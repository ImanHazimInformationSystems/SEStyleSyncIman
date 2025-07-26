async function loadProducts() {
  const res = await fetch("/api/products");
  const products = await res.json();

  const container = document.getElementById("product-list");
  container.innerHTML = "";

  products.forEach((p) => {
    const col = document.createElement("div");
    col.className = "col-md-3";
    col.innerHTML = `
      <div class="card h-100">
        <img src="${p.imageUrl || "https://via.placeholder.com/300x300?text=No+Image" }" class="card-img-top" alt="${p.name}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${p.name}</h5>
          <p class="card-text">$${p.price}</p>
          <a href="/product-details.html?id=${p._id}" class="btn btn-primary mt-auto">View</a>
        </div>
      </div>
    `;
    container.appendChild(col);
  });
}

loadProducts();
