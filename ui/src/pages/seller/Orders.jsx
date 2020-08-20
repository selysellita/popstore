import React ,{Component} from 'react'
import Axios from 'axios'
import {APIURL} from '../../supports/ApiUrl'
import {
    Grid,
    Header,
    Segment,
    Button,
    Message,
    Container,
    Input,
    Icon,
    Divider
} from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import {titleConstruct,isJson,getDate} from '../../supports/services'
import {LoadOrders} from '../../redux/actions'
import { connect } from 'react-redux'



class Orders extends Component {
    state = { 
        orderid:0,
        trackingcode:'',

        cancelid:0,
        reason:'',

        errormessage:'',
        loading:false
     }

    componentDidMount=()=>{
        
    }

    onDrop=(idtransactionseller)=>{
        this.setState({loading:true})
        if(!this.state.trackingcode){
            this.setState({errormessage:'Tracking Code is Empty'})
        }else{
            var update={
                idpackagestatus:3,
                courier_code:this.state.trackingcode
            }
            Axios.put(`${APIURL}/transactionstores/${idtransactionseller}`,update)
            .then((updated)=>{
                console.log('order id ',idtransactionseller,' is updated')
                this.setState({loading:false})
                this.props.LoadOrders(this.props.User.iduser)
            }).catch((err)=>{
                console.log(err)
            })
        }
    }

    onCancel=(idtransactionseller)=>{
        if(!this.state.reason){
            this.setState({errormessage:'State Your Reason'})
        }else{
            var update={
                idpackagestatus:6,
                seller_cancel_reason:this.state.reason
            }
            Axios.put(`${APIURL}/transactionstores/${idtransactionseller}`,update)
            .then((updated)=>{
                console.log('order id ',idtransactionseller,' is cancelled')
                // this.props.LoadOrders() // DONT FORGET TO COMPLETE THIS
            }).catch((err)=>{
                console.log(err)
            })
        }
    }


    renderByItem=(itemlist)=>{
        return itemlist.map((item,index)=>{
            const typeArr=isJson(item.type)
            return (
                <Grid key={index}>
                    <Grid.Row>
                        <Grid.Column width={6}>
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
                        <Grid.Column width={8} style={{display:'flex',flexDirection:'column'}}>
                            <Header as={'h4'} style={{marginBottom:'0em',flexBasis:'1em'}}>
                                {item.product_name}
                                <span style={{fontSize:'14px',fontWeight:'100',marginLeft:'.5em'}}>(id {item.iditem})</span>
                            </Header>
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
                            {/* <Header 
                                as={'h5'} 
                                style={{
                                    margin:'0 0 0em',
                                    flexBasis:'1em',
                                    opacity:item.isselected?'1':'.8'
                                }}
                            >
                                Rp {item.price},00
                            </Header> */}
                            <p style={{margin:'0 0 .5em',flexBasis:'1em',fontSize:'13px',opacity:'.7'}}>{item.weight} gram</p>
                            <Header as={'h5'} style={{margin:'0 0 .5em',flexBasis:'1em'}}>qty: {item.qty}</Header>

                            
                        </Grid.Column>
                    </Grid.Row>
                </Grid>


            )
        })
    }
    

    renderByTransaction=()=>{

        if(!this.props.Store.list.length){
            return (
                <div style={{textAlign:'center'}}>There are no orders</div>
            )
        }

        return this.props.Store.list.map((transaction,index)=>{

            return (
                <Segment key={index}>
                    <Grid>
                        <Grid.Row style={{paddingBottom:'0'}}>
                            <Grid.Column width={5}>
                                {getDate(transaction.package_updateat)}
                            </Grid.Column>
                            <Grid.Column width={5}>
                            
                            </Grid.Column>
                            <Grid.Column width={6} style={{textAlign:'right'}}>
                                <div style={{display:'inline-block',textAlign:'left'}}>
                                    Status
                                    <Header as={'div'} color='blue'>
                                        {titleConstruct(transaction.status_name)}
                                    </Header>
                                </div>
                            </Grid.Column>
                            <Grid.Column width={16}>
                                <Divider/>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={16} style={{marginBottom:'1em'}}>
                                <Header as={'h4'} style={{display:'flex'}}><Icon name='user' style={{fontSize:'18px'}}/>{titleConstruct(transaction.username)}</Header>
                            </Grid.Column>
                            <Grid.Column width={7}>
                                {this.renderByItem(transaction.itemlist)}
                            </Grid.Column>
                            <Grid.Column width={3}>

                            </Grid.Column>
                            <Grid.Column width={5}>
                                <Header as={'h4'}>
                                    Delivery
                                </Header>
                                <div style={{marginTop:'.5em'}}>
                                    <span>
                                        Delivery Method
                                    </span>
                                    <Header as={'h3'} color='blue' style={{display:'inline-block',float:'right',fontWeight:'800',margin:'0'}}>
                                        {transaction.delivery_method}
                                    </Header>
                                </div>
                                <div style={{marginTop:'.5em',fontSize:'12px',color:'gray'}}>
                                    <span>
                                        total weight
                                    </span>
                                    <span style={{float:'right',display:'inline-block'}}>
                                        {transaction.totalweight} g
                                    </span>
                                </div>
                                {
                                    transaction.seller_delivery_cost?
                                    <div style={{marginTop:'.0em',fontSize:'12px',color:'gray'}}>
                                        <span>
                                            delivery cost
                                        </span>
                                        <span style={{float:'right'}}>
                                            Rp {transaction.seller_delivery_cost},00
                                        </span>
                                    </div>
                                    : null

                                }
                                <div style={{marginTop:'.0em',fontSize:'12px',color:'gray'}}>
                                    <span>
                                        To
                                    </span>
                                    <span style={{float:'right'}}>
                                        {titleConstruct(transaction.username)}
                                    </span>
                                </div>
                                <Divider/>
                                {
                                    transaction.idtransaction===this.state.orderid?
                                    <>
                                    <Input
                                        placeholder='Tracking Code'
                                        style={{width:'100%',marginBottom:'.5em'}}
                                        value={this.state.trackingcode}
                                        onChange={(e)=>{this.setState({trackingcode:e.target.value})}}
                                    />
                                    <Button 
                                        primary
                                        style={{width:'100%',marginBottom:'.5em'}}
                                        onClick={()=>{this.onDrop(transaction.idtransactionseller)}}
                                        loading={this.state.loading}
                                        disabled={this.state.loading}
                                    >
                                        {/* <Icon name='barcode'/> */}
                                        Confirm
                                    </Button>
                                    </>
                                    :
                                    <Button 
                                        primary
                                        style={{width:'100%',marginBottom:'.5em'}}
                                        onClick={()=>{this.setState({orderid:transaction.idtransaction,trackingcode:'',cancelid:0,errormessage:''})}}
                                    >
                                        Input Courier Code
                                    </Button>
                                }
                                {
                                    transaction.idtransaction===this.state.cancelid?
                                    <>
                                    <Input
                                        placeholder='Reason Of Cancellation'
                                        style={{width:'100%',marginBottom:'.5em'}}
                                        value={this.state.reason}
                                        onChange={(e)=>{this.setState({reason:e.target.value})}}
                                    />
                                    <Button 
                                        color='red'
                                        style={{width:'100%'}}
                                        onClick={()=>{this.onCancel(transaction.idtransactionseller)}}
                                    >
                                        {/* <Icon name='barcode'/> */}
                                        Confirm
                                    </Button>
                                    </>
                                    :
                                    <Button 
                                        // primary
                                        style={{width:'100%'}}
                                        onClick={()=>{this.setState({cancelid:transaction.idtransaction,reason:'',orderid:0,errormessage:''})}}
                                    >
                                        Cancel Order
                                    </Button>
                                }
                                {
                                    this.state.errormessage&&transaction.idtransaction===this.state.orderid?
                                    <p style={{color:'red'}}>{this.state.errormessage}</p>
                                    : null
                                }
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
                <Message style={{textAlign:'center'}}>Your Orders Today</Message>
                {this.renderByTransaction()}
                
            </Container>
        );
    }
}

const MapstatetoProps=(state)=>{
    return {
        User: state.Auth,
        Store: state.Store
    }
}

 
export default connect(MapstatetoProps,{LoadOrders}) (Orders);