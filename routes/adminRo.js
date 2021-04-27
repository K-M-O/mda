// npm modules, controllers, middlewares.

const express = require('express')
const router = express.Router()
const controller = require('../controllers/adminCo')
const checkAuth = require('../middleware/checkAuth')

router.use(checkAuth.token,checkAuth.admin)

router.get('/adminPanel', controller.getAdminPanel)
router.get('/reports/:type/all', controller.getAdminReports)
router.delete('/adminPanel/user/:id/', controller.deleteUser)

module.exports = router