// public/js/home.js
async function loadProducts() {
  const res = await fetch("/api/products");
  const products = await res.json();

  const container = document.getElementById("product-list-container");
  container.innerHTML = "";

  products.forEach((p) => {
    const col = document.createElement("div");
    col.className = "col mb-5";
    col.innerHTML = `
      <div class="card h-100">
        <img class="card-img-top" src="${p.imageUrl || '/images/no-image.png'}" alt="${p.name}" />
        <div class="card-body p-4 d-flex flex-column">
          <div class="text-center">
            <h5 class="fw-bolder">${p.name}</h5>
            $${p.price}
          </div>
          <p class="mt-2 small text-muted">${p.brand || ''}</p>
          <a href="product-details.html?id=${p._id}" class="btn btn-outline-dark mt-auto">View</a>
        </div>
      </div>
    `;
    container.appendChild(col);
  });
}

loadProducts();
