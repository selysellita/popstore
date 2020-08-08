import React ,{Component} from 'react'
import Axios from 'axios'
import {APIURL} from '../../supports/ApiUrl'
import {
    Grid,
    Header,
    Image,
    Form,
    Segment,
    Button,
    Message,
    Container,
    Input,
    TextArea,
    Checkbox,
    Icon,
    Divider,
    Dropdown,
    Modal
} from 'semantic-ui-react'
import Payment from './Payment'
import {Link} from 'react-router-dom'
import {titleConstruct,isJson} from '../../supports/services'
import {LoadCart,UpdateCheckout,CountTotalCharge,CountTotalPayment} from '../../redux/actions'
import {Redirect} from 'react-router-dom'
import { connect } from 'react-redux'


class Checkout extends Component {
    state = { 
        delivery: [],
     }

    componentDidMount=()=>{
        // GET DELIVERY OPTIONS
        Axios.get(`${APIURL}/delivery`)
        .then((res)=>{
            console.log('delivery',res.data)
            this.setState({delivery:res.data})
        }).catch((err)=>{
            console.log(err)
        })

        // GET PAYMENT OPTIONS
        Axios.get(`${APIURL}/payment`)
        .then((res)=>{
            // console.log(res.data)
            this.setState({paymentlist:res.data})
        }).catch((err)=>{
            console.log(err)
        })
    }

    

    renderDeliveryList=(index)=>{
        const list=this.state.delivery.map((del,index)=>{
            return {
                key: index,
                text: del.delivery_method,
                value: del.iddelivery,
                // image: 
            }
        })
        return (
            <Dropdown
                placeholder='Select Method'
                selection
                options={list}
                onChange={(e,{value})=>{
                    // console.log(value)
                    // UPDATE CHECKOUT
                    var checkout=this.props.Cart.checkout

                    checkout[index].iddelivery=value

                    // COUNT DELIVERY COST PER SELLER
                    for(var del of this.state.delivery){
                        if(del.iddelivery==value){
                            console.log('cost ',del.delivery_cost)
                            checkout[index].seller_delivery_cost=Math.ceil(checkout[index].totalweight/del.per_weight)*del.delivery_cost
                        }
                    }
                    this.props.UpdateCheckout(checkout)
                }}
            />
        )
    }    

    renderPaymentList=()=>{
        const list=this.state.paymentlist.map((val,index)=>{
            return {
                key: index,
                text: val.payment_method,
                value: val.payment_method,
                // image: 
            }
        })
        return (
            <Dropdown
                // button
                // basic
                placeholder='Select Method'
                selection
                options={list}
                onChange={(e,{value})=>{this.setState({paymentselect:value})}}
            />
        )
    }

    renderItemsSelected=()=>{


        return this.props.Cart.checkout.map((seller,index)=>{

            // const listItems=()

            return (
                <Segment key={index} style={{width:'100%',paddingBottom:'2rem'}}>
                    <Grid>
                        <Grid.Row style={{paddingBottom:'0'}}>
                            <Grid.Column>
                                <Header as={'h3'}>{titleConstruct(seller.namatoko)}</Header>
                            </Grid.Column>
                        </Grid.Row>

                        <Divider/>

                        <Grid.Row>
                            <Grid.Column width={9}>
                                <Grid>
                                    {
                                        seller.itemlist.map((item,i)=>{
                                            const typeArr=isJson(item.type)
                                            return (
                                                <Grid.Row key={i}>
                                                    
                                                    <Grid.Column width={7}>
                                                        {/* <Image fluid src='https://react.semantic-ui.com/images/wireframe/image.png'/> */}
                                                        <div
                                                            style={{
                                                                paddingTop:'80%',
                                                                backgroundImage:`url(${APIURL+isJson(item.imagecover)[0]})`,
                                                                backgroundSize:'contain',
                                                                backgroundRepeat:'no-repeat',
                                                                backgroundPosition:'center',
                                                                position:'relative'
                                                            }}
                                                            // as={Link}
                                                            // to={`/product/${item.idproduct}`}
                                                        >
                                                            <Link 
                                                                to={`/product/${item.idproduct}`}
                                                                style={{
                                                                    // border:'1px solid red',
                                                                    position:'absolute',
                                                                    top:'0',
                                                                    left:'0',
                                                                    width:'100%',
                                                                    height:'100%',
                                                                    backgroundColor:item.isselected?'':'rgba(255,255,255,.2)'
                                                                }}
                                                            />
                                                        </div>
                                                    </Grid.Column>
                                                    <Grid.Column width={9} style={{display:'flex',flexDirection:'column'}}>
                                                        <Header as={'h4'} style={{marginBottom:'0em',flexBasis:'1em',opacity:item.isselected?'1':'.8'}}>{item.product_name}</Header>
                                                        <p style={{margin:'0 0 .5em',fontSize:'12px',flexBasis:'.8em',opacity:item.isselected?'1':'.8'}}>
                                                            {
                                                                typeArr.map((type,j)=>{
                                                                    return (
                                                                        <span key={j} style={{marginRight:'.5em'}}>
                                                                            {titleConstruct(isJson(item.variant)[j].name)+' '+titleConstruct(type)}
                                                                        </span>
                                                                    )
                                                                })
                                                            }
                                                            {/* <span style={{display:'inline-block'}}></span> */}
                                                        </p>
                                                        <Header 
                                                            as={'h5'} 
                                                            style={{
                                                                margin:'0 0 0em',
                                                                flexBasis:'1em',
                                                                opacity:item.isselected?'1':'.8'
                                                            }}
                                                        >
                                                            Rp {item.price},00
                                                        </Header>
                                                        <p style={{margin:'0 0 .5em',flexBasis:'1em',fontSize:'13px',opacity:'.7'}}>{item.weight} gram</p>
                                                        <p style={{margin:'0 0 .5em',flexBasis:'1em'}}>qty: {item.qty}</p>

                                                        
                                                    </Grid.Column>
                                                    
                                                </Grid.Row>
                                            )
                                        })
                                    }

                                </Grid>
                            </Grid.Column>

                            <Grid.Column width={7} style={{}}>
                                <Header as={'h4'}>
                                    Delivery Method
                                </Header>
                                {this.renderDeliveryList(index)}
                                <div style={{marginTop:'.5em'}}>
                                    <span>
                                        total weight
                                    </span>
                                    <span style={{float:'right'}}>
                                        {seller.totalweight} g
                                    </span>
                                </div>
                                {
                                    seller.seller_delivery_cost?
                                    <div style={{marginTop:'.5em'}}>
                                        <span>
                                            delivery cost
                                        </span>
                                        <span style={{float:'right'}}>
                                            Rp {seller.seller_delivery_cost},00
                                        </span>
                                    </div>
                                    : null

                                }
                            </Grid.Column>


                            <Grid.Column width={16} style={{textAlign:'right'}}>
                                <Divider/>
                                SubTotal 
                                <Header 
                                    as={'span'} 
                                    color='blue'
                                    style={{display:'inline-block',width:'150px',fontSize:'15px',marginTop:'0'}}
                                >
                                    Rp {seller.seller_delivery_cost?seller.seller_items_price+seller.seller_delivery_cost:seller.seller_items_price},00
                                </Header>
                            </Grid.Column>
                        </Grid.Row>

                        
                    </Grid>
                </Segment>
            )
        })

    }
    
    render() { 
        // console.log(this.state.deliveryselect)
        return ( 

            <Container style={{paddingTop:'2em',width:'900px',marginBottom:'4em'}}>

                <Grid>
                    <Grid.Row>
                        <Grid.Column width={11}>
                            <Segment style={{width:'100%'}}>
                                Checkout
                            </Segment>

                            <Segment style={{width:'100%'}}>
                                <Grid>
                                    <Grid.Row>
                                        <Grid.Column width={16}>
                                            <Header as={'h4'}>
                                                Address
                                            </Header>
                                            <p style={{margin:'0'}}>{this.props.User.address}</p>
                                        </Grid.Column>
                                    </Grid.Row>


                                </Grid>

                            </Segment>

                            <Message>
                                Pick Delivery Option
                            </Message>

                            {this.renderItemsSelected()}

                        </Grid.Column>


                        <Grid.Column width={5}>
                            <Segment style={{width:'100%',}}>
                                <div style={{margin:'0 0 .5em'}}>
                                    <Header as={'h5'} style={style.checkoutTitle}>Quantity</Header>
                                    <Header as={'h5'} style={style.checkoutValue}>{this.props.Cart.totalqty}</Header>
                                </div>
                                <div style={{margin:'0 0 1em'}}>
                                    <Header as={'h5'} style={style.checkoutTitle}>Total Price</Header>
                                    <Header as={'h5'} style={style.checkoutValue}>Rp {this.props.Cart.totalprice},00</Header>
                                </div>
                                <div style={{margin:'0 0 1em'}}>
                                    <Header as={'h5'} style={style.checkoutTitle}>Total Delivery Cost</Header>
                                    <Header as={'h5'} style={style.checkoutValue}>{this.props.Cart.totaldeliverycost?`Rp ${this.props.Cart.totaldeliverycost},00`:'-'}</Header>
                                </div>
                                    
                                <Divider/>
                                <div style={{margin:'0 0 1em'}}>
                                    <Header as={'h5'} style={{display:'inline-block',color:'gray',margin:'0',fontWeight:'300'}}>Total</Header>
                                    <Header as={'h5'} color='blue' style={{display:'inline-block',float:'right',margin:'0'}}>{this.props.Cart.totalworth?`Rp ${this.props.Cart.totalworth},00`:'-'}</Header>
                                </div>
                                <div style={{textAlign:'right'}}>

                                    <Payment
                                        trigger={
                                            <Button
                                                primary
                                                style={{margin:'auto',display:'inline-block',width:'100%'}}
                                                // as={Link}
                                                // to='/checkout'
                                                // onClick={this.onClickPayment}
                                                // onClick={()=>{
                                                //     this.setState({ispayment:!this.state.ispayment})
                                                // }}
                                                disabled={this.props.Cart.ischeckout?false:true}
                                                onClick={()=>{
                                                    this.props.CountTotalCharge()
                                                    console.log(this.props.Cart)
                                                    this.props.CountTotalPayment()
                                                }}
                                            >
                                                Payment
                                            </Button>
                                        }
                                    />

                                </div>
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>



            </Container>


        );
    }
}

const style={
    checkoutTitle:{
        display:'inline-block',color:'gray',margin:'0',fontWeight:'100',fontSize:'13px'
    },
    checkoutValue:{
        display:'inline-block',float:'right',margin:'0',fontWeight:'100',fontSize:'13px'
    }
}

const MapstatetoProps=(state)=>{
    return {
        User: state.Auth,
        Cart: state.Cart
    }
}

 
export default connect(MapstatetoProps,{LoadCart,UpdateCheckout,CountTotalCharge,CountTotalPayment}) (Checkout);