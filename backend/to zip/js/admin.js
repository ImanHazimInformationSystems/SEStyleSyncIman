document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ DOM fully loaded");

  const form = document.getElementById("productForm");
  const tableBody = document.getElementById("productTableBody");

  if (!form) console.error("❌ productForm NOT found");
  if (!tableBody) console.error("❌ productTableBody NOT found");

  if (!form || !tableBody) {
    console.error("❌ Required elements not found in DOM.");
    return;
  }

  // Load products
  loadProducts();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("productId").value;
    const method = id ? "PUT" : "POST";
    const url = id ? `/api/products/${id}` : "/api/products";

    const formData = new FormData(form);

    const res = await fetch(url, {
      method,
      body: formData
    });

    if (res.ok) {
      alert("Product saved!");
      resetForm();
      loadProducts();
    } else {
      const data = await res.json();
      alert(data.message || "Error saving product.");
    }
  });

  async function loadProducts() {
    const res = await fetch("/api/products");
    const products = await res.json();
    tableBody.innerHTML = "";

    products.forEach((p) => {
      if (!p.isDeleted) {
        tableBody.innerHTML += `
          <tr>
            <td>${p.name}</td>
            <td>${p.brand || '-'}</td>
            <td>$${p.price}</td>
            <td>${p.stock}</td>
            <td>
              <button class="btn btn-sm btn-info" onclick="editProduct('${p._id}')">Edit</button>
              <button class="btn btn-sm btn-danger" onclick="deleteProduct('${p._id}')">Delete</button>
            </td>
          </tr>
        `;
      }
    });
  }

  window.editProduct = function(id) {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(p => {
        document.getElementById("productId").value = p._id;
        document.getElementById("name").value = p.name;
        document.getElementById("brand").value = p.brand;
        document.getElementById("category").value = p.category;
        document.getElementById("description").value = p.description;
        document.getElementById("price").value = p.price;
        document.getElementById("stock").value = p.stock;
      });
  };

  window.deleteProduct = function(id) {
    if (!confirm("Are you sure you want to delete this product?")) return;

    fetch(`/api/products/${id}`, {
      method: "DELETE"
    })
      .then(res => res.json())
      .then(() => {
        alert("Product deleted successfully.");
        loadProducts();
      })
      .catch(() => alert("Error deleting product"));
  };

  window.resetForm = function() {
    form.reset();
    document.getElementById("productId").value = "";
  };
});
