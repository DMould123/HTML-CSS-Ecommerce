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

// Update Total
function updateTotal() {
  var cartBoxes = document.querySelectorAll('.cart-box')
  var total = 0

  cartBoxes.forEach(function (cartBox) {
    var priceElement = cartBox.querySelector('.card-price')
    var itemsElement = cartBox.querySelector('.items')
    var price = parseFloat(priceElement.innerText.replace('kr', ''))
    var item = parseFloat(itemsElement.value)
    total += price * item
  })

  document.querySelector('.total-price').innerText = 'kr' + total.toFixed(2) // Format total with two decimal places
}
