const {db}=require('../connections/mysql')
const {uploader}=require('../supports/uploader')
const fs=require('fs')
module.exports={
/////////////////// CREATE NEW SELLER //////////////
    createSeller:(req,res)=>{
        const path='/sellers'
        const upload=uploader(path,'SLR').fields([{name:'imageprofile'}])
        upload(req,res,(err)=>{
            if(err){
                return res.status(500).json({message:'upload fail in line 11', error: err.message})
            }
            const {imageprofile}=req.files
            const imagePath=imageprofile ? path + '/' + imageprofile[0].filename : null
            console.log('test1')
            
            const data = JSON.parse(req.body.data);
            
            data.imageprofile= imagePath
            const {namatoko,alamattoko,iduser}=data
             var newseller={
            namatoko,
            alamattoko,
            iduser,
            isverified:false
        }
        var sql=`select s.*,u.isseller from seller s 
                 join users u on s.iduser = u.iduser
                 where s.iduser=${iduser};`
                 db.query(sql,(err,result)=>{
                    if(err) res.status(500).send(err,{message:'error in line 16'})
                    if(result.length) {
                        fs.unlinkSync('./public' + imagePath)
                        res.status(200).send({message:'You have been registered as a seller'})
                        }else{
                            var sql1=`insert into seller set ?` 
                            db.query(sql1,data,(err,result1)=>{
                                if(err){
                                    fs.unlinkSync('./public' + imagePath)
                                    return res.status(500).json({message:'error in line 38'})
                                }
                                var sql2=`update users set ? where iduser=${iduser}`
                                db.query(sql2,{isseller:1},(err,result2)=>{
                                    if(err) res.status(500).send(err,{message:'error in line 32'})
                                    var sql3=`select * from seller where idseller=${result1.insertId}`
                                    db.query(sql3,(err,result3)=>{
                                        if(err)res.status(500).send(err,{message:'error in line 31'})
                                res.status(200).send({...result3[0],message:'Registered as a Seller'})
                                    })
                                })
                            })
                        }
                 })
        })
    },
    /////////////////// GET SELLER //////////////
    getSeller:(req,res)=>{
        const {iduser}=req.query
        var sql=`select * from seller where iduser=${iduser}`
        db.query(sql,(err,result)=>{
            if(err) res.status(500).send(err)
            res.status(200).send(result)
        })
    },
    //////////// GET PRODUCT SELLER ////////
    productSeller:(req,res)=>{
        const {idseller}=req.params
        var sql=`select * from products where idseller=${idseller}`
        db.query(sql,(err,result)=>{
            if(err) res.status(500).send(err)
            res.status(200).send(result)
        })
    },
    //////////// UPLOAD GAMBAR SELLER //////
    uploadImageSeller:(req,res)=>{
        const path='/sellers'
        const upload=uploader(path,'SLR').fields([{name:'imageprofile'}])
        upload(req,res,(err)=>{
            if(err){
                return res.status(500).json({message:'upload fail in line 71', error: err.message})
            }
            const {imageprofile}=req.files
            
            
            const imagePath=imageprofile ? path + '/' + imageprofile[0].filename : null

    
            
            const data= JSON.parse(req.body.data)
         
            const {idseller}=req.query
            var obj={
                imageprofile:imagePath
            }
            console.log(obj);
            
            var sql=`insert into seller set ? where idseller=${idseller}`
            db.query(sql,obj,(err,result)=>{
                if(err){
                    fs.unlinkSync('./public' + imagePath)
                    res.status(500).json({message:'failed to upload image'})
                }else{
                    var sql1=`select imageprofile from seller where idseller=${idseller}`
                    db.query(sql1,(err,result1)=>{
                        if(err) res.status(500).send(err)
                        return res.status(200).send({...result1[0]})
                    })
                }
            })
        })
    }
}