import {USER_LOGIN_START,USER_LOGIN_SUCCESS,USER_LOGIN_FAILED} from './../type'
import Axios from 'axios';
import { APIURL } from '../../supports/ApiUrl';
import {LoadCart} from '../actions'
import { KeepSeller } from './Selleraction';
import { LoadPayment } from './PaymentActions';
import { LoadInvoices } from './InvoiceActions';
import { LoadOrders } from './StoreActions';


export const LoginUser=({username,password})=>{
    return (dispatch)=>{
        dispatch({type:USER_LOGIN_START})
        if(username===''||password===''){
            console.log('test')
            dispatch({type:USER_LOGIN_FAILED,payload: 'All Column should be filled!'})
        }else{
            Axios.get(`${APIURL}/users/login`,{
                params:{
                    username:username,
                    password
                }
            }).then((res)=>{
                if(res.data.status){
                    console.log(res.data)
                    localStorage.setItem('token', res.data.token)
                    dispatch({type:USER_LOGIN_SUCCESS,payload:res.data})

                    // ALL INITIAL REDUX FUNCTION
                    // DONT FORGET
                    dispatch(LoadCart(res.data.iduser))
                    dispatch(LoadPayment(res.data.iduser))

                    // SELLER
                    if(res.data.isseller){
                        dispatch(KeepSeller(res.data.iduser))
                        dispatch(LoadOrders(res.data.iduser))
                    }
                    
                    // ADMIN
                    if(res.data.isadmin){
                        dispatch(LoadInvoices(res.data.iduser))
                    }

                }else{
                    dispatch({type:USER_LOGIN_FAILED,payload:'Account is not recognized!'})
                }
            }).catch((err)=>{
                console.log(err)
                dispatch({type:USER_LOGIN_FAILED,payload:err.message})
            })
        }
    }
}

export const KeepLogin=(data)=>{
    return{
        type:USER_LOGIN_SUCCESS,
        payload:data
    }
}

export const isLogout=()=>{
    localStorage.removeItem('token')
    return{
        type:'ErrorClear',
    }
}



    