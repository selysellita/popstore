const express=require('express')
const {CommentControllers}=require('../controllers')
const Router=express.Router()

Router.get('/comment', CommentControllers.allComments)
Router.post('/newcomment/:idproduct',CommentControllers.addNewComment)
module.exports=Router