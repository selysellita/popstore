import React ,{Component} from 'react'
import Axios from 'axios'
import {APIURL} from '../../supports/ApiUrl'
import {
    Grid,
    Header,
    Image,
    Segment,
    Button,
    Message,
    Container,
    Divider,
    Icon,
    Modal,
} from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import {titleConstruct,isJson,getDate} from '../../supports/services'
import {ListByTransaction} from '../../supports/ListAssembler'
import {LoadCart} from '../../redux/actions'
import { connect } from 'react-redux'



class TransactionList extends Component {
    state = { 
        list:[],
        ismodal:false,
        modaltransaction:{},
        israted:false,
        timeout:'',

        now: new Date(),
        clock:undefined,
     }

     
    componentDidMount=()=>{
        this.getList()
        var clock=setInterval(() => {
            this.setState({now:new Date()})
        }, 1000);
        this.setState({clock})
    }

    componentWillUnmount=()=>{
        clearTimeout(this.state.clock)
        clearTimeout(this.state.timeout)
    }

    getList=()=>{
        // GET LIST WHERE IDORDERSTATUS=3
        Axios.get(`${APIURL}/transactiondetails/admin?idorderstatus=${[3]}`)
        .then((res)=>{
            console.log('get list delivered',res.data)

            // RECONSTRUCT LIST , BY TRANSACTION BY TRANSACTION SELLER
            // var listByTransaction=ListByTransaction(res.data).reverse()
            // console.log('transaction history',listByTransaction)
            this.setState({list:res.data.reverse()})

        }).catch((err)=>{
            console.log(err)
        })
    }

    autoCompleteOrder=(idtransactiondetail,idproduct)=>{
        // UPDATE ORDER STATUS TO COMPLETE
        Axios.put(`${APIURL}/transactiondetails/${idtransactiondetail}`,{idorderstatus:4})
        .then((updated)=>{
            console.log('order id ',idtransactiondetail,' is completed')

            // RECOUNT SOLD NUMBER
            this.countSold(idproduct)

            this.getList()


        }).catch((err)=>{
            console.log(err)
        })
    }

    // COUNT SOLD WHEN ORDERSTATUS IS COMPLETED
    countSold=(idproduct)=>{
        Axios.put(`${APIURL}/products/sold/${idproduct}`)
        .then((res)=>{
            console.log('sold number is counted')
            this.getList()
        }).catch((err)=>{
            console.log(err)
        })
    }


    renderByItem=(itemlist)=>{
        return itemlist.map((item,index)=>{
            const typeArr=isJson(item.type)
            return (
                <Grid.Column key={index} width={16}>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={4}>
                                <div
                                    style={{
                                        paddingTop:'80%',
                                        backgroundImage:`url(${APIURL+isJson(item.imagecover)[0]})`,
                                        backgroundSize:'contain',
                                        backgroundRepeat:'no-repeat',
                                        backgroundPosition:'center',
                                        position:'relative'
                                    }}
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
                                            // backgroundColor:item.isselected?'':'rgba(255,255,255,.2)'
                                        }}
                                    />
                                </div>
                            </Grid.Column>
                            <Grid.Column width={7} style={{display:'flex',flexDirection:'column'}}>
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
                                    Rp {item.checkout_price},00
                                </Header>
                                <p style={{margin:'0 0 .5em',flexBasis:'1em',fontSize:'13px',opacity:'.7'}}>{item.weight} gram</p>
                                <p style={{margin:'0 0 .5em',flexBasis:'1em'}}>qty: {item.qty}</p>

                                
                            </Grid.Column>
                            <Grid.Column width={5}>
                                {/* <Header as={'h4'} style={{marginBottom:'0em',flexBasis:'1em'}}>{item.weight} gram</Header> */}
                                <p style={{margin:'0 0 .5em',fontSize:'12px',flexBasis:'.8em'}}>{item.weight} gram</p>

                                <p style={{margin:'0 0 .5em',fontSize:'12px',flexBasis:'.8em'}}>qty {item.qty}</p>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Grid.Column>


            )
        })
    }

    renderByTransactionSeller=(sellerlist)=>{
        return sellerlist.map((seller,index)=>{
            return (
                <Grid.Row key={index}>
                    <Grid.Column width={16} style={{marginBottom:'1em'}}>
                        <Header as={'h3'}>{titleConstruct(seller.namatoko)}</Header>
                    </Grid.Column>

                    <Grid.Column width={11}>
                        <Grid>
                            <Grid.Row>
                                {this.renderByItem(seller.itemlist)}
                            </Grid.Row>
                        </Grid>
                    </Grid.Column>

                    <Grid.Column width={5} style={{}}>
                        <Header as={'h4'}>
                            Delivery
                        </Header>
                        <div style={{marginTop:'.5em'}}>
                            <span>
                                Delivery Method
                            </span>
                            <span style={{float:'right',fontWeight:'800'}}>
                                {seller.delivery_method}
                            </span>
                        </div>
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
                    <Grid.Column width={16}>
                        <Divider/>
                    </Grid.Column>
                </Grid.Row>
            )
        })
    }

    renderModal=(transaction)=>{
        return (
            <Modal trigger={<Button>More Details</Button>}>

                <Segment>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={5}>
                                {getDate(transaction.createat)}
                            </Grid.Column>
                            <Grid.Column width={5}>
                                Payment 
                                <Header as={'span'} style={{fontSize:'15px'}} color='blue'>
                                    <Icon name='bitcoin' size='mini' color='blue' style={{margin:'0 0 0 .5em'}}/>
                                    Popcoin
                                </Header>
                            </Grid.Column>
                            <Grid.Column width={6} style={{textAlign:'right'}}>
                                <div style={{display:'inline-block',textAlign:'left'}}>
                                    Status
                                    <Header as={'div'} color='blue'>
                                        {transaction.status_name}
                                    </Header>
                                </div>
                            </Grid.Column>
                            <Divider style={{width:'100%'}}/>
                        </Grid.Row>
                        {this.renderByTransactionSeller(transaction.sellerlist)}
                    </Grid>
                </Segment>
            </Modal>
        )
    }

    renderRating=(idtransactiondetail,rating,item)=>{
        // console.log('idtransactiondetail',idtransactiondetail)
        // console.log('rating ',rating)
        // console.log(item)
        if(rating){
            // return (
            //     <p>asdf</p>
            // )
            // console.log(rating)
            var stars=[]
            for(var i=1;i<=rating;i++){
                stars[i]=(<Icon key={i} name='star'/>)
            }

            // console.log(stars)
            return (
                <div style={{textAlign:'right'}}>
                    {stars}
                </div>
            )
        }else{
            return (
                <div style={{textAlign:'right'}}>
                    <span style={{marginRight:'.5em'}}>Rate Order </span>
                    <Icon name='star outline' style={{cursor:'pointer'}} onClick={()=>{
                        this.onRating(idtransactiondetail,1,item.idproduct)
                    }}/>
                    <Icon name='star outline' style={{cursor:'pointer'}} onClick={()=>{
                        this.onRating(idtransactiondetail,2,item.idproduct)
                    }}/>
                    <Icon name='star outline' style={{cursor:'pointer'}} onClick={()=>{
                        this.onRating(idtransactiondetail,3,item.idproduct)
                    }}/>
                    <Icon name='star outline' style={{cursor:'pointer'}} onClick={()=>{
                        this.onRating(idtransactiondetail,4,item.idproduct)
                    }}/>
                    <Icon name='star outline' style={{cursor:'pointer'}} onClick={()=>{
                        this.onRating(idtransactiondetail,5,item.idproduct)
                    }}/>
                </div>
            )
        }
    }


    renderByOrder=()=>{
        // console.log('itemlist',itemlist)
        return this.state.list.map((item,index)=>{
            const typeArr=isJson(item.type)
            var seconds=(-Date.parse(this.state.now)+Date.parse(item.order_updateat))/1000+(2*60*60)
            var expiredinmins=Math.floor(seconds/60)
            var expiredinsecs=seconds%60
            var isexpired=seconds<=0

            if(isexpired){
                this.autoCompleteOrder(item.idtransactiondetail,item.idproduct)
            }


            return (
                <Segment key={index}>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={16}>
                                {getDate(item.order_updateat)}
                            </Grid.Column>
                            <Grid.Column width={3}>
                                <div
                                    style={{
                                        paddingTop:'80%',
                                        backgroundImage:`url(${APIURL+isJson(item.imagecover)[0]})`,
                                        backgroundSize:'contain',
                                        backgroundRepeat:'no-repeat',
                                        backgroundPosition:'center',
                                        position:'relative'
                                    }}
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
                                            // backgroundColor:item.isselected?'':'rgba(255,255,255,.2)'
                                        }}
                                    />
                                </div>
                            </Grid.Column>
                            <Grid.Column width={4} style={{display:'flex',flexDirection:'column'}}>
                                <Header as={'h4'} style={{marginBottom:'0em',flexBasis:'1em'}}>{item.product_name}</Header>
                                <p style={{margin:'0 0 .5em',fontSize:'12px',flexBasis:'.8em'}}>
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
                                    Rp {item.checkout_price},00
                                </Header>
                                {/* <p style={{margin:'0 0 .5em',flexBasis:'1em',fontSize:'13px',opacity:'.7'}}>{item.weight} gram</p> */}
                                <p style={{margin:'0 0 .5em',flexBasis:'1em'}}>qty {item.qty}</p>

                                
                            </Grid.Column>
                            <Grid.Column width={4}>
                                <Header as={'h4'} color='blue'>
                                    {
                                        item.orderstatus_name
                                    }
                                </Header>
                            </Grid.Column>
                            <Grid.Column width={4} style={{alignItems:'flex-end'}}>

                                <p>
                                    Deadline until complete
                                </p>

                                <div style={{textAlign:'center'}}>
                                    {
                                        isexpired?
                                        <div><span style={{fontWeight:'800'}}>Transaction Is Completed</span></div>
                                        :
                                        <div style={{display:'inline-flex',padding:'0em 0em',border:'0px solid rgba(255,0,0,.5)',color:'rgb(178,34,34)',background:'rgba(255,0,0,.0)'}}>
                                            Expire in 
                                            <span style={{fontWeight:'800',marginLeft:'.5em'}}>{expiredinmins} : {expiredinsecs<10&expiredinsecs>=0?'0'+expiredinsecs:expiredinsecs}</span>
                                            <Icon name='clock' style={{fontSize:'21px',margin:'0 0 0 .3em'}}/>
                                        </div>
                                    }
                                </div>
                                

                                
                                {/* <Button
                                    onClick={()=>{
                                        Axios.put(`${APIURL}/products/rating/${item.idproduct}`)
                                        .then((res)=>{
                                            console.log('berhasil')
                                            console.log(res.data)
                                        }).catch((err)=>{
                                            console.log(err)
                                        })
                                    }}
                                    >
                                    test
                                </Button> */}
                                {/* <div style={{textAlign:'right',marginTop:'auto'}}>
                                    <Header 
                                        as={'span'} 
                                        color='blue'
                                        style={{
                                            margin:'0',
                                            fontSize:'15px',
                                            fontWeight:'600',
                                            cursor:'pointer'
                                        }} 
                                    >
                                        return</Header>
                                </div> */}
                            </Grid.Column>
                            {/* <Grid.Column width={4} style={{textAlign:'right'}}>
                                {
                                    item.idorderstatus==3?
                                    <>
                                    <Button style={{width:'100%'}}>
                                        Return
                                    </Button>
                                    <Button style={{width:'100%'}}>
                                        Complete
                                    </Button>
                                    </>
                                    : null
                                }
                            </Grid.Column> */}
                        </Grid.Row>
                    </Grid>
                </Segment>
            )
        })
    }
    

    renderBySeller=(sellerlist)=>{
        return sellerlist.map((seller,index)=>{
            return (
                <Grid.Row key={index} style={{padding:'0'}}>
                    <Grid.Column width={3} style={{marginBottom:'1em'}}>
                        <Header as={'h3'} style={{display:'inline-block'}}>{titleConstruct(seller.namatoko)}</Header>
                    </Grid.Column>
                    <Grid.Column width={4}>
                        {
                            seller.idpackagestatus===4?
                            <div style={{display:'inline-block',fontSize:'12px'}}>
                                Time of Arrival: {getDate(seller.package_updateat)}
                            </div>
                            : null
                        }
                    </Grid.Column>
                    <Grid.Column width={4}>
                        {
                            seller.idpackagestatus===4?
                            <div style={{display:'inline-block',fontSize:'12px'}}>
                                Accepted By: {titleConstruct(seller.recipient)}
                            </div>
                            : null
                        }
                    </Grid.Column>

                    <Grid.Column width={16} style={{paddingTop:'1em'}}>
                        <Grid>
                            <Grid.Row>
                                {this.renderByOrder(seller.itemlist)}
                            </Grid.Row>
                        </Grid>
                    </Grid.Column>

                    <Grid.Column width={16}>
                        <Divider/>
                    </Grid.Column>
                </Grid.Row>
            )
        })
    }


    renderByTransaction=()=>{

        return this.state.list.map((transaction,index)=>{
            return (
                <Segment key={index}>
                    <Grid>
                        <Grid.Row style={{paddingBottom:'0'}}>
                            <Grid.Column width={7}>
                                {getDate(transaction.createat)}
                            </Grid.Column>
                            <Grid.Column width={5}>
                                <span style={{display:'block'}}>Status</span>
                                <Header as={'span'} style={{fontSize:'15px'}} color='blue'>
                                    {
                                        transaction.idstatus===2?
                                        'Waiting For Payment Verification'
                                        : titleConstruct(transaction.status_name)
                                    }
                                </Header>
                            </Grid.Column>
                            <Grid.Column width={4} style={{textAlign:'right'}}>
                                <div style={{display:'inline-block',textAlign:'left'}}>
                                    <span style={{display:'block'}}>Total Payment</span>
                                    <Header as={'span'} color='blue' style={{fontSize:'15px'}}>
                                        Rp {transaction.totalpayment},00
                                    </Header>
                                </div>
                            </Grid.Column>
                            <Divider style={{width:'100%'}}/>
                        </Grid.Row>
                        {this.renderBySeller(transaction.sellerlist)}
                        <Grid.Row style={{paddingTop:'0'}}>
                            <Grid.Column>
                                {this.renderModal(transaction)}
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
            )
        })
    }

    
    render() { 
        return ( 
            <Container style={{paddingTop:'2em',width:'900px',marginBottom:'4em'}}>

                {this.renderByOrder()}

                <Modal open={this.state.ismodal}>
                    <Modal.Header>Select a Photo</Modal.Header>
                    <Modal.Content image>
                    <Image wrapped size='medium' src='https://react.semantic-ui.com/images/avatar/large/rachel.png' />
                    <Modal.Description>
                        <Header>Default Profile Image</Header>
                        <p>
                        We've found the following gravatar image associated with your e-mail
                        address.
                        </p>
                        <p>Is it okay to use this photo?</p>
                    </Modal.Description>
                    </Modal.Content>
                </Modal>

                {
                    this.state.israted?
                    <Message 
                        style={{
                            position:'fixed',
                            top:'50%',
                            left:'50%',
                            transform: 'translate(-50%,-50%)',
                            // color:'green'
                        }}
                        color='blue'
                    >
                        Thank you for your rating<Icon name='check'/>
                    </Message>
                    : null
                }
                
            </Container>
        );
    }
}

const MapstatetoProps=(state)=>{
    return {
        User: state.Auth,
        Cart: state.Cart,
        Payment: state.Payment
    }
}

 
export default connect(MapstatetoProps,{LoadCart}) (TransactionList);