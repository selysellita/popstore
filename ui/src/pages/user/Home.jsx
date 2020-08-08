import React, { Component } from 'react';
import { Grid, Image, Button, Segment, Header, Card, Icon, Rating } from 'semantic-ui-react';
import Flashsale from '../../components/FlashsaleHome'
import { NavLink, Link } from 'react-router-dom';
import Axios from 'axios';
import { APIURL } from '../../supports/ApiUrl';

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
                  <Grid.Row columns={2} >
                      <Grid.Column style={{marginRight:0, paddingRight: 0,}}>
                          <Image src='/images/men.jpg'/>
                      </Grid.Column>
                      <Grid.Column style={{marginLeft:0, paddingLeft: 0,}}>
                        <Image src='/images/women.jpg' />
                      </Grid.Column>
                      <div style={{position:"absolute",width:'100%',alignSelf:'center', fontFamily:'muli,sans-serif', fontWeight:'100'}}>
                        <center>
                          <Segment circular style={{width: 200, height: 200, backgroundColor: '#898989'}}>
                            <Header as='h2'>
                              Men
                              <Link to='/allproducts/men'>
                                  <Button inverted className='btn-shopnow' style={{padding:20, marginTop:10, borderWidth:'0.5px',fontWeight:100, textTransform:'uppercase', fontSize:'16px'}}>Shop Now</Button>
                              </Link>
                            </Header>
                          </Segment>
                          <Segment circular inverted style={{width: 200, height: 200}}>
                            <Header as='h2' inverted>
                              Women
                              <Link to='/allproducts/women'>
                                  <Button inverted className='btn-shopnow' style={{padding:20, marginTop:10, borderWidth:'0.5px',fontWeight:100, textTransform:'uppercase', fontSize:'16px'}}>Shop Now</Button>
                              </Link>
                            </Header>
                          </Segment>
                        </center>
                      </div>
                  </Grid.Row>
                  <div style={{width:'100%', borderWidth:'2px', borderColor:'black', padding:20, justifyContent: 'center', alignItems:'center', display: 'flex', flexDirection:'column' ,}}>
                    <div className=" box-2 btn btn-one" style={{width:'100%', textAlign:'center', marginBottom:20}}>
                    <div className="wrapper"  >
                      <a href="#"><span>Hover Me!</span></a>
                    </div>
                    </div> 
                    <div style={{width:'100%', textAlign:'center', marginBottom:20}}>
                      <Link to='search/recommended'><h2>Recommended Products</h2></Link>
                    </div> 
                    <div style={{width:'70%', textAlign:'center',display:'flex',justifyContent:'space-between'}}>
                        {this.renderRecommended()}
                    </div>
                  </div>
                  <div style={{width:'100%', borderWidth:'20px', borderColor:'black', padding:20, justifyContent: 'center', alignItems:'center', display: 'flex', flexDirection:'column' ,}}>
                    <div style={{width:'100%', textAlign:'center', marginBottom:20}}>
                    <Link to='search/mostviewed'><h2>Most Viewed Products</h2></Link>
                    </div>
                    <div style={{width:'70%', textAlign:'center',display:'flex',justifyContent:'space-between'}}>
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