import{
    CART_EMPTY,
    CART_DATA,
    CART_LIST,
    CART_CHECKOUT,
    CART_TOTAL_WORTH,
    CART_COMMERCE_PROMO,
    CART_TOTAL_CHARGE,
    CART_PAYMENT_PROMO,
    CART_TOTAL_PAYMENT,
} from '../type'

const INITIAL_STATE={

    list:[],
    checkout:[],
    totalitems:0,

    totalqty:0,
    totalprice:0,
    totaldeliverycost:0,
    ischeckout:false,
    totalworth:'',          // sum of total price and total delivery cost

    commerce_promo:0,
    totalcharge:'',         // sum of total worth minus commerce promo
    
    payment_promo:0,
    totalpayment:'',        // sume of totalcharge  minus payment_promo

    
}

export default (state= INITIAL_STATE,action)=>{
    switch(action.type){
        case CART_DATA:
            return {...state,...action.payload}
        case CART_LIST:
            return {...state,list:action.payload}
        case CART_CHECKOUT: // update delivery option on each seller transaction
            return {...state,checkout:action.payload}
        case CART_TOTAL_WORTH: // count total worth once delivery cost is set up
            return {
                ...state,
                totalworth:state.totalprice+state.totaldeliverycost,
                ischeckout:true // if all delivery option are already selected
            }
        
        case CART_COMMERCE_PROMO:
            return {
                ...state,
                commerce_promo: action.payload
            }
        case CART_TOTAL_CHARGE: // total charge after commerce promo is applied
            return {
                ...state,
                totalcharge: state.totalworth-state.commerce_promo
            }

        case CART_PAYMENT_PROMO:
            return {
                ...state,
                payment_promo: action.payload
            }
        case CART_TOTAL_PAYMENT: // total payment after payment promo is applied
            return {
                ...state,
                totalpayment: state.totalcharge-state.payment_promo
            }
        case CART_EMPTY:
            return INITIAL_STATE
        default:
            return state
    }
}