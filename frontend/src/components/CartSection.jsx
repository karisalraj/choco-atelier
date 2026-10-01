
import "./CartSection.css";

function CartSection({
  items,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) {
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <section className="cart-section" aria-labelledby="cart-title">
      <div className="cart-container">
        <div className="cart-heading">
          <div>
            <p className="cart-eyebrow">YOUR SELECTION</p>
            <h2 id="cart-title">Your Bag</h2>
          </div>

          <button
            className="cart-close-button"
            type="button"
            onClick={onClose}
          >
            Continue Shopping ×
          </button>
        </div>

        {items.length === 0 ? (
          <div className="cart-empty">
            <h3>Your bag is waiting.</h3>
            <p>Add a little chocolate moment to your day.</p>
            <button type="button" onClick={onClose}>
              Explore Chocolates
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {items.map((item) => (
                <article className="cart-item" key={item.cartKey}>
                  <div className="cart-item-art">
                    {item.image ? (
                      <img src={item.image} alt={item.name} />
                    ) : (
                      <span className="cart-custom-box-icon" aria-hidden="true">
                        ✦
                      </span>
                    )}
                  </div>

                  <div className="cart-item-info">
                    <h3>{item.name}</h3>

                    {item.itemType === "custom-box" && (
                      <p className="cart-custom-description">
                        {item.chocolates.filter(Boolean).join(", ")}
                      </p>
                    )}

                    <p className="cart-item-price">
                      ₹{item.price.toLocaleString("en-IN")}
                    </p>

                    <button
                      className="cart-remove-button"
                      type="button"
                      onClick={() => onRemoveItem(item.cartKey)}
                    >
                      Remove
                    </button>
                  </div>

                  <div className="cart-quantity">
                    <button
                      type="button"
                      aria-label={`Decrease quantity of ${item.name}`}
                      disabled={item.quantity <= 1}
                      onClick={() =>
                        onUpdateQuantity(item.cartKey, item.quantity - 1)
                      }
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      type="button"
                      aria-label={`Increase quantity of ${item.name}`}
                      onClick={() =>
                        onUpdateQuantity(item.cartKey, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>

                  <strong className="cart-line-total">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </strong>
                </article>
              ))}
            </div>

            <div className="cart-summary">
              <div className="cart-subtotal">
                <span>Subtotal</span>
                <strong>₹{subtotal.toLocaleString("en-IN")}</strong>
              </div>

              <p>Shipping and any applicable charges are calculated at checkout.</p>

              
<button
  className="cart-checkout-button"
  type="button"
  onClick={onProceedToCheckout}
>
  Proceed to Checkout
</button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default CartSection;