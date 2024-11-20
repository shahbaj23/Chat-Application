const express = require('express')
const { sendMessage, getMessages } = require('../controllers/messageController')
const protectedRoute = require('../middleware/protectedRoute')
const router = express.Router()

router.post('/send/:id',protectedRoute, sendMessage)
router.get('/:id', protectedRoute, getMessages)

module.exports = router