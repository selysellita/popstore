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
import {titleConstruct,isJson,getDate,date,idr} from '../../supports/services'
import {ListByTransaction,listItemsByProduct,listFlashsaleItemsByProduct} from '../../supports/ListAssembler'
import {LoadCart,UpdateCheckout,CountTotalCharge,CountTotalPayment} from '../../redux/actions'
import {Redirect} from 'react-router-dom'
import { connect } from 'react-redux'


class FlashsaleRequest extends Component {
    state = { 
        flashsale:{},
        list:[],

        idproductselect:0,
        errormessage:'',

        now: new Date(),
        clock:undefined,

     }

     
    componentDidMount=()=>{
        this.getFlashsaleList()

        // TIMER
        var clock=setInterval(() => {
            this.setState({now:new Date()})
        }, 1000);
        this.setState({clock})
    }

    componentWillUnmount=()=>{
        clearTimeout(this.state.clock)
    }


    getFlashsaleList=()=>{
        Axios.get(`${APIURL}/flashsales/status?idflashsalestatus=2`)
        .then((flashsale)=>{
            console.log('flashsale list',flashsale.data)

            this.setState({flashsale:flashsale.data[0]})
            
            // INITIAL IDFLASHSALE
            this.getProductList(flashsale.data[0].idflashsale)
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

    renderTimeClock=(flashsale)=>{
        var secondstostart=(-Date.parse(this.state.now)+Date.parse(flashsale.startat))/1000
        var secondstofinish=(-Date.parse(this.state.now)+Date.parse(flashsale.finishat))/1000

        // CLOCK FOR ACTIVE FLASHSALE
        var finishinsecs=secondstofinish%60
        var finishinmins=Math.floor(secondstofinish/60)%60
        var finishinhours=Math.floor(secondstofinish/60/60)

        
        var hours=finishinhours<10&finishinhours>=0?'0'+finishinhours:finishinhours
        var mins=finishinmins<10&finishinmins>=0?'0'+finishinmins:finishinmins
        var secs=finishinsecs<10&finishinsecs>=0?'0'+finishinsecs:finishinsecs

        // CLOCK UNTIL FLASHSALE START
        var startinmins=Math.floor(secondstostart/60)
        var startinsecs=secondstostart%60

        var isstarted=secondstostart<=0
        var isfinished=secondstofinish<=0

        return (
            <div 
                style={{
                    display:'inline-flex',
                    padding:'0em 0em .5em 0',
                    color:'rgb(178,34,34)',
                    // fontSize:'18px'
                }}
            >
                {/* <div style={{color:'gray'}}>Time Remaining</div> */}
                
                <Label color='blue' as='span' style={{fontWeight:'800',margin:'0 .5em'}}>{hours.toString()}</Label>
                :
                <Label color='blue' as='span' style={{fontWeight:'800',margin:'0 .5em'}}>{mins.toString()}</Label>
                :
                <Label color='blue' as='span' style={{fontWeight:'800',margin:'0 .5em'}}>{secs.toString()}</Label>


                {/* <Icon name='clock' style={{fontSize:'21px',margin:'0 0 0 .3em'}}/> */}
            </div>
        )
    }

    renderProductListCard=()=>{
        return this.state.list.map((product,index)=>{
            return (
                <Grid.Column width={4} key={index} style={{padding:'0 1rem 1rem 0'}}>
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
                        <Header as={'h4'} style={{margin:'.5em 0'}}>{product.product_name}</Header>
                        <Header 
                            as={'h6'} 
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
                        <Header as={'h6'} color='blue' style={{fontWeight:'800',fontSize:'16px',margin:'0 0 3px'}}>{idr(product.flashsale_price)}</Header>
                        <Rating icon='star' size='mini' disabled defaultRating={product.product_rating} maxRating={5} />
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
        // console.log(this.state.flashsaleoptions)
        var secondstofinish=(-Date.parse(this.state.now)+Date.parse(this.state.flashsale.finishat))/1000
        if(secondstofinish<=0){
            return (
                <Container style={{paddingTop:'2em',width:'900px',marginBottom:'4em'}}>
                    <Message>Flashsale is finished</Message>
                </Container>
            )
        }
        return (
            <Container style={{paddingTop:'2em',width:'900px',marginBottom:'4em'}}>
                <div style={{width:'100%'}}>
                    
                    {
                        this.state.flashsale?
                        <Header as={'h2'} style={{display:'inline-block',margin:'0 1em 0 0',verticalAlign:'-4px'}}>Flashsale</Header>
                        :
                        <Header as={'h3'} style={{display:'inline-block',margin:'0 1em 0 0'}}>No Active Flashsale</Header>
                    }

                    {
                        this.state.flashsale?
                        this.renderTimeClock(this.state.flashsale)
                        : null
                    }
                    
                </div>
                
                <Segment style={{width:'100%'}}>

                    <Grid>
                        <Grid.Row style={{padding:'1rem 0 1rem 1rem'}}>
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