import {
    INVOICE_LIST
} from '../type'
import Axios from 'axios';
import { APIURL } from '../../supports/ApiUrl';
import {ListByTransaction} from '../../supports/ListAssembler'


export const LoadInvoices=(iduser)=>{
    console.log('request invoices list')
    return(dispatch)=>{
        // GET DATA TRANSACTION LIST WHERE ALL IDUSER AND IDSTATUS=2

        Axios.get(`${APIURL}/transactions/admin?idstatus=2`)
        .then((res)=>{
            // console.log(res.data)
            
            // RECONSTRUCT LIST , BY TRANSACTION BY TRANSACTION SELLER
            var listByTransaction=ListByTransaction(res.data).reverse()
            
            
            var data={
                list: listByTransaction,
                total: listByTransaction.length
            }
            dispatch({type:INVOICE_LIST,payload:data})
            console.log('invoices loaded')
        }).catch((err)=>{
            console.log(err)
        })
    }
}