const cartItems = document.getElementById("cartItems");
const cartSubtotal = document.getElementById("cartSubtotal");
const shippingPrice = document.getElementById("shippingPrice");
const cartTotal = document.getElementById("cartTotal");
const clearCartButton = document.getElementById("clearCartButton");
const checkoutButton = document.getElementById("checkoutButton");
const checkoutMessage = document.getElementById("checkoutMessage");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function showCart() {
  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = "<p>Your cart is empty.</p>";
    cartSubtotal.textContent = "0 kr";
    shippingPrice.textContent = "0 kr";
    cartTotal.textContent = "0 kr";
    return;
  }

  let subtotal = 0;

  for (let i = 0; i < cart.length; i++) {
    const product = cart[i];

    const productTotal = product.price * product.quantity;
    subtotal = subtotal + productTotal;

    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";

    const image = document.createElement("img");
    image.src = product.image;
    image.alt = product.title;

    const quantityControls = document.createElement("div");
    quantityControls.className = "quantity-controls";

    const minusButton = document.createElement("button");
    minusButton.textContent = "−";

    const quantityText = document.createElement("span");
    quantityText.textContent = product.quantity;

    const plusButton = document.createElement("button");
    plusButton.textContent = "+";

    quantityControls.appendChild(minusButton);
    quantityControls.appendChild(quantityText);
    quantityControls.appendChild(plusButton);

    const price = document.createElement("p");
    price.className = "cart-item-price";
    price.textContent = productTotal + " kr";

    const removeButton = document.createElement("button");
    removeButton.className = "remove-button";
    removeButton.textContent = "🗑️";

    cartItem.appendChild(image);
    cartItem.appendChild(quantityControls);
    cartItem.appendChild(price);
    cartItem.appendChild(removeButton);

    cartItems.appendChild(cartItem);

    plusButton.addEventListener("click", function () {
      product.quantity++;
      saveCart();
      showCart();
    });

    minusButton.addEventListener("click", function () {
      if (product.quantity > 1) {
        product.quantity--;
      } else {
        cart.splice(i, 1);
      }

      saveCart();
      showCart();
    });

    removeButton.addEventListener("click", function () {
      cart.splice(i, 1);
      saveCart();
      showCart();
    });
  }

  const shipping = 49;

  cartSubtotal.textContent = subtotal + " kr";
  shippingPrice.textContent = shipping + " kr";
  cartTotal.textContent = subtotal + shipping + " kr";
}

clearCartButton.addEventListener("click", function () {
  cart = [];
  saveCart();
  showCart();
});

checkoutButton.addEventListener("click", function () {
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  if (cart.length === 0) {
    checkoutMessage.textContent = "Your cart is empty.";
    return;
  }

  if (isLoggedIn === "true") {
    window.location.href = "../checkout/index.html";
  } else {
    checkoutMessage.textContent = "Please log in to proceed to checkout.";
    window.location.href = "../account/Login.html";
  }
});

showCart();