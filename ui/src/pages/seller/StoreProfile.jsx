import React, { Component } from 'react';
import SidebarSeller from './componentseller/sidebar';
import { Button, Menu, Icon, Card, Table, Pagination, Input, Grid, Image, Header, Form, TextArea, Segment, RevealContent } from 'semantic-ui-react'
import { NavLink } from 'react-router-dom';
import SubNavigation from './componentseller/subnavigation';
import _ from 'lodash'
import Axios from 'axios'
import { APIURL } from '../../supports/ApiUrl';
import { useState } from 'react';
import {connect} from 'react-redux'
import { useEffect } from 'react';
import Slide from 'react-reveal/Fade'
import { isJson } from './../../supports/services'
import {Redirect} from 'react-router-dom'
const StoreProfile=(props)=>{
    const [data,setdata]=useState({})
    const [product,setproduct]=useState([])
    const [imagedata,setimagedata]=useState({
        imageprofile:undefined
    })
    const [editpicture,setpicture]=useState(true)
    const [productpage,setpage]=useState(0)

    useEffect(()=>{
        Axios.get(`${APIURL}/sellers/getseller?iduser=${props.auth.iduser}`)
        .then((res)=>{
            setdata(res.data[0])
            console.log(res.data[0].idseller);
            var idsellers=res.data[0].idseller
            Axios.get(`${APIURL}/sellers/productseller/${idsellers}`)
            .then((res)=>{
                setproduct(res.data)
            }).catch((err)=>{
                console.log(err);
            })
        }).catch((err)=>{
            console.log(err)
        })
    },[])

   
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

    const renderProduct=()=>{
        console.log(product)
        
        return product.map((val,index)=>{
            return(
                <div key={index} style={{width:'100%', marginLeft:12, marginRight:12, marginBottom:20}}>
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
               
              </a>
            </Card.Content>
          </Card>
                </Slide>
              </div>
            )
        })
    }
    
    
    const uploadImage=()=>{
        var formData=new FormData()
        var options={
            headers:{
             'Content-Type':'multipart/form-data',
             'Authorization':`Bearer ${props.token}`  
            }
        }
        var idseller=data.idseller
        var obj={
            idseller
        }
        formData.append('imageprofile',imagedata.imageprofile)
        formData.append('data', JSON.stringify(obj))
        Axios.post(`${APIURL}/sellers/uploadimage?idseller=${data.idseller}`,formData,options)
        .then((res)=>{
            setdata({...data,imageprofile:res.data[0]})
        }).catch((err)=>{
            console.log(err);
        })
    }


    return (
        <div  style={{display:'flex', paddingTop:50}}>
        <div>
            <SidebarSeller/>
        </div>
        <div style={{backgroundColor:'#faf8ec',padding: 10, width:'80%', display:'flex', flexDirection:'column'}}>                                               
            <div style={{paddingTop:'50px'}}>
                <Grid columns={3} style={{paddingLeft: 10, paddingRight: 10,}}>
                    <Grid.Row stretched widht={5}>
                        <Grid.Column style={{height:'20%'}}>
                          <div>
                                {
                                    data.imageprofile?  <Image src={APIURL+data.imageprofile}/> :  <Image src='https://react.semantic-ui.com/images/wireframe/image.png' size='large' disabled />
                                }
                                {
                                    editpicture?<Button onClick={()=>{setpicture(!editpicture)}}>Change Profile Picture</Button>: 
                                    <div>
                                        <Form.Input
                                    fluid
                                    type='file'
                                    multiple
                                    icon='file image outline'
                                    iconPosition='left'
                                    placeholder='Insert Store Profile'
                                    onChange={(e)=>{setimagedata({imageprofile:e.target.files[0]})}}/>
                                    </div>
                                }
                                 <Button onClick={uploadImage}>Upload Picture</Button>
                          </div>
              
                
                          
                        </Grid.Column>
                        <Grid.Column style={{ widht:'100%',  display:'flex', flexDirection:'column'}}>
                            <div style={{height:'20%'}}>
                                <h3  style={{letterSpacing:'8px', textTransform:'uppercase',fontWeight:'lighter',fontSize:40}}>{data.namatoko}</h3>
                                <h4>Store Location: <i>{data.alamattoko}</i> </h4>
                            </div>
                            <br/>
                            <br/>
                            <div style={{width:'100%', marginTop:'5%'}}>
                            </div>
                          
                            {
                               renderProduct()
                           }
                        </Grid.Column>
                       
                    </Grid.Row>
                </Grid>
            </div>
        </div>

    </div>
    )
}
const MapstatetoProps=(state)=>{
    return  {
      auth:state.Auth,
      seller:state.Seller
    }           
  }
export default connect(MapstatetoProps)(StoreProfile);