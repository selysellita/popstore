import {
    CART_EMPTY,
    CART_DATA,
    CART_LIST,
    CART_CHECKOUT,
    CART_TOTAL_WORTH,
    CART_TOTAL_CHARGE,
    CART_TOTAL_PAYMENT
} from '../type'
import Axios from 'axios';
import { APIURL } from '../../supports/ApiUrl';


export const LoadCart=(iduser)=>{
    console.log('Load Cart')
    return async (dispatch)=>{

        // GET TRANSACTION DETAILS JOIN ITEMS JOIN PRODUCT
        Axios.get(`${APIURL}/transactiondetails/item/product/seller?iduser=${iduser}`)
        .then(async(res)=>{
            // dispatch({type:CART_LIST,payload:res.data})

            var cartlist=res.data.reverse()

            // CHECK FOR FLASHSALE ITEMS
            
            for(var orderitem of cartlist){

                if(orderitem.isflashsale){
                    // FIND FLASHSALE PRICE
                    // console.log('get product flashsale price')

                    try{
                        var product=await Axios.get(`${APIURL}/flashsales/product/active/approved?idproduct=${orderitem.idproduct}`)
                        
                        orderitem.price=product.data.flashsale_price
                    }catch(err){
                        console.log(err)
                    }
                }
            }

            console.log('cartlist flashsale checked and update')

            // console.log('cartlist after flashcheck',cartlist)




            // CHECK ITEMS STOCK
        
            var stock=true
            var id=0
            // console.log('cartlist',cartlist)

            if(cartlist.length===0){
                dispatch({type:CART_EMPTY})
            }
    
            cartlist.forEach((td,cartlistindex)=>{
                // console.log(td)
                // iditem
                // qty

                Axios.put(`${APIURL}/items/checkstock/${td.iditem}`,{qty:td.qty})
                .then(async(newstock)=>{
                    // console.log(`item id ${td.iditem} newstock is ${newstock.data.stock}`)
                    if(newstock.data.stock<0){
                        stock=false
                        id=td.iditem

                        // DATA CHECK FOR STOCK
                        cartlist[cartlistindex].qtyshort=newstock.data.stock
                        
                    }

                    // LAST CYCLE
                    // AFTER ALL STOCK IS CHECKED
                    if(cartlist.length-1===cartlistindex){

                        // STOCK IS CHECKED
                        // RECONSTRUCT LIST, ITEMS BY SELLER
                        console.log('stock is checked')
                        // console.log(cartlist)
                        var listBySeller=[]
                        for(let item of cartlist){
                            // check if seller data already in array
                            var isexist=false
                            for(var i=0;i<listBySeller.length;i++){
                                if(listBySeller[i].idseller===item.idseller){
                                    isexist=true
                                    listBySeller[i].itemlist.push(item)
                                }
                            }
                            if(!isexist){
                                var sellerdata={
                                    idseller: item.idseller,
                                    namatoko: item.namatoko,
                                    alamattoko: item.alamattoko,
                                    imageprofile: item.imageprofile,
                                    isblocked: item.isblocked,
                                    itemlist: [item]
                                }
                                listBySeller.push(sellerdata)
                            }
                        }
            
                        // console.log('list by seller')
                        // console.log('cart list action',listBySeller)
                        dispatch({type:CART_LIST,payload:listBySeller})
            
            
            
                        // RECONSTRUCT LIST, ITEMS BY SELLER
                        // SELECTED ITEMS ONLY
                        var listCheckout=[]
                        for(let item of res.data){
                            // check if seller data already in array
                            isexist=false
                            for(i=0;i<listCheckout.length;i++){
                                if(listCheckout[i].idseller===item.idseller){
                                    isexist=true
                                    if(item.isselected){
                                        listCheckout[i].itemlist.push(item)
            
                                        listCheckout[i].totalqty+=item.qty
                                        listCheckout[i].totalweight+=item.weight
                                        listCheckout[i].seller_items_price+=item.qty*item.price
                                    }
                                }
                            }
                            if(!isexist){
                                let sellerdata={
                                    idseller: item.idseller,
                                    namatoko: item.namatoko,
                                    alamattoko: item.alamattoko,
                                    imageprofile: item.imageprofile,
                                    isblocked: item.isblocked,
            
                                    totalqty: item.qty,
                                    totalweight: item.weight*item.qty,
                                    seller_items_price: item.qty*item.price,
            
                                    itemlist: [item]
                                }
                                if(item.isselected){
                                    listCheckout.push(sellerdata)
                                }
                            }
                        }
            
                        // console.log('list by seller')
                        // console.log('cart checkout action',listCheckout)
                        dispatch({type:CART_CHECKOUT,payload:listCheckout})
            
            
            
            
            
                        
            
                        // COUNT TOTAL QTY AND TOTAL PRICE
                        // SELECTED ONLY
                        var totalqty=0
                        var totalprice=0
                        var totalitems=0
                        for(var order of res.data){
                            if(order.isselected){
                                totalqty+=order.qty

                                // FLASHSALE
                                // CHECK IF FLASHSALE
                                // NO NEED , BEC ALREADY UPDATED WITH FLASHSALE PRICE
                                if(false){
                                    // FIND FLASHSALE PRICE
                                    console.log('get product flashsale price')

                                    try{
                                        var product=await Axios.get(`${APIURL}/flashsales/product/active/approved?idproduct=${order.idproduct}`)
                                        
                                        totalprice+=order.qty*product.data.flashsale_price
                                    }catch(err){
                                        console.log(err)
                                    }

                                }else{
                                    totalprice+=order.qty*order.price
                                }
                            }
                            totalitems+=1
                            
                        }
            
            
                        dispatch({type:CART_DATA,payload:{totalqty,totalprice,totalitems}})

                        console.log('cart finish loaded')

                        

                    }

                }).catch((err)=>{
                    console.log(err)
                })
            })



            
            

        }).catch((err)=>{
            console.log(err)
        })





        // PREVIOUS STRUCTURE
        // Axios.get(`${APIURL}/transactions/get?iduser=${iduser}&idstatus=1`)
        // .then((res)=>{
        //     console.log('transaction action',res.data)
        //     dispatch({type:CART_DATA,payload:res.data[0]})
        //     // GET TRANSACTION DETAILS JOIN ITEMS JOIN PRODUCT
        //     Axios.get(`${APIURL}/transactiondetails/item/product/seller?idtransaction=${res.data[0].idtransaction}`)
        //     .then((res)=>{
        //         console.log('transaction action',res.data)

        //         dispatch({type:CART_LIST,payload:res.data})

        //         // COUNT TOTAL QTY AND TOTAL PRICE
        //         var totalqty=0
        //         var totalprice=0
        //         for(var order of res.data){
        //             totalqty+=order.qty
        //             totalprice+=order.qty*order.price
        //         }

        //         dispatch({type:CART_DATA,payload:{totalqty,totalprice}})
                
        //     }).catch((err)=>{
        //         console.log(err)
        //     })
        // }).catch((err)=>{
        //     console.log(err)
        // })
    }
}


export const UpdateCheckout=(checkout)=>{
    console.log('update checkout action',checkout)

    return(dispatch)=>{
        // COUNT TOTAL DELIVERY COST
        var totaldeliverycost=0
        for(var order of checkout){
            totaldeliverycost+=order.seller_delivery_cost 
            // sum of Nan and integer are Nan
        }
        console.log(totaldeliverycost)
    
        if(totaldeliverycost){
            dispatch({type:CART_DATA,payload:{totaldeliverycost}})
            dispatch({type:CART_TOTAL_WORTH})
        }

        // update delivery option for each seller transaction
        dispatch({type:CART_CHECKOUT,payload:checkout})
    }

}

export const CountTotalCharge=()=>{
    console.log('count total charge')
    return(dispatch)=>{
        dispatch({type:CART_TOTAL_CHARGE})
    }
}

export const CountTotalPayment=()=>{
    return(dispatch)=>{
        dispatch({type:CART_TOTAL_PAYMENT})
    }
}