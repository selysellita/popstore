const express=require('express')
const bodyParser=require('body-parser')
const cors=require('cors')
const bearertoken=require('express-bearer-token')

const app=express()

const PORT=2000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(bearertoken())
app.use(cors())


app.get('/',(req,res)=>{
    return res.send("<h1 style='text-align:center; margin-top:100px;'>Final Project JC 12</h1>")
})


const {
    UserRouters,
    ProductRouters,
    ItemRouters,
    TransactionRouters,
    TransactionDetailsRouters,
    SellerRouters, 
    AdminRouters,
    WishlistRouters,
    TransactionSellerRouters,
    FlashsaleRouters,
    CommentRouters,
}=require('./routers')
const { db } = require('./connections/mysql')

app.use('/users',UserRouters)
app.use('/products',ProductRouters)
app.use('/items',ItemRouters)
app.use('/transactions',TransactionRouters)
app.use('/transactiondetails',TransactionDetailsRouters)
app.use('/sellers', SellerRouters)
app.use('/admin',AdminRouters)
app.use('/wishlist',WishlistRouters)
app.use('/flashsales',FlashsaleRouters)

app.use('/comments',CommentRouters)

app.use('/transactionstores',TransactionSellerRouters)

app.use(express.static('public')) // access to public folder


// GET DELIVERY OPTIONS
app.get('/delivery',(req,res)=>{
    console.log('get delivery options')
    var sql=`select * from delivery`
    db.query(sql,(err,delivery)=>{
        if(err) return res.status(500).send(err)

        res.status(200).send(delivery)
    })
})

// GET PAYMENT OPTIONS
app.get('/payment',(req,res)=>{
    console.log('get payment options')
    var sql=`select * from payment`
    db.query(sql,(err,payment)=>{
        if(err) return res.status(500).send(err)

        res.status(200).send(payment)
    })
})

// GET MAIN CATEGORY LIST
app.get('/categories',(req,res)=>{
    console.log('get categories')
    var sql=`select * from categories`
    db.query(sql,(err,categories)=>{
        if(err) return res.status(500).send(err)

        res.status(200).send(categories)
    })
})

// GET MERK LIST
app.get('/merk',(req,res)=>{
    console.log('get merk list')
    var sql=`select * from merk`
    db.query(sql,(err,merk)=>{
        if(err) return res.status(500).send(err)

        res.status(200).send(merk)
    })
})

// ADD MERK
app.post('/merk',(req,res)=>{
    console.log('add merk')
    const {merk_name}=req.body

    // CHECK IF MERK_NAME ALREADY IN LIST
    var sql=`select * from merk where merk_name='${merk_name}'`
    db.query(sql,(err,check)=>{
        if(err) return res.status(500).send(err)

        if(check.length){
            res.status(200).send({status:false,message:'merk already exist'})
        }else{
            sql=`insert into merk set ?`
            db.query(sql,req.body,(err,added)=>{
                if(err) return res.status(500).send(err)
        
                res.status(200).send({status:true,added})
            })
        }
    })

})


app.listen(PORT,()=>console.log('API is online at port '+PORT))


