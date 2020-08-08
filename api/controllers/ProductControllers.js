const {db}=require('../connections/mysql')
const {uploader}=require('../supports/uploader')
const fs=require('fs')


module.exports={
    get:(req,res)=>{
        console.log('getting product...')
        console.log(req.params)
        const {idproduct}=req.params

        var sql=`select * from products where idproduct=${idproduct}`
        db.query(sql,(err,product)=>{
            if(err) return res.status(500).send(err)
            console.log('succeed')
            console.log('')
            res.status(200).send(product[0])
            // sql=`UPDATE products SET isseen = isseen + 1 WHERE idproduct=${idproduct}`
            // db.query(sql,(err,isseen)=>{
            //     if(err) return res.status(500).send(err)
            // })
            
        })
    },
    

    // CURRENTLY NOT BEING USED
    // create:(req,res)=>{
    //     console.log('create product')
    //     console.log(req.body)

    //     var sql=`insert into products set ?`
    //     db.query(sql,req.body,(err,created)=>{
    //         if(err) return res.status(500).send(err)

    //         res.status(200).send(created)
    //     })
    // },

    add:(req,res)=>{
        console.log('add product')
        // console.log(req.body)
        // upload image
        const path='/products'
        const upload=uploader(path,'CVR').array('photo',5)

        upload(req,res,(err)=>{
            if(err) return res.status(500).json({message:'Upload image failed',error:err.message})
            console.log('req files')
            console.log(req.files)
            // const {image}=req.files
            // const imagePath=image?path+'/'+image[0].filename:null
            
            // const imagePath=path+'/'+req.files[0].filename

            const imagePath=req.files.map((file)=>{
                return path+'/'+file.filename
            })

            console.log(imagePath)

            // in case the ref object does not exist
            // need to delete image, then terminate
            // if(!req.body.data){
            //     console.log('delete image')
            //     fs.unlinkSync('./public'+imagePath)
            //     return res.status(500).json({message:'data undefined, please check again'})
            // }

            // if(!imagePath){
            //     return res.status(500).json({message:'image cannot be empty'})
            // }

            const data=JSON.parse(req.body.data)
            data.imagecover=JSON.stringify(imagePath)

            console.log(data)
            
            var sql=`insert into products set ?`
            db.query(sql,data,(err,added)=>{
                if(err){
                    console.log(err)
                    if(imagePath){
                        for(const imgpath of imagePath){
                            fs.unlinkSync('./public'+imgpath)
                        }
                    }
                    return res.status(500).json({message:'Cannot upload to mysql, please check again',error:err.message})
                }

                res.status(200).send(added)

            })
        })
    },


    edit:(req,res)=>{
        console.log('editing product details...')

        const {idproduct}=req.params
        
        var sql=`update products set ? where idproduct=${idproduct}`

        var edit=req.body
        edit.updateat=new Date()

        db.query(sql,edit,(err,edited)=>{
            if(err) return res.status(500).send(err)

            console.log('product details updated')
            res.status(200).send(edited)
        })
    },

    addcover:(req,res)=>{
        console.log('adding cover...')
        // console.log(req.params)
        const{idproduct}=req.params

        const path='/products'
        const upload=uploader(path,'CVR').array('photo',5)

        upload(req,res,(err)=>{
            if(err) return res.status(500).send(err)

            console.log('reqbodydata')
            console.log(req.body)


            const newImagePath=JSON.parse(req.body.data)==null?[]:JSON.parse(req.body.data)

            console.log(newImagePath)

            const imagePath=req.files.map((file)=>{
                newImagePath.push(path+'/'+file.filename)
                return path+'/'+file.filename
            })

            console.log(newImagePath)

            
            const data={
                imagecover:JSON.stringify(newImagePath),
                updateat: new Date()
            }

            var sql=`update products set ? where idproduct=${idproduct}`
            db.query(sql,data,(err,updated)=>{
                if(err) return res.status(500).send(err)
                console.log('update cover berhasil')
                res.status(200).send(updated)
            })


        })

    },

    deletecover:(req,res)=>{
        console.log('deleting cover...')
        console.log(req.params)
        console.log(req.body)

        const {idproduct,index}=req.params
        const imagePath=req.body

        // imagePath[index]

        // delete image from folder
        if(fs.existsSync('./public' + imagePath[index])){ // check if file exist, to prevent error
            fs.unlinkSync('./public' + imagePath[index]);
        }

        // delete path
        imagePath.splice(index,1)

        var edit={
            imagecover: JSON.stringify(imagePath)
        }

        var sql=`update products set ? where idproduct=${idproduct}`
        db.query(sql,edit,(err,update)=>{
            if(err) return res.status(500).send(err)
            
            res.status(200).send(update)
        })

    },
                  ////////////// SHOWING ALL PRODUCT TO USER //////////////
    allproducts:(req,res)=>{
        const {search,category, pmin, pmax, sort, page}=req.query
        console.log(search,'search160',page, 'page162',pmin, 'hargamin',pmax, 'hargamax', sort, 'sortinglala')
        const pricemin=parseInt(pmin)
        const pricemax=parseInt(pmax)
        const limit=8       //ini jumlah produk per page
        const offset=page
        console.log(offset, 'dipsy', sort)
        if(search||pricemin||pricemax||category||sort){
            var sql=`SELECT p.* ,i.iditem, i.price as price, c.category_name as maincategory
                        FROM products p 
                        JOIN items i ON i.idproduct=p.idproduct
                        JOIN categories c ON p.idcategory=c.idcategory
                    WHERE p.isdeleted=0 AND p.isblocked=0 
                        ${search? `AND p.product_name LIKE '%${search}%' ` : ''}
                        ${category?`AND p.category LIKE '%${category}%' ` : '' }
                        ${pricemin? `AND price >=${pricemin}` : ''}
                        ${pricemax? `AND price <=${pricemax}` : ''}
                    GROUP BY i.idproduct
                    ${sort === 'priceasc'? `ORDER BY price ASC`: sort ==='pricedesc'? `ORDER BY price DESC`:`ORDER BY sold DESC`}
                    LIMIT ${offset},${limit}`
        db.query(sql,(err,result)=>{
                console.log(sql)
                if(err) res.status(500).send({err,message:'error get product search'})
                return res.send(result)
            })
        }else{
            var sql=`SELECT p.* ,i.iditem, i.price, c.category_name as maincategory
                        FROM products p 
                        JOIN items i ON i.idproduct=p.idproduct
                        JOIN categories c ON p.idcategory=c.idcategory
                    WHERE p.isdeleted=0 AND p.isblocked=0
                    GROUP BY i.idproduct
                    ORDER BY sold DESC
                    LIMIT ${offset},${limit}`
            db.query(sql,(err,result)=>{
                if(err) res.status(500).send({err,message:'error get total product'})
                return res.send(result)
            })
        }
    },
    getTotalProduct:(req,res)=>{
        const {search, category, pmin, pmax}=req.query
        const pricemin=parseInt(pmin)
        const pricemax=parseInt(pmax)
        if(search ||pricemin ||pricemax||category){
            console.log('masuk total search', search, pmin, pmax)
            var sql= `  SELECT COUNT(DISTINCT(p.idproduct)) AS total
                            FROM products p 
                            JOIN items i ON i.idproduct=p.idproduct
                            JOIN categories c ON p.idcategory=c.idcategory
                        WHERE p.isdeleted=0 AND p.isblocked=0 
                        ${search? `AND p.product_name like '%${search}%' ` : ''}
                        ${category?`AND p.category like '%${category}%' ` : '' }
                        ${pricemin? `AND price >=${pricemin}` : ''}
                        ${pricemax? `AND price <=${pricemax}` : ''}`
            console.log(sql) 
            console.log('teletubies')
            db.query(sql,(err,result)=>{
                if(err) res.status(500).send({err,message:'error get total product'})
                console.log(result)
                console.log(sql)
                return res.send(result[0])
            })
        }else{
            var sql= `  SELECT COUNT(idproduct) AS total
                        FROM products 
                        WHERE isdeleted=0 AND isblocked=0 `
            db.query(sql,(err,result)=>{
                console.log('total', sql, result)
                if(err) res.status(500).send({err,message:'error get total product'})
                return res.send(result[0])
            })
        }
    },                    
                    ///////////////// GET PRODUCT BY SEARCH KEYWORD ///////////////// ==> NOT YET FINISHED
    searchproduct:(req,res)=>{
        const {search,category, pmin, pmax, sort, page}=req.query
        const {keyword} =req.params
        console.log(req.params.keyword)
        console.log(search,'search160',page, 'page162',pmin, 'hargamin',pmax, 'hargamax', sort, 'sortinglala')
        const pricemin=parseInt(pmin)
        const pricemax=parseInt(pmax)
        const sortby=(keyword==='best-seller'?`a`: `b`)
        const limit=8       //ini jumlah produk per page
        const offset=page
        console.log(offset, 'dipsy', sort)
        if(search||pricemin||pricemax||category||sort){
            var sql=`SELECT p.* ,i.iditem, i.price as price, c.category_name as maincategory
                        FROM products p 
                        JOIN items i ON i.idproduct=p.idproduct
                        JOIN categories c ON p.idcategory=c.idcategory
                    WHERE p.isdeleted=0 AND p.isblocked=0 
                        ${search? `AND p.product_name LIKE '%${search}%' ` : ''}
                        ${category?`AND p.category LIKE '%${category}%' ` : '' }
                        ${pricemin? `AND price >=${pricemin}` : ''}
                        ${pricemax? `AND price <=${pricemax}` : ''}
                    GROUP BY i.idproduct
                    ${sort?(sort === 'priceasc'? `ORDER BY price ASC`: sort ==='pricedesc'? `ORDER BY price DESC`: sort==='most-viewed'?`ORDER BY seen DESC`: sort==='rating'?`ORDER BY rating DESC`:`ORDER BY sold DESC`):''}
                    LIMIT ${offset},${limit}`
                db.query(sql,(err,result)=>{
                console.log(sql)
                if(err) res.status(500).send({err,message:'error get product search'})
                return res.send(result)
            })
        }else{
            var sql=`SELECT p.* ,i.iditem, i.price, c.category_name as maincategory
                        FROM products p 
                        JOIN items i ON i.idproduct=p.idproduct
                        JOIN categories c ON p.idcategory=c.idcategory
                    WHERE p.isdeleted=0 AND p.isblocked=0
                    GROUP BY i.idproduct
                    ORDER BY ${keyword==='recommended'?`sold`:keyword==='mostviewed'?`seen`:`rating`} DESC
                    LIMIT ${offset},${limit}`
            db.query(sql,(err,result)=>{
                console.log(sql, 'searchpage')
                if(err) res.status(500).send({err,message:'error get total product'})
                return res.send(result)
            })
        }
    },

    countSold:(req,res)=>{
        console.log('counting sold data...')

        const {idproduct}=req.params

        var sql=`select * from transactiondetails td
        join items i on i.iditem=td.iditem
        join products p on p.idproduct=i.idproduct
        where p.idproduct=${idproduct} and idorderstatus in (3,4)`

        db.query(sql,(err,count)=>{
            if(err) return res.status(500).send(err)

            sql=`update products set ? where idproduct=${idproduct}`
            db.query(sql,{sold:count.length},(err,updated)=>{
                if(err) return res.status(500).send(err)
                console.log('sold number counter')
                res.status(200).send(updated)
            })
        })
    },
                    ///////////////// GET MOST VIEWED PRODUCT FOR HOMEPAGE /////////////////
    mostviewed:(req,res)=>{
        var sql= `  SELECT p.* ,i.iditem, i.price, c.category_name as maincategory
                        FROM products p 
                        JOIN items i ON i.idproduct=p.idproduct
                        JOIN categories c ON p.idcategory=c.idcategory
                        WHERE p.isdeleted=0 AND p.isblocked=0
                    GROUP BY i.idproduct  
                    ORDER BY seen DESC
                    LIMIT 0,4;`
        db.query(sql,(err,mostviewed)=>{
            if(err) return res.status(500).send({err,message:'error get product search'})
            sql= `  SELECT p.* ,i.iditem, i.price, c.category_name as maincategory
                        FROM products p 
                        JOIN items i ON i.idproduct=p.idproduct
                        JOIN categories c ON p.idcategory=c.idcategory
                        WHERE p.isdeleted=0 AND p.isblocked=0
                    GROUP BY i.idproduct  
                    ORDER BY sold DESC
                    LIMIT 0,4;`
            db.query(sql,(err,recommended)=>{
            if(err) res.status(500).send({err,message:'error get product search'})
            return res.status(200).send({mostviewed, recommended})
            })
        })
    },

    countRating:(req,res)=>{
        console.log('counting rating data...')

        const {idproduct}=req.params

        var sql=`select avg(td.rating) as product_rating,
        count(td.rating) as product_rating_count
        from transactiondetails td
        join items i on i.iditem=td.iditem
        join products p on p.idproduct=i.idproduct
        where p.idproduct=${idproduct} and td.rating is not null`

        db.query(sql,(err,result)=>{
            if(err) return res.status(500).send(err)

            sql=`update products set ? where idproduct=${idproduct}`
            db.query(sql,result,(err,updated)=>{
                if(err) return res.status(500).send(err)

                console.log('product rating updated')
                res.status(200).send(updated)
            })
        })
    },
    ////////////// SHOWING MEN CATEGORY PRODUCT TO USER //////////////
    menProducts:(req,res)=>{
        const {search,category, pmin, pmax, sort, page}=req.query
        console.log(search,'search160',page, 'page162',pmin, 'hargamin',pmax, 'hargamax', sort, 'sortinglala')
        const pricemin=parseInt(pmin)
        const pricemax=parseInt(pmax)
        const limit=8       //ini jumlah produk per page
        const offset=page
        console.log(offset, 'dipsy', sort)
        if(search||pricemin||pricemax||category||sort){
            var sql=`SELECT p.* ,i.iditem, i.price as price, c.category_name as maincategory
                        FROM products p 
                        JOIN items i ON i.idproduct=p.idproduct
                        JOIN categories c ON p.idcategory=c.idcategory
                    WHERE p.isdeleted=0 AND p.isblocked=0 AND p.idcategory != 2
                        ${search? `AND p.product_name LIKE '%${search}%' ` : ''}
                        ${category?`AND p.category LIKE '%${category}%' ` : '' }
                        ${pricemin? `AND price >=${pricemin}` : ''}
                        ${pricemax? `AND price <=${pricemax}` : ''}
                    GROUP BY i.idproduct
                    ${sort === 'priceasc'? `ORDER BY price ASC`: sort ==='pricedesc'? `ORDER BY price DESC`:`ORDER BY sold DESC`}
                    LIMIT ${offset},${limit}`
        db.query(sql,(err,result)=>{
                console.log(sql)
                if(err) res.status(500).send({err,message:'error get product search'})
                return res.send(result)
            })
        }else{
            var sql=`SELECT p.* ,i.iditem, i.price, c.category_name as maincategory
                        FROM products p 
                        JOIN items i ON i.idproduct=p.idproduct
                        JOIN categories c ON p.idcategory=c.idcategory
                    WHERE p.isdeleted=0 AND p.isblocked=0 AND p.idcategory !=2
                    GROUP BY i.idproduct
                    ORDER BY sold DESC
                    LIMIT ${offset},${limit}`
            db.query(sql,(err,result)=>{
                console.log(sql , 'getproductman')
                if(err) res.status(500).send({err,message:'error get total product'})
                return res.send(result)
            })
        }
    },
    totalMenProducts:(req,res)=>{
        const {search, category, pmin, pmax}=req.query
        const pricemin=parseInt(pmin)
        const pricemax=parseInt(pmax)
        if(search ||pricemin ||pricemax||category){
            console.log('masuk total search', search, pmin, pmax)
            var sql= `  SELECT COUNT(DISTINCT(p.idproduct)) AS total
                            FROM products p 
                            JOIN items i ON i.idproduct=p.idproduct
                            JOIN categories c ON p.idcategory=c.idcategory
                        WHERE p.isdeleted=0 AND p.isblocked=0 AND p.idcategory !=2
                        ${search? `AND p.product_name like '%${search}%' ` : ''}
                        ${category?`AND p.category like '%${category}%' ` : '' }
                        ${pricemin? `AND price >=${pricemin}` : ''}
                        ${pricemax? `AND price <=${pricemax}` : ''}`
            console.log(sql) 
            console.log('teletubies TOTAL MENPRODUCT')
            db.query(sql,(err,result)=>{
                if(err) res.status(500).send({err,message:'error get total product'})
                console.log(result)
                console.log(sql)
                return res.send(result[0])
            })
        }else{
            var sql= `  SELECT COUNT(idproduct) AS total
                        FROM products 
                        WHERE isdeleted=0 AND isblocked=0 AND idcategory !=2 `
            db.query(sql,(err,result)=>{
                console.log('total', sql, result)
                if(err) res.status(500).send({err,message:'error get total product'})
                return res.send(result[0])
            })
        }
    },
     ////////////// SHOWING Women CATEGORY PRODUCT TO USER //////////////
     womenProducts:(req,res)=>{
        const {search,category, pmin, pmax, sort, page}=req.query
        console.log(search,'search160',page, 'page162',pmin, 'hargamin',pmax, 'hargamax', sort, 'sortinglala')
        const pricemin=parseInt(pmin)
        const pricemax=parseInt(pmax)
        const limit=8       //ini jumlah produk per page
        const offset=page
        console.log(offset, 'dipsy', sort)
        if(search||pricemin||pricemax||category||sort){
            var sql=`SELECT p.* ,i.iditem, i.price as price, c.category_name as maincategory
                        FROM products p 
                        JOIN items i ON i.idproduct=p.idproduct
                        JOIN categories c ON p.idcategory=c.idcategory
                    WHERE p.isdeleted=0 AND p.isblocked=0 AND p.idcategory != 1
                        ${search? `AND p.product_name LIKE '%${search}%' ` : ''}
                        ${category?`AND p.category LIKE '%${category}%' ` : '' }
                        ${pricemin? `AND price >=${pricemin}` : ''}
                        ${pricemax? `AND price <=${pricemax}` : ''}
                    GROUP BY i.idproduct
                    ${sort === 'priceasc'? `ORDER BY price ASC`: sort ==='pricedesc'? `ORDER BY price DESC`:`ORDER BY sold DESC`}
                    LIMIT ${offset},${limit}`
        db.query(sql,(err,result)=>{
                console.log(sql)
                if(err) res.status(500).send({err,message:'error get product search'})
                return res.send(result)
            })
        }else{
            var sql=`SELECT p.* ,i.iditem, i.price, c.category_name as maincategory
                        FROM products p 
                        JOIN items i ON i.idproduct=p.idproduct
                        JOIN categories c ON p.idcategory=c.idcategory
                    WHERE p.isdeleted=0 AND p.isblocked=0 AND p.idcategory != 1
                    GROUP BY i.idproduct
                    ORDER BY sold DESC
                    LIMIT ${offset},${limit}`
            db.query(sql,(err,result)=>{
                console.log(sql , 'getproductman')
                if(err) res.status(500).send({err,message:'error get total product'})
                return res.send(result)
            })
        }
    },
    totalWomenProducts:(req,res)=>{
        const {search, category, pmin, pmax}=req.query
        const pricemin=parseInt(pmin)
        const pricemax=parseInt(pmax)
        if(search ||pricemin ||pricemax||category){
            console.log('masuk total search', search, pmin, pmax)
            var sql= `  SELECT COUNT(DISTINCT(p.idproduct)) AS total
                            FROM products p 
                            JOIN items i ON i.idproduct=p.idproduct
                            JOIN categories c ON p.idcategory=c.idcategory
                        WHERE p.isdeleted=0 AND p.isblocked=0 AND p.idcategory != 1
                        ${search? `AND p.product_name like '%${search}%' ` : ''}
                        ${category?`AND p.category like '%${category}%' ` : '' }
                        ${pricemin? `AND price >=${pricemin}` : ''}
                        ${pricemax? `AND price <=${pricemax}` : ''}`
            console.log(sql) 
            console.log('teletubies TOTAL WomenPRODUCT')
            db.query(sql,(err,result)=>{
                if(err) res.status(500).send({err,message:'error get total product'})
                console.log(result)
                console.log(sql)
                return res.send(result[0])
            })
        }else{
            var sql= `  SELECT COUNT(idproduct) AS total
                        FROM products 
                        WHERE isdeleted=0 AND isblocked=0 AND idcategory !=1 `
            db.query(sql,(err,result)=>{
                console.log('total', sql, result)
                if(err) res.status(500).send({err,message:'error get total product'})
                return res.send(result[0])
            })
        }
    },
                 ///////////////// GET PRODUCT SELLER ///////////////// 
    sellerProducts:(req,res)=>{
        const {search,category, pmin, pmax, sort, page, idseller}=req.query
        console.log(search,'search160',page, 'page162',pmin, 'hargamin',pmax, 'hargamax', sort, 'sortinglala')
        const pricemin=parseInt(pmin)
        const pricemax=parseInt(pmax)
        const limit=5       //ini jumlah produk per page
        const offset=page
        console.log(offset, 'dipsy', sort)
        if(search||pricemin||pricemax||category||sort){
            var sql=`SELECT p.* ,i.iditem, i.price as price, i.stock as stock,  c.category_name as maincategory
                        FROM products p 
                        JOIN items i ON i.idproduct=p.idproduct
                        JOIN categories c ON p.idcategory=c.idcategory
                        JOIN seller s ON p.idseller=s.idseller
                    WHERE p.idseller=${idseller}
                        ${search? `AND p.product_name LIKE '%${search}%' ` : ''}
                        ${category?`AND p.category LIKE '%${category}%' ` : '' }
                        ${pricemin? `AND price >=${pricemin}` : ''}
                        ${pricemax? `AND price <=${pricemax}` : ''}
                    GROUP BY i.idproduct
                    ${sort === 'priceasc'? `ORDER BY price ASC`: sort ==='pricedesc'? `ORDER BY price DESC`:`ORDER BY sold DESC`}
                    LIMIT ${offset},${limit}`
        db.query(sql,(err,result)=>{
                console.log(sql)
                if(err) res.status(500).send({err,message:'error get product search'})
                return res.send(result)
            })
        }else{
            var sql=`SELECT p.* ,i.iditem, i.price, i.stock as stock, c.category_name as maincategory
                        FROM products p 
                        JOIN items i ON i.idproduct=p.idproduct
                        JOIN categories c ON p.idcategory=c.idcategory
                        JOIN seller s ON p.idseller=s.idseller
                    WHERE p.idseller=${idseller}
                    GROUP BY i.idproduct
                    ORDER BY sold DESC
                    LIMIT ${offset},${limit}`
            db.query(sql,(err,result)=>{
                console.log(sql , 'getproductseller')
                if(err) res.status(500).send({err,message:'error get total product'})
                return res.send(result)
            })
        }
    },
    totalSellerProducts:(req,res)=>{
        const {search, category, pmin, pmax, idseller}=req.query
        const pricemin=parseInt(pmin)
        const pricemax=parseInt(pmax)
        if(search ||pricemin ||pricemax||category){
            console.log('masuk total search', search, pmin, pmax)
            var sql= `  SELECT COUNT(DISTINCT(p.idproduct)) AS total
                            FROM products p 
                            JOIN items i ON i.idproduct=p.idproduct
                            JOIN categories c ON p.idcategory=c.idcategory
                            JOIN seller s ON p.idseller=s.idseller
                        WHERE p.idseller=${idseller}
                        ${search? `AND p.product_name like '%${search}%' ` : ''}
                        ${category?`AND p.category like '%${category}%' ` : '' }
                        ${pricemin? `AND price >=${pricemin}` : ''}
                        ${pricemax? `AND price <=${pricemax}` : ''}`
            console.log(sql) 
            console.log('teletubies TOTAL WomenPRODUCT')
            db.query(sql,(err,result)=>{
                if(err) res.status(500).send({err,message:'error get total product'})
                console.log(result)
                console.log(sql)
                return res.send(result[0])
            })
        }else{
            var sql= `  SELECT COUNT(idproduct) AS total
                        FROM products 
                        WHERE idseller=${idseller} `
            db.query(sql,(err,result)=>{
                console.log('total', sql, result)
                if(err) res.status(500).send({err,message:'error get total product'})
                return res.send(result[0])
            })
        }
    },
    getseen:(req,res)=>{
        console.log(' adding seen...')
        console.log(req.params)
        const {idproduct}=req.params
        console.log('succeed seen +1')
        sql=`UPDATE products SET seen = seen + 1 WHERE idproduct=${idproduct}`
        db.query(sql,(err,isseen)=>{
            if(err) return res.status(500).send(err)
            res.status(200).send(isseen)
        })
    },

    getStoreProducts:(req,res)=>{
        console.log('get seller products')
        console.log(req.query)
        const {idseller}=req.query

        var sql=`
        select * from items i
        join products p on p.idproduct=i.idproduct
        join seller s on s.idseller=p.idseller
        where p.idseller=${idseller} and p.isdeleted=0 and p.isblocked=0`
        db.query(sql,(err,items)=>{
            if(err) return res.status(500).send(err)

            console.log(items)
            res.status(200).send(items)
        })
    }
}