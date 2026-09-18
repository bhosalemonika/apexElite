function loadFile(file, id, callback) {
  let element = document.getElementById(id);
  if (!element) {
    return;
  }
  fetch(file)
    .then((response) => response.text())
    .then((data) => {
      element.innerHTML = data;
      if (callback) {
        callback();
      }
    });
}

loadFile("navbar.html", "header");
loadFile("footer.html", "footer");
loadFile("cartNavbar.html", "nav");
loadFile("cartFooter.html", "foot");

let products = [];
fetch("product.json")
  .then((response) => response.json())
  .then((data) => {
    products = data;
    loadFile("home.html", "home", showProducts);
    showAllProducts();
    if (typeof showCart === "function") {
      showCart();
    }
    showProductDetails();
    showRecommendedProducts();

  })
  .catch((error) => {
    console.log(error);
  });

function showProducts() {
  let box = document.getElementById("featuredProducts");
  if (!box) return;
  box.innerHTML = products
    .slice(0, 3)
    .map((product) => createProduct(product))
    .join("");
}
function showAllProducts() {
  let box = document.getElementById("allProducts");
  if (!box) return;
  box.innerHTML = products
    .map((product) => createProduct(product))
    .join("");
}
function createProduct(product) {
  return `
    <div class="product-card" onclick="viewProduct(${product.id})">
      <div class="product-image">
        <img 
          src="${product.image}" 
          alt="${product.name}"
        >
        ${
          product.badge
            ? `<span class="badge">${product.badge}</span>`
            : ""
        }
      </div>
      <div class="product-details">
        <div class="product-top">
          <h3>${product.name}</h3>
          <span class="price">
            $${product.price}
          </span>
        </div>
        <div class="rating">
          ★ ${product.rating}
          (${product.reviews} reviews)
        </div>
        <div class="colors">
          ${product.colors
            .map(
              (color) => `
                <span class="color ${color}"></span>
              `
            )
            .join("")}
        </div>

        <button
          class="add-to-bag"
          onclick="event.stopPropagation(); addToCart(${product.id})"
        >
          ADD TO BAG
        </button>

      </div>

    </div>
  `;
}

function addToCart(id) {

  let cart =
    JSON.parse(localStorage.getItem("cart")) || [];

  id = Number(id);

  let item = cart.find(function(item) {
    return Number(item.id) === id;
  });

  if (item) {

    item.quantity++;

  } else {

    cart.push({
      id: id,
      quantity: 1
    });

  }

  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );

  window.location.href = "cart.html";
}
function showProductDetails() {

  let productImage = document.getElementById("productImage");
  let productCategory = document.getElementById("productCategory");
  let productName = document.getElementById("productName");
  let productPrice = document.getElementById("productPrice");
  let productDescription = document.getElementById("productDescription");
  let addProduct = document.getElementById("addProduct");

  if (!productImage || !productCategory || !productName ||
      !productPrice || !productDescription || !addProduct) {
    return;
  }

  let id = new URLSearchParams(window.location.search).get("id");

  if (!id) {
    return;
  }

  let product = products.find(function(product) {
    return Number(product.id) === Number(id);
  });

  if (!product) {
    console.log("Product not found for id:", id);
    return;
  }

  productImage.src = product.image;
  productImage.alt = product.name;

  productCategory.textContent = product.category;

  productName.textContent = product.name;

  productPrice.textContent =
    "$" + Number(product.price).toFixed(2);

  productDescription.textContent =
    product.description;

  addProduct.onclick = function() {
    addToCart(product.id);
  };
}
function viewProduct(id) {
  window.location.href = "viewPage.html?id=" + id;
}

function showRecommendedProducts() {
    let box = document.getElementById("recommendedProducts");

    if (!box) {
        return;
    }

    box.innerHTML = products
        .slice(0, 4)
        .map(function(product) {

            return `
              <div class="card" onclick="viewProduct(${product.id})">

                <img
                  src="${product.image}"
                  alt="${product.name}"
                >

                    <h4>
                        ${product.name}
                    </h4>

                    <p>
                        $${Number(product.price).toFixed(2)}
                    </p>

                </div>
            `;

        })
        .join("");
}