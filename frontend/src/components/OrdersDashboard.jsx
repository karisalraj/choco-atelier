
import { useEffect, useState } from "react";

function OrdersDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/orders");

        if (!response.ok) {
          throw new Error("Unable to load orders.");
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <section><p>Loading orders...</p></section>;
  }

  if (error) {
    return (
      <section>
        <h2>Orders</h2>
        <p>{error}</p>
        <p>Make sure the FastAPI backend is running.</p>
      </section>
    );
  }

  return (
    <section>
      <h2>Orders Dashboard</h2>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div>
          {orders.map((order) => (
            <article
              key={order.id}
              style={{
                border: "1px solid #c9a45c",
                padding: "16px",
                marginBottom: "16px",
                borderRadius: "8px",
              }}
            >
              <h3>Order #{order.id}</h3>
              <p><strong>Customer:</strong> {order.fullName}</p>
              <p><strong>Email:</strong> {order.email}</p>
              <p><strong>Phone:</strong> {order.phone}</p>
              <p>
                <strong>Address:</strong>{" "}
                {order.address}, {order.city}, {order.state} - {order.pincode}
              </p>
              <p><strong>Payment:</strong> {order.paymentMethod}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Total:</strong> ₹{order.subtotal}</p>

              <h4>Items</h4>
              <ul>
                {order.items.map((item, index) => (
                  <li key={`${order.id}-${index}`}>
                    {item.name} — ₹{item.price} × {item.quantity}
                  </li>
                ))}
              </ul>

              <small>
                Ordered: {new Date(order.createdAt).toLocaleString()}
              </small>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default OrdersDashboard;