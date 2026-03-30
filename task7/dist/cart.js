let cart = [];

// Elements
const cartItemsContainer = document.getElementById("cart-items");
const subtotalEl = document.getElementById("subtotal");
const totalEl = document.getElementById("total");
const cartCount = document.querySelector(".cart-count");
const cartPopup = document.getElementById("cart-popup");

// CART OPEN / CLOSE
function toggleCart() {
  cartPopup.classList.toggle("hidden");
  cartPopup.classList.toggle("flex");
}

// Cart icon click
document.querySelector(".bg-black").addEventListener("click", toggleCart);


// ADD TO CART BUTTONS
document.querySelectorAll(".add-btn").forEach(button => {
  button.addEventListener("click", () => {

    const name = button.dataset.name;
    const price = parseFloat(button.dataset.price);
    const img = button.dataset.img;

    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
      existingItem.qty += 1;
    } else {
      cart.push({
        name,
        price,
        img,
        qty: 1
      });
    }

    updateCart();
    toggleCart();
  });
});


// UPDATE CART
function updateCart() {

  cartItemsContainer.innerHTML = "";

  let subtotal = 0;
  let count = 0;

  cart.forEach((item, index) => {

    subtotal += item.price * item.qty;
    count += item.qty;

    const cartItem = document.createElement("div");

    cartItem.className =
      "flex items-center justify-between border-b pb-3";

    cartItem.innerHTML = `
      <div class="flex items-center gap-3">
        <img src="${item.img}" class="w-12 h-12 object-contain">
        <div>
          <h4 class="font-semibold">${item.name}</h4>
          <p class="text-sm text-gray-500">GBP ${item.price}</p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button onclick="decreaseQty(${index})" class="px-2 bg-gray-200">-</button>
        <span>${item.qty}</span>
        <button onclick="increaseQty(${index})" class="px-2 bg-gray-200">+</button>
      </div>
    `;

    cartItemsContainer.appendChild(cartItem);
  });

  subtotalEl.textContent = subtotal.toFixed(2);
  totalEl.textContent = (subtotal + 3).toFixed(2);
  cartCount.textContent = `(${count})`;
}



// INCREASE QTY
function increaseQty(index) {
  cart[index].qty++;
  updateCart();
}


// DECREASE QTY
function decreaseQty(index) {

  if (cart[index].qty > 1) {
    cart[index].qty--;
  } else {
    cart.splice(index, 1);
  }

  updateCart();
}



// slideer

  const track = document.getElementById('sliderTrack');
  const nextBtn = document.getElementById('nextBtn');
  const prevBtn = document.getElementById('prevBtn');
  let currentPos = 0;

  nextBtn.onclick = () => {
    if (currentPos > -100) { 
      currentPos -= 33.33;
      track.style.transform = `translateX(${currentPos}%)`;
    }
  };

  prevBtn.onclick = () => {
    if (currentPos < 0) {
      currentPos += 33.33;
      track.style.transform = `translateX(${currentPos}%)`;
    }
  };