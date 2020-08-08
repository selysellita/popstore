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
import {ListByTransaction,listItemsByProduct} from '../../supports/ListAssembler'
import {LoadCart,UpdateCheckout,CountTotalCharge,CountTotalPayment} from '../../redux/actions'
import {Redirect} from 'react-router-dom'
import { connect } from 'react-redux'


class FlashsalesData extends Component {
    state = { 
        flashsaleoptions:[],
        idflashsale:'',

        idseller:this.props.Seller.idseller,
        productlist:[],

        productsubmitted:[],

        idproductadd:0,
        flashsaleprice:'',

        errormessage:''

     }

     
    componentDidMount=()=>{
        this.getFlashsaleList()
        this.getProductList()
    }

    componentDidUpdate=()=>{
        // console.log('didupdate')
        if(this.state.idseller!==this.props.Seller.idseller){
            this.getProductList()
            this.setState({idseller:this.props.Seller.idseller})
        }
    }

    getFlashsaleList=()=>{
        Axios.get(`${APIURL}/flashsales/status?idflashsalestatus=1`)
        .then((flashsale)=>{
            // console.log(flashsale)
            var options = flashsale.data.map((val,index)=>{
                return {
                    key: index,
                    text: `Start at ${getDate(val.startat)}`,
                    value: val.idflashsale
                }
            })
            this.setState({flashsaleoptions:options})
        }).catch((err)=>{
            console.log(err)
        })
    }

    getProductList=()=>{
        // console.log('idseller',this.props.Seller.idseller)
        Axios.get(`${APIURL}/products/seller?idseller=${this.props.Seller.idseller}`)
        .then((res)=>{
            // console.log('data items list',res.data)
            var ProductList=listItemsByProduct(res.data)
            console.log('product list',ProductList)

            this.setState({productlist:ProductList})

        }).catch((err)=>{
            console.log(err)
        })
    }

    getProductSubmitted=(idflashsale)=>{
        Axios.get(`${APIURL}/flashsales/products?idflashsale=${idflashsale}&idseller=${this.state.idseller}`)
        .then((res)=>{
            console.log('product already on flashsale',res.data)
            this.setState({productsubmitted:res.data})
        }).catch((err)=>{
            console.log(err)
        })
    }

    submitProduct=()=>{
        console.log('submit product')

        if(!this.state.idflashsale){
            this.setState({errormessage:'Pick Flashsale Start Time'})
        }else if(!this.state.flashsaleprice){
            this.setState({errormessage:'State Product Flashsale Price'})
        }else{
            var product={
                idproduct:this.state.idproductadd,
                flashsale_price:this.state.flashsaleprice
            }
            console.log('product submitted',product)
            Axios.post(`${APIURL}/flashsales/${this.state.idflashsale}`,product)
            .then((added)=>{
                console.log('product added to flashsale form')
                this.getProductSubmitted(this.state.idflashsale)
                this.setState({idproductadd:0})
            }).catch((err)=>{
                console.log(err)
            })
        }
        
    }


    renderProductList=()=>{
        return this.state.productlist.map((product,index)=>{
            // CHECK IF PRODUCT IS ALREADY IN FLASHSALE
            var issubmitted=false
            this.state.productsubmitted.forEach((flashsaleproduct,index)=>{
                if(flashsaleproduct.idproduct==product.idproduct){
                    issubmitted=true
                }
            })
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
                    <Grid.Column width={3}>
                        <Header as={'h4'}>{product.product_name}</Header>
                        <Header as={'h4'} style={{fontWeight:'100',fontSize:'16px',margin:'0'}}>Rp{product.productprice},00</Header>
                    </Grid.Column>

                    {
                        this.state.idproductadd==product.idproduct?
                        <Grid.Column width={6}>
                            <Header as={'h5'}>State Your Product Flashsale Price</Header>
                            <Input
                                placeholder='Flashsale Price'
                                value={this.state.flashsaleprice}
                                onChange={(e)=>{
                                    this.setState({flashsaleprice:e.target.value})
                                }}
                            />
                        </Grid.Column>
                        :
                        <>
                            <Grid.Column width={4}>
                                <Rating icon='star' disabled defaultRating={product.product_rating} maxRating={5} />
                                ({product.product_rating_count?product.product_rating_count:'no rating'})
                            </Grid.Column>
                            <Grid.Column width={2}>
                                sold({product.sold?product.sold:'0'})
                            </Grid.Column>

                        </>
                    }

                    <Grid.Column width={4}>
                        {
                            issubmitted?
                            <div>
                                Product is already submitted in this flashsale <Icon name='check'/>
                            </div>
                            :this.state.idproductadd==product.idproduct?
                                <Button
                                    basic
                                    color='blue'
                                    onClick={()=>{
                                        this.submitProduct()
                                    }}
                                >
                                    Submit
                                </Button>
                            :
                                <Button
                                    basic
                                    color='blue'
                                    onClick={()=>{
                                        this.setState({idproductadd:product.idproduct,flashsaleprice:'',errormessage:''})
                                    }}
                                >
                                    Add To Flashsale
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
                        // value={this.state.idflashsale}
                        onChange={(e,{value})=>{
                            this.setState({idflashsale:value})
                            // GET SELLER PRODUCT ALREADY LISTED IN THE FLASHSALE
                            this.getProductSubmitted(value)

                        }}
                    />
                </Segment>
                
                <Segment style={{width:'100%'}}>
                    <Message>Select Your Products</Message>
                    <Header as={'h3'} style={{marginBottom:'1em'}}>Product List</Header>
                    <Grid>
                        {/* <Grid.Row style={{padding:'.5em 0'}}>
                            <Grid.Column width={3}>
                                
                            </Grid.Column>
                            <Grid.Column width={3}>
                                <Header as={'h3'}>Product Name</Header>
                            </Grid.Column>
                            <Grid.Column width={4}>
                                <Header as={'h3'}>Rating</Header>
                            </Grid.Column>
                            <Grid.Column width={2}>
                                <Header as={'h3'}>Sold</Header>
                            </Grid.Column>
                            <Grid.Column width={1}>
                                <Header as={'h3'}>Select</Header>
                            </Grid.Column>
                        </Grid.Row> */}
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
        Seller: state.Seller,
    }
}
 
export default connect(MapstatetoProps) (FlashsalesData);