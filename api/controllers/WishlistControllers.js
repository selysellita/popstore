const {db}=require('../connections/mysql')
const {uploader}=require('../supports/uploader')
const fs=require('fs')
const { json } = require('body-parser')

module.exports={
    ///// SHOW DATA WISHLIST KE PAGES WISHLIST FRONT END /////
    showWishlist:(req,res)=>{
        const {iduser}=req.query
        var sql=`select  w.* , p.* , i.price from wishlist w 
                 join products p on w.idproduct = p.idproduct 
                 join items i on p.idproduct = i.idproduct
                 where iduser=${iduser}
                 group by w.idproduct `
        db.query(sql,(err,result)=>{
            if(err) res.status(500).send(err)
           return res.status(200).send(result)
        })
    },

    /////// INSERT DATA IDPRODUCT DAN IDUSER KE DATABASE WISHLIST ////////
    getidProduct:(req,res)=>{
        const {idproduct,iduser}=req.body
        var isitable={
            idproduct,
            iduser
        }
        var sql=`insert into wishlist set ?`
        db.query(sql,isitable,(err,result)=>{
            if(err) res.status(500).send(err,{message:'error line 24'})
            res.status(200).send(result)
        })
    },
    /////// GET WISHLIST DATABASE ////
    getAllWishlist:(req,res)=>{
        const {iduser}=req.query
        var sql=`select * from wishlist where iduser=${iduser}`
        db.query(sql,(err,result)=>{
            if(err) res.status(500).send(err,{message:'error line 24'})
            return res.status(200).send(result)
        })
    },
    ///// DELETE WISHLIST DATA ////
    deleteWishlist:(req,res)=>{
        const {idwishlist}=req.query
        var sql=`delete from wishlist where idwishlist=${idwishlist}`
        db.query(sql,(err,result)=>{
            if(err) res.status(500).send(err.message)
            return res.status(200).send(result)
        })
    },

    postimage:(req,res)=>{
        const path = '/products'
    const upload = uploader(path, 'JAMES').fields([{ name: 'image'}]);
    upload(req, res, (err)=>{
        if(err){
            return res.status(500).json({ message: 'Upload files failed !',error: err.message })
        }
        const { image } = req.files
        const imagePath= image ? path + '/' + image[0].filename : null
        const data = JSON.parse(req.body.data);
        console.log(data);
        console.log(image);
        
        data.image=imagePath
        console.log(data.image)
        console.log(data)
        
        var sql='insert into image set ?'
        db.query(sql,data,(err,result)=>{
            
            if(err){
               fs.unlinkSync('./public' + imagePath)
                return res.status(500).json({message:'error in line 22'})
            }
            var sql1='select * from image'
            db.query(sql1,(err,result1)=>{
                if(err) res.status(500).send(err)
                return res.status(200).send(result1)
            })
        })
    })
    },

    deleteProduct:(req,res)=>{
        const {idproduct,iduser}=req.query
        var sql=`delete from wishlist where idproduct=${idproduct} and iduser=${iduser}`
        db.query(sql,(err,result)=>{
            if(err) res.status(500).send(err.message)
            return res.status(200).send(result)
        })
    }
}
