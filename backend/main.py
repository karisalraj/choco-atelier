import os
from datetime import datetime, timedelta, timezone
from typing import Literal
import jwt
from fastapi import (
    FastAPI,
    Depends,
    HTTPException,
    status,
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field
from pwdlib import PasswordHash
from sqlalchemy.orm import Session

from database import Base, engine, get_db
from models import Order, Admin
from pathlib import Path

from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

FRONTEND_DIST = Path(__file__).resolve().parent.parent / "frontend" / "dist"
# --------------------------------------------------
# DATABASE
# --------------------------------------------------

# Create tables for all registered models.
Base.metadata.create_all(bind=engine)


# --------------------------------------------------
# JWT / ADMIN AUTHENTICATION SETTINGS
# --------------------------------------------------

SECRET_KEY = os.getenv("CHOCO_SECRET_KEY")

if not SECRET_KEY:
    raise RuntimeError(
        "CHOCO_SECRET_KEY is missing. Set it before starting the backend."
    )

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

password_hash = PasswordHash.recommended()
bearer_scheme = HTTPBearer()


def create_access_token(admin_id: int) -> str:
    """Create a signed JWT access token for an admin."""

    expires_at = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload = {
        "sub": str(admin_id),
        "exp": expires_at,
    }

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM,
    )


def get_current_admin(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> Admin:
    """Validate the JWT and return the logged-in admin."""

    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
        )

        admin_id = payload.get("sub")

        if admin_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication token",
            )

        admin_id = int(admin_id)

    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token",
        )

    admin = (
        db.query(Admin)
        .filter(Admin.id == admin_id)
        .first()
    )

    if admin is None or not admin.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Admin account is inactive or not found",
        )

    return admin


# --------------------------------------------------
# FASTAPI APP
# --------------------------------------------------

app = FastAPI(
    title="Choco Atelier API",
    description="Backend API for Choco Atelier",
    version="1.0.0",
)


# --------------------------------------------------
# CORS
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# REQUEST SCHEMAS
# --------------------------------------------------

class OrderItem(BaseModel):
    name: str = Field(min_length=1, max_length=150)
    price: float = Field(gt=0)
    quantity: int = Field(ge=1)
    image: str | None = None
    cartKey: str | None = None


class OrderCreate(BaseModel):
    fullName: str = Field(min_length=2, max_length=120)
    email: str = Field(min_length=5, max_length=150)
    phone: str = Field(pattern=r"^[6-9][0-9]{9}$")
    address: str = Field(min_length=5, max_length=300)
    city: str = Field(min_length=2, max_length=100)
    state: str = Field(min_length=2, max_length=100)
    pincode: str = Field(pattern=r"^[0-9]{6}$")
    paymentMethod: str = Field(min_length=1, max_length=30)
    items: list[OrderItem] = Field(min_length=1)


class OrderStatusUpdate(BaseModel):
    status: Literal[
        "pending",
        "processing",
        "completed",
        "cancelled",
    ]


class AdminLogin(BaseModel):
    email: str = Field(min_length=5, max_length=150)
    password: str = Field(min_length=1, max_length=128)


# --------------------------------------------------
# HOME / HEALTH
# --------------------------------------------------

@app.get("/")
def home():
    if FRONTEND_DIST.exists():
        return FileResponse(FRONTEND_DIST / "index.html")

    return {
        "message": "Welcome to Choco Atelier API",
        "status": "running"
    }


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Choco Atelier Backend",
    }


# --------------------------------------------------
# ADMIN LOGIN
# --------------------------------------------------

@app.post("/api/admin/login")
def admin_login(
    login_data: AdminLogin,
    db: Session = Depends(get_db),
):
    email = login_data.email.strip().lower()

    admin = (
        db.query(Admin)
        .filter(Admin.email == email)
        .first()
    )

    if (
        admin is None
        or not admin.is_active
        or not password_hash.verify(
            login_data.password,
            admin.password_hash,
        )
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    access_token = create_access_token(admin.id)

    return {
        "message": "Admin login successful",
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        "admin": {
            "id": admin.id,
            "email": admin.email,
        },
    }


# --------------------------------------------------
# CREATE AND SAVE A NEW ORDER
# Public endpoint used by checkout.
# --------------------------------------------------

@app.post("/api/orders", status_code=status.HTTP_201_CREATED)
def create_order(
    order_data: OrderCreate,
    db: Session = Depends(get_db),
):
    subtotal = sum(
        item.price * item.quantity
        for item in order_data.items
    )

    items_data = [
        item.model_dump(exclude_none=True)
        for item in order_data.items
    ]

    new_order = Order(
        full_name=order_data.fullName,
        email=order_data.email,
        phone=order_data.phone,
        address=order_data.address,
        city=order_data.city,
        state=order_data.state,
        pincode=order_data.pincode,
        payment_method=order_data.paymentMethod,
        items=items_data,
        subtotal=subtotal,
        status="pending",
    )

    try:
        db.add(new_order)
        db.commit()
        db.refresh(new_order)

        return {
            "message": "Order saved successfully",
            "order_id": new_order.id,
            "status": new_order.status,
            "subtotal": new_order.subtotal,
        }

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to save the order",
        )


# --------------------------------------------------
# GET ALL ORDERS
# Admin authentication required.
# --------------------------------------------------

@app.get("/api/orders")
def get_orders(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    orders = (
        db.query(Order)
        .order_by(Order.created_at.desc())
        .all()
    )

    return [
        {
            "id": order.id,
            "fullName": order.full_name,
            "email": order.email,
            "phone": order.phone,
            "address": order.address,
            "city": order.city,
            "state": order.state,
            "pincode": order.pincode,
            "paymentMethod": order.payment_method,
            "items": order.items,
            "subtotal": order.subtotal,
            "status": order.status,
            "createdAt": order.created_at.isoformat(),
        }
        for order in orders
    ]


# --------------------------------------------------
# UPDATE ORDER STATUS
# Admin authentication required.
# --------------------------------------------------

@app.patch("/api/orders/{order_id}/status")
def update_order_status(
    order_id: int,
    status_data: OrderStatusUpdate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    order = (
        db.query(Order)
        .filter(Order.id == order_id)
        .first()
    )

    if order is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )

    order.status = status_data.status

    try:
        db.commit()
        db.refresh(order)

        return {
            "message": "Order status updated successfully",
            "order_id": order.id,
            "status": order.status,
        }

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to update order status",
        )
        
        # --------------------------------------------------
# SERVE REACT FRONTEND
# --------------------------------------------------

FRONTEND_DIST = Path(__file__).resolve().parent.parent / "frontend" / "dist"

if FRONTEND_DIST.exists():
    app.mount(
        "/assets",
        StaticFiles(directory=FRONTEND_DIST / "assets"),
        name="assets",
    )

    @app.get("/{full_path:path}")
    def serve_react_app(full_path: str):
        requested_file = FRONTEND_DIST / full_path

        if requested_file.is_file():
            return FileResponse(requested_file)

        return FileResponse(FRONTEND_DIST / "index.html")