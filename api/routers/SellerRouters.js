const express=require('express')
const {SellerControllers}=require('../controllers')

const Router=express.Router()

Router.post('/createseller',SellerControllers.createSeller)
Router.get('/getseller',SellerControllers.getSeller)
Router.post('/uploadimage',SellerControllers.uploadImageSeller)
Router.get('/productseller/:idseller', SellerControllers.productSeller)
module.exports=Router
