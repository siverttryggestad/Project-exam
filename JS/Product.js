const baseUrl = "https://v2.api.noroff.dev/online-shop";

const productTitle = document.getElementById("productTitle");
const productDescription = document.getElementById("productDescription");
const oldPrice = document.getElementById("oldPrice");
const productPrice = document.getElementById("productPrice");
const productRating = document.getElementById("productRating");
const productImage = document.getElementById("productImage");
const productTags = document.getElementById("productTags");
const productReviews = document.getElementById("productReviews");
const addToCartButton = document.getElementById("addToCartButton");
const shareButton = document.getElementById("shareButton");
const messageText = document.getElementById("messageText");
const recommendedGrid = document.getElementById("recommendedGrid");

let currentProduct = null;

const queryString = window.location.search;
const params = new URLSearchParams(queryString);
const productId = params.get("id");

async function getProduct() {
  try {
    const response = await fetch(baseUrl + "/" + productId);
    const result = await response.json();

    const product = result.data;

    showProduct(product);
    getRecommendedProducts(product.id);
  } catch (error) {
    productTitle.textContent = "Could not load product";
    console.log(error);
  }
}

function showProduct(product) {
  currentProduct = product;

  productTitle.textContent = product.title;
  productDescription.textContent = product.description;

  productImage.src = product.image.url;
  productImage.alt = product.image.alt;

  if (product.discountedPrice < product.price) {
    oldPrice.textContent = product.price + " kr";
    productPrice.textContent = product.discountedPrice + " kr";
  } else {
    oldPrice.textContent = "";
    productPrice.textContent = product.price + " kr";
  }

  productRating.textContent = "Rating: " + product.rating + "/5";

  showTags(product.tags);
  showReviews(product.reviews);
}

function showTags(tags) {
  productTags.innerHTML = "";

  for (let i = 0; i < tags.length; i++) {
    const tag = document.createElement("li");
    tag.textContent = tags[i];
    productTags.appendChild(tag);
  }
}

function showReviews(reviews) {
  productReviews.innerHTML = "";

  if (reviews.length === 0) {
    productReviews.innerHTML = "<p>No reviews yet.</p>";
    return;
  }

  for (let i = 0; i < reviews.length; i++) {
    const reviewCard = document.createElement("div");
    reviewCard.className = "review-card";

    const username = document.createElement("h3");
    username.textContent = reviews[i].username;

    const rating = document.createElement("p");
    rating.textContent = "Rating: " + reviews[i].rating + "/5";

    const description = document.createElement("p");
    description.textContent = reviews[i].description;

    reviewCard.appendChild(username);
    reviewCard.appendChild(rating);
    reviewCard.appendChild(description);

    productReviews.appendChild(reviewCard);
  }
}

async function getRecommendedProducts(currentProductId) {
  try {
    const response = await fetch(baseUrl);
    const result = await response.json();

    const products = result.data;
    const recommendedProducts = [];

    for (let i = 0; i < products.length; i++) {
      if (products[i].id !== currentProductId && recommendedProducts.length < 3) {
        recommendedProducts.push(products[i]);
      }
    }

    showRecommendedProducts(recommendedProducts);
  } catch (error) {
    recommendedGrid.innerHTML = "<p>Could not load recommended products.</p>";
    console.log(error);
  }
}

function showRecommendedProducts(products) {
  recommendedGrid.innerHTML = "";

  for (let i = 0; i < products.length; i++) {
    const product = products[i];

    const card = document.createElement("article");
    card.className = "product-card";

    const imageLink = document.createElement("a");
    imageLink.href = "../product/index.html?id=" + product.id;
    imageLink.className = "product-image-link";

    const image = document.createElement("img");
    image.src = product.image.url;
    image.alt = product.image.alt;

    imageLink.appendChild(image);

    const title = document.createElement("h3");
    title.className = "product-title";
    title.textContent = product.title;

    const price = document.createElement("p");
    price.className = "product-price";

    if (product.discountedPrice < product.price) {
      price.innerHTML =
        "<span class='old-price'>" +
        product.price +
        " kr</span> <span class='sale-price'>" +
        product.discountedPrice +
        " kr</span>";
    } else {
      price.textContent = product.price + " kr";
    }

    card.appendChild(imageLink);
    card.appendChild(title);
    card.appendChild(price);

    recommendedGrid.appendChild(card);
  }
}

addToCartButton.addEventListener("click", function () {
  if (!currentProduct) {
    messageText.textContent = "Product is not loaded yet.";
    return;
  }

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const cartProduct = {
    id: currentProduct.id,
    title: currentProduct.title,
    price: currentProduct.discountedPrice,
    image: currentProduct.image.url,
    quantity: 1
  };

  let productAlreadyInCart = false;

  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id === cartProduct.id) {
      cart[i].quantity++;
      productAlreadyInCart = true;
    }
  }

  if (productAlreadyInCart === false) {
    cart.push(cartProduct);
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  messageText.textContent = "Product added to cart.";
});

shareButton.addEventListener("click", function () {
  const shareUrl = window.location.href;

  navigator.clipboard.writeText(shareUrl);
  messageText.textContent = "Product link copied.";
});

if (productId) {
  getProduct();
} else {
  productTitle.textContent = "No product selected.";
}