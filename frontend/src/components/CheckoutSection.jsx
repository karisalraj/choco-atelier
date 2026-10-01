import { useState } from "react";
import "./CheckoutSection.css";

function CheckoutSection({ items, onBackToCart, onPlaceOrder }) {
    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [orderConfirmation, setOrderConfirmation] = useState(null);

    const subtotal = items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );


    const handleSubmit = async (event) => {
        event.preventDefault();

        if (items.length === 0) {
            setSubmitError("Your bag is empty.");
            return;
        }

        setIsSubmitting(true);
        setSubmitError("");

        try {
            const formData = new FormData(event.currentTarget);

            const orderDetails = {
                fullName: formData.get("fullName"),
                email: formData.get("email"),
                phone: formData.get("phone"),
                address: formData.get("address"),
                city: formData.get("city"),
                state: formData.get("state"),
                pincode: formData.get("pincode"),
                paymentMethod: formData.get("paymentMethod"),
                items: items.map((item) => ({
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image || "",
                    cartKey: item.cartKey,
                })),
            };

            const response = await fetch("http://127.0.0.1:8000/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(orderDetails),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.detail
                        ? JSON.stringify(result.detail)
                        : "Unable to place your order."
                );
            }
            setOrderConfirmation(result);
            onPlaceOrder({
                ...orderDetails,
                orderId: result.order_id,
                status: result.status,
                subtotal: result.subtotal,
            });

            setOrderPlaced(true);
        } catch (error) {
            console.error("Order submission failed:", error);
            setSubmitError(
                error.message || "Could not connect to the server. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    if (orderPlaced) {
        return (
            <section className="checkout-section">
                <div className="checkout-success">
                    <span className="checkout-success-icon">✓</span>
                    <p className="checkout-eyebrow">CHOCO ATELIER</p>
                    <h2>Thank you for your order.</h2>

                    <p>
                        Your order has been saved successfully. Thank you for choosing
                        Choco Atelier. Your chocolate selection is now in our order records.
                    </p>

                    {orderConfirmation && (
                        <div className="checkout-order-confirmation">
                            <p>
                                Order ID: <strong>#{orderConfirmation.order_id}</strong>
                            </p>
                            <p>
                                Status: <strong>{orderConfirmation.status}</strong>
                            </p>
                            <p>
                                Order total:{" "}
                                <strong>
                                    ₹{Number(orderConfirmation.subtotal).toLocaleString("en-IN")}
                                </strong>
                            </p>
                        </div>
                    )}

                    <p className="checkout-summary-note">
                        No payment was taken. Online payment and delivery tracking
                        are not connected yet.
                    </p>
                    <button type="button" onClick={onBackToCart}>
                        Return to Bag
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section   className="checkout-section">
            <div className="checkout-container">
                <div className="checkout-heading">
                    <div>
                        <p className="checkout-eyebrow">ALMOST YOURS</p>
                        <h2 id="checkout-title">Checkout</h2>
                        <p>Share your delivery details to complete this demo order.</p>
                    </div>

                    <button
                        className="checkout-back-button"
                        type="button"
                        onClick={onBackToCart}
                    >
                        ← Back to Bag
                    </button>
                </div>

                {items.length === 0 ? (
                    <div className="checkout-empty">
                        <h3>Your bag is empty.</h3>
                        <p>Add chocolates before continuing to checkout.</p>
                        <button type="button" onClick={onBackToCart}>
                            Return to Bag
                        </button>
                    </div>
                ) : (
                    <div className="checkout-layout">
                        <form className="checkout-form" onSubmit={handleSubmit}>
                            <div className="checkout-form-heading">
                                <span>01</span>
                                <div>
                                    <h3>Delivery details</h3>
                                    <p>Where should we send your chocolate box?</p>
                                </div>
                            </div>

                            <div className="checkout-fields">
                                <label>
                                    Full name
                                    <input
                                        type="text"
                                        name="fullName"
                                        placeholder="Enter your full name"
                                        autoComplete="name"
                                        required
                                    />
                                </label>

                                <div className="checkout-field-row">
                                    <label>
                                        Email address
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="you@example.com"
                                            autoComplete="email"
                                            required
                                        />
                                    </label>

                                    <label>
                                        Phone number
                                        <input
                                            type="tel"
                                            name="phone"
                                            placeholder="10-digit mobile number"
                                            autoComplete="tel"
                                            inputMode="numeric"
                                            pattern="[6-9][0-9]{9}"
                                            title="Enter a valid 10-digit Indian mobile number"
                                            required
                                        />
                                    </label>
                                </div>

                                <label>
                                    Address
                                    <textarea
                                        name="address"
                                        rows="3"
                                        placeholder="House number, street, area"
                                        autoComplete="street-address"
                                        required
                                    />
                                </label>

                                <div className="checkout-field-row">
                                    <label>
                                        City
                                        <input
                                            type="text"
                                            name="city"
                                            placeholder="City"
                                            autoComplete="address-level2"
                                            required
                                        />
                                    </label>

                                    <label>
                                        State
                                        <input
                                            type="text"
                                            name="state"
                                            placeholder="State"
                                            autoComplete="address-level1"
                                            required
                                        />
                                    </label>

                                    <label>
                                        PIN code
                                        <input
                                            type="text"
                                            name="pincode"
                                            placeholder="6-digit PIN"
                                            inputMode="numeric"
                                            pattern="[0-9]{6}"
                                            autoComplete="postal-code"
                                            required
                                        />
                                    </label>
                                </div>
                            </div>
                            <div className="checkout-payment">
                                <div className="checkout-form-heading">
                                    <span>02</span>
                                    <div>
                                        <h3>Payment method</h3>
                                        <p>Choose how you would like to pay.</p>
                                    </div>
                                </div>

                                <div className="checkout-payment-options">
                                    <label
                                        className={`checkout-payment-option ${paymentMethod === "cod" ? "is-selected" : ""
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="cod"
                                            checked={paymentMethod === "cod"}
                                            onChange={() => setPaymentMethod("cod")}
                                        />
                                        <span>
                                            <strong>Cash on Delivery</strong>
                                            <small>Pay when your chocolate order arrives.</small>
                                        </span>
                                    </label>

                                    <label
                                        className={`checkout-payment-option ${paymentMethod === "upi" ? "is-selected" : ""
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="upi"
                                            checked={paymentMethod === "upi"}
                                            onChange={() => setPaymentMethod("upi")}
                                        />
                                        <span>
                                            <strong>UPI / QR Payment</strong>
                                            <small>Google Pay, PhonePe, Paytm — demo selection only.</small>
                                        </span>
                                    </label>

                                    <label
                                        className={`checkout-payment-option ${paymentMethod === "card" ? "is-selected" : ""
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="card"
                                            checked={paymentMethod === "card"}
                                            onChange={() => setPaymentMethod("card")}
                                        />
                                        <span>
                                            <strong>Debit / Credit Card</strong>
                                            <small>Visa, Mastercard, RuPay — demo selection only.</small>
                                        </span>
                                    </label>
                                </div>

                                {paymentMethod !== "cod" && (
                                    <p className="checkout-payment-notice">
                                        Online payment is not connected yet. No payment details are requested
                                        or charged in this demo.
                                    </p>
                                )}
                            </div>
                            {submitError && (
                                <p className="checkout-error" role="alert">
                                    {submitError}
                                </p>
                            )}
                            <button
                                className="checkout-submit-button"
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Placing Order..." : "Place Order"}
                            </button>
                        </form>

                        <aside className="checkout-summary">
                            <p className="checkout-eyebrow">YOUR SELECTION</p>
                            <h3>Order Summary</h3>

                            <div className="checkout-summary-items">
                                {items.map((item) => (
                                    <div className="checkout-summary-item" key={item.cartKey}>
                                        <div className="checkout-summary-image">
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} />
                                            ) : (
                                                <span aria-hidden="true">✦</span>
                                            )}
                                            <small>{item.quantity}</small>
                                        </div>

                                        <div className="checkout-summary-name">
                                            <strong>{item.name}</strong>
                                            <span>
                                                ₹{item.price.toLocaleString("en-IN")} each
                                            </span>
                                        </div>

                                        <strong className="checkout-summary-price">
                                            ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                                        </strong>
                                    </div>
                                ))}
                            </div>

                            <div className="checkout-total-row">
                                <span>Subtotal</span>
                                <strong>₹{subtotal.toLocaleString("en-IN")}</strong>
                            </div>

                            <div className="checkout-total-row">
                                <span>Delivery</span>
                                <span>Calculated later</span>
                            </div>

                            <div className="checkout-total-row checkout-grand-total">
                                <span>Order total</span>
                                <strong>₹{subtotal.toLocaleString("en-IN")}</strong>
                            </div>

                            <p className="checkout-summary-note">
                                This is a frontend demo. Delivery fees, payment, and order
                                storage are not connected yet.
                            </p>
                        </aside>
                    </div>
                )}
            </div>
        </section>
    );
}

export default CheckoutSection;