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
}

// Remove Cart Item
function removeCartItem(event) {
  var buttonClicked = event.target
  buttonClicked.parentElement.remove()
}
