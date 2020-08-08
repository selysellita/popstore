import React ,{Component,useState} from 'react'
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
    Modal,
    Dropdown,
    Tab,
    Menu,
    Label,
    Rating
} from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import {titleConstruct,isJson,getDate,date} from '../../supports/services'
import {ListByTransaction,listItemsByProduct,listFlashsaleItemsByProduct} from '../../supports/ListAssembler'
import {LoadCart,UpdateCheckout,CountTotalCharge,CountTotalPayment} from '../../redux/actions'
import {Redirect} from 'react-router-dom'
import { connect } from 'react-redux'


class FlashsaleRequest extends Component {
    state = { 
        flashsaleoptions:[],
        list:[],
        idflashsale:'',

        idproductselect:0,
        errormessage:''

     }

     
    componentDidMount=()=>{
        this.getFlashsaleList()
    }

    getFlashsaleList=()=>{
        Axios.get(`${APIURL}/flashsales/status?idflashsalestatus=1`)
        .then((flashsale)=>{
            console.log('flashsale list',flashsale.data)
            var options = flashsale.data.reverse().map((val,index)=>{
                return {
                    key: index,
                    text: `Start at ${getDate(val.startat)}`,
                    value: val.idflashsale
                }
            })
            this.setState({flashsaleoptions:options,idflashsale:options[0].value})
            // INITIAL IDFLASHSALE
            this.getProductList(options[0].value)
        }).catch((err)=>{
            console.log(err)
        })
    }

    getProductList=(idflashsale)=>{
        Axios.get(`${APIURL}/flashsales/products/${idflashsale}`)
        .then((res)=>{
            console.log('flashsale item list',res.data)
            var ProductList=listFlashsaleItemsByProduct(res.data)
            console.log('flashsale product list',ProductList)
            this.setState({list:ProductList})
        }).catch((err)=>{
            console.log(err)
        })
    }

    onApprove=(idflashsaleproduct)=>{
        var update={
            isapproved:1
        }
        Axios.put(`${APIURL}/flashsales/product/${idflashsaleproduct}`,update)
        .then((updated)=>{
            console.log('product is approved')
            this.getProductList(this.state.idflashsale)
        }).catch((err)=>{
            console.log(err)
        })
    }

    renderProductList=()=>{
        return this.state.list.map((product,index)=>{
            return (
                <Grid.Row key={index} style={{padding:'.5em 0'}}>
                    <Grid.Column width={3}>
                        <div
                            style={{
                                width:'100%',
                                paddingTop:'60%',
                                backgroundImage:`url(${APIURL+isJson(product.imagecover)[0]})`,
                                backgroundSize:'contain',
                                backgroundRepeat:'no-repeat',
                                backgroundPosition:'center',
                                marginBottom:'.5em'
                            }}
                        />
                        <Link 
                            to={`/product/${product.idproduct}`}
                            style={{
                                position:'absolute',
                                top:'0',
                                left:'0',
                                width:'100%',
                                height:'100%',
                            }}
                        />
                    </Grid.Column>
                    <Grid.Column width={4}>
                        <Header as={'h4'} style={{marginBottom:'.3em'}}>{product.product_name}</Header>
                        <Header as={'h4'} style={{fontWeight:'100',fontSize:'16px',margin:'0'}}>Rp{product.productprice},00</Header>
                        <Rating icon='star' size='small' disabled defaultRating={product.product_rating} maxRating={5} />
                        ({product.product_rating_count?product.product_rating_count:'no rating'})
                        <div>
                            sold({product.sold?product.sold:'0'})
                        </div>
                    </Grid.Column>

                    <Grid.Column width={3}>
                        <Header as={'h4'} style={{fontWeight:'100',fontSize:'16px',margin:'0'}}>Rp{product.flashsale_price},00</Header>
                        <Header as={'h4'} style={{fontWeight:'900',fontSize:'12px',margin:'0'}} color='blue'>
                            <Icon name='long arrow alternate down' style={{fontSize:'12px',margin:'0',verticalAlign:'-1px'}}/>
                            -Rp{-product.flashsale_price+product.productprice},00</Header>
                    </Grid.Column>

                    <Grid.Column width={4}>
                        {
                            product.isapproved?
                            <Header 
                                as={'h5'} 
                                color='blue'
                                style={{fontWeight:'100'}}
                            >
                                <Icon name='check'/>
                                approved
                            </Header>
                            : product.idproduct==this.state.idproductselect?
                            <Button
                                basic
                                color='blue'
                                onClick={()=>{
                                    this.onApprove(product.idflashsaleproduct)
                                }}
                            >
                                Confirm
                            </Button>
                            :
                            <Button
                                basic
                                color='blue'
                                onClick={()=>{
                                    this.setState({idproductselect:product.idproduct})
                                }}
                            >
                                Approve
                            </Button>
                        }

                        {
                            product.idproduct==this.state.idproductadd&&this.state.errormessage?
                            <div style={{color:'red',marginTop:'.5em'}}>{this.state.errormessage}</div>
                            : null
                        }
                    </Grid.Column>

                </Grid.Row>
            )
        })
    }

    render() {
        return (
            <Container style={{paddingTop:'2em',width:'900px',marginBottom:'4em'}}>
                <Segment style={{width:'100%'}}>
                    <Dropdown 
                        placeholder='Pick A Start Time' 
                        search 
                        selection 
                        options={this.state.flashsaleoptions}
                        value={this.state.idflashsale}
                        onChange={(e,{value})=>{
                            this.setState({idflashsale:value})
                            this.getProductList(value)
                        }}
                    />
                </Segment>
                
                <Segment style={{width:'100%'}}>
                    <Message>Choose Which Products You Wish To Appear At The Flashsale</Message>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={3}>
                                <Header as={'h3'} style={{marginBottom:'1em'}}>Product List</Header>
                            </Grid.Column>
                            <Grid.Column width={4}>
                                <Header as={'h3'} style={{marginBottom:'1em'}}>Details</Header>
                            </Grid.Column>
                            <Grid.Column width={3}>
                                <Header as={'h3'} style={{marginBottom:'1em'}}>Flashsale Price</Header>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    <Grid>
                        {this.renderProductList()}
                    </Grid>
                </Segment>
                
                
            </Container>
        )
    }
}

const MapstatetoProps=(state)=>{
    return {
        User: state.Auth,
    }
}
 
export default connect(MapstatetoProps) (FlashsaleRequest);