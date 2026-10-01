import { useCallback, useEffect, useState } from "react";
import "./AdminOrders.css";

const API_URL = "http://127.0.0.1:8000/api/orders";

const ORDER_STATUSES = [
  "pending",
  "processing",
  "completed",
  "cancelled",
];

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);
}

function formatDate(dateValue) {
  if (!dateValue) return "Date unavailable";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleString("en-IN");
}

function formatStatus(status) {
  if (!status) return "Pending";

  return status.charAt(0).toUpperCase() + status.slice(1);
}

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState({});
  const [updatingOrders, setUpdatingOrders] = useState({});

  const getToken = () => {
    return localStorage.getItem("choco_admin_token");
  };

  const logoutAdmin = () => {
    localStorage.removeItem("choco_admin_token");
    localStorage.removeItem("choco_admin");

    window.location.replace("/admin/login");
  };

  const fetchOrders = useCallback(async (isRefresh = false) => {
    const token = getToken();

    if (!token) {
      window.location.replace("/admin/login");
      return;
    }

    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        logoutAdmin();
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Unable to load orders."
        );
      }

      if (!Array.isArray(data)) {
        throw new Error(
          "Unexpected response from the server."
        );
      }

      setOrders(data);

      const statusValues = {};

      data.forEach((order) => {
        statusValues[order.id] = order.status || "pending";
      });

      setSelectedStatuses(statusValues);
    } catch (err) {
      setError(
        err.message ||
          "Could not load orders. Check the backend connection."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = (orderId, nextStatus) => {
    setSelectedStatuses((currentStatuses) => ({
      ...currentStatuses,
      [orderId]: nextStatus,
    }));
  };

  const handleUpdateStatus = async (orderId) => {
    const token = getToken();

    if (!token) {
      window.location.replace("/admin/login");
      return;
    }

    const nextStatus = selectedStatuses[orderId];

    if (!ORDER_STATUSES.includes(nextStatus)) {
      setError("Please select a valid order status.");
      return;
    }

    setUpdatingOrders((current) => ({
      ...current,
      [orderId]: true,
    }));

    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch(
        `${API_URL}/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: nextStatus,
          }),
        }
      );

      if (response.status === 401) {
        logoutAdmin();
        return;
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.detail ||
            "Unable to update order status."
        );
      }

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: result.status || nextStatus,
              }
            : order
        )
      );

      setSelectedStatuses((currentStatuses) => ({
        ...currentStatuses,
        [orderId]: result.status || nextStatus,
      }));

      setSuccessMessage(
        `Order #${orderId} status updated successfully.`
      );
    } catch (err) {
      setError(
        err.message ||
          "Could not update status. Check the backend connection."
      );
    } finally {
      setUpdatingOrders((current) => ({
        ...current,
        [orderId]: false,
      }));
    }
  };

  const pendingOrders = orders.filter(
    (order) =>
      order.status?.toLowerCase() === "pending"
  ).length;

  const completedOrders = orders.filter(
    (order) =>
      order.status?.toLowerCase() === "completed"
  ).length;

  const totalRevenue = orders.reduce(
    (total, order) =>
      total + (Number(order.subtotal) || 0),
    0
  );

  return (
    <main className="admin-orders">
      <header className="admin-orders__header">
        <div>
          <p className="admin-orders__eyebrow">
            CHOCO ATELIER / ADMIN
          </p>

          <h1>Order Management</h1>

          <p className="admin-orders__subtitle">
            View customer orders and manage order status.
          </p>
        </div>

        <div className="admin-orders__header-actions">
           <button
    className="admin-orders__store"
    type="button"
    onClick={() => {
      window.location.href = "/";
    }}
  >
    Back to Store
  </button>
          <button
            className="admin-orders__refresh"
            type="button"
            onClick={() => fetchOrders(true)}
            disabled={loading || refreshing}
          >
            {refreshing
              ? "Refreshing..."
              : "Refresh Orders"}
          </button>

          <button
            className="admin-orders__logout"
            type="button"
            onClick={logoutAdmin}
          >
            Logout
          </button>
        </div>
      </header>

      {successMessage && (
        <div className="admin-orders__notice admin-orders__notice--success">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="admin-orders__notice admin-orders__notice--error">
          {error}
        </div>
      )}

      <section className="admin-orders__summary">
        <div className="admin-orders__summary-card">
          <span>Total Orders</span>
          <strong>{orders.length}</strong>
        </div>

        <div className="admin-orders__summary-card">
          <span>Pending Orders</span>
          <strong>{pendingOrders}</strong>
        </div>

        <div className="admin-orders__summary-card">
          <span>Completed Orders</span>
          <strong>{completedOrders}</strong>
        </div>

        <div className="admin-orders__summary-card">
          <span>Order Value</span>
          <strong>
            {formatCurrency(totalRevenue)}
          </strong>
        </div>
      </section>

      {loading ? (
        <div className="admin-orders__message">
          <span className="admin-orders__loader" />
          <p>Loading customer orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="admin-orders__empty">
          <h2>No orders yet</h2>
          <p>
            New customer orders will appear here.
          </p>
        </div>
      ) : (
        <section className="admin-orders__list">
          {orders.map((order) => {
            const currentStatus =
              selectedStatuses[order.id] ||
              order.status ||
              "pending";

            const isUpdating = Boolean(
              updatingOrders[order.id]
            );

            return (
              <article
                className="admin-orders__card"
                key={order.id}
              >
                <div className="admin-orders__card-header">
                  <div>
                    <span className="admin-orders__order-label">
                      ORDER #{order.id}
                    </span>

                    <h2>{order.fullName}</h2>

                    <p className="admin-orders__email">
                      {order.email}
                    </p>
                  </div>

                  <span className="admin-orders__status">
                    {formatStatus(
                      order.status || "pending"
                    )}
                  </span>
                </div>

                <div className="admin-orders__details">
                  <p>
                    <strong>Phone:</strong>{" "}
                    {order.phone}
                  </p>

                  <p>
                    <strong>Address:</strong>{" "}
                    {[
                      order.address,
                      order.city,
                      order.state,
                      order.pincode,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>

                  <p>
                    <strong>Payment:</strong>{" "}
                    {order.paymentMethod}
                  </p>

                  <p>
                    <strong>Date:</strong>{" "}
                    {formatDate(order.createdAt)}
                  </p>
                </div>

                <div className="admin-orders__items">
                  <h3>Items Ordered</h3>

                  {(order.items || []).map(
                    (item, index) => (
                      <div
                        className="admin-orders__item"
                        key={`${order.id}-${
                          item.cartKey || index
                        }`}
                      >
                        <span>
                          {item.name} ×{" "}
                          {item.quantity}
                        </span>

                        <strong>
                          {formatCurrency(
                            Number(item.price) *
                              Number(item.quantity)
                          )}
                        </strong>
                      </div>
                    )
                  )}
                </div>

                <div className="admin-orders__total">
                  <span>Order Total</span>
                  <strong>
                    {formatCurrency(order.subtotal)}
                  </strong>
                </div>

                <div className="admin-orders__status-control">
                  <label
                    htmlFor={`order-status-${order.id}`}
                  >
                    Update order status
                  </label>

                  <div className="admin-orders__status-actions">
                    <select
                      id={`order-status-${order.id}`}
                      value={currentStatus}
                      onChange={(event) =>
                        handleStatusChange(
                          order.id,
                          event.target.value
                        )
                      }
                      disabled={isUpdating}
                    >
                      {ORDER_STATUSES.map(
                        (status) => (
                          <option
                            key={status}
                            value={status}
                          >
                            {formatStatus(status)}
                          </option>
                        )
                      )}
                    </select>

                    <button
                      className="admin-orders__status-button"
                      type="button"
                      onClick={() =>
                        handleUpdateStatus(
                          order.id
                        )
                      }
                      disabled={
                        isUpdating ||
                        currentStatus ===
                          (order.status ||
                            "pending")
                      }
                    >
                      {isUpdating
                        ? "Updating..."
                        : "Update Status"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}

export default AdminOrders;