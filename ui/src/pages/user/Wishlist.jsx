import React, { useState } from 'react'
import { Card, Image, Button, Message,Container } from 'semantic-ui-react'
import { useEffect } from 'react'
import {APIURL} from './../../supports/ApiUrl'
import Axios from 'axios'
import {connect} from 'react-redux'
import { isJson } from '../../supports/services'
import Slide from 'react-reveal/Fade'
import {Redirect} from 'react-router-dom'

const WishlistPage = (props) => {
    const [wishlist,setwishlist]=useState([])
  const [message,setmessage]=useState(false)
    const [productpage,setpage]=useState(0)
    useEffect(()=>{
      
        Axios.get(`${APIURL}/wishlist/getwishlist?iduser=${props.iduser}`)
        .then((res)=>{
            setwishlist(res.data)
            console.log(res.data)
        }).catch((err)=>{
            console.log(err)
        })
    },[])

  
    
    const removeWishlist=(idwishlist)=>{
      return(
        Axios.delete(`${APIURL}/wishlist/deletewishlist?idwishlist=${idwishlist}`)
        .then((res)=>{
          setmessage(true)
        }).catch((err)=>{
          console.log(err);
          
        })
     )
    }

   const prodetail=(idproduct)=>{
      return(
        setpage(idproduct)
      )
   }

   if(productpage){
     return(
       <Redirect to={`/product/${productpage}`}/>
     )
   }
    
    const ShowCardWishlist=()=>{
        return wishlist.map((val,index)=>{
            return(
              <div key={index} style={{width:'22%', marginLeft:12, marginRight:12, marginBottom:20}}>
                <Slide left>
            <Card raised style={{ paddingTop:5, height:'100%'}} >
            <Image src={APIURL+isJson(val.imagecover)[0]} style={{height:'40%'}} wrapped ui={false} />
            <Card.Content style={{backgroundColor:'#FAF8ED'}}>
              <Card.Header style={{ fontFamily:'muli,sans-serif', fontWeight: 400}}>{val.product_name}</Card.Header>
              <Card.Meta>{val.category}</Card.Meta>
              <Card.Description>
                {val.description}
              </Card.Description>
              <br/>
              <Card.Header>Rp.{val.price },00 </Card.Header>
            </Card.Content>
            <Card.Content extra  style={{backgroundColor:'#FAF8ED'}}>
              <a>
                <Button onClick={()=>prodetail(val.idproduct)}>Product Detail</Button>
                <Button style={{marginLeft:'1px'}} onClick={()=>removeWishlist(val.idwishlist)}>remove</Button>
              </a>
            </Card.Content>
          </Card>
                </Slide>
              </div>
            )
        })
    }
    
    return(
     <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
       <h1 style={{fontFamily:'muli,sans-serif', textTransform:'uppercase',fontWeight:100, letterSpacing:'8px',marginTop:'2%',marginBottom:'2%'}}>{props.username}'s wishlist</h1>
       <Container style={{display:'flex', flexDirection:'row', alignItems:'center', }}>
  
           {
               ShowCardWishlist()
           }
       </Container>
       {
         message?<Message negative>
         <Message.Header style={{fontFamily:'muli,sans-serif', textTransform:'uppercase',fontWeight:100, letterSpacing:'8px',alignItems:'center',width:'100%'}}>
           Removed From Wishlist</Message.Header>
       </Message>:
       null
       }
     </div>
      
    )
}

const MapstatetoProps=(state)=>{
    return state.Auth            
}
export default connect(MapstatetoProps)(WishlistPage)