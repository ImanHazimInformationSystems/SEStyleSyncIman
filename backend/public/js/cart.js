document.addEventListener("DOMContentLoaded", () => {
  const cartTable = document.querySelector(".cart-items");
  const cartTotal = document.querySelector(".cart-total-price");

  const token = localStorage.getItem("token");

  // Redirect if not logged in
  if (!token) {
    alert("Please login to view your cart.");
    window.location.href = "/login.html";
    return;
  }

  // ✅ 1. Load Cart Items
  async function loadCart() {
    try {
      const res = await fetch("/api/cart", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      if (res.status === 401 || res.status === 403) {
        console.warn("Token rejected by server. Logging out.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        alert("Your session has expired or is invalid. Please login again.");
        return window.location.href = "/login.html";
        }


      if (!res.ok) throw new Error("Failed to fetch cart");

      const cart = await res.json();
      cartTable.innerHTML = "";
      let total = 0;

      if (cart.items.length === 0) {
        cartTable.innerHTML = "<tr><td colspan='3'>Your cart is empty.</td></tr>";
      } else {
        for (const item of cart.items) {
          const { product, quantity } = item;
          const row = document.createElement("tr");

          row.innerHTML = `
            <td>${product.name}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>${quantity}</td>
          `;

          cartTable.appendChild(row);
          total += product.price * quantity;
        }
      }

      cartTotal.textContent = `$${total.toFixed(2)}`;
    } catch (err) {
      console.error("Cart load error:", err);
      alert("Failed to load cart. Please try again.");
    }
  }

  loadCart();
});
