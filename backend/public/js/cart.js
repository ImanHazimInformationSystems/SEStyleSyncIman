function updateCartCount() {
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartCount = document.getElementById("cart-count");
  if (cartCount) {
    cartCount.textContent = totalQuantity;
  }
}

document.addEventListener("DOMContentLoaded", function () {

  updateCartCount();

  if (document.querySelector(".cart-items")) {
    setupCartPage();
  }

  if (document.querySelector(".shop-item-button") && document.querySelector(".qty")) {
    setupProductPage();
  }
});

/* ---------- PRODUCT DETAIL PAGE ---------- */
function setupProductPage() {
  const addToCartBtn = document.querySelector(".shop-item-button");
  const quantityInput = document.querySelector(".qty");
  const minusBtn = document.querySelector(".minus");
  const plusBtn = document.querySelector(".plus");

  updateCartCount();

  if (plusBtn && quantityInput) {
    plusBtn.addEventListener("click", function () {
      let currentQty = parseInt(quantityInput.value);
      quantityInput.value = currentQty + 1;
      minusBtn.disabled = false;
    });
  }

  if (minusBtn && quantityInput) {
    minusBtn.addEventListener("click", function () {
      let currentQty = parseInt(quantityInput.value);
      if (currentQty > 1) {
        quantityInput.value = currentQty - 1;
        if (currentQty - 1 === 1) {
          minusBtn.disabled = true;
        }
      }
    });
  }

  if (addToCartBtn && quantityInput) {
    addToCartBtn.addEventListener("click", function () {
      const title = document.querySelector(".shop-item-title").innerText;
      const price = document.querySelector(".shop-item-price").innerText;
      const image = document.querySelector(".shop-item-image").src;
      const quantity = parseInt(quantityInput.value);

      const newItem = { title, price, image, quantity };

      let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
      const existing = cartItems.find(item => item.title === title);

      if (existing) {
        existing.quantity += quantity;
      } else {
        cartItems.push(newItem);
      }

      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      updateCartCount();

      quantityInput.value = 1;
      minusBtn.disabled = true;
    });
  }

  if (parseInt(quantityInput.value) <= 1) {
    minusBtn.disabled = true;
  }
}


/* ---------- CART PAGE ---------- */
async function setupCartPage() {
  const token = localStorage.getItem("token");
  const cartItemsContainer = document.querySelector(".cart-items");
  const totalElement = document.querySelector(".cart-total-price");

  // Clear existing items
  cartItemsContainer.innerHTML = "";

  let items = [];
  let total = 0;

  if (token) {
    // Logged-in user: fetch from backend
    try {
      const res = await fetch("/api/cart", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to load cart");

      items = data.items || [];

      items.forEach(({ product, quantity }) => {
        const price = product.price;
        const title = product.name;
        const image = product.imageUrl || "/images/default.jpg";
        total += price * quantity;

        addItemToCart(title, `$${price.toFixed(2)}`, image, quantity, product._id);
      });
    } catch (err) {
      console.error("Cart fetch failed:", err.message);
      alert("Failed to load cart.");
    }
  } else {
    // Guest user: use localStorage
    const storedCart = JSON.parse(localStorage.getItem("cartItems")) || [];

    storedCart.forEach(item => {
      const price = parseFloat(item.price.replace("$", ""));
      total += price * item.quantity;
      addItemToCart(item.title, item.price, item.image, item.quantity);
    });
  }

  totalElement.innerText = `$${total.toFixed(2)}`;
  updateCartCount();

  const plusButtons = document.getElementsByClassName("plus");
  const minusButtons = document.getElementsByClassName("minus");

  updateCartInLocalStorage();  // sync what's visible
  updateCartCount();  

}
/* ---------- SHARED FUNCTIONS ---------- */

function addItemToCart(title, price, imageSrc, quantity, productId = null) {
  const cartItemsContainer = document.querySelector(".cart-items");

  const cartRow = document.createElement("tr");
  cartRow.classList.add("cart-row");

  if (productId) {
    cartRow.dataset.productId = productId;
  }

  const isVideo = imageSrc.match(/\.(mp4|mov|webm)$/i);
  cartRow.innerHTML = `
    <td style="display: flex; align-items: center; gap: 10px;">
      ${
        isVideo
          ? `<video width="60" height="60" style="border-radius: 5px;">
              <source src="${imageSrc}" type="video/mp4">
              Video not supported
            </video>`
          : `<img src="${imageSrc || '/images/default.jpg'}" width="60" height="60" style="object-fit: cover; border-radius: 5px;">`
      }
      <span>${title}</span>
    </td>
    <td class="cart-price">${price}</td>
    <td>
      <div class="quantity-controls" style="display: flex; align-items: center; gap: 5px;">
        <input type="button" value="-" class="minus" />
        <input type="number" class="cart-quantity-input" min="1" value="${quantity}" style="width: 50px; text-align: center;" readonly />
        <input type="button" value="+" class="plus" />
      </div>
    </td>
  `;

  cartItemsContainer.appendChild(cartRow);

  // Refresh cart count
  updateCartCount();

  // Re-attach plus/minus events (safe for dynamic items)
  attachQuantityHandlers();
}

function updateCartTotal() {
  const cartRows = document.querySelectorAll(".cart-row");
  let total = 0;

  cartRows.forEach(row => {
    const priceElement = row.querySelector(".cart-price");
    const quantityElement = row.querySelector(".cart-quantity-input");

    const price = parseFloat(priceElement.innerText.replace("RM", "").replace("$", "").trim());
    const quantity = parseInt(quantityElement.value);

    if (!isNaN(price) && !isNaN(quantity)) {
      total += price * quantity;
    }
  });

  total = Math.round(total * 100) / 100;

  const totalElement = document.querySelector(".cart-total-price");
  if (totalElement) {
    totalElement.innerText = "$ " + total.toFixed(2);
  }
}

function updateCartInLocalStorage() {
  const cartRows = document.querySelectorAll(".cart-row");
  const updatedCart = [];

  cartRows.forEach(row => {
    const title = row.querySelector("td span").innerText;
    const price = row.querySelector(".cart-price").innerText;
    const imgElement = row.querySelector("img");
    const image = imgElement ? imgElement.src : "/images/default.jpg";
    const quantity = parseInt(row.querySelector(".cart-quantity-input").value);

    updatedCart.push({ title, price, image, quantity });
  });

  localStorage.setItem("cartItems", JSON.stringify(updatedCart));
}

function quantityChanged(event) {
  const input = event.target;
  const quantity = parseInt(input.value);

  if (isNaN(quantity) || quantity < 1) {
    input.value = 1;
  }

  updateCartTotal();
  updateCartInLocalStorage();
}

function attachQuantityHandlers() {
  const plusButtons = document.querySelectorAll(".plus");
  const minusButtons = document.querySelectorAll(".minus");

  plusButtons.forEach(btn => {
    btn.onclick = async function () {
      const row = this.closest(".cart-row");
      const input = row.querySelector(".cart-quantity-input");
      const productId = row.dataset.productId;
      const token = localStorage.getItem("token");

      input.value = parseInt(input.value) + 1;
      updateCartTotal();
      updateCartInLocalStorage();
      updateCartCount();

      if (token && productId) {
        await fetch(`/api/cart/update/${productId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ quantity: parseInt(input.value) })
        });
      }
    };
  });

  minusButtons.forEach(btn => {
    btn.onclick = async function () {
      const row = this.closest(".cart-row");
      const input = row.querySelector(".cart-quantity-input");
      const title = row.querySelector("td span").innerText.trim();
      const productId = row.dataset.productId;
      const token = localStorage.getItem("token");
      const quantity = parseInt(input.value);

      if (quantity > 1) {
        input.value = quantity - 1;
        updateCartTotal();
        updateCartInLocalStorage();
        updateCartCount();

        if (token && productId) {
          await fetch(`/api/cart/update/${productId}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ quantity: parseInt(input.value) })
          });
        }
      } else {
        row.remove();

        if (token && productId) {
          await fetch(`/api/cart/remove/${productId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
          });
        }

        let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
        cartItems = cartItems.filter(item => item.title !== title);
        localStorage.setItem("cartItems", JSON.stringify(cartItems));

        updateCartTotal();
        updateCartInLocalStorage();
        updateCartCount();
      }
    };
  });
}

function purchaseClicked() {
  const token = localStorage.getItem("token");

  if (token) {
    // Logged-in user — you may want to send the cart to the backend for order processing
    alert("Purchase successful! (Logged-in user)");
    // Optionally: Clear server-side cart using a DELETE or POST to /api/cart/checkout
  } else {
    // Guest user — just clear localStorage
    alert("Thank you for your purchase!");
    localStorage.removeItem("cartItems");
    document.querySelector(".cart-items").innerHTML = "";
    document.querySelector(".cart-total-price").innerText = "$0.00";
    updateCartCount();
  }
}       