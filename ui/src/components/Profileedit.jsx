import React, { useState,useEffect } from 'react'
import Axios from 'axios'

import {connect} from 'react-redux'
import { APIURL } from './../supports/ApiUrl'
import { Button,Input,Table, Message } from 'semantic-ui-react'
import {Redirect} from 'react-router-dom'
const ProfileEdit=(props)=>{

    const [edit,setedit]=useState(false)
    const [editprofile,setprofile]=useState({username:'',address:'',iduser:`${props.iduser}`})
    const [profileimage,setimage]=useState({image:undefined})
   const editSubmit=()=>{
    var formData=new FormData()
    var options={
      headers:{
       'Content-Type':'multipart/form-data',
       'Authorization':`Bearer ${props.token}`
      }
  }
  formData.append('image',profileimage.image)
  formData.append('data',JSON.stringify(editprofile))
    Axios.put(`${APIURL}/users/editprofile`,formData,options)
    .then((res)=>{
        console.log(res.data)
        console.log('berhasil')
        setedit(true)
    }).catch((err)=>{
        console.log(err) 
    })
   }

   const editChange=(e)=>{
    setprofile({...editprofile,[e.target.name]:e.target.value})  
}
  if(edit){
    return <Redirect to='/'/>
  }

  
    return(
        <div style={{width:'70%',
            marginLeft:'22%', 
            marginRight:'15%',
            marginTop:'5%'}}
           >
              <Table basic='very'>
              <Table.Header>
      
       <h1>
         Update Profile
       </h1>
      
    </Table.Header>
<Table.Body>
  <Table.Row>
    <Table.Cell>Username:     
    <Input type="text" 
               placeholder='Username...' 
               name='username'
               value={editprofile.username}
               onChange={editChange}/>
    </Table.Cell>
    
  </Table.Row>
  <Table.Row>
    <Table.Cell>Email: {props.email} </Table.Cell>
    <Table.Cell></Table.Cell>
    <Table.Cell></Table.Cell>
  </Table.Row>
  <Table.Row>
    <Table.Cell>Address: <Input type="text" 
               placeholder='Address...' 
               name='address'
               value={editprofile.address} 
               onChange={editChange}/></Table.Cell>
    <Table.Cell></Table.Cell>
    <Table.Cell></Table.Cell>
  </Table.Row>
  <Table.Row>
    <Table.Cell>Account Status: {props.isseller===true?'seller':'users'}</Table.Cell>
    <Table.Cell></Table.Cell>
    <Table.Cell></Table.Cell>
  </Table.Row>
  <Table.Row>
    <Table.Cell>Input Profile Image: <Input fluid
                type='file'
            multiple
                icon='file image outline'
                iconPosition='left'
                name='image'
                placeholder='Insert Store Profile'
                onChange={(e)=>setimage({image:e.target.files[0]})}
               /></Table.Cell>
    <Table.Cell></Table.Cell>
    <Table.Cell></Table.Cell>
  </Table.Row>
</Table.Body>
</Table>
      
        <Button style={{marginLeft:'30%', }} onClick={editSubmit} >
            safe profile
        </Button>
        {
          edit? <Message >
          <Message.Header style={{fontFamily:'muli,sans-serif', textTransform:'uppercase',fontWeight:100, letterSpacing:'8px',alignItems:'center',width:'100%'}}>
            Update Profile Success</Message.Header>
        </Message>:
        null
        }
        </div>
    )
    }
const MapstatetoProps=(state)=>{
    return state.Auth            
}
export default connect(MapstatetoProps)(ProfileEdit)