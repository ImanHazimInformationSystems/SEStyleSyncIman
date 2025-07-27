document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("productForm");
  const tableBody = document.getElementById("productTableBody");
  const token = localStorage.getItem("token");

  // 🟩 Handle form submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    const res = await fetch("/api/seller/add-product", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData
    });

    const data = await res.json();
    if (res.ok) {
      alert("✅ Product added!");
      form.reset();
      loadSellerProducts();
    } else {
      alert("❌ Error: " + (data.message || "Unknown error"));
    }
  });

  // 🟩 Fetch and show seller's products
  async function loadSellerProducts() {
    const res = await fetch("/api/seller/products", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const products = await res.json();
    tableBody.innerHTML = "";

    products.forEach((p) => {
      tableBody.innerHTML += `
        <tr>
          <td>${p.name}</td>
          <td>${p.brand || '-'}</td>
          <td>$${p.price}</td>
          <td>${p.stock}</td>
          <td>
            <button class="btn btn-sm btn-danger" onclick="deleteProduct('${p._id}')">Delete</button>
          </td>
        </tr>
      `;
    });
  }

  // 🟩 Delete product
  window.deleteProduct = async function (id) {
    if (!confirm("Are you sure?")) return;

    const res = await fetch(`/api/seller/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      alert("🗑️ Product deleted.");
      loadSellerProducts();
    } else {
      alert("❌ Failed to delete.");
    }
  };

  loadSellerProducts();
});
