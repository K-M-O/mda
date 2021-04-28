// express, controllers, middlewares.

const express = require('express')
const router = express.Router()
const controller = require('../controllers/documentsCo')
const checkAuth = require('../middleware/checkAuth')

router.get('/show/:id', controller.getDoucment)

router.use(checkAuth.token)

router.get('/new/:type', checkAuth.admin, controller.getNewDocument)
router.post('/new/:type', checkAuth.admin, controller.postCreateDocument, controller.postCreateDocumentSaveImages)

router.get('/manage/:type/:id', checkAuth.admin, controller.getDocumentManage)
router.post('/manage/:type/:id/update', checkAuth.admin, controller.postUpdateDocument)
router.delete('/manage/:type/:id/remove', checkAuth.admin, controller.postDeleteDocument)

module.exports = router