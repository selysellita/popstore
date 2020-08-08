const express=require('express')
const {FlashsaleControllers}=require('../controllers')

const Router=express.Router()

Router.get('/',FlashsaleControllers.get)
Router.post('/',FlashsaleControllers.create)
Router.get('/status',FlashsaleControllers.getStatus)
Router.get('/products',FlashsaleControllers.checkProduct)
Router.post('/:idflashsale',FlashsaleControllers.addProduct)
Router.get('/products/:idflashsale',FlashsaleControllers.getProducts)
Router.get('/products/approved/:idflashsale',FlashsaleControllers.getProductsApproved)
Router.put('/product/:idflashsaleproduct',FlashsaleControllers.updateProduct)
Router.put('/:idflashsale',FlashsaleControllers.update)
Router.get('/product/active/approved',FlashsaleControllers.getProductFlashsalePrice)

module.exports=Router

