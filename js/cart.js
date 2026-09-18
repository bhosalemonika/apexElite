
function showCart() {
  let box = document.getElementById("products");
  if (!box) return;
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let subtotal = 0;
  box.innerHTML = cart
    .map((item) => {
      let product = products.find((product) => product.id === item.id);
      if (!product) return "";
      let price = product.price * item.quantity;
      subtotal += price;
      return `
            <div class="item">
                <img
                    src="${product.image}"
                    alt="${product.name}"
                >
                <div class="info">
                    <h3>
                        ${product.name}
                    </h3>
                    <p>
                        ${product.category}
                    </p>
                    <div class="details">
                        <div>
                            <small>SIZE</small>
                            <b>10.5</b>
                        </div>
                        <div>
                            <small>QUANTITY</small>
                            <b>
                                <button class="bt-min"
                                    onclick="changeQuantity(${product.id}, -1)"
                                >
                                    -
                                </button>
                                ${item.quantity}
                                <button class="bt-min"
                                    onclick="changeQuantity(${product.id}, 1)"
                                >
                                    +
                                </button>
                            </b>
                        </div>
                    </div>
                    <small
                        class="remove"
                        onclick="removeProduct(${product.id})"
                    >
                        Remove
                    </small>
                </div>
                <strong>
                    $${price.toFixed(2)}

                </strong>
            </div>
        `;
    })
    .join("");
  let tax = subtotal * 0.0824;

  let total = subtotal + tax;
  document.getElementById("subtotal").textContent = "$" + subtotal.toFixed(2);
  document.getElementById("tax").textContent = "$" + tax.toFixed(2);
  document.getElementById("total").textContent = "$" + total.toFixed(2);
}

function changeQuantity(id, change) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let item = cart.find((item) => item.id === id);
  if (!item) return;
  item.quantity += change;
  if (item.quantity <= 0) {
    cart = cart.filter((item) => item.id !== id);
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  showCart();
}

function removeProduct(id) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter((item) => item.id !== id);
  localStorage.setItem("cart", JSON.stringify(cart));
  showCart();
}
