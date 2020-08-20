import React ,{Component} from 'react'
import Axios from 'axios'
import {APIURL} from '../../supports/ApiUrl'
import {
    Grid,
    Header,
    Button,
    Message,
    Container,
    Checkbox,
    Icon,
    Divider,
    Modal,
    Dimmer
} from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import {idr} from '../../supports/services'
import {LoadCart,CountTotalPayment,LoadPayment,KeepLogin} from '../../redux/actions'
import {Redirect} from 'react-router-dom'
import { connect } from 'react-redux'


class Payment extends Component {
    state = { 
        idpayment:0,

        loading:false,
        redirect:false,
        ispaid:false,
        tohome:false

     }


    submitPayment=()=>{
        this.setState({loading:true})
        console.log(this.props.Cart)

        // CHECK ITEM ISSELECTED
        // CHECK PROMO AVAILIBILITY
        // CHECK POPCOIN CREDIT?
        // CHECK SAME TRANSACTION ALREADY DONE IN ANOTHER TAB
        /////////////////////////////////

        this.checkStatus()
        // STEP 1
        // CHECK ITEM STATUS, IT MUST BE 'ONCART'
        // STEP 2
        // CHECK ITEM STOCK
        // STEP 3
        // CREATE TRANSACTION

    }
    
    // CASE, WHEN ANOTHER TAB IS OPEN, AND TRANSACTION WAS MADE
    // TRANSACTION DETAIL STATUS MUST BE FROM 'ON CART' TO UPDATE TO NEXT STATUS
    checkStatus=async ()=>{
        var status=true
        this.props.Cart.checkout.forEach(async(seller,checkoutindex)=>{
            // seller.itemlist.forEach((order,sellerindex)=>{
            for(var order of seller.itemlist){
                // iditem
                // qty
                try{
                    var ordernow= await Axios.get(`${APIURL}/transactiondetails/order/${order.idtransactiondetail}`)
                    if(ordernow.data.idorderstatus!==1){
                        status=false
                    }

                }catch(err){
                    console.log(err)
                    this.setState({loading:false})
                }
                
                
                
                // Axios.get(`${APIURL}/transactiondetails/order/${order.idtransactiondetail}`)
                // .then((ordernow)=>{
                //     if(ordernow.data.idorderstatus!==1){
                //         status=false
                //     }
                    
                //     // last cycle
                //     if(this.props.Cart.checkout.length-1==checkoutindex&&seller.itemlist.length-1==sellerindex){
                //         console.log('last cycle')
                //         if(status){
                //             console.log('status is checked')
                //             this.checkStock()
                //         }else{
                //             console.log('item is not on cart')
                //             this.setState({loading:false})
                //         }
                //     }

                // }).catch((err)=>{
                //     console.log(err)
                // })

            }

            if(this.props.Cart.checkout.length-1===checkoutindex){
                // console.log('last cycle')
                if(status){
                    console.log('status is checked')
                    this.checkStock()
                }else{
                    console.log('item is not on cart')
                    this.setState({loading:false})
                }
            }
        })
    } 

    checkStock=()=>{

        // CHECK ITEM STOCK
        // STEP 1
        // SUBTRACT ITEM STOCK BY QTY
        // STEP 2
        // IF NEW STOCK VALUE LESS THAN ZERO, THEN UNDO ALL SUBTRACTION

        var stock=true
        var id=0

        this.props.Cart.checkout.forEach((seller,checkoutindex)=>{
            seller.itemlist.forEach((order,sellerindex)=>{
                // iditem
                // qty

                Axios.put(`${APIURL}/items/stock/${order.iditem}`,{qty:order.qty})
                .then((newstock)=>{
                    console.log(`item id ${order.iditem} newstock is ${newstock.data.stock}`)
                    if(newstock.data.stock<0){
                        stock=false
                        id=order.iditem
                    }

                    // LAST CYCLE
                    // AFTER ALL STOCK IS CHECKED
                    if(this.props.Cart.checkout.length-1===checkoutindex&&seller.itemlist.length-1===sellerindex){

                        if(stock){
                            // STOCK IS GOOD
                            console.log('item stock are available')
                            this.createTransactions()
                        }else{
                            // UNDO SUBTRACTION
                            console.log('stock is not enough')
                            console.log(`item id ${id}`)
                            this.undoStock()
                            this.setState({loading:false})

                        }
                    }

                }).catch((err)=>{

                })
            })
        })
    }

    undoStock=()=>{
        this.props.Cart.checkout.forEach((seller,checkoutindex)=>{
            seller.itemlist.forEach((order,sellerindex)=>{
                // iditem
                // qty

                Axios.put(`${APIURL}/items/undostock/${order.iditem}`,{qty:order.qty})
                .then((newstock)=>{
                    console.log(`item id ${order.iditem} new stock is ${newstock.data.stock}`)

                    // LAST CYCLE
                    // AFTER ALL STOCK IS CHECKED
                    if(this.props.Cart.checkout.length-1===checkoutindex&&seller.itemlist.length-1===sellerindex){

                        console.log('all stock is undo')
                    }

                }).catch((err)=>{
                    console.log(err)
                })
            })
        })
    }


    createTransactions=()=>{
        // console.log(this.props.Cart)
        var transactiondata={
            ...this.props.Cart,
            iduser: this.props.User.iduser,
            idpayment: this.state.idpayment
        }
        
        console.log('request create transaction')
        Axios.post(`${APIURL}/transactions/secured`,transactiondata)
        .then((paymentcreated)=>{
            this.props.LoadCart(this.props.User.iduser)
            this.props.LoadPayment(this.props.User.iduser)
            // IF USING POPCOIN
            if(this.state.idpayment===4){
                this.setState({ispaid:true})
                setTimeout(() => {
                    this.setState({ispaid:false,tohome:true})
                }, 2500);
            }else{
                this.setState({redirect:true,loading:false})
            }
        }).catch((err)=>{
            console.log(err)
            this.setState({loading:false})
        })

        // IF USING POPCOIN
        if(this.state.idpayment===4){
            const token=localStorage.getItem('token')
            if(token){
                var topup={
                    popcoin: -this.props.Cart.totalpayment
                }
                Axios.put(`${APIURL}/users/popcoin`,topup,{
                    headers:{
                        'Authorization':`Bearer ${token}`
                    }
                }).then((res)=>{
                    console.log('popcoin payment succeed')
                    this.props.KeepLogin(res.data)
                }).catch((err)=>{
                    console.log(err)
                })
    
            }else{
                console.log('user is not logged in')
            }
        }
    }

    createTransactionByFrontEnd=()=>{

        return 1

        // SAME FUNCTION, BUT WITH TRY CATCH
        console.log(this.props.Cart)
        var transactiondata={
            ...this.props.Cart,
            iduser: this.props.User.iduser,
            idpayment: this.state.idpayment
        }
        
        console.log('request create transaction')
        Axios.post(`${APIURL}/transactions`,transactiondata)
        .then(async(created)=>{
            // create seller transaction

            // NOTE, THIS FOR LOOP, DOES NOT WORK PROPERLY HERE, 
            // -----> for(var seller of this.props.Cart.checkout){  <------
            // VALUE OF THE FIRST CYCLE GETS REPLACE BY THE VALUE FROM THE LAST CYCLE

            this.props.Cart.checkout.forEach(async(seller)=>{
                // console.log('seller loop'+seller.namatoko)
                const{
                    idseller,
                    iddelivery,
                    totalqty,
                    totalweight,
                    seller_delivery_cost,
                    seller_items_price
                }=seller
                var transactionsellerdata = {
                    idtransaction:created.data.insertId,
                    idseller,
                    iddelivery,
                    totalqty,
                    totalweight,
                    seller_delivery_cost,
                    seller_items_price
                }
                
                console.log('request create transaction seller '+seller.idseller)
                try{
                    var transactionseller=await Axios.post(`${APIURL}/transactions/seller`,transactionsellerdata)
                    // update transaction detail
                    seller.itemlist.forEach(async(item)=>{

                        // DONT FORGET TO SUBTRACT ITEM STOCK

                        // CASE STUDY
                        // IF SAME PAGE IS OPEN IN ANOTHER TAB
                        // 

                        // for(var item of seller.itemlist){
                        var update={
                            idtransaction:created.data.insertId,
                            idtransactionseller:transactionseller.data.insertId,
                            idorderstatus:2,
                            checkout_price:item.price
                        }
                        console.log(`update order id ${item.idtransactiondetail}`)
                        
                        try{
                            var updated=await Axios.put(`${APIURL}/transactiondetails/${item.idtransactiondetail}`,update)
                            console.log(`order id ${item.idtransactiondetail} proccessed`)

                            this.props.LoadCart(this.props.User.iduser)
                            this.props.LoadPayment(this.props.User.iduser)
                            this.setState({redirect:true})
                        }catch(err){
                            console.log(err)
                        }
                        
                    })

                }catch(err){
                    console.log(err)
                }

            })
        }).catch((err)=>{
            console.log(err)
        })


        // SAME FUNCTION
        // console.log(this.props.Cart)
        // var transactiondata={
        //     ...this.props.Cart,
        //     iduser: this.props.User.iduser,
        //     idpayment: this.state.idpayment
        // }
        
        // console.log('request create transaction')
        // Axios.post(`${APIURL}/transactions`,transactiondata)
        // .then((created)=>{
        //     // create seller transaction
        //     // NOTE, THIS FOR LOOP, DOES NOT WORK PROPERLY HERE, 
        //     // VALUE OF THE FIRST CYCLE GETS REPLACE BY THE VALUE FROM THE LAST CYCLE
        //     // for(var seller of this.props.Cart.checkout){ 
        //     this.props.Cart.checkout.forEach((seller)=>{
        //         // console.log('seller loop'+seller.namatoko)
        //         const{
        //             idseller,
        //             iddelivery,
        //             totalqty,
        //             seller_delivery_cost,
        //             seller_items_price
        //         }=seller
        //         var transactionsellerdata = {
        //             idtransaction:created.data.insertId,
        //             idseller,
        //             iddelivery,
        //             totalqty,
        //             seller_delivery_cost,
        //             seller_items_price
        //         }
                
        //         console.log('request create transaction seller '+seller.idseller)
        //         Axios.post(`${APIURL}/transactions/seller`,transactionsellerdata)
        //         .then((transactionseller)=>{
        //             // update transaction details
        //             // for(var item of seller.itemlist){
        //             seller.itemlist.forEach((item)=>{
        //                 var update={
        //                     idtransaction:created.data.insertId,
        //                     idtransactionseller:transactionseller.data.insertId,
        //                     idorderstatus:2
        //                 }
        //                 console.log(`update order id ${item.idtransactiondetail}`)
        //                 Axios.put(`${APIURL}/transactiondetails/${item.idtransactiondetail}`,update)
        //                 .then((updated)=>{
        //                     console.log(`order id ${item.idtransactiondetail} proccessed`)
        //                 }).catch((err)=>{
        //                     console.log(err)
        //                 })
        //             })

        //         }).catch((err)=>{
        //             console.log(err)
        //         })
        //     })
        // }).catch((err)=>{
        //     console.log(err)
        // })
        // .finally(()=>{
        //     console.log('finally')
        // })

    }

    
    render() { 
        // console.log(this.state.deliveryselect)
        // POPCOIN
        var remainingcredit=this.props.User.popcoin-this.props.Cart.totalpayment
        return ( 

            <Modal trigger={this.props.trigger} style={{width:'500px'}}>
                <Modal.Header>Payment</Modal.Header>
                <Modal.Content>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={12}>
                                <Grid>
                                    <Grid.Row>
                                        <Grid.Column>
                                            <Icon name='bitcoin' size='large' color='blue'/>
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Header as={'span'} color='blue'>Popcoin</Header>
                                            {
                                                this.state.idpayment===4?
                                                <div style={{fontSize:'13px',whiteSpace:'nowrap'}}>
                                                    {idr(this.props.User.popcoin)} - <span style={{fontWeight:'800'}}>{idr(this.props.Cart.totalpayment)}</span>
                                                    {
                                                        remainingcredit>0?
                                                        <div style={{marginTop:'.5em'}}>{idr(this.props.User.popcoin-this.props.Cart.totalpayment)} (remains)</div>
                                                        :
                                                        <div style={{marginTop:'.5em',color:'red'}}>
                                                            Insufficient Credit, please top up
                                                            <Button 
                                                                basic 
                                                                color='blue' 
                                                                style={{marginLeft:'.5em'}} 
                                                                as={Link} 
                                                                to='/popcoin'
                                                            >
                                                                Top Up
                                                                <Icon name='long arrow alternate right'/>
                                                            </Button>
                                                        </div>
                                                    }
                                                </div>
                                                :
                                                <div style={{fontSize:'13px',whiteSpace:'nowrap'}}>
                                                    {idr(this.props.User.popcoin)}
                                                </div>
                                            }
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Grid.Column>
                            <Grid.Column width={4} style={{display:'flex',alignItems:'center',justifyContent:'flex-end'}}>
                                <Checkbox 
                                    toggle 
                                    checked={this.state.idpayment===4}
                                    onClick={()=>{
                                        this.setState({idpayment:4})
                                        this.props.CountTotalPayment()
                                    }}
                                />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    
                </Modal.Content>
                <Divider/>

                <Modal.Content>
                    <Modal.Description>
                        <div>
                            <Header style={{display:'inline-block'}}>Transfer</Header>
                            <Checkbox 
                                toggle 
                                style={{float:'right'}}
                                checked={this.state.idpayment===1}
                                onClick={()=>{
                                    this.setState({idpayment:1})
                                    // this.props.CountTotalPayment()
                                }}
                            />
                        </div>
                        <p style={{fontSize:'16px'}}>Guide</p>
                        <Message>
                            <p style={{color:'red',marginBottom:'.5em'}}>Important</p>
                            Upload your proof of payment within an hour
                        </Message>
                        <p>
                            Pellentesque finibus nulla dui, ac aliquam neque efficitur consequat. Phasellus mauris dui, consequat sit amet finibus ut, convallis ac augue
                        </p>
                    </Modal.Description>
                </Modal.Content>

                <Divider/>

                <Modal.Content>
                    <Modal.Description>
                        <div>
                            <Header style={{display:'inline-block'}}>Credit Card</Header>
                            <Checkbox 
                                toggle 
                                style={{float:'right'}}
                                checked={this.state.idpayment===2}
                                onClick={()=>{
                                    this.setState({idpayment:2})
                                    // this.props.CountTotalPayment()
                                }}
                            />
                        </div>
                        <p style={{fontSize:'16px'}}>Guide</p>
                        <Message>
                            <p style={{color:'red',marginBottom:'.5em'}}>Important</p>
                            Upload your proof of payment within an hour
                        </Message>
                        <p>
                            Pellentesque finibus nulla dui, ac aliquam neque efficitur consequat. Phasellus mauris dui, consequat sit amet finibus ut, convallis ac augue
                        </p>
                    </Modal.Description>
                </Modal.Content>

                <Divider/>

                <Container style={{padding:'0 1em 1em 1em'}}>
                    <Header as={'h2'} style={{textAlign:'center',marginBottom:'1rem'}}>
                        {idr(this.props.Cart.totalpayment)}
                    </Header>
                    <Button
                        primary
                        loading={this.state.loading}
                        style={{width:'100%'}}
                        disabled={(this.props.Cart.totalpayment&&this.state.idpayment?false:true) || (this.state.idpayment===4&&remainingcredit<0) || (this.state.loading)}
                        onClick={this.submitPayment}
                    >
                        Pay
                    </Button>
                </Container>

                {/* MESSAGE AFTER UPLOAD */}
                {
                    this.state.ispaid?
                    <Dimmer active={this.state.ispaid} inverted>
                        <div style={{color:'rgba(0,0,0,.7)',fontSize:'18px'}}>
                            <p>
                                <Icon name='check'/>
                                Your Payment Is Verified
                            </p>
                            {/* <p>
                                Your Order Is Processed
                            </p> */}
                        </div>
                    </Dimmer>
                    : null
                }

                {
                    this.state.redirect?
                    <Redirect to='/transactions'/>
                    : null
                }
                {
                    this.state.tohome?
                    <Redirect to='/'/>
                    : null
                }
                
            </Modal>

                            
        );
    }
}


const MapstatetoProps=(state)=>{
    return {
        User: state.Auth,
        Cart: state.Cart
    }
}

 
export default connect(MapstatetoProps,{CountTotalPayment,LoadCart,LoadPayment,KeepLogin}) (Payment);