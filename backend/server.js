const express = require('express')
const dotenv = require('dotenv')
const path = require('path')
// Load variables
dotenv.config()

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

// Start Server
const app = express()

// Middleware to parse JSON data
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '..', 'public')))

console.log('STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY)

// Home Route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
})

// Success Route
app.get('/success', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'success.html'))
})

// Cancel Route
app.get('/cancel', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'cancel.html'))
})

// Define a route to handle Stripe checkout
// Define a route to handle Stripe checkout
app.post('/stripe-checkout', async (req, res) => {
  const cartItems = req.body.items

  console.log('Cart Items:', cartItems)

  if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
    return res.status(400).json({ error: 'Invalid or empty cart data' })
  }

  try {
    const lineItems = cartItems.map((item) => {
      console.log('Item:', item)

      if (!item.price || typeof item.price !== 'string') {
        throw new Error('Invalid item price')
      }

      const unitAmount =
        parseInt(item.price.replace(/[^0-9.-]+/g, ''), 10) * 100

      return {
        price_data: {
          currency: 'SEK', // Use 'SEK' as the currency code for Swedish kronor
          product_data: {
            name: item.title,
            images: [item.productImage]
          },
          unit_amount: unitAmount
        },
        quantity: parseInt(item.items, 10)
      }
    })

    console.log('Line Items:', lineItems)

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: `${process.env.DOMAIN}/success`,
      cancel_url: `${process.env.DOMAIN}/cancel`,
      line_items: lineItems,
      billing_address_collection: 'required'
    })

    res.json({ url: session.url })
  } catch (error) {
    console.error('Error creating payment session:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.listen(3000, () => {
  console.log('Listening on port 3000')
})
