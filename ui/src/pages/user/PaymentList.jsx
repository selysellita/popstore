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
    Divider,
    Label,
    Modal
} from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import {titleConstruct,isJson, idr} from '../../supports/services'
import {LoadPayment,LoadCart} from '../../redux/actions'
import { connect } from 'react-redux'



class PaymentList extends Component {
    state = { 
        now:new Date(),
        clock:undefined,
        uploadid:0,
        filepaymentproof:undefined,
        errormessage:'',
        iddelete:0,
        isuploaded:false,
        timeout:'',

     }

    componentDidMount=()=>{
        
        var clock=setInterval(() => {
            this.setState({now:new Date()})
        }, 1000);
        this.setState({clock})
    }

    componentWillUnmount=()=>{
        clearTimeout(this.state.clock)
        clearTimeout(this.state.timeout)
    }

    onUpload=()=>{
        console.log(this.state.filepaymentproof)
        if(!this.state.filepaymentproof){
            this.setState({errormessage:'Please select an image file'})
        }else{
            var formdata= new FormData()

            var Headers={
                header:{
                    'Content-Type': 'multipart/form-data',
                }
            }

            formdata.append('image',this.state.filepaymentproof)


            Axios.post(`${APIURL}/transactions/paymentproof/${this.state.uploadid}`,formdata,Headers)
            .then((uploaded)=>{
                console.log('payment proof uploaded')
                this.props.LoadPayment(this.props.User.iduser)

                var delay = setTimeout(()=>{
                    this.setState({isuploaded:false})
                },4000)
                this.setState({isuploaded:true,timeout:delay})

            }).catch((err)=>{
                console.log(err)
            })

        }
    }

    CancelTransaction=(idtransaction,transaction)=>{
        Axios.put(`${APIURL}/transactions/${idtransaction}`,{idstatus:5})
        .then((cancelled)=>{
            console.log('transaction '+idtransaction+' cancelled')
            
            this.props.LoadPayment(this.props.User.iduser)
            

        }).catch((err)=>{
            console.log(err)
        })

        // RESTOCK ITEMS
        Axios.put(`${APIURL}/items/transaction/cancel?idtransaction=${idtransaction}`)
        .then((restock)=>{
            console.log('all items restocked')
        }).catch((err)=>{
            console.log(err)
        })

        // RE-ADD ITEMS BACK TO CART
        // DONT FORGET TO MAKE SURE NOT TO ADD TO DELETED ORDER
        console.log('transaction',transaction)
        transaction.sellerlist.forEach((seller,i)=>{
            seller.itemlist.forEach((item,j)=>{
                // 
                var td={
                    iduser: this.props.User.iduser,
                    iditem: item.iditem,
                    qty: item.qty,
                    message: item.message,
                }
                Axios.post(`${APIURL}/transactiondetails`,td)
                .then((res)=>{
                    // last cycle
                    if(transaction.sellerlist.length-1===i&&seller.itemlist.length-1===j){
                        // ALL ITEMS ARE BACK TO CART
                        this.props.LoadCart(this.props.User.iduser)
                    }
                }).catch((err)=>{
                    console.log(err)
                })
            })
        })
    }

    renderByItem=(itemlist)=>{
        return itemlist.map((item,index)=>{
            const typeArr=isJson(item.type)
            return (
                <Grid.Column key={index} width={16} style={{paddingBottom:'1em'}}>
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
                                    Rp {item.price},00
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
                <Grid.Row key={index} style={{paddingBottom:'0'}}>
                    <Grid.Column width={16} style={{marginBottom:'1em'}}>
                        <Header as={'h3'}>{titleConstruct(seller.namatoko)}</Header>
                    </Grid.Column>

                    <Grid.Column width={9}>
                        <Grid>
                            <Grid.Row style={{paddingBottom:'0'}}>
                                {this.renderByItem(seller.itemlist)}
                            </Grid.Row>
                        </Grid>
                    </Grid.Column>

                    <Grid.Column width={7} style={{}}>
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

    inter=()=>{
        setInterval(()=>{
            this.setState({payat:1})
        },1000)
    }
    

    renderByTransaction=()=>{

        if(!this.props.Payment.list.length){
            return (
                <div style={{textAlign:'center'}}>There is no payment due</div>
            )
        }

        return this.props.Payment.list.map((transaction,index)=>{

            var seconds=(Date.parse(transaction.payat)-Date.parse(this.state.now))/1000
            var expiredinmins=Math.floor(seconds/60)
            var expiredinsecs=seconds%60
            var isexpired=seconds<=0

            if(isexpired){
                this.CancelTransaction(transaction.idtransaction,transaction)
            }


            return (
                <Segment key={index}>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={5} style={{fontWeight:'bold'}}>
                                Transaction ID {transaction.idtransaction}
                            </Grid.Column>
                            <Grid.Column width={5}>
                                Payment 
                                <Header as={'span'} style={{fontSize:'15px',marginLeft:'.5em'}} color={transaction.payment_method==='Popcoin'?'blue':null}>
                                    {
                                        transaction.payment_method==='Popcoin'?
                                        <>
                                            <Icon name='bitcoin' size='tiny' color='blue' style={{margin:'0 0 0 .5em',fontSize:'18px'}}/>
                                            {transaction.payment_method}
                                        </>
                                        : 
                                        transaction.payment_method
                                    }
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
                            <Grid.Column width={16} style={{textAlign:'center'}}>
                                {
                                    isexpired?
                                    <div><span style={{fontWeight:'800'}}>Transaction Is Expired</span></div>
                                    :
                                    <div style={{display:'inline-flex',padding:'0em 0em',border:'0px solid rgba(255,0,0,.5)',color:'rgb(178,34,34)',background:'rgba(255,0,0,.0)'}}>
                                        Expire in 
                                        <span style={{fontWeight:'800',marginLeft:'.5em'}}>{expiredinmins} : {expiredinsecs<10&expiredinsecs>=0?'0'+expiredinsecs:expiredinsecs}</span>
                                        <Icon name='clock' style={{fontSize:'21px',margin:'0 0 0 .3em'}}/>
                                    </div>
                                }
                            </Grid.Column>
                            {
                                transaction.idtransaction===this.state.uploadid?
                                <Grid.Column width={16} style={{marginTop:'1em',textAlign:'center'}}>
                                    <Input 
                                        type='file'
                                        // multiple
                                        style={{marginRight:'1em'}}
                                        onChange={(e)=>{
                                            if(e.target.files){
                                                // console.log(e.target.files)
                                                this.setState({filepaymentproof:e.target.files[0]})
                                            }
                                        }}
                                    />
                                    <Button primary style={{height:'100%'}} onClick={this.onUpload}><Icon name='upload'/>Upload</Button>
                                    {
                                        this.state.errormessage?
                                        <Label 
                                            basic 
                                            color='red' 
                                            pointing 
                                            style={{
                                                position:'absolute',
                                                top:'100%',
                                                left:'35%'
                                            }}>
                                            {this.state.errormessage}
                                        </Label>
                                        : null
                                    }
                                </Grid.Column>
                                :
                                <Grid.Column width={16} style={{marginTop:'1em',textAlign:'center'}}>
                                    <Button 
                                        primary 
                                        disabled={isexpired}
                                        style={{width:'100%'}}
                                        onClick={()=>{this.setState({uploadid:transaction.idtransaction})}}
                                    >
                                        Upload Transfer Proof
                                    </Button>
                                </Grid.Column>
                            }
                            <Grid.Column width={16} style={{marginTop:'1em',textAlign:'center'}}>
                                Total Payment : 
                                <Header as={'h4'} style={{display:'inline-block'}}>{idr(transaction.totalpayment)}</Header>
                            </Grid.Column>
                            <Divider style={{width:'100%'}}/>
                        </Grid.Row>
                        {this.renderByTransactionSeller(transaction.sellerlist)}
                        <Grid.Row style={{paddingTop:'0'}}>
                            <Grid.Column width={16} style={{marginTop:'1em',textAlign:'center'}}>
                                {
                                    transaction.idtransaction===this.state.iddelete?
                                    <Button 
                                        color='red'
                                        disabled={isexpired}
                                        style={{width:'100%'}}
                                        onClick={()=>{this.CancelTransaction(transaction.idtransaction,transaction)}}
                                    >
                                        Confirm
                                    </Button>
                                    :
                                    <Button 
                                        // color='red'
                                        disabled={isexpired}
                                        style={{width:'100%'}}
                                        onClick={()=>{this.setState({iddelete:transaction.idtransaction})}}
                                    >
                                        Cancel Transaction
                                    </Button>
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
                <Message style={{textAlign:'center'}}>Upload The Proof of Payment Before It Expires</Message>
                {this.renderByTransaction()}
                

                {/* MESSAGE AFTER UPLOAD */}
                {
                    this.state.isuploaded?
                    <Modal open={this.state.isuploaded}>
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
                            <p>
                            Your Payment Proof Is Uploaded
                            </p>
                            <p>
                                Your Order Will Be Processed After Your Payment Has Been Verified 
                            </p>
                            {/* <Icon name='check'/> */}
                        </Message>
                    </Modal>
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

 
export default connect(MapstatetoProps,{LoadPayment,LoadCart}) (PaymentList);