import{
    SELLER_REGISTER_CHECK,
    SELLER_REGISTER_SUCCESS,
    SELLER_REGISTER_FAILED
} from './../type'

const INITIAL_STATE={
    idseller:0,
    namatoko:'',
    alamattoko:'',
    imageprofile:undefined,
    loading:false
}

export default (state= INITIAL_STATE,action)=>{
    switch(action.type){
        case SELLER_REGISTER_CHECK:
            return{...state,loading:true}
        case SELLER_REGISTER_SUCCESS:
            return{...state, ...action.payload}
        case SELLER_REGISTER_FAILED:
            return{...state,loading:false,errormes:action.payload}
        case 'ClearState':
            return INITIAL_STATE
        default: 
           return state
    }
}