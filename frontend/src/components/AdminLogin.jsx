import { useState } from "react";
import "./AdminLogin.css";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "https://choco-atelier.onrender.com/api/admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Login failed.");
      }

      // Save JWT token
      localStorage.setItem("choco_admin_token", data.access_token);

      // Save admin information
      localStorage.setItem(
        "choco_admin",
        JSON.stringify(data.admin)
      );

      // Redirect to admin dashboard
      window.location.href = "/admin/orders";
    } catch (error) {
      setError(error.message || "Unable to login.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">

        <div className="admin-login-brand">
          <div className="admin-login-logo">🍫</div>

          <h1>Choco Atelier</h1>

          <p>Admin Portal</p>
        </div>
        <button
  type="button"
  className="admin-back-button"
  onClick={() => {
    window.location.href = "/";
  }}
>
  ← Back to Store
</button>
        <form onSubmit={handleLogin}>

          <div className="admin-input-group">
            <label htmlFor="admin-email">
              Email Address
            </label>

            <input
              id="admin-email"
              type="email"
              placeholder="Enter admin email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="username"
            />
          </div>

          <div className="admin-input-group">
            <label htmlFor="admin-password">
              Password
            </label>

            <input
              id="admin-password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="admin-login-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="admin-login-button"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

        </form>

        <div className="admin-login-footer">
          <span>Choco Atelier</span>
          <span>•</span>
          <span>Secure Admin Access</span>
        </div>

      </div>
    </div>
  );
}

export default AdminLogin;