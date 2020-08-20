import React ,{Component,useState} from 'react'
import Axios from 'axios'
import {APIURL} from '../../supports/ApiUrl'
import {
    Grid,
    Header,
    Segment,
    Container,
    Rating
} from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import {isJson,getDate,idr} from '../../supports/services'
import {listFlashsaleItemsByProduct} from '../../supports/ListAssembler'
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
        Axios.get(`${APIURL}/flashsales/status?idflashsalestatus=2`)
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
        Axios.get(`${APIURL}/flashsales/products/approved/${idflashsale}`)
        .then((res)=>{
            console.log('flashsale item list',res.data)
            var ProductList=listFlashsaleItemsByProduct(res.data)
            console.log('flashsale product list',ProductList)
            this.setState({list:ProductList})

            // ADMIN UPDATE PRODUCT STATUS ISFLASHSALE
            ProductList.forEach((product,index)=>{
                Axios.put(`${APIURL}/products/${product.idproduct}`,{isflashsale:1})
                .then((updated)=>{

                    if(ProductList.length-1==index){
                        console.log('all product is in flashsale')
                    }
                }).catch((err)=>{
                    console.log(err)
                })
            })
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

    renderProductListCard=()=>{
        return this.state.list.map((product,index)=>{
            return (
                <Grid.Column width={4} key={index} style={{marginBottom:'1rem'}}>
                    <Segment style={{padding:'.5em',height:'100%'}}>
                        {/* <Grid>
                            <Grid.Row>

                            </Grid.Row>
                        </Grid> */}
                        <div
                            style={{
                                width:'100%',
                                paddingTop:'100%',
                                backgroundImage:`url(${APIURL+isJson(product.imagecover)[0]})`,
                                backgroundSize:'contain',
                                backgroundRepeat:'no-repeat',
                                backgroundPosition:'center',
                                marginBottom:'.5em'
                            }}
                        />
                        <Header as={'h4'}>{product.product_name}</Header>
                        <Header 
                            as={'h5'} 
                            style={{
                                fontWeight:'100',
                                fontSize:'16px',
                                margin:'0',
                                position:'relative',
                                display:'inline-block',
                                color:'gray'
                            }}
                        >
                            {idr(product.productprice)}
                            <div
                                style={{
                                    width:'100%',
                                    height:'1.5px',
                                    backgroundColor:'gray',
                                    position:'absolute',
                                    top:'50%',
                                }}
                            ></div>
                        </Header>
                        <Header as={'h5'} color='blue' style={{fontWeight:'800',fontSize:'16px',margin:'0 0 3px'}}>{idr(product.flashsale_price)}</Header>
                        <Rating icon='star' disabled defaultRating={product.product_rating} maxRating={5} />
                        ({product.product_rating_count?product.product_rating_count:'no rating'})
                        
                        <Link 
                            to={`/product/${product.idproduct}`}
                            style={{
                                width:'100%',
                                height:'100%',
                                position:'absolute',
                                top:'0',
                                left:'0'
                            }}
                        />
                    </Segment>
                </Grid.Column>
            )
        })
    }

    render() {
        return (
            <Container style={{paddingTop:'2em',width:'900px',marginBottom:'4em'}}>
                <Segment style={{width:'100%'}}>
                    {
                        this.state.flashsaleoptions.length?
                        this.state.flashsaleoptions.map((val,index)=>{
                            return (
                                <Header as={'h3'} key={index}>Flashsale ID {val.value}</Header>
                            )
                        })
                        : <Header as={'h3'}>No Active Flashsale</Header>
                    }
                    {/* <Dropdown 
                        placeholder='Pick A Start Time' 
                        search 
                        selection 
                        options={this.state.flashsaleoptions}
                        value={this.state.idflashsale}
                        onChange={(e,{value})=>{
                            this.setState({idflashsale:value})
                            this.getProductList(value)
                        }}
                    /> */}
                </Segment>
                
                <Segment style={{width:'100%'}}>

                    <Grid>
                        <Grid.Row>
                            {this.renderProductListCard()}
                        </Grid.Row>
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