// express, controllers, middlewares.

const express = require('express')
const router = express.Router()
const controller = require('../controllers/homeCo')

router.get('/', controller.checkQuery,controller.filterOne,controller.filterTwo,controller.filterThree,controller.filterFour,controller.filterFive)
router.get('/all/:name', controller.getAll)

module.exports = router