import React, {useState,useEffect} from 'react'
import { Form, Button, Message } from 'semantic-ui-react'
import {Redirect} from 'react-router-dom'
import Axios from 'axios'
import { APIURL } from '../../supports/ApiUrl'
import {connect} from 'react-redux'
import {LoginUser} from './../../redux/actions'

const ChangePass = (props) =>{
    const [password,setpassword]=useState({
        password:'',
        isConfirmPassword:'',
        email:''
    })

    const [message , setmessage]=useState('')

    
   const sendnewpass=()=>{
        console.log(password)
        var ispassword=password.password
        var isConfirmPassword=password.isConfirmPassword

        if(ispassword === '' || isConfirmPassword === '' ){
            setmessage('Please Fill in your new password')
        }
        else if(ispassword !== isConfirmPassword){
            setmessage('Your Password Does not Match Each Other')
        }
        Axios.put(`${APIURL}/users/changepassword`,{...password})
        .then((res)=>{
           console.log(res.data)
           props.LoginUser(res.data)
        }).catch((err)=>{
            console.log(err)
        })
    }
    
    return(
             <div className="ui form"
        style={{height:'80vh', width:'100%', justifyContent:'center', alignItems:'center', textAlign:'center', display:'flex'}}>
        <div className="field">
          <h1 >Please enter your new password</h1>
          <Form onSubmit={sendnewpass}>
          <Form.Group style={{flexDirection: 'column', justifyContent: 'center'}} >
          <Form.Input
           placeholder='Please type your email'
           name='email'
           type='text'
           onChange={(e)=>{setpassword({...password,email:e.target.value})}}
           /> 
           <br/>
          <Form.Input
           placeholder='Insert New Password'
           name='password'
           type='password'
           onChange={(e)=>{setpassword({...password,password:e.target.value})}}
          /> 
           <br/>
           <Form.Input
           placeholder='Please Re-type your password to confirm'
           name='confirmPassword'
           type='password'
           onChange={(e)=>{setpassword({...password,isConfirmPassword:e.target.value})}}
           /> 
          </Form.Group>
          <br/>
        <Button color='teal' fluid-size='large' >
            Submit
        </Button>
          </Form>
        {
            message?
            <Message style={{color:'red'}}>
                {message}
            </Message>
            : null
        }
        {
                  
    props.islogin?
        <Redirect to='/'/>
        :null
        }
        </div>
        </div>
    )

}


const MapStatetoProps=(state)=>{
    return state.Auth
  }
  
export default connect(MapStatetoProps,{LoginUser})(ChangePass)