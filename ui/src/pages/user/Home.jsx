import React, { Component } from 'react';
import { Grid, Image, Button, Segment, Header, Card, Icon, Rating } from 'semantic-ui-react';
import Flashsale from '../../components/FlashsaleHome'
import {Link } from 'react-router-dom';
import Axios from 'axios';
import { APIURL } from '../../supports/ApiUrl';
import './user.css'

class Home extends Component {
  state = {
      mostViewedProducts:[],
      recommendedProducts:[]
  }

  componentDidMount(){
      Axios.get(`${APIURL}/products/mostviewed`)
      .then((res)=>{
        this.setState({
          mostViewedProducts:res.data.mostviewed,
          recommendedProducts:res.data.recommended
        })
      }).catch((err)=>{
        console.log(err)
      })
  }

  renderMostViewed=()=>{
    // console.log(this.state.mostViewedProducts)
    // console.log(this.state.mostViewedProducts[0])
    // console.log( this.state.mostViewedProducts[0])
    if(this.state.mostViewedProducts.length){
      return this.state.mostViewedProducts.map((val,index)=>{
          return (                  
            <div key={index} style={{width:'22%', marginLeft:12, marginRight:12, marginBottom:20}}>
                <Link to={`/product/${val.idproduct}`}>
                    <Card raised style={{ paddingTop:5, height:'100%'}}>
                            <Image src={APIURL+ JSON.parse(val.imagecover)[0]} style={{height:'150px' }}/>
                        {/* <a style={{alignSelf:'center'}}>
                        </a> */}
                        <Card.Content style={{borderColor: 'transparent',}} >
                        <Card.Header style={{display:'block', overflow: 'hidden',}}>{val.product_name}</Card.Header>
                        <Card.Meta>{val.maincategory}</Card.Meta>
                        <Card.Description >
                            Rp.{val.price} <br/>
                            <Rating icon='star' rating={val.product_rating} maxRating={5} />
                        </Card.Description>
                        </Card.Content>
                        <Card.Content style={{textAlign:'center',alignSelf:'center'}} extra>
                            <Icon name='cart' />
                            Detail
                        {/* <a style={{fontSize:'20px', width:'100%'}} >
                        </a> */}
                        </Card.Content>
                    </Card>
                </Link>
            </div>
          ) 
      })
    }
  }

  renderRecommended=()=>{
    if(this.state.recommendedProducts.length){
      return this.state.recommendedProducts.map((val,index)=>{
            return (                  
              <div key={index} style={{width:'22%', marginLeft:12, marginRight:12, marginBottom:20}}>
                  <Link to={`/product/${val.idproduct}`}>
                      <Card raised style={{ paddingTop:5, height:'100%'}}>
                              <Image src={APIURL+ JSON.parse(val.imagecover)[0]} style={{height:'150px' }}/>
                          {/* <a style={{alignSelf:'center'}}>
                          </a> */}
                          <Card.Content style={{borderColor: 'transparent',}} >
                          <Card.Header style={{display:'block', overflow: 'hidden',}}>{val.product_name}</Card.Header>
                          <Card.Meta>{val.maincategory}</Card.Meta>
                          <Card.Description >
                              Rp.{val.price} <br/>
                              <Rating icon='star' rating={val.product_rating} maxRating={5} />
                          </Card.Description>
                          </Card.Content>
                          <Card.Content style={{textAlign:'center',alignSelf:'center'}} extra>
                              <Icon name='cart' />
                              Detail
                          {/* <a style={{fontSize:'20px', width:'100%'}} >
                          </a> */}
                          </Card.Content>
                      </Card>
                  </Link>
              </div>
           ) 
      })
    }
  }
  

  render() { 
    return ( 
          <Grid style={{padding:50 }}>
                  <Grid.Row columns={2} style={{position:'relative'}}>
                      <Grid.Column style={{marginRight:0, paddingRight: 0,}}>
                          <Image height='400px' src='/images/men.jpg'/>
                      </Grid.Column>
                      <Grid.Column  style={{marginLeft:0, paddingLeft: 0,}}>
                        <Image height='400px' src='/images/women.jpg' />
                      </Grid.Column>

                      <div className='circleMenWomen'>
                          <Segment circular className='menSegment'>
                            <Header as='h2'>
                              <p>Men</p>
                              <Link to='/allproducts/men'>
                                  <Button inverted className='shopNow' >Shop Now</Button>
                              </Link>
                            </Header>
                          </Segment>
                          <Segment circular inverted className='womenSegment'>
                            <Header as='h2' inverted>
                              <p>Women</p>
                              <Link to='/allproducts/women'>
                                  <Button inverted className=' shopNow' >Shop Now</Button>
                              </Link>
                            </Header>
                          </Segment>
                      </div>

                  </Grid.Row>
                  <div className='showProduct'>
                    <Link className='allProducts box-2 btn btn-one ' to='allproducts'>
                        See All Products
                    </Link>                  

                    <Link className='categoryproduct' style={{justifyContent:'center'}} to='search/recommended'>
                      <h2>Recommended Products</h2>
                    </Link>                  
                    <div className='categoryproduct' style={{marginBottom:'30px'}}>
                        {this.renderRecommended()}
                    </div>

                    <Link className='categoryproduct' style={{justifyContent:'center'}} to='search/mostviewed'>
                      <h2>Most Viewed Products</h2>
                    </Link>
                    <div className='categoryproduct'>
                        {this.renderMostViewed()}
                    </div>
                  </div>
                

                  {/* INDO */}
                  {/* FLASHSALE */}
                  <Flashsale/>
          </Grid>
    );
  }
}
 
export default Home;