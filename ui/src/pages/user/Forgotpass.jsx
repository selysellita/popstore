import React, {useState, useEffect} from 'react'
import { Form, Button, Message } from 'semantic-ui-react'
import Axios from 'axios'
import { APIURL } from '../../supports/ApiUrl'
import {connect} from 'react-redux'

const ForgotPass =(props)=>{

    const [emailaddress,setemail]=useState({
      username:'',
      email:''
    })

    const [message , setmessage]=useState({
      message:'',
      email:''
    })

    
    const sendChangePass=()=>{
      if(!emailaddress.username || !emailaddress.email){
        setmessage({
          ...message,
          message:'Fill All Columns'
        })
      }else{
        /////////////// SEARCH EMAIL DAN USERNAME /////////////
        // props.ForgotUser(emailaddress)
        // console.log(props.email)
        // console.log(props.username)
        /////////////// KIRIM EMAIL ////////////////////
          Axios.post(`${APIURL}/users/forgotpassword`,emailaddress)
          .then((res)=>{
            console.log(res.data)
            setmessage({...message,message:'Your recovery Email has been sent'})
          }).catch((Err)=>{
            console.log(Err)
          })
      }
    }
    
    const forgotChange = (e, { name, value }) => setemail({...emailaddress, [name]: value })

    return(
    
        <div 
        style={{height:'80vh', width:'100%', justifyContent:'center', alignItems:'center', textAlign:'center', display:'flex'}}>
        <div >
          <h1 >If you forgot your password please enter your e-mail and username</h1>
          <Form onSubmit={sendChangePass} >
          <Form.Group style={{flexDirection: 'column', justifyContent: 'center'}} >
          <Form.Input
           placeholder='E-mail'
           name='email'
           value={emailaddress.email}
           onChange={forgotChange}/> 
           <br/>
           <Form.Input
           placeholder='Insert Username'
           name='username'
           value={emailaddress.username}
           onChange={forgotChange}/> 
          </Form.Group>
          <br/>
        <Button color='teal' fluid-size='large'>
            Submit
        </Button>
        {
          message.message?
          <div style={{color:'red'}}>{message.message}</div>
          : null
        }
          </Form>
        </div>

      </div>
    )
}

const MapStatetoProps=(state)=>{
  return state.Auth
}

export default connect(MapStatetoProps) (ForgotPass)