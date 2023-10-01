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

// Ready Function
function ready() {
  // Remove Items from Cart
  var removeCart = document.getElementsByClassName('cart-remove')
  for (var i = 0; i < removeCart.length; i++) {
    var button = removeCart[i]
    button.addEventListener('click', removeCartItem)
  }
  // Item Update
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

  loadCartFromLocalStorage() // Load cart data from localStorage
}

// Remove Cart Item
function removeCartItem(event) {
  var buttonClicked = event.target
  buttonClicked.parentElement.remove()
  updateTotal()
  saveCartToLocalStorage() // Save cart data after removing an item
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
  saveCartToLocalStorage() // Save cart data after updating item quantity
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

function addProductToCart(title, price, productImageSrc, productImage) {
  var cartItems = document.querySelector('.cart-content')
  var cartItemsBoxes = cartItems.getElementsByClassName('cart-box')
  var cartBoxToUpdate = null

  // Check if the item already exists in the cart
  for (var i = 0; i < cartItemsBoxes.length; i++) {
    var cartItemTitle = cartItemsBoxes[i].querySelector('.card-product-title')
    if (cartItemTitle && cartItemTitle.innerText === title) {
      cartBoxToUpdate = cartItemsBoxes[i]
      break
    }
  }

  if (cartBoxToUpdate) {
    // If the item exists in the cart, update the quantity
    var itemsElement = cartBoxToUpdate.querySelector('.items')
    if (itemsElement) {
      var currentQuantity = parseFloat(itemsElement.value)
      itemsElement.value = currentQuantity + 1
    }
  } else {
    // If the item does not exist in the cart, create a new cart box
    var cartShopBox = document.createElement('div')
    cartShopBox.classList.add('cart-box')

    var cartBoxContent = `
      <img src="${productImageSrc}" alt="" class="cart-img">
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
      .addEventListener('click', removeCartItem)
    cartShopBox.querySelector('.items').addEventListener('change', itemsChanged)
  }

  // Store the product image source in the cart item data
  var cartData = JSON.parse(localStorage.getItem('cartData')) || []
  var existingCartItemIndex = cartData.findIndex((item) => item.title === title)
  if (existingCartItemIndex !== -1) {
    // If the item already exists in cartData, update the quantity
    cartData[existingCartItemIndex].items++
  } else {
    // If the item doesn't exist in cartData, add it
    cartData.push({
      title: title,
      price: price,
      items: 1,
      productImage: productImageSrc
    })
  }
  localStorage.setItem('cartData', JSON.stringify(cartData))

  updateTotal()
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

function saveCartToLocalStorage() {
  var cartBoxes = document.querySelectorAll('.cart-box')
  var cartData = []

  cartBoxes.forEach(function (cartBox) {
    var titleElement = cartBox.querySelector('.card-product-title')
    var priceElement = cartBox.querySelector('.card-price')
    var itemsElement = cartBox.querySelector('.items')

    if (titleElement && priceElement && itemsElement) {
      var title = titleElement.innerText
      var price = priceElement.innerText
      var items = itemsElement.value

      cartData.push({
        title: title,
        price: price,
        items: items
      })
    }
  })

  localStorage.setItem('cartData', JSON.stringify(cartData))
}

function loadCartFromLocalStorage() {
  var cartData = localStorage.getItem('cartData')

  if (cartData) {
    cartData = JSON.parse(cartData)

    cartData.forEach(function (item) {
      // Ensure that productImageSrc is set to an empty string if not present in the item data
      var productImageSrc = item.productImage || ''

      addProductToCart(item.title, item.price, productImageSrc) // Pass the product image source
      var itemsElement = document.querySelector('.cart-box:last-child .items')
      if (itemsElement) {
        itemsElement.value = item.items
      }
    })

    updateTotal()
  }
}
