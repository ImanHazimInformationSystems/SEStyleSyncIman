// ✅ Load all products
async function loadProducts() {
  const res = await fetch("/api/products");
  const products = await res.json();
  const tbody = document.getElementById("productTableBody");
  tbody.innerHTML = "";

  products.forEach((p) => {
    const row = `
      <tr>
        <td>${p.name}</td>
        <td>${p.brand || '-'}</td>
        <td>$${p.price}</td>
        <td>${p.stock}</td>
        <td>
          <button onclick="editProduct('${p._id}')" class="btn btn-sm btn-info me-2">Edit</button>
          <button onclick="deleteProduct('${p._id}')" class="btn btn-sm btn-danger">Delete</button>
        </td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

// ✅ Add product
document.getElementById("addProductForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;

  const product = {
    name: form.name.value,
    brand: form.brand.value,
    category: form.category.value,
    description: form.description.value,
    price: form.price.value,
    imageUrl: form.imageUrl.value,
    stock: form.stock.value
  };

  const res = await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product)
  });

  const data = await res.json();
  if (res.ok) {
    alert("Product added!");
    form.reset();
    loadProducts();
  } else {
    alert(data.message || "Error adding product.");
  }
});

// ✅ Edit product
async function editProduct(id) {
  const res = await fetch(`/api/products/${id}`);
  const p = await res.json();

  const form = document.getElementById("editProductForm");
  form.style.display = "block";
  form.id.value = p._id;
  form.name.value = p.name;
  form.brand.value = p.brand;
  form.category.value = p.category;
  form.description.value = p.description;
  form.price.value = p.price;
  form.imageUrl.value = p.imageUrl;
  form.stock.value = p.stock;
}

// ✅ Submit product edit
document.getElementById("editProductForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;

  const updated = {
    name: form.name.value,
    brand: form.brand.value,
    category: form.category.value,
    description: form.description.value,
    price: form.price.value,
    imageUrl: form.imageUrl.value,
    stock: form.stock.value
  };

  const res = await fetch(`/api/products/${form.id.value}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updated)
  });

  if (res.ok) {
    alert("Product updated!");
    form.reset();
    form.style.display = "none";
    loadProducts();
  } else {
    alert("Failed to update.");
  }
});

// ✅ Delete product
async function deleteProduct(id) {
  if (!confirm("Are you sure you want to delete this product?")) return;

  const res = await fetch(`/api/products/${id}`, {
    method: "DELETE"
  });

  const data = await res.json();
  if (res.ok) {
    alert("Product deleted!");
    loadProducts();
  } else {
    alert(data.message || "Error deleting product.");
  }
}

// ✅ Initial load
loadProducts();
