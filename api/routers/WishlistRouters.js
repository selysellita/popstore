const express=require('express')
const {WishlistControllers}=require('../controllers')


const Router=express.Router()

Router.get('/getallwishlist', WishlistControllers.getAllWishlist)
////// untuk taro di page wishlist ///////
Router.get('/getwishlist',WishlistControllers.showWishlist)
/////// untuk post data dari product detail to wishlist database /////////
Router.post('/getproduct',WishlistControllers.getidProduct)
////////////////////////////////
Router.delete('/deletewishlist',WishlistControllers.deleteWishlist)

Router.delete('/product',WishlistControllers.deleteProduct)



Router.post('/postwishlist',WishlistControllers.postimage)
module.exports=Router