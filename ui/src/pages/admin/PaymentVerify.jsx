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
    Modal,
    Dropdown,
    Tab,
    Menu,
    Label
} from 'semantic-ui-react'
import Payment from '../user/Payment'
import {Link} from 'react-router-dom'
import {titleConstruct,isJson} from '../../supports/services'
import {LoadInvoices} from '../../redux/actions'
import {Redirect} from 'react-router-dom'
import { connect } from 'react-redux'



class PaymentList extends Component {
    state = { 
        idaccept:0,
        iddeny:0
        
     }

    componentDidMount=()=>{
        
        // var clock=setInterval(() => {
        //     this.setState({now:new Date()})
        // }, 1000);
        // this.setState({clock})
    }

    onAccept=(idtransaction,transaction)=>{
        // UPDATE TRANSACTION STATUS
        var update={
            idstatus:3
        }
        Axios.put(`${APIURL}/transactions/${idtransaction}`,update)
        .then((updated)=>{
            console.log('transaction id',idtransaction,' is updated')
            this.props.LoadInvoices(this.props.User.iduser)
        }).catch((err)=>{
            console.log(err)
        })

        // UPDATE TRANSACTION SELLER STATUS
        transaction.sellerlist.forEach((store)=>{
            let obj={
                idpackagestatus:2
            }
            Axios.put(`${APIURL}/transactionstores/${store.idtransactionseller}`,obj)
            .then((updated)=>{
                console.log('transaction seller id',store.idtransactionseller,' is updated')
            })
        })
    }

    onDeny=(idtransaction)=>{

        // CREATE DATETIME OF TWO HOUR LATER
        Date.prototype.addHours = function(h) {
            this.setTime(this.getTime() + (h*60*60*1000));
            return this;
        }
        var payat=new Date().addHours(2)
        // ////////////////////////////////

        var update={
            idstatus:1,
            payat:2
        }
        Axios.put(`${APIURL}/transactions/${idtransaction}`,update)
        .then((updated)=>{
            console.log('transaction id ',idtransaction,' is denied')
            this.props.LoadInvoices(this.props.User.iduser)
        }).catch((err)=>{
            console.log(err)
        })
    }
    

    renderByTransaction=()=>{
        console.log(this.props.Invoices)
        if(!this.props.Invoices.list.length){
            return (
                <div style={{textAlign:'center'}}>There is no Invoices</div>
            )
        }

        return this.props.Invoices.list.map((transaction,index)=>{

            return (
                <Segment key={index}>
                    <Grid>
                        {/* <Grid.Row>
                            <Grid.Column width={5}>
                                Transaction ID {transaction.idtransaction}
                            </Grid.Column>
                            <Grid.Column width={5}>
                                Payment 
                                <Header as={'span'} style={{fontSize:'15px',marginLeft:'.5em'}} color={transaction.payment_method=='Popcoin'?'blue':null}>
                                    {
                                        transaction.payment_method=='Popcoin'?
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
                            
                            <Divider style={{width:'100%'}}/>
                        </Grid.Row> */}
                        <Grid.Row>
                            <Grid.Column width={6}>
                                <div
                                    style={{
                                        paddingTop:'100%',
                                        backgroundImage:`url(${APIURL+JSON.parse(transaction.paymentproof)})`,
                                        backgroundSize:'contain',
                                        backgroundRepeat:'no-repeat',
                                        backgroundPosition:'center',
                                        position:'relative'
                                    }}
                                >
                                    <Modal 
                                        trigger={
                                            <Button
                                                basic
                                                // inverted
                                                style={{
                                                    position:'absolute',
                                                    bottom:'1em',
                                                    left:'50%',
                                                    width:'calc(100% - 2em)',
                                                    transform:'translate(-50%,0)'
                                                }}
                                            >
                                                Show Full Image
                                            </Button>
                                        }
                                    >
                                        <Image
                                            src={APIURL+JSON.parse(transaction.paymentproof)}
                                            style={{margin:'auto'}}
                                        />
                                    </Modal>
                                </div>
                            </Grid.Column>
                            <Grid.Column width={10} style={{display:'flex',flexDirection:'column'}}>
                                <Header as={'h4'}>
                                    Transaction ID {transaction.idtransaction}
                                </Header>
                                <div style={{marginTop:'.5em'}}>
                                    <span>
                                        User
                                    </span>
                                    <span style={{float:'right',fontWeight:'800'}}>
                                        {titleConstruct(transaction.username)}
                                    </span>
                                </div>
                                <div style={{marginTop:'.5em'}}>
                                    <span>
                                        Payment Method
                                    </span>
                                    <span style={{float:'right'}}>
                                        {transaction.payment_method}
                                    </span>
                                </div>
                                <div style={{margin:'.5em 0 2em'}}>
                                    <span>
                                        Total Payment
                                    </span>
                                    <span style={{float:'right'}}>
                                        Rp {transaction.totalpayment},00
                                    </span>
                                </div>
                                <div style={{marginTop:'auto'}}>
                                    {
                                        transaction.idtransaction==this.state.idaccept?
                                        <Button 
                                            primary 
                                            style={{width:'100%',marginBottom:'.5em',marginTop:'auto'}}
                                            onClick={()=>{this.onAccept(transaction.idtransaction,transaction)}}
                                        >Confirm</Button>
                                        :
                                        <Button 
                                            primary 
                                            style={{width:'100%',marginBottom:'.5em'}}
                                            onClick={()=>{this.setState({idaccept:transaction.idtransaction,iddeny:0})}}
                                        >Accept Payment</Button>
                                    }
                                    {
                                        transaction.idtransaction==this.state.iddeny?
                                        <Button 
                                            style={{width:'100%'}}
                                            color='red'
                                            onClick={()=>{this.onDeny(transaction.idtransaction)}}
                                        >Confirm</Button>
                                        :
                                        <Button 
                                            style={{width:'100%'}}
                                            onClick={()=>{this.setState({iddeny:transaction.idtransaction,idaccept:0})}}
                                        >Deny And Request Another Payment Proof</Button>
                                    }
                                </div>
                                
                            </Grid.Column>
                        </Grid.Row>
                        {/* {this.renderByTransactionSeller(transaction.sellerlist)}
                        <Grid.Row>
                            <Grid.Column width={16} style={{marginTop:'1em',textAlign:'center'}}>
                                <Button 
                                    // color='red'
                                    style={{width:'100%'}}
                                    
                                >
                                    Cancel Transaction
                                </Button>
                            </Grid.Column>
                        </Grid.Row> */}
                    </Grid>
                </Segment>
            )
        })
    }

    
    render() { 
        return ( 
            <Container style={{paddingTop:'2em',width:'900px',marginBottom:'4em'}}>
                <Message style={{textAlign:'center'}}>Verify User Transaction's Payment Proof</Message>
                {this.renderByTransaction()}
                
            </Container>
        );
    }
}

const MapstatetoProps=(state)=>{
    return {
        User: state.Auth,
        Cart: state.Cart,
        Invoices: state.Invoices
    }
}

 
export default connect(MapstatetoProps,{LoadInvoices}) (PaymentList);