import { useState } from "react";

import "./Navbar.css";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Shop", href: "#shop" },
  { label: "Custom Box", href: "#custom-box" },
  { label: "Our Story", href: "#story" },
];

function Navbar({ cartCount, onCartClick }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleProfileClick = () => {
  closeMenu();

  const adminToken = localStorage.getItem("choco_admin_token");

  if (adminToken) {
    window.location.href = "/admin/orders";
  } else {
    window.location.href = "/admin/login";
  }
};

  return (
    <header className="site-header">
      <nav
        className="navbar"
        aria-label="Main navigation"
      >
        {/* Brand */}
        <a
          className="navbar-brand"
          href="#home"
          onClick={closeMenu}
        >
          <span className="brand-name">
            CHOCO ATELIER
          </span>

          <span className="brand-tagline">
            ARTISAN CHOCOLATE BOUTIQUE
          </span>
        </a>

        {/* Profile / Admin */}
        <button
          className="navbar-profile"
          type="button"
          onClick={handleProfileClick}
          aria-label="Open admin profile"
          title="Admin Profile"
        >
          <span className="navbar-profile-icon">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                cx="12"
                cy="8"
                r="3.2"
              />

              <path
                d="M5.5 19.5c.8-3.4 3.1-5.2 6.5-5.2s5.7 1.8 6.5 5.2"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </span>

          <span className="navbar-profile-text">
            Profile
          </span>
        </button>

        {/* Navigation Links */}
        <div
          className={`navbar-links ${
            menuOpen ? "is-open" : ""
          }`}
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="navbar-link"
              onClick={closeMenu}
            >
              {link.label}
            </a>
          ))}

          {/* Profile inside mobile menu */}
          <button
            className="navbar-profile mobile-profile"
            type="button"
            onClick={handleProfileClick}
          >
            <span className="navbar-profile-icon">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  cx="12"
                  cy="8"
                  r="3.2"
                />

                <path
                  d="M5.5 19.5c.8-3.4 3.1-5.2 6.5-5.2s5.7 1.8 6.5 5.2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>

            <span>Profile</span>
          </button>

          {/* Mobile Cart */}
          <button
            className="navbar-cart mobile-cart"
            type="button"
            onClick={() => {
              closeMenu();
              onCartClick();
            }}
          >
            Cart{" "}
            <span className="cart-count">
              {cartCount}
            </span>
          </button>
        </div>

        {/* Right Actions */}
        <div className="navbar-actions">
          {/* Desktop Cart */}
          <button
            className="navbar-cart desktop-cart"
            type="button"
            onClick={onCartClick}
          >
            Cart{" "}
            <span className="cart-count">
              {cartCount}
            </span>
          </button>

          {/* Mobile Menu */}
          <button
            className={`menu-toggle ${
              menuOpen ? "is-active" : ""
            }`}
            type="button"
            aria-label={
              menuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={menuOpen}
            onClick={() =>
              setMenuOpen(
                (current) => !current
              )
            }
          >
            <span />
            <span />
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;