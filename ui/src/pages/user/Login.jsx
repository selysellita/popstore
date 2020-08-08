import React, { useState } from 'react'
import { Form, Segment,Message } from 'semantic-ui-react'
import {connect} from 'react-redux'
import {LoginUser} from './../../redux/actions'
import {Redirect} from 'react-router-dom'

const Login = (props) => {
    
    const [data, setdata]=useState({
        username:'',
        password:''
    })


    const [forgot,setforgot]=useState(false)
  

    const handleChange = (e, { name, value }) => setdata({...data, [name]: value })

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log('inputing data...')
        props.LoginUser(data)
        setdata({...data, username:'', password:''})

    }

    if(props.islogin){
        return <Redirect to='/'/>
    }
    const isforgot=()=>{
        setforgot(true)
    }

    if(forgot){
        return  <Redirect to='/forgotpassword'/>
      }
      
    return (
        <div
        style={{height:'80vh', width:'100%', justifyContent:'center', alignItems:'center', textAlign:'center', display:'flex'}}>
            <Segment inverted>
                <Form inverted style={{width:'300px'}} onSubmit={handleSubmit}>
                    <h1>Login User</h1>
                    <Form.Group style={{flexDirection: 'column', justifyContent: 'center'}} >
                        <Form.Input
                        placeholder='Username'
                        name='username'
                        type='text'
                        value={data.username}
                        onChange={handleChange}
                        /> <br/>
                        <Form.Input
                        placeholder='Password'
                        name='password'
                        type='password'
                        value={data.password}
                        onChange={handleChange}
                        /> <br/>
                        <Form.Button content='Submit'/><br/>
                        <Form.Button content='Forgot Password?' onClick={isforgot}/>
                    </Form.Group>
                </Form>
                {
                    props.message?
                    <Message style={{color:'red'}}>
                        {props.message}
                    </Message>
                    : null
                }
            </Segment>
        </div>
    )
}


const MapstatetoProps=(state)=>{
    return state.Auth            
}

export default connect(MapstatetoProps,{LoginUser}) (Login)