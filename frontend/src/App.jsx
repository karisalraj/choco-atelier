import { useState } from "react";

import Navbar from "./components/Navbar.jsx";
import HeroScroll from "./components/HeroScroll.jsx";
import ShopSection from "./components/ShopSection.jsx";
import ProductDetails from "./components/ProductDetails.jsx";
import CustomBox from "./components/CustomBox.jsx";
import CartSection from "./components/CartSection.jsx";
import CheckoutSection from "./components/CheckoutSection.jsx";
import AdminLogin from "./components/AdminLogin.jsx";
import AdminOrders from "./components/AdminOrders.jsx";
import OurStory from "./components/OurStory.jsx";

import "./App.css";

function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  // --------------------------------------------------
  // ADMIN ROUTES
  // --------------------------------------------------

  const currentPath = window.location.pathname;

  const isAdminLogin = currentPath === "/admin/login";
  const isAdminOrders = currentPath === "/admin/orders";

  // Admin Login page
  if (isAdminLogin) {
    return <AdminLogin />;
  }

  // Admin Dashboard protection
  if (isAdminOrders) {
    const adminToken = localStorage.getItem("choco_admin_token");

    if (!adminToken) {
      window.location.replace("/admin/login");
      return null;
    }

    return <AdminOrders />;
  }

  // --------------------------------------------------
  // CART
  // --------------------------------------------------

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const addToCart = (item, quantity = 1) => {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (cartItem) => cartItem.cartKey === item.cartKey
      );

      if (existingItem) {
        return currentItems.map((cartItem) =>
          cartItem.cartKey === item.cartKey
            ? {
                ...cartItem,
                quantity: cartItem.quantity + quantity,
              }
            : cartItem
        );
      }

      return [
        ...currentItems,
        {
          ...item,
          quantity,
        },
      ];
    });

    setCartOpen(true);
  };

  const updateCartQuantity = (cartKey, nextQuantity) => {
    if (nextQuantity < 1) return;

    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.cartKey === cartKey
          ? {
              ...item,
              quantity: nextQuantity,
            }
          : item
      )
    );
  };

  const removeCartItem = (cartKey) => {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.cartKey !== cartKey)
    );
  };

  // --------------------------------------------------
  // SHOP
  // --------------------------------------------------

  const handleBackToShop = () => {
    setSelectedProduct(null);

    requestAnimationFrame(() => {
      document.getElementById("shop")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  // --------------------------------------------------
  // CHECKOUT
  // --------------------------------------------------

  const handleProceedToCheckout = () => {
    setCartOpen(false);
    setCheckoutOpen(true);

    requestAnimationFrame(() => {
      document.getElementById("checkout-title")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  const handleBackToCart = () => {
    setCheckoutOpen(false);
    setCartOpen(true);

    requestAnimationFrame(() => {
      document.getElementById("cart-title")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  const handlePlaceOrder = (orderDetails) => {
    console.log("Demo checkout details:", orderDetails);

    setCartItems([]);
  };

  // --------------------------------------------------
  // CUSTOMER WEBSITE
  // --------------------------------------------------

  return (
    <main className="app">
      <Navbar
        cartCount={cartCount}
        onCartClick={() => {
          setCartOpen(true);

          requestAnimationFrame(() => {
            document.getElementById("cart-title")?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          });
        }}
      />

      <HeroScroll />

      <ShopSection
        onViewDetails={setSelectedProduct}
        onAddToCart={addToCart}
      />

      {selectedProduct && (
        <ProductDetails
  product={selectedProduct}
  onBackToShop={handleBackToShop}
  onAddToCart={addToCart}
/>
      )}

      <CustomBox onAddToCart={addToCart} />
      <OurStory />

      {cartOpen && (
        <CartSection
          items={cartItems}
          onClose={() => setCartOpen(false)}
          onUpdateQuantity={updateCartQuantity}
          onRemoveItem={removeCartItem}
          onProceedToCheckout={handleProceedToCheckout}
        />
      )}

      {checkoutOpen && (
        <CheckoutSection
          items={cartItems}
          onBackToCart={handleBackToCart}
          onPlaceOrder={handlePlaceOrder}
        />
      )}
    </main>
  );
}

export default App;