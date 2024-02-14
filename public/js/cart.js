const payBtn = document.querySelector('.btn-purchase')

payBtn.addEventListener('click', () => {
  // Fetch the cart items from localStorage
  const cartItems = JSON.parse(localStorage.getItem('cartData'))

  // Create an array of line items for the Stripe Checkout
  const lineItems = cartItems.map((item) => ({
    title: item.title,
    price: item.price,
    productImage: item.productImage,
    items: item.items
  }))

  // Create a Checkout Session on the server
  fetch('/stripe-checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ items: lineItems })
  })
    .then((response) => response.json())
    .then((data) => {
      // Redirect the user to the Stripe Checkout page
      window.location.href = data.url
    })
    .catch((error) => {
      console.error('Error creating checkout session:', error)
    })
})
