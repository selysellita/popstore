import{
    USER_LOGIN_SUCCESS,
    USER_LOGIN_START,
    USER_LOGIN_FAILED,
} from './../type'

const INITIAL_STATE={
    username:'',
    iduser:0,
    loading:false,
    islogin:false,
    message:'',
    token:'',
    password:'',
    isverified:0,
    email:'',
    address:'',
    isseller:false,
    isadmin:false,
    
}

export default (state= INITIAL_STATE,action)=>{
    switch(action.type){
        case USER_LOGIN_START:
            return{...state,loading:true}
        case USER_LOGIN_SUCCESS:
            return{...state,loading:false,...action.payload,islogin:true}
        case USER_LOGIN_FAILED:
            return{...state,loading:false,message:action.payload}
        case 'ErrorClear':
            return INITIAL_STATE
        case 'AFTERVERIFIED':
            return {...state,...action.payload}
        default:
            return state
    }
}