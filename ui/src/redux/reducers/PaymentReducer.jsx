import{
    PAYMENT_LIST
} from '../type'

const INITIAL_STATE={
    list:[],
    total:0
    
}

export default (state= INITIAL_STATE,action)=>{
    switch(action.type){
        case PAYMENT_LIST:
            return {...state,...action.payload}
        default:
            return state
    }
}