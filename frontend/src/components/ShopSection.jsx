
import { useState } from "react";
import { products } from "../products";
import "./ShopSection.css";

const categories = ["All", "Dark", "Milk", "Filled"];


function ShopSection({ onViewDetails, onAddToCart }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [addedProduct, setAddedProduct] = useState(null);

  const visibleProducts =
    activeCategory === "All"
      ? products
      : products.filter((product) => product.category === activeCategory);

  const addToCart = (product) => {
    onAddToCart({
      ...product,
      cartKey: `product-${product.id}`,
      itemType: "product",
    });

    setAddedProduct(product.id);
  };

  return (
    <section className="shop-section" id="shop">
      <div className="shop-container">
        <div className="shop-heading">
          <p className="shop-eyebrow">THE CHOCOLATE COLLECTION</p>
          <h2>
            Made for Your <em>Sweetest</em> Moments
          </h2>
          <p className="shop-intro">
            Thoughtfully crafted chocolates, made to turn little moments
            into something memorable.
          </p>
        </div>

        <div className="shop-toolbar">
          <div className="shop-filters" aria-label="Filter chocolates">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={`shop-filter ${
                  activeCategory === category ? "is-active" : ""
                }`}
                aria-pressed={activeCategory === category}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <p className="shop-cart-status">Choose your chocolates</p>
        </div>

        <div className="shop-grid">
          {visibleProducts.map((product) => (
            <article className="product-card" key={product.id}>
              <div className="product-art">
                <img
                  className="product-image"
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                />
                <span className="product-piece-count">6 pieces</span>
              </div>

              <div className="product-info">
                <div className="product-title-row">
                  <h3>{product.name}</h3>
                  <span className="product-price">
                    ₹{product.price.toLocaleString("en-IN")}
                  </span>
                </div>

                <p className="product-description">{product.description}</p>

                <button
                  className="product-details-link"
                  type="button"
                  onClick={() => onViewDetails(product)}
                >
                  View Details →
                </button>

                <button
                  className="product-add-button"
                  type="button"
                  onClick={() => addToCart(product)}
                >
                  {addedProduct === product.id ? "Added to Bag ✓" : "Add to Bag"}
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="shop-footer">
          <p>Small-batch chocolates. Made with care.</p>
          <a href="#home">Back to top ↑</a>
        </div>
      </div>
    </section>
  );
}

export default ShopSection;