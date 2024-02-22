// Function to clear localStorage for testing purposes
function clearLocalStorage() {
  localStorage.removeItem('cartData')
}

// Clear localStorage before loading cart data for testing
clearLocalStorage()

let cart = document.querySelector('.cart')
let cartIcon = document.querySelector('#cart-icon')
let closeCart = document.querySelector('#close-cart')
let cartCount = 0 // Initialize cart count

// Function to update the cart icon's count
function updateCartIcon(count) {
  const cartIcon = document.getElementById('cart-icon')
  cartIcon.setAttribute('items', count.toString())
}

// Open Cart
cartIcon.onclick = () => {
  cart.classList.add('cart-active')
}

closeCart.onclick = () => {
  cart.classList.remove('cart-active')
}

// Add to Cart
if (!localStorage.getItem('cartData')) {
  // Call loadCartFromLocalStorage only if cartData is not already present in localStorage
  if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      loadCartFromLocalStorage() // Call loadCartFromLocalStorage once when the page content is fully loaded
      ready() // Call the ready function
    })
  } else {
    loadCartFromLocalStorage() // Call loadCartFromLocalStorage once when the page content is fully loaded
    ready() // Call the ready function
  }
} else {
  ready() // If cartData is already present in localStorage, directly call the ready function
}

// Ready Function
function ready() {
  console.log('Ready function called')
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
  console.log('Remove cart item called')
  var buttonClicked = event.target
  var itemsElement = buttonClicked.parentElement.querySelector('.items')
  if (itemsElement) {
    var removedQuantity = parseFloat(itemsElement.value)
    cartCount -= removedQuantity
  }
  buttonClicked.parentElement.remove()
  updateTotal()
  saveCartToLocalStorage() // Save cart data after removing an item
  updateCartIcon(cartCount) // Update the cart icon count
}

// Function to update cart count
function updateCartCount() {
  console.log('Updating cart count')
  var cartBoxes = document.querySelectorAll('.cart-box')
  cartCount = 0

  cartBoxes.forEach(function (cartBox) {
    var itemsElement = cartBox.querySelector('.items')
    if (itemsElement) {
      cartCount += parseFloat(itemsElement.value)
    }
  })

  if (cartCount < 0) {
    cartCount = 0 // Ensure cart count doesn't go below 0
  }

  updateCartIcon(cartCount)
}

function changeCartItemQuantity(cartBox, increase) {
  var itemsElement = cartBox.querySelector('.items')
  if (itemsElement) {
    var currentQuantity = parseFloat(itemsElement.value)
    if (increase) {
      itemsElement.value = currentQuantity + 1
      cartCount += 1 // Increase cart count
    } else {
      if (currentQuantity > 1) {
        itemsElement.value = currentQuantity - 1
        cartCount -= 1 // Decrease cart count
      }
    }
    updateCartCount()
  }
}

// Add event listeners for cart item quantity increase and decrease buttons
document.addEventListener('click', function (event) {
  if (event.target.classList.contains('cart-increase')) {
    var cartBox = event.target.closest('.cart-box')
    changeCartItemQuantity(cartBox, true)
  } else if (event.target.classList.contains('cart-decrease')) {
    var cartBox = event.target.closest('.cart-box')
    changeCartItemQuantity(cartBox, false)
  }
})

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

  // Update the cart icon count based on the new quantity
  updateCartCount()
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

function addProductToCart(
  title,
  price,
  productImageSrc,
  productImage,
  cartBox
) {
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
      cartCount += 1 // Increase cart count
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
    cartCount += 1 // Increase cart count
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
  updateCartIcon(cartCount) // Update the cart icon count
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

    // Update the cart icon count based on the loaded data
    cartCount = cartData.reduce((acc, item) => acc + parseInt(item.items), 0)
    updateCartIcon(cartCount)

    updateTotal()
  }
}

// Example: Add an item to the cart
function addToCart(item) {
  // Add the item to the cart logic here

  // Update the cart count
  cartCount++

  // Update the cart icon with the new count
  updateCartIcon(cartCount)
}

// Example: Remove an item from the cart
function removeFromCart(item) {
  // Remove the item from the cart logic here

  // Update the total and save cart data
  updateTotal()
  saveCartToLocalStorage()
}
