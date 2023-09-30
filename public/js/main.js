// Open & Close Cart
let cart = document.querySelector('.cart')
let cartIcon = document.querySelector('#cart-icon')
let closeCart = document.querySelector('#close-cart')

// Open Cart
cartIcon.onclick = () => {
  cart.classList.add('cart-active')
}

closeCart.onclick = () => {
  cart.classList.remove('cart-active')
}

// Add to Cart
if (document.readyState == 'loading') {
  document.addEventListener('DOMContentLoaded', ready)
} else {
  ready()
}

//Ready Function
function ready() {
  // Remove Items from Cart
  var removeCart = document.getElementsByClassName('cart-remove')
  for (var i = 0; i < removeCart.length; i++) {
    var button = removeCart[i]
    button.addEventListener('click', removeCartItem)
  }
  //Item Update
  var itemsUpdate = document.getElementsByClassName('items')
  for (var i = 0; i < itemsUpdate.length; i++) {
    var input = itemsUpdate[i]
    input.addEventListener('change', itemsChanged)
  }
  // Add to Cart
  var addCart = document.getElementsByClassName('add-cart')
  for (var i = 0; i < addCart.length; i++) {
    var button = addCart[i]
    button.addEventListener('click', addCartClicked)
  }
}

// Remove Cart Item
function removeCartItem(event) {
  var buttonClicked = event.target
  buttonClicked.parentElement.remove()
  updateTotal()
}

// Item Quantity updated
function itemsChanged(event) {
  var input = event.target
  if (isNaN(input.value) || input.value <= 0) {
    // Display an error message or handle the invalid input as needed
    console.log('Invalid input. Please enter a valid quantity.')
    input.value = 1
  }
  updateTotal()
}

// Add Cart Function
function addCartClicked(event) {
  var button = event.target
  var shopProducts = button.parentElement
  var title = shopProducts.getElementsByClassName('product-title')[0].innerText
  var price = shopProducts.getElementsByClassName('price')[0].innerText
  var productImage = shopProducts
    .getElementsByClassName('product-img')[0]
    .getAttribute('src')
  addProductToCart(title, price, productImage)
  updateTotal()
}

function addProductToCart(title, price, productImage) {
  var cartShopBox = document.createElement('div')
  cartShopBox.classList.add('cart-box')
  var cartItems = document.querySelector('.cart-content') // Change to querySelector
  var cartItemsTitles = cartItems.getElementsByClassName('card-product-title')

  for (var i = 0; i < cartItemsTitles.length; i++) {
    if (cartItemsTitles[i].innerText === title) {
      alert('You previously added this item to the cart!')
      return
    }
  }

  var cartBoxContent = `
    <img src="${productImage}" alt="" class="cart-img">
    <div class="card-detail-box">
      <div class="card-product-title">${title}</div>
      <div class="card-price">${price}</div>
      <input type="number" name="" id="" value="1" class="items" />
    </div>
    <!-- Remove Items from Cart -->
    <i class="bx bx-trash cart-remove"></i>
  `

  cartShopBox.innerHTML = cartBoxContent
  cartItems.appendChild(cartShopBox)

  cartShopBox
    .querySelector('.cart-remove')
    .addEventListener('click', removeCartItem) // Corrected querySelector
  cartShopBox.querySelector('.items').addEventListener('change', itemsChanged) // Corrected querySelector
}

// Update Total
function updateTotal() {
  var cartBoxes = document.querySelectorAll('.cart-box')
  var total = 0

  cartBoxes.forEach(function (cartBox) {
    var priceElement = cartBox.querySelector('.card-price')
    var itemsElement = cartBox.querySelector('.items')

    // Check if priceElement and itemsElement exist
    if (priceElement && itemsElement) {
      var price = parseFloat(priceElement.innerText.replace('kr', ''))
      var item = parseFloat(itemsElement.value)
      total += price * item
    }
  })

  // Update the total price
  var totalPriceElement = document.querySelector('.total-price')
  if (totalPriceElement) {
    totalPriceElement.innerText = 'kr' + total.toFixed(2) // Format total with two decimal places
  }
}
