from getpass import getpass

from pwdlib import PasswordHash

from database import Base, engine, SessionLocal
from models import Admin


# Make sure database tables exist
Base.metadata.create_all(bind=engine)

password_hash = PasswordHash.recommended()


email = input("Enter admin email: ").strip().lower()

password = getpass("Enter admin password: ")
confirm_password = getpass("Confirm admin password: ")


if not email:
    print("Email cannot be empty.")
    raise SystemExit(1)


if len(password) < 8:
    print("Password must contain at least 8 characters.")
    raise SystemExit(1)


if password != confirm_password:
    print("Passwords do not match.")
    raise SystemExit(1)


db = SessionLocal()

try:
    # Remove the old demo/wrong admin account
    old_admin = (
        db.query(Admin)
        .filter(Admin.email == "demogmail.com")
        .first()
    )

    if old_admin:
        db.delete(old_admin)
        db.commit()
        print("Old demo admin account removed.")


    # Check whether the new email already exists
    existing_admin = (
        db.query(Admin)
        .filter(Admin.email == email)
        .first()
    )

    if existing_admin:
        print("An admin account with this email already exists.")
        raise SystemExit(0)


    # Create the correct admin account
    new_admin = Admin(
        email=email,
        password_hash=password_hash.hash(password),
        is_active=True,
    )

    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)

    print()
    print("====================================")
    print("Admin account created successfully!")
    print("Admin ID:", new_admin.id)
    print("Admin Email:", new_admin.email)
    print("====================================")

except Exception:
    db.rollback()
    raise

finally:
    db.close()