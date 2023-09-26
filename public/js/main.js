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
