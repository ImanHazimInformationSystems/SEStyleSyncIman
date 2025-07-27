// Check if user is admin and show admin form
const user = JSON.parse(localStorage.getItem("user"));
if (user?.role === 'admin') {
  document.getElementById("adminProductForm").style.display = "block";
}

// Add product (admin only)
document.getElementById("addProductForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const token = localStorage.getItem("token");

  const res = await fetch("/api/products", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData
  });

  const data = await res.json();
  if (res.ok) {
    alert("Product added!");
    form.reset();
    loadProducts();
  } else {
    alert(data.message || "Error adding product");
  }
});

async function loadProducts() {
  const res = await fetch("/api/products");
  const products = await res.json();
  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";

  products.forEach(p => {
    if (!p.isDeleted) {
      grid.innerHTML += `
        <div class="col mb-5">
          <div class="card h-100">
            <video class="card-img-top" autoplay muted loop playsinline>
              <source src="${p.imageUrl}" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div class="card-body text-center">
              <h5 class="card-title">${p.name}</h5>
              <p class="card-text">$${p.price}</p>
              <a href="/product-details.html?id=${p._id}" class="btn btn-sm btn-outline-dark">View</a>
            </div>
          </div>
        </div>
      `;
    }
  });
}

loadProducts(); // ✅ Call it
