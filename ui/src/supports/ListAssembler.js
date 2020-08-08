

export const ListByTransaction=(list,method)=>{
    // RECONSTRUCT LIST , BY TRANSACTION BY TRANSACTION SELLER
    // FIRST, BY TRANSACTION SELLER
    var listByTransactionSeller=[]
    list.forEach((item)=>{
        var isexist=false
        for(var i=0;i<listByTransactionSeller.length;i++){
            if(listByTransactionSeller[i].idtransactionseller==item.idtransactionseller){
                isexist=true
                listByTransactionSeller[i].itemlist.push(item)
            }
        }
        if(!isexist){
            const{
                idtransactionseller,
                idtransaction,
                idseller,
                iddelivery,
                idpackagestatus,
                namatoko,
                delivery_method,
                recipient,
                totalqty,
                totalweight,
                seller_delivery_cost,
                seller_items_price,
                total_price,
                package_createat,
                package_updateat
            }=item
            var transactionsellerdata={
                idtransactionseller,
                idtransaction,
                idseller,
                iddelivery,
                idpackagestatus,
                namatoko,
                delivery_method,
                recipient,
                totalqty,
                totalweight,
                seller_delivery_cost,
                seller_items_price,
                total_price,
                package_createat,
                package_updateat,
                itemlist:[item]
            }
            listByTransactionSeller.push(transactionsellerdata)
        }
    })
    // console.log('list by transaction seller',listByTransactionSeller)

    if(method=='store'){
        return listByTransactionSeller
    }


    // RECONSTRUCT LIST BY TRANSACTION
    var listByTransaction=[]
    listByTransactionSeller.forEach((ts)=>{
        var isexist=false
        for(var i=0;i<listByTransaction.length;i++){
            if(listByTransaction[i].idtransaction==ts.idtransaction){
                isexist=true
                listByTransaction[i].sellerlist.push(ts)
            }
        }
        if(!isexist){
            const{
                idtransaction,
                iduser,
                username,
                idstatus,
                status_name,
                totalprice,
                totaldeliverycost,
                totalworth,
                commerce_promo,
                totalcharge,
                payment_promo,
                totalpayment,
                idpayment,
                payment_method,
                paymentproof,
                payat,
                createat,
                updateat
            }=ts.itemlist[0]
            var transactiondata={
                idtransaction,
                iduser,
                username,
                status_name,
                idstatus,
                totalprice,
                totaldeliverycost,
                totalworth,
                commerce_promo,
                totalcharge,
                payment_promo,
                totalpayment,
                idpayment,
                payment_method,
                paymentproof,
                payat,
                createat,
                updateat,
                sellerlist:[ts]
            }
            listByTransaction.push(transactiondata)
        }

    })

    // console.log('list by transaction',listByTransaction)

    return listByTransaction
}


// REASON USING THIS ASSEMBLER
// NEED VALUE FROM TRANSACTION SUCH AS IDUSER,USERNAME,UPDATEAT,...
export const ListByStoreTransaction=(list)=>{
    // RECONSTRUCT LIST , BY TRANSACTION
    var listByTransaction=[]
    list.forEach((item)=>{
        var isexist=false
        for(var i=0;i<listByTransaction.length;i++){
            if(listByTransaction[i].idtransaction==item.idtransaction){
                isexist=true
                listByTransaction[i].itemlist.push(item)
            }
        }
        if(!isexist){
            const{
                idtransaction,
                iduser,
                username,
                status_name,
                idstatus,
                createat,
                updateat,

                idtransactionseller,
                idseller,
                namatoko,
                iddelivery,
                delivery_method,
                totalqty,
                totalweight,
                seller_delivery_cost,
                seller_items_price,
                total_price,
                package_createat,
                package_updateat
            }=item
            var transactiondata={
                idtransaction,
                iduser,
                username,
                status_name,
                idstatus,
                createat,
                updateat,

                idtransactionseller,
                idseller,
                namatoko,
                iddelivery,
                delivery_method,
                totalqty,
                totalweight,
                seller_delivery_cost,
                seller_items_price,
                total_price,
                package_createat,
                package_updateat,
                itemlist:[item]
            }
            listByTransaction.push(transactiondata)
        }
    })
    // console.log('list by transaction seller',listByTransaction)

    return listByTransaction
}


export const listItemsByProduct=(list)=>{

    var listByProduct=[]
    list.forEach((item)=>{
        var isexist=false
        for(var i=0;i<listByProduct.length;i++){
            if(listByProduct[i].idproduct==item.idproduct){
                isexist=true
                listByProduct[i].itemlist.push(item)

                // TO KEEP PRODUCT PRICE LABEL IS THE HIGHEST PRICE OF ITS ITEMS
                // IF ITEM PRICE IS BIGGER THAN PRODUCT PRICE
                if(listByProduct[i].productprice<item.price){
                    listByProduct[i].productprice=item.price
                }
            }
        }

        if(!isexist){
            const{
                idproduct,
                product_name,
                imagecover,
                description,
                product_rating,
                product_rating_count,
                sold,
                seen,
                
                price,
            }=item
            var productdata={
                idproduct,
                product_name,
                imagecover,
                description,
                product_rating,
                product_rating_count,
                sold,
                seen,

                productprice:price,
                itemlist:[item]
            }
            listByProduct.push(productdata)
        }
    })
    return listByProduct
}


export const listFlashsaleItemsByProduct=(list)=>{

    var listByProduct=[]
    list.forEach((item)=>{
        var isexist=false
        for(var i=0;i<listByProduct.length;i++){
            if(listByProduct[i].idproduct==item.idproduct){
                isexist=true
                listByProduct[i].itemlist.push(item)

                // TO KEEP PRODUCT PRICE LABEL IS THE HIGHEST PRICE OF ITS ITEMS
                // IF ITEM PRICE IS BIGGER THAN PRODUCT PRICE
                if(listByProduct[i].productprice<item.price){
                    listByProduct[i].productprice=item.price
                }
            }
        }

        if(!isexist){
            const{
                idproduct,
                product_name,
                imagecover,
                description,
                product_rating,
                product_rating_count,
                sold,
                seen,
                idflashsaleproduct,
                flashsale_price,
                isapproved,
                
                price,
            }=item
            var productdata={
                idproduct,
                product_name,
                imagecover,
                description,
                product_rating,
                product_rating_count,
                sold,
                seen,
                idflashsaleproduct,
                flashsale_price,
                isapproved,

                productprice:price,
                itemlist:[item]
            }
            listByProduct.push(productdata)
        }
    })
    return listByProduct
}


export const listSalesByTime=(list)=>{

    // var secondstostart=(-Date.parse(this.state.now)+Date.parse(flashsale.startat))/1000

    var firsthour=Date.parse(list[0].order_updateat)/1000/60/60
    var lasthour

    //  ADD VALUE HOUR IN EACH ORDER
    var listAddHour=list.map((order,index)=>{

        var hour=Date.parse(order.order_updateat)/1000/60/60
        hour=Math.ceil(hour-firsthour)

        var milliseconds=Date.parse(order.order_updateat)
        // ROUND UP
        milliseconds=milliseconds-(milliseconds%3600)+3600

        // GET LAST HOUR
        if(index==list.length-1){
            lasthour=hour
        }

        return {
            ...order,
            hour,
            milliseconds,
        }
        
    })

    // LOOP HOURLY FROM FIRSTHOUR
    var listByHours=[]
    for(var i=0;i<=lasthour;i++){
        // MERGE ORDERS WITH SAME HOUR
        var checkout_price=0
        var qty=0
        var milliseconds=listAddHour[0].milliseconds+i*1000*60*60
        var subhour=i-lasthour
        // var order_updateat=
        for(var j=0;j<listAddHour.length;j++){
            if(listAddHour[j].hour==i){
                checkout_price+=listAddHour[j].checkout_price
                qty+=listAddHour[j].qty
                // order_updateat=listAddHour[j].order_updateat
            }
        }
        var data={
            checkout_price,
            qty,
            milliseconds,
            subhour

        }
        listByHours.push(data)
    }

    return listByHours


    // MERGE AND SUM ORDERS WITH THE SAME HOUR VALUE
    var listByHour=[]
    
    listAddHour.forEach((order,index)=>{
        // CHECK IF HOUR ALREADY EXIST
        var isexist=false
        for(var i=0;i<listByHour.length;i++){
            if(order.hour==listByHour[i].hour){
                isexist=true
                // MERGE AND SUM
                listByHour[i].checkout_price+=order.checkout_price
                listByHour[i].qty+=order.qty
            }

        }
        if(!isexist){
            listByHour.push(order)
        }else{
            var orderzero={
                checkout_price:0,
                qty:0,
                hour:order.hour
            }
            listByHour.push(orderzero)
        }
    })
    

    return listByHour
}