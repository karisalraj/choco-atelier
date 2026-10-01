import { useEffect, useState } from "react";

import "./ProductDetails.css";

function ProductDetails({ product, onBackToShop, onAddToCart }) {
  const [selectedBox, setSelectedBox] = useState(product.boxOptions[0]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setSelectedBox(product.boxOptions[0]);
    setQuantity(1);
    setAdded(false);

    document.getElementById("product-details")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [product]);

  const updateQuantity = (amount) => {
    setQuantity((current) =>
      Math.max(1, Math.min(10, current + amount))
    );

    setAdded(false);
  };

  const handleAddToBag = () => {
    const cartItem = {
      cartKey: `${product.name}-${selectedBox.pieces}`,
      name: product.name,
      price: selectedBox.price,
      image: product.image,
    };

    onAddToCart(cartItem, quantity);

    setAdded(true);
  };

  return (
    <section className="product-details" id="product-details">
      <div className="product-details-container">

        <div className="product-details-visual">
          <div className="details-chocolate-art">
            <img
              className="details-product-image"
              src={product.image}
              alt={product.name}
            />

            <span className="details-art-caption">
              {product.name}
            </span>
          </div>
        </div>

        <div className="product-details-info">

          <button
            className="details-back-button"
            type="button"
            onClick={onBackToShop}
          >
            ← Back to Collection
          </button>

          <p className="details-eyebrow">
            THE SIGNATURE COLLECTION
          </p>

          <h2>{product.name}</h2>

          <div className="details-rating">
            <span aria-label="5 out of 5 stars">
              ★★★★★
            </span>

            <span>
              Handcrafted chocolate selection
            </span>
          </div>

          <p className="details-price">
            ₹{selectedBox.price.toLocaleString("en-IN")}
          </p>

          <p className="details-description">
            {product.details}
          </p>

          <div className="details-option-group">
            <p className="details-option-label">
              Choose your box
            </p>

            <div className="details-box-options">
              {product.boxOptions.map((option) => (
                <button
                  key={option.pieces}
                  type="button"
                  className={`details-box-option ${
                    selectedBox.pieces === option.pieces
                      ? "is-selected"
                      : ""
                  }`}
                  aria-pressed={
                    selectedBox.pieces === option.pieces
                  }
                  onClick={() => {
                    setSelectedBox(option);
                    setAdded(false);
                  }}
                >
                  <span>{option.pieces} pcs</span>

                  <small>
                    ₹{option.price.toLocaleString("en-IN")}
                  </small>
                </button>
              ))}
            </div>
          </div>

          <div className="details-purchase-row">

            <div
              className="details-quantity"
              aria-label="Quantity"
            >
              <button
                type="button"
                aria-label="Decrease quantity"
                disabled={quantity <= 1}
                onClick={() => updateQuantity(-1)}
              >
                −
              </button>

              <span>{quantity}</span>

              <button
                type="button"
                aria-label="Increase quantity"
                disabled={quantity >= 10}
                onClick={() => updateQuantity(1)}
              >
                +
              </button>
            </div>

            <button
              className="details-add-button"
              type="button"
              onClick={handleAddToBag}
            >
              {added ? "Added to Bag ✓" : "Add to Bag"}
            </button>

          </div>

          {added && (
            <p className="details-feedback" role="status">
              {quantity} box{quantity > 1 ? "es" : ""} of{" "}
              {product.name} added to your bag.
            </p>
          )}

          <div className="details-notes">
            <p>✦ Carefully crafted in small batches</p>
            <p>✦ Elegant gifting-ready presentation</p>
            <p>✦ Store in a cool, dry place</p>
          </div>

        </div>
      </div>
    </section>
  );
}

export default ProductDetails;