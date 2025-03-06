let cart = JSON.parse(localStorage.getItem("cart")) || [];

function updateCartCount() {
  const cartCountSpan = document.getElementById("cart-count");
  if(cartCountSpan) {
    cartCountSpan.textContent = cart.length;
  }
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if(!toast) return;
  toast.textContent = message;
  toast.classList.remove("hidden");
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      toast.classList.add("hidden");
    }, 300);
  }, 3000);
}

function addToCart(product) {
  let existing = cart.find(item => item.id === product.id);
  if(existing) {
    existing.quantity += product.quantity;
  } else {
    cart.push(product);
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  showToast(product.name + " added to cart!");
}

function renderCartPage() {
  const cartPage = document.getElementById("cart-page");
  if(!cartPage) return; 

  const cartBody = document.getElementById("cart-body");
  const subTotalSpan = document.getElementById("sub-total");
  const taxSpan = document.getElementById("tax-amount");
  const totalSpan = document.getElementById("total-amount");
  const checkoutBtn = document.getElementById("checkoutBtn");

  if(cart.length === 0) {
    cartBody.innerHTML = `
      <tr>
        <td colspan="5">Your cart is empty.</td>
      </tr>`;
    subTotalSpan.textContent = "0";
    taxSpan.textContent = "0";
    totalSpan.textContent = "0";
    return;
  }

  cartBody.innerHTML = "";
  let subTotal = 0;

  
  cart.forEach((item, index) => {
    const itemSubtotal = item.price * item.quantity;
    subTotal += itemSubtotal;

    let tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <div>
          <img src="${item.img}" alt="${item.name}">
        </div>
        <p>${item.name}</p>
      </td>
      <td>$${item.price}</td>
      <td>
        <div class="quantity-box">
          <button class="quantity-btn" data-index="${index}" data-action="minus">-</button>
          <span style="margin:0 8px;">${item.quantity}</span>
          <button class="quantity-btn" data-index="${index}" data-action="plus">+</button>
        </div>
      </td>
      <td>$${itemSubtotal}</td>
      <td>
        <a href="#" class="remove-btn" data-index="${index}">Remove</a>
      </td>
    `;
    cartBody.appendChild(tr);
  });

 
  let tax = (subTotal * 0.1).toFixed(2);
  let total = (subTotal + parseFloat(tax)).toFixed(2);

  subTotalSpan.textContent = subTotal.toFixed(2);
  taxSpan.textContent = tax;
  totalSpan.textContent = total;

 
  cartBody.querySelectorAll(".quantity-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const idx = parseInt(btn.getAttribute("data-index"));
      const action = btn.getAttribute("data-action");
      if(action === "plus") {
        cart[idx].quantity++;
      } else if(action === "minus") {
        cart[idx].quantity = Math.max(1, cart[idx].quantity - 1);
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount();
      renderCartPage();
    });
  });

 
  cartBody.querySelectorAll(".remove-btn").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const idx = parseInt(link.getAttribute("data-index"));
      cart.splice(idx, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount();
      renderCartPage();
    });
  });

 
  checkoutBtn.addEventListener("click", () => {
    if(cart.length === 0){
      alert("Your cart is empty!");
      return;
    }
    alert("Your order has been confirmed! Thank you.");
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    renderCartPage();
  });
}


document.addEventListener("DOMContentLoaded", () => {

  updateCartCount();

  
  const buyButtons = document.querySelectorAll(".buy-btn");
  buyButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const name = btn.getAttribute("data-name");
      const price = parseFloat(btn.getAttribute("data-price"));
      const img = btn.getAttribute("data-img");
      let product = {
        id: name,
        name: name,
        price: price,
        img: img,
        quantity: 1
      };
      addToCart(product);
    });
  });

  
  renderCartPage();
});
