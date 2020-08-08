const {db}=require('../connections/mysql')



module.exports={
    // GET
    get:(req,res)=>{
        console.log('get flashsales')

        var sql=`select * from flashsales f
        join flashsalestatus fs on fs.idflashsalestatus=f.idflashsalestatus`
        db.query(sql,(err,list)=>{
            if(err) return res.status(500).send(err)

            res.status(200).send(list)
        })
    },

    create:(req,res)=>{
        console.log('create flashsale')
        const {hour}=req.body
        
        var time=new Date()
        var year=time.getFullYear()
        var month=time.getMonth()
        var date=time.getDate()
        

        // CHECK IF STARTAT ALREADY CREATED
        var sql=`select * from flashsales`
        db.query(sql,(err,all)=>{
            if(err) return res.status(500).send(err)

            var isexist=false
            all.forEach((flashsale,index)=>{
                var checkyear=flashsale.startat.getFullYear()
                var checkmonth=flashsale.startat.getMonth()
                var checkdate=flashsale.startat.getDate()
                var checkhour=flashsale.startat.getHours()

                if( year==checkyear && month==checkmonth && date==checkdate && hour==checkhour){
                    isexist=true
                }
            })

            if(isexist){
                res.status(200).send({status:false,message:'Flashsale already created'})
            }else{

                var startat=new Date(time.getFullYear(),time.getMonth(),time.getDate(),hour,0,0)
                var finishat=new Date(time.getFullYear(),time.getMonth(),time.getDate(),hour+2,0,0)
        
                var create={
                    startat,
                    finishat
                }
        
                var sql=`insert into flashsales set ?`
                db.query(sql,create,(err,created)=>{
                    if(err) return res.status(500).send(err)
        
                    res.status(200).send({status:true})
                })
            }
        })


    },

    getStatus:(req,res)=>{
        console.log('get flashsale by status')
        console.log(req.query)
        const{idflashsalestatus}=req.query

        var sql=`select * from flashsales f
        join flashsalestatus fs on fs.idflashsalestatus=f.idflashsalestatus
        where f.idflashsalestatus in (${idflashsalestatus})`
        db.query(sql,(err,list)=>{
            if(err) return res.status(500).send(err)

            res.status(200).send(list)
        })
    },

    checkProduct:(req,res)=>{
        console.log('check product in flashsale')

        const{idflashsale,idseller}=req.query

        var sql=`
        select * from flashsaleproducts fp
        join products p on p.idproduct=fp.idproduct
        join flashsales f on f.idflashsale=fp.idflashsale
        where fp.idflashsale=${idflashsale} and p.idseller=${idseller}
        `
        db.query(sql,(err,list)=>{
            if(err) return res.status(500).send(err)

            res.status(200).send(list)
        })

    },

    addProduct:(req,res)=>{
        console.log('add product to flashsale')

        const{idflashsale}=req.params
        const{idproduct,flashsale_price}=req.body

        var obj={
            idflashsale,
            idproduct,
            flashsale_price
        }
        var sql=`insert into flashsaleproducts set ?`
        db.query(sql,obj,(err,added)=>{
            if(err) return res.status(500).send(err)

            res.status(200).send(added)
        })
    },

    getProducts:(req,res)=>{
        console.log('get product list from flashsale')

        const{idflashsale}=req.params
        var sql=`
        select * from flashsaleproducts fp
        join products p on p.idproduct=fp.idproduct
        join items i on i.idproduct=p.idproduct
        where fp.idflashsale=${idflashsale}`

        db.query(sql,(err,list)=>{
            if(err) return res.status(500).send(err)

            res.status(200).send(list)
        })
    },

    getProductsApproved:(req,res)=>{
        console.log('get product list from flashsale')

        const{idflashsale}=req.params
        var sql=`
        select * from flashsaleproducts fp
        join products p on p.idproduct=fp.idproduct
        join items i on i.idproduct=p.idproduct
        where fp.idflashsale=${idflashsale} and fp.isapproved=1`

        db.query(sql,(err,list)=>{
            if(err) return res.status(500).send(err)

            res.status(200).send(list)
        })
    },

    updateProduct:(req,res)=>{
        console.log('update flashsale product')

        const{idflashsaleproduct}=req.params

        console.log(req.body)

        var sql=`update flashsaleproducts set ? where idflashsaleproduct=${idflashsaleproduct}`
        db.query(sql,req.body,(err,updated)=>{
            if(err) return res.status(500).send(err)

            res.status(200).send(updated)
        })
    },

    update:(req,res)=>{
        console.log('update flashsale status')

        console.log(req.params)
        const{idflashsale}=req.params
        console.log(req.body)

        var sql=`update flashsales set ? where idflashsale=${idflashsale}`
        db.query(sql,req.body,(err,updated)=>{
            if(err) return res.status(500).send(err)

            res.status(200).send(updated)
        })
    },

    getProductFlashsalePrice:(req,res)=>{
        console.log('get product flashsale price')

        const{idproduct}=req.query
        var sql=`select * from flashsaleproducts fp
        join flashsales f on f.idflashsale=fp.idflashsale
        where f.idflashsalestatus=2 and idproduct=${idproduct} and fp.isapproved=1`
        db.query(sql,(err,result)=>{
            if(err) return res.status(500).send(err)

            res.status(200).send(result[0])
        })
    }
}