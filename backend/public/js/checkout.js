let subtotal = 0;
let discountAmount = 0; // ✅ must match everywhere

function renderCartItems() {
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  const container = document.getElementById("cart-items");

  subtotal = 0;
  container.innerHTML = "";

  if (cartItems.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  cartItems.forEach(item => {
    let price = item.price;
    if (typeof price === "string") {
      price = parseFloat(price.replace(/[^0-9.]/g, ""));
    }

    console.log(`Title: ${item.title}, Price: ${price}, Qty: ${item.quantity}`);

    const itemTotal = price * item.quantity;
    subtotal += itemTotal;

    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <img src="${item.image}" alt="${item.title}">
      <div>
        <p>${item.title}</p>
        <span>${item.quantity}x</span>
      </div>
      <strong>$ ${itemTotal.toFixed(2)}</strong>
    `;
    container.appendChild(div);
  });

  updateTotals(); // ✅ update after render
}

function updateTotals() {
  const shipping = 10.00;
  const total = subtotal + shipping - discountAmount; // ✅ use the same name!

  document.getElementById("subtotal").innerText = `$ ${subtotal.toFixed(2)}`;
  document.getElementById("shipping").innerText = `$ ${shipping.toFixed(2)}`;
  document.getElementById("discount").innerText = `- $${discountAmount.toFixed(2)}`;
  document.getElementById("total").innerText = `$ ${total.toFixed(2)}`;
}

function applyDiscount() {
  const code = document.getElementById("discount-code-input").value.trim().toUpperCase();
  const validCodes = {
    "FREESHIP": 10,
    "SAVE5": 5,
    "SHOPWITHLEENA": 500
  };

  if (validCodes[code]) {
    discountAmount = validCodes[code];
    alert(`Discount code applied! You saved $${discountAmount}.`);
  } else {
    discountAmount = 0;
    alert("Invalid discount code.");
  }

  updateTotals(); // ✅ recalculate with new discount
}

// ✅ Call render on load
renderCartItems();

let selectedPaymentMethod = localStorage.getItem("paymentMethod") || "";

function selectPayment(method) {
  selectedPaymentMethod = method;
  localStorage.setItem("paymentMethod", method);

  // Remove all selected states
  document.getElementById("option-card").classList.remove("selected");
  document.getElementById("option-paypal").classList.remove("selected");

  // Add selected class
  if (method === "card") {
    document.getElementById("option-card").classList.add("selected");
    document.getElementById("card-form").style.display = "block";
  } else if (method === "paypal") {
    document.getElementById("option-paypal").classList.add("selected");
    document.getElementById("card-form").style.display = "none";
  }
}

// On load, re-apply saved payment method
window.onload = function() {
  renderCartItems();
  document.getElementById("apply-discount-btn").addEventListener("click", applyDiscount);

  if (selectedPaymentMethod) {
    selectPayment(selectedPaymentMethod);
  }
};

const expiryInput = document.getElementById("card-expiry");

expiryInput.addEventListener("input", () => {
  // Remove all non-digits
  let value = expiryInput.value.replace(/\D/g, "");

  // Limit to 4 digits max (MMYY)
  if (value.length > 4) {
    value = value.substring(0, 4);
  }

  // Format as MM/YY
  if (value.length >= 3) {
    value = value.substring(0, 2) + "/" + value.substring(2);
  }

  expiryInput.value = value;
});

const cardNumberInput = document.getElementById("card-number");

cardNumberInput.addEventListener("input", formatCardNumber);

function formatCardNumber(e) {
  // Remove all non-digit characters
  let value = e.target.value.replace(/\D/g, "");

  // Limit to 16 digits max
  value = value.substring(0, 16);

  // Add spaces every 4 digits
  const parts = [];
  for (let i = 0; i < value.length; i += 4) {
    parts.push(value.substring(i, i + 4));
  }

  e.target.value = parts.join(" ");
}
const cvvInput = document.getElementById("card-cvv");

cvvInput.addEventListener("input", () => {
  // Remove all non-digits
  cvvInput.value = cvvInput.value.replace(/\D/g, "");

  // Limit to max 3 digits
  if (cvvInput.value.length > 3) {
    cvvInput.value = cvvInput.value.slice(0, 3);
  }
});

document.getElementById("pay-now-btn").addEventListener("click", handlePayment);

function handlePayment() {
  if (selectedPaymentMethod === "card") {
    const cardNumber = document.getElementById("card-number").value.trim();
    const cvv = document.getElementById("card-cvv").value.trim();
    const expiry = document.getElementById("card-expiry").value.trim();
    // Remove spaces in card number
    const cleanCardNumber = cardNumber.replace(/\s+/g, "");
    
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      alert("Expiry Date must be in MM/YY format.");
      return;
    }

    const [month, year] = expiry.split("/").map(Number);

    if (month < 1 || month > 12) {
      alert("Expiry month must be between 01 and 12.");
      return;
    }

    if (!/^\d{16}$/.test(cleanCardNumber)) {
      alert("Card Number must be exactly 16 digits.");
      return;
    }

    if (!/^\d{3}$/.test(cvv)) {
      alert("CVV must be exactly 3 digits.");
      return;
    }

    alert("Payment successful with card!");
    // You can redirect or process further here
  } else if (selectedPaymentMethod === "paypal") {
    alert("Payment successful with PayPal!");
    // Handle PayPal flow here
  } else {
    alert("Please select a payment method.");
  }
}

// ✅ Hook up Apply button AFTER HTML loads
document.getElementById("apply-discount-btn").addEventListener("click", applyDiscount);
