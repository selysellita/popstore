import React from 'react'
import {
  Grid,
  Header,
  Form,
  Segment,
  Button,
} from 'semantic-ui-react'
import { useState } from 'react'
import {connect} from 'react-redux'
import {SellerRegister} from './../../redux/actions'
const Sellerregis = (props) => {

  const [data,setdata]=useState({
    namatoko:'',
    alamattoko:'',
    iduser:props.auth.iduser,
    imageprofile:undefined
  })

//   const [imageprofile,setimage]=useState({
//     image:undefined
// })

  const testmasuk=()=>{
    return(
      props.SellerRegister(data)
    )
  }
  
console.log(props.seller.namatoko)

  return(
    <Grid textAlign='center' style={{ height: '70vh' }} verticalAlign='middle'>
    <Grid.Column style={{ maxWidth: 450 }}>
    <Header as='h2' color='teal' textAlign='center'>
      Seller Registration
    </Header>
    <Form size='large'>
        <Segment stacked>
            <Form.Input 
                fluid icon='building outline' 
                iconPosition='left' 
                placeholder='Insert store name' 
                onChange={(e)=>{setdata({...data,namatoko:e.target.value})}}
            />
            <Form.Input 
                fluid icon='compass outline' 
                iconPosition='left' 
                placeholder='Insert store address' 
                onChange={(e)=>{setdata({...data,alamattoko:e.target.value})}}
            />
            <Form.Input
                fluid
                type='file'
            multiple
                icon='file image outline'
                iconPosition='left'
                placeholder='Insert Store Profile'
                onChange={(e)=>setdata({...data,imageprofile:e.target.files[0]})}
            />
            <Button color='teal' fluid size='large' onClick={testmasuk}>
                Register
            </Button>
        </Segment>
    </Form>
    </Grid.Column>
</Grid>
  )
}
const MapstatetoProps=(state)=>{
  return  {
    auth:state.Auth,
    seller:state.Seller
  }           
}
export default connect(MapstatetoProps,{SellerRegister})(Sellerregis)