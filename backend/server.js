const express = require('express')
const dotenv = require('dotenv')
const path = require('path')

// Load variables
dotenv.config()

// Start Server
const app = express()

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '..', 'public')))

// Home Route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
})

app.listen(3000, () => {
  console.log('Listening on port 3000')
})
