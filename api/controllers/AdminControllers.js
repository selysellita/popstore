const {db}=require('../connections/mysql')
const transporter=require('../supports/mailer')

module.exports={
    ////////// GET SELLER ////////
    AllSeller:(req,res)=>{
        var sql=`select s.*, u.username,u.email,u.lastlogin from seller s join users u on s.iduser = u.iduser;`
        db.query(sql,(err,result)=>{
            if (err) res.status(500).send(err,{message:'error in line 9'})
            res.status(200).send(result)
        })
    },
    //////// BLOCK SELLER /////
    BlockSeller:(req,res)=>{
        const {idseller}=req.params
        console.log(idseller)
        var blocked={
            isblocked:true
        }
        var sql=`update seller set ? where idseller=${idseller}`
            db.query(sql, blocked , (err,result)=>{
                if(err) res.status(500).send('error line 23')
                console.log(idseller)
                if(blocked){
                    res.status(200).send({message:'your email has been unblocked'})
                }
                var maildata={
                    from: 'Admin <mde50526@gmail.com>',
                    to: 'jamestjahjadi@gmail.com',
                    subject: 'Account Blocked',
                    html: `Hello, We're sorry to say this but your account has been blocked due to some report about your store`
                }
                transporter.sendMail(maildata,(err,sent)=>{
                    if(err) return res.status(500).send(err)
                    res.status(200).send({message:`blocked`})
                })
            })
    },
    
    //////// UNBLOCK SELLER ///////////////
    UnblockSeller:(req,res)=>{
        const {idseller}=req.params
        console.log(idseller)
        var blocked={
            isblocked:false
        }
        var sql=`update seller set ? where idseller=${idseller}`
            db.query(sql, blocked , (err,result)=>{
                if(err) res.status(500).send('error line 23')
                if(blocked){
                    res.status(200).send({message:'your email has been unblocked'})
                }
                var maildata={
                    from: 'Admin <mde50526@gmail.com>',
                    to: 'jamestjahjadi@gmail.com',
                    subject: 'Account Unblocked',
                    html: `Hello, we're gladly to inform you that your store has been Unblocked, Happy Selling :)`
                }
                transporter.sendMail(maildata,(err,sent)=>{
                    if(err) return res.status(500).send(err)
                    res.status(200).send({message:`unblocked`})
                })
            })
    },
    ////// SELLER VERIFICATION ////////////
    VerifySeller:(req,res)=>{
        const {idseller}=req.params
        console.log(idseller)
        var verified={
            isverified:true
        }
        var sql=`update seller set ? where idseller=${idseller}`
            db.query(sql, verified , (err,result)=>{
                if(err) res.status(500).send('error line 23')
                
                var maildata={
                    from: 'Admin <mde50526@gmail.com>',
                    to: 'jamestjahjadi@gmail.com',
                    subject: 'Seller Account verification',
                    html: `Hello, we're gladly to inform you that your Seller Account has been verified Happy Selling :)`
                }
                transporter.sendMail(maildata,(err,sent)=>{
                    if(err) return res.status(500).send(err)
                    res.status(200).send({message:`Account verified`})
                })
            })
    },
    ///// SHOW UNVERIFIED SELLER //////
    GetUnverified:(req,res)=>{
        var sql=`select s.*, u.username,u.email,u.lastlogin from seller s join users u on s.iduser = u.iduser where s.isverified=false;`
        db.query(sql,(err,result)=>{
            if(err) res.status(500).send(err)
            return res.status(200).send(result)
        })
    },
 

    getSalesCount:(req,res)=>{
        console.log('get list count data sales')
        // console.log('get sales',req.query)
        const {method}=req.query

        var merk=`
        select m.merk_name as title,
        count(m.merk_name) as totalcount,
        sum(td.checkout_price) as totalprice
        from transactiondetails td
        join items i on i.iditem=td.iditem
        join products p on p.idproduct=i.idproduct
        join merk m on m.idmerk=p.idmerk
        join categories c on c.idcategory=p.idcategory
        join transactionsellers ts on ts.idtransactionseller=td.idtransactionseller
        join transactions t on t.idtransaction=ts.idtransaction
        -- where td.idorderstatus=4
        group by m.merk_name
        -- order by p.idproduct
        `

        var category=`
        select c.category_name as title,
        count(c.category_name) as totalcount,
        sum(td.checkout_price) as totalprice
        from transactiondetails td
        join items i on i.iditem=td.iditem
        join products p on p.idproduct=i.idproduct
        join merk m on m.idmerk=p.idmerk
        join categories c on c.idcategory=p.idcategory
        join transactionsellers ts on ts.idtransactionseller=td.idtransactionseller
        join transactions t on t.idtransaction=ts.idtransaction
        -- where td.idorderstatus=4
        group by c.category_name
        -- order by p.idproduct
        `

        if(method=='merk'){
            console.log('by merk')
            var sql=merk
        }else if(method=='category'){
            console.log('by category')
            var sql=category
        }
        db.query(sql,(err,result)=>{
            if(err) return res.status(500).send(err)

            res.status(200).send(result)
        })
    },

    getSalesGrowth:(req,res)=>{
        console.log('get list sales growth')
        // console.log('get sales',req.query)
        const {method}=req.query

        var total=`
        select checkout_price,qty,order_updateat
        from transactiondetails td
        join items i on i.iditem=td.iditem
        join products p on p.idproduct=i.idproduct
        join transactionsellers ts on ts.idtransactionseller=td.idtransactionseller
        join transactions t on t.idtransaction=ts.idtransaction
        where idorderstatus=4
        order by order_updateat`


        db.query(total,(err,list)=>{
            if(err) return res.status(500).send(err)

            res.status(200).send(list)
        })
    },
    
}