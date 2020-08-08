import {
    PAYMENT_LIST
} from '../type'
import Axios from 'axios';
import { APIURL } from '../../supports/ApiUrl';
import {ListByTransaction} from '../../supports/ListAssembler'


export const LoadPayment=(iduser)=>{
    console.log('request payment due list')
    return(dispatch)=>{
        Axios.get(`${APIURL}/transactions/user?iduser=${iduser}&idstatus=1`)
        .then((res)=>{
            // console.log(res.data)


            // RECONSTRUCT LIST , BY TRANSACTION BY TRANSACTION SELLER
            var listByTransaction=ListByTransaction(res.data)


            var data={
                list: listByTransaction,
                total: listByTransaction.length
            }
            dispatch({type:PAYMENT_LIST,payload:data})
            console.log('payment due list loaded')
        }).catch((err)=>{
            console.log(err)
        })
    }
}