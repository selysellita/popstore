import React, { useState,useEffect } from 'react'
import Axios from 'axios'
// import 'bootstrap/dist/css/bootstrap.min.css';
import {connect} from 'react-redux'
import { APIURL } from '../../supports/ApiUrl'
import { Button,Table,Image } from 'semantic-ui-react'
import { isJson } from '../../supports/services'
import ProfileEdit from './../../components/Profileedit'
const Profile=(props)=>{
    const [data,setdata]=useState({})
    const [edit,setedit]=useState(false)

    useEffect(()=>{
        Axios.get(`${APIURL}/users/profile?iduser=${props.iduser}`)
        .then((res)=>{
            console.log(res.data)
            setdata(res.data)
        }).catch((err)=>{
            console.log(err) 
        })
    },[])
    
    console.log(data.username);
    
    return(
        edit===false?
        <div style={{width:'50%',
            marginLeft:'22%', 
            marginRight:'15%',
            marginTop:'5%'}}>
        <Table basic='very'>

    <Table.Body>
      <Image src={APIURL+ data.image}/>
      <Table.Row>
        <Table.Cell>Username:</Table.Cell>
        <Table.Cell></Table.Cell>
        <Table.Cell>{data.username}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>Email:</Table.Cell>
        <Table.Cell></Table.Cell>
        <Table.Cell>{data.email}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>Address</Table.Cell>
        <Table.Cell></Table.Cell>
        <Table.Cell>{data.address}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>Account Status:</Table.Cell>
        <Table.Cell></Table.Cell>
        <Table.Cell>{data.isseller===1?'seller':'users'}</Table.Cell>
      </Table.Row>
    </Table.Body>
  </Table>
        <Button style={{marginLeft:'30%'}} onClick={()=>{setedit(true)}}>
            Update Profile
        </Button>
        </div>
        :
        <ProfileEdit/>
    )
}
const MapstatetoProps=(state)=>{
    return state.Auth            
}
export default connect(MapstatetoProps) (Profile)