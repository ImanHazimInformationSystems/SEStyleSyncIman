// Show form if user is admin
const user = JSON.parse(localStorage.getItem("user") || "{}");
const token = localStorage.getItem("token");

if (user.role === "admin") {
  document.getElementById("adminProductForm").style.display = "block";
}

// Submit product
document.getElementById("addProductForm")?.addEventListener("submit", async (e) => {
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
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(product)
  });

  const data = await res.json();
  if (res.ok) {
    alert("Product added!");
    form.reset();
    loadProducts(); // if you have this to refresh the list
  } else {
    alert(data.message || "Error adding product.");
  }

  async function loadProducts() {
  const res = await fetch("/api/products");
  const { products } = await res.json();

  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";

  products.forEach((p) => {
    const isVideo = p.imageUrl?.endsWith(".mp4");
    const media = isVideo
      ? `<video class="card-img" autoplay muted loop playsinline>
           <source src="${p.imageUrl}" type="video/mp4" />
         </video>`
      : `<img src="${p.imageUrl}" class="card-img-top" alt="${p.name}" />`;

    const editBtn = user.role === "admin"
      ? `<button class="btn btn-sm btn-outline-primary me-2" onclick="editProduct('${p._id}')">Edit</button>
         <button class="btn btn-sm btn-outline-danger" onclick="deleteProduct('${p._id}')">Delete</button>`
      : "";

    const card = `
      <div class="col mb-5">
        <div class="card h-100">
          ${media}
          <div class="card-body">
            <h5 class="card-title">${p.name}</h5>
            <p class="card-text">$${p.price}</p>
            <p class="card-text text-muted">${p.category || ''}</p>
            <p class="card-text small">${p.description?.slice(0, 100)}...</p>
          </div>
          <div class="card-footer d-flex justify-content-between">
            <a href="product-details.html?id=${p._id}" class="btn btn-sm btn-dark">View</a>
            ${editBtn}
          </div>
        </div>
      </div>
    `;

    grid.innerHTML += card;
  });
}
loadProducts();

async function deleteProduct(id) {
  if (!confirm("Delete this product?")) return;

  const res = await fetch(`/api/products/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (res.ok) {
    alert("Deleted!");
    loadProducts();
  } else {
    alert(data.message || "Error");
  }
}

function editProduct(id) {
  const product = prompt("New product name (leave blank to cancel):");
  if (!product) return;

  fetch(`/api/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name: product }),
  })
    .then((res) => res.json())
    .then((data) => {
      alert("Updated!");
      loadProducts();
    })
    .catch((err) => alert("Error"));
}


});
