document.addEventListener("DOMContentLoaded", function () {
  // Page-specific logic
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
function setupCartPage() {
  const storedCart = JSON.parse(localStorage.getItem("cartItems")) || [];

  storedCart.forEach(item => {
    addItemToCart(item.title, item.price, item.image, item.quantity);
  });

  updateCartTotal();

  const quantityInputs = document.getElementsByClassName("cart-quantity-input");
  for (let input of quantityInputs) {
    input.addEventListener("change", quantityChanged);
  }

  const plusButtons = document.getElementsByClassName("plus");
  const minusButtons = document.getElementsByClassName("minus");

  for (let btn of plusButtons) {
    btn.addEventListener("click", function () {
      const input = this.parentElement.querySelector(".cart-quantity-input");
      input.value = parseInt(input.value) + 1;
      updateCartTotal();
      updateCartInLocalStorage();
    });
  }

  for (let btn of minusButtons) {
    btn.addEventListener("click", function () {
      const input = this.parentElement.querySelector(".cart-quantity-input");
      if (parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
        updateCartTotal();
        updateCartInLocalStorage();
      }
    });
  }

  const purchaseBtn = document.querySelector(".btn-purchase");
  if (purchaseBtn) {
    purchaseBtn.addEventListener("click", purchaseClicked);
  }
}


/* ---------- SHARED FUNCTIONS ---------- */

function addItemToCart(title, price, imageSrc, quantity) {
  const cartItemsContainer = document.querySelector(".cart-items");

  const cartRow = document.createElement("tr");
  cartRow.classList.add("cart-row");
  cartRow.innerHTML = `
    <td style="display: flex; align-items: center; gap: 10px;">
        <img src="${imageSrc}" width="60" height="60" style="object-fit: cover; border-radius: 5px;">
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
    const image = row.querySelector("img").src;
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

function updateCartCount() {
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartCount = document.getElementById("cart-count");
  if (cartCount) {
    cartCount.textContent = totalQuantity;
  }
}
