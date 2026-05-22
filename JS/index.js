const url = "https://v2.api.noroff.dev/online-shop";

const carouselImage = document.getElementById("carouselImage");
const carouselImageLink = document.getElementById("carouselImageLink");
const carouselTitle = document.getElementById("carouselTitle");
const carouselDescription = document.getElementById("carouselDescription");
const carouselOldPrice = document.getElementById("carouselOldPrice");
const carouselSalePrice = document.getElementById("carouselSalePrice");
const carouselButton = document.getElementById("carouselButton");
const loginSuccessMessage = document.getElementById("logInSuccessMessage");

const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");

const productGrid = document.getElementById("productGrid");
const productCount = document.getElementById("productCount");

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");

let products = [];
let carouselProducts = [];
let currentIndex = 0;

async function getProducts() {
  try {
    const response = await fetch(url);
    const data = await response.json();

    products = data.data;

    for (let i = 0; i < products.length; i++) {
      if (products[i].discountedPrice < products[i].price && carouselProducts.length < 3) {
        carouselProducts.push(products[i]);
      }
    }

    if (carouselProducts.length < 3) {
      carouselProducts = products.slice(0, 3);
    }

    showCarouselProduct();
    showProducts(products.slice(0, 12));
  } catch (error) {
    productGrid.innerHTML = "<p>Could not load products.</p>";
    console.log(error);
  }
}

function showCarouselProduct() {
  const product = carouselProducts[currentIndex];

  carouselImage.src = product.image.url;
  carouselImage.alt = product.image.alt;

  carouselImageLink.href = "product/index.html?id=" + product.id;
  carouselButton.href = "product/index.html?id=" + product.id;

  carouselTitle.textContent = product.title;
  carouselDescription.textContent = product.description;

  if (product.discountedPrice < product.price) {
    carouselOldPrice.textContent = "$" + product.price;
    carouselSalePrice.textContent = "$" + product.discountedPrice;
  } else {
    carouselOldPrice.textContent = "";
    carouselSalePrice.textContent = "$" + product.price;
  }
}

function showProducts(productList) {
  productGrid.innerHTML = "";
  productCount.textContent = productList.length + " products";

  for (let i = 0; i < productList.length; i++) {
    const product = productList[i];

    const card = document.createElement("article");
    card.className = "product-card";

    const imageLink = document.createElement("a");
    imageLink.href = "product/index.html?id=" + product.id;
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
        "<span class='old-price'>$" +
        product.price +
        "</span> <span class='sale-price'>$" +
        product.discountedPrice +
        "</span>";
    } else {
      price.textContent = "$" + product.price;
    }

    const rating = document.createElement("p");
    rating.className = "product-rating";
    rating.textContent = "Stars: " + product.rating;

    const button = document.createElement("a");
    button.href = "product/index.html?id=" + product.id;
    button.className = "product-button";
    button.textContent = "View product";

    card.appendChild(imageLink);
    card.appendChild(title);
    card.appendChild(price);
    card.appendChild(rating);
    card.appendChild(button);

    productGrid.appendChild(card);
  }
}

nextButton.addEventListener("click", function () {
  currentIndex++;

  if (currentIndex >= carouselProducts.length) {
    currentIndex = 0;
  }

  showCarouselProduct();
});

prevButton.addEventListener("click", function () {
  currentIndex--;

  if (currentIndex < 0) {
    currentIndex = carouselProducts.length - 1;
  }

  showCarouselProduct();
});

searchButton.addEventListener("click", function () {
  const searchValue = searchInput.value.toLowerCase();
  const filteredProducts = [];

  for (let i = 0; i < products.length; i++) {
    const title = products[i].title.toLowerCase();
    const description = products[i].description.toLowerCase();

    if (title.includes(searchValue) || description.includes(searchValue)) {
      filteredProducts.push(products[i]);
    }
  }

  showProducts(filteredProducts.slice(0, 12));
});

searchInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    searchButton.click();
  }
});

getProducts();

const loginMessage = localStorage.getItem("loginMessage");

if (loginMessage === "true") {
  loginSuccessMessage.classList.remove("hidden");

  setTimeout(function () {
    loginSuccessMessage.classList.add("hidden");
  }, 5000);

  localStorage.removeItem("loginMessage");
}
