import {
    ORDERS_LIST
} from '../type'
import Axios from 'axios';
import { APIURL } from '../../supports/ApiUrl';
import {ListByStoreTransaction} from '../../supports/ListAssembler'


export const LoadOrders=(iduser)=>{
    console.log('request orders list')
    return(dispatch)=>{
        // FIND DATA IDSELLER
        Axios.get(`${APIURL}/users/seller?iduser=${iduser}`)
        .then((seller)=>{

            const {idseller}=seller.data

            // GET LIST DATA WHERE IDSELLER AND STATUSPACKAGE
            Axios.get(`${APIURL}/transactions/seller?idseller=${idseller}&idpackagestatus=2`)
            .then((res)=>{
                console.log('orders list loaded')
                // console.log(res.data)
                
                // RECONSTRUCT LIST , BY TRANSACTION BY TRANSACTION SELLER
                var listByTransaction=ListByStoreTransaction(res.data)
    
    
                var data={
                    list: listByTransaction,
                    total: listByTransaction.length
                }
                dispatch({type:ORDERS_LIST,payload:data})
                console.log('orders list loaded')
            }).catch((err)=>{
                console.log(err)
            })

        }).catch((err)=>{
            console.log(err)
        })




    }
}