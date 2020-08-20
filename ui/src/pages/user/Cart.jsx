import React ,{Component} from 'react'
import Axios from 'axios'
import {APIURL} from '../../supports/ApiUrl'
import {
    Grid,
    Header,
    Form,
    Segment,
    Button,
    Container,
    TextArea,
    Checkbox,
    Icon,
    Divider,
} from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import {titleConstruct,isJson, idr} from '../../supports/services'
import {LoadCart} from '../../redux/actions'
import { connect } from 'react-redux'


class Cart extends Component {
    state = { 
        items:[],

        editid:0,
        editmessage:'',

        // stock is not enough
        iditemshortlist:[],
        qtyshort:[]
     }

    componentDidMount=()=>{
        // this.props.LoadCart()

        // DONT FORGET TO CHECK IF STOCK IS GOOD BEFORE CHECKOUT
        // console.log('cart componentdidmount')

        this.checkStock()
        
    }

    checkStock=()=>{

        // CHECK ITEM STOCK

        var stock=true
        var id=0

        this.props.Cart.list.forEach((seller,checkoutindex)=>{
            seller.itemlist.forEach((order,sellerindex)=>{
                // iditem
                // qty

                Axios.put(`${APIURL}/items/checkstock/${order.iditem}`,{qty:order.qty})
                .then((newstock)=>{
                    console.log(`item id ${order.iditem} newstock is ${newstock.data.stock}`)
                    if(newstock.data.stock<0){
                        stock=false
                        id=order.iditem

                        var listiditem=this.state.iditemshortlist.concat(order.iditem)
                        var qtyshort=newstock.data.stock

                        this.setState({iditemshortlist:listiditem,qtyshort})
                        
                    }

                    // LAST CYCLE
                    // AFTER ALL STOCK IS CHECKED
                    if(this.props.Cart.list.length-1===checkoutindex&&seller.itemlist.length-1===sellerindex){

                        if(stock){
                            // STOCK IS GOOD
                            
                        }else{
                            // RELOAD
                            console.log('stock is not enough')
                            console.log(this.state.iditemshortlist)
                            this.props.LoadCart(this.props.User.iduser)

                        }
                    }

                }).catch((err)=>{
                    console.log(err)
                })
            })
        })
    }

    updateDetails=(idtransactiondetail,edit)=>{
        console.log('edit details')

        Axios.post(`${APIURL}/transactiondetails/${idtransactiondetail}`,edit)
        .then((res)=>{
            console.log('details updated')
            this.props.LoadCart(this.props.User.iduser)

            // TO AVOID UNLIMITED LOOP
            if(this.state.editid!==0||this.state.editmessage!==''){
                this.setState({editid:0,editmessage:''})
            }
        }).catch((err)=>{
            console.log(err)
        })
    }
    

    renderItems=()=>{
        
        if(!this.props.Cart.list.length){
            return (
                <Segment style={{width:'100%',paddingBottom:'2rem'}}>
                    <Grid>
                        <Grid.Row style={{paddingBottom:'0',opacity:'.8'}}>
                            <Grid.Column>
                                <Header as={'h3'}>Store</Header>
                            </Grid.Column>
                        </Grid.Row>


                                    <Grid.Row style={{paddingTop:'0'}}>
                                        <Grid.Column width={16}>
                                            <Divider />

                                        </Grid.Column>
                                        {/* <Grid.Column width={1} style={{display:'flex',alignItems:'center'}}>
                                            <Checkbox 
                                                style={{transform:'scale(1.2)'}}
                                                checked={false}
                                            />
                                        </Grid.Column> */}
                                        <Grid.Column width={5}>
                                            <div
                                                style={{
                                                    paddingTop:'80%',
                                                    backgroundImage:`url('https://react.semantic-ui.com/images/wireframe/image.png')`,
                                                    backgroundSize:'contain',
                                                    backgroundRepeat:'no-repeat',
                                                    backgroundPosition:'center',
                                                    position:'relative'
                                                }}
                                            >
                                            </div>
                                        </Grid.Column>
                                        <Grid.Column width={6} style={{display:'flex',flexDirection:'column'}}>
                                            <Header as={'h5'} style={{marginBottom:'0em',flexBasis:'1em',opacity:'.8',fontWeight:'100'}}>No Items On Cart</Header>
                                            <p style={{margin:'0 0 .5em',fontSize:'12px',flexBasis:'.8em'}}>
                                                
                                                            <span style={{marginRight:'.5em'}}>
                                                                {/* Color Blue */}
                                                            </span>
                                                        
                                            </p>

                                            
                                        </Grid.Column>
                                    </Grid.Row>
                                
                            
                    </Grid>
                </Segment>
            )
        }


        return this.props.Cart.list.map((seller,index)=>{

            // const listItems=()


            return (
                <Segment key={index} style={{width:'100%',paddingBottom:'2rem'}}>
                    <Grid>
                        <Grid.Row style={{paddingBottom:'0'}}>
                            <Grid.Column>
                                <Header as={'h3'}>{titleConstruct(seller.namatoko)}</Header>
                            </Grid.Column>
                        </Grid.Row>

                        {
                            seller.itemlist.map((item,i)=>{
                                const typeArr=isJson(item.type)

                                // CHECK STOCK
                                // UNSELECT ORDER
                                if(typeof item.qtyshort !== 'undefined'){
                                    if(item.isselected){
                                        this.updateDetails(item.idtransactiondetail,{isselected:false})
                                    }
                                }

                                // MAX FLASHSALE ITEM QTY IS 1
                                // UNSELECT ORDER
                                if(item.isflashsale && item.qty>1 && item.isselected){
                                    this.updateDetails(item.idtransactiondetail,{isselected:false})
                                }

                                return (
                                    <Grid.Row key={i} style={{paddingTop:'0'}}>
                                        <Grid.Column width={16}>
                                            <Divider />

                                        </Grid.Column>
                                        <Grid.Column width={1} style={{display:'flex',alignItems:'center'}}>
                                            <Checkbox 
                                                style={{transform:'scale(1.2)'}}
                                                checked={item.isselected?true:false}
                                                onChange={(e,{checked})=>{
                                                    this.updateDetails(item.idtransactiondetail,{isselected:checked})
                                                }}
                                            />
                                        </Grid.Column>
                                        <Grid.Column width={5}>
                                            {/* <Image fluid src='https://react.semantic-ui.com/images/wireframe/image.png'/> */}
                                            <div
                                                style={{
                                                    paddingTop:'80%',
                                                    backgroundImage:`url(${APIURL+isJson(item.imagecover)[0]})`,
                                                    backgroundSize:'contain',
                                                    backgroundRepeat:'no-repeat',
                                                    backgroundPosition:'center',
                                                    position:'relative',
                                                    opacity:typeof item.qtyshort !== 'undefined'?'.7':'1'
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
                                        <Grid.Column width={6} style={{display:'flex',flexDirection:'column'}}>
                                            {/* CHECK STOCK */}
                                            {/* MESSAGE */}
                                            {
                                                typeof item.qtyshort == 'undefined'?
                                                null
                                                :item.qtyshort===-item.qty?
                                                <p style={{color:'red',margin:'0'}}>Stock is empty</p>
                                                :
                                                <p style={{color:'red',margin:'0'}}>Quantity is short by {-item.qtyshort}</p>
                                            }
                                            {/* MAX FLASHSALE ITEM */}
                                            {
                                                item.isflashsale&&item.qty>1?
                                                <p style={{color:'red',margin:'0'}}>Maximum Flahsale Item is 1 per product</p>
                                                : null
                                            }
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
                                            {
                                                item.isflashsale?
                                                <Header 
                                                    as={'h5'} 
                                                    color={item.isflashsale?'blue':'black'}
                                                    style={{
                                                        margin:'0 0 1em',
                                                        flexBasis:'1em',
                                                        opacity:item.isselected?'1':'.8'
                                                    }}
                                                >
                                                    {idr(item.price)}
                                                    <span style={{fontSize:'12px',color:'gray',marginLeft:'.5em'}}>
                                                        <Icon name='long arrow alternate left' style={{margin:'0'}}/>flashsale
                                                    </span>
                                                </Header>
                                                :
                                                <Header 
                                                    as={'h5'} 
                                                    color={item.isflashsale?'blue':'black'}
                                                    style={{
                                                        margin:'0 0 1em',
                                                        flexBasis:'1em',
                                                        opacity:item.isselected?'1':'.8'
                                                    }}
                                                >
                                                    {idr(item.price)}
                                                </Header>
                                            }
                                            {
                                                this.state.editid===item.idtransactiondetail?
                                                <div>
                                                <Form>
                                                    <TextArea 
                                                        rows={2}
                                                        placeholder='Message to seller'
                                                        style={{marginBottom:'.5em'}}
                                                        value={this.state.editmessage}
                                                        onChange={(e)=>{
                                                            this.setState({editmessage:e.target.value})
                                                        }}
                                                    />
                                                </Form>
                                                <Header as={'span'}
                                                    style={{fontWeight:'bold',fontSize:'15px',cursor:'pointer'}}
                                                    color='blue'
                                                    onClick={()=>{
                                                        this.updateDetails(item.idtransactiondetail,{message:this.state.editmessage})
                                                    }}
                                                >
                                                    Ok
                                                </Header>
                                                </div>
                                                :
                                                <div>
                                                {
                                                    item.message?
                                                    <p style={{marginBottom:'.5em',opacity:item.isselected?'1':'.8'}}>"{item.message}"</p>
                                                    : null
                                                }
                                                <Header as={'span'}
                                                    style={{fontWeight:'bold',fontSize:'15px',cursor:'pointer'}}
                                                    color='blue'
                                                    onClick={()=>{
                                                        this.setState({
                                                            editid:item.idtransactiondetail,
                                                            editmessage:item.message
                                                        })
                                                    }}
                                                >
                                                    {item.message?'edit':'add message'}
                                                </Header>
                                                </div>

                                            }
                                        </Grid.Column>
                                        <Grid.Column width={4} style={{
                                            display:'flex',
                                            // display:typeof item.qtyshort !== 'undefined'?'none':'flex',
                                            alignItems:'flex-end'
                                            }}>
                                            <div style={{display:'inline-block',marginLeft:'auto',fontSize:'16px'}}>
                                                <Icon 
                                                    name='trash' 
                                                    color='grey' 
                                                    style={{margin:'0 .5em 0 0',cursor:'pointer'}}
                                                    onClick={()=>{this.updateDetails(item.idtransactiondetail,{qty:0})}}
                                                />
                                                <Icon 
                                                    name='minus circle' 
                                                    color='blue' 
                                                    style={{margin:'0 .3em 0 .5em',cursor:'pointer'}}
                                                    onClick={()=>{this.updateDetails(item.idtransactiondetail,{qty:item.qty-1})}}
                                                />
                                                <Header 
                                                    as={'p'} 
                                                    style={{
                                                        display:'inline-block',
                                                        width:'25px',
                                                        margin:'0',
                                                        textAlign:'center',
                                                        // verticalAlign:'-1px',
                                                        fontSize:'15px'
                                                        }}
                                                    >
                                                        {item.qty}
                                                    </Header>
                                                <Icon 
                                                    name='plus circle' 
                                                    color='blue' 
                                                    disabled={typeof item.qtyshort !== 'undefined'}
                                                    style={{margin:'0 0 0 .3em',cursor:'pointer'}}
                                                    onClick={()=>{this.updateDetails(item.idtransactiondetail,{qty:item.qty+1})}}
                                                />
                                            </div>
                                        </Grid.Column>
                                    </Grid.Row>
                                )
                            })
                        }
                        
                    </Grid>
                </Segment>
            )
        })


        
        // PREVIOUS STRUCTURE
        // return this.props.Cart.list.map((item,index)=>{
        //     return (
        //         <Segment key={index} style={{width:'100%'}}>
        //             <Grid>
        //                 <Grid.Row>
        //                     <Grid.Column width={5}>
        //                         {/* <Image fluid src='https://react.semantic-ui.com/images/wireframe/image.png'/> */}
        //                         <div
        //                             style={{
        //                                 paddingTop:'80%',
        //                                 backgroundImage:`url(${APIURL+isJson(item.imagecover)[0]})`,
        //                                 backgroundSize:'cover',
        //                                 backgroundPosition:'center',
        //                                 position:'relative'
        //                             }}
        //                             // as={Link}
        //                             // to={`/product/${item.idproduct}`}
        //                         >
        //                             <Link 
        //                                 to={`/product/${item.idproduct}`}
        //                                 style={{
        //                                     // border:'1px solid red',
        //                                     position:'absolute',
        //                                     top:'0',
        //                                     left:'0',
        //                                     width:'100%',
        //                                     height:'100%'
        //                                 }}
        //                             />
        //                         </div>
        //                     </Grid.Column>
        //                     <Grid.Column width={6}>
        //                         <Header as={'h4'}>{item.product_name}</Header>
        //                         <Header as={'h5'} style={{margin:'0 0 1em'}}>Rp {item.price},00</Header>
        //                         {
        //                             this.state.editid==item.idtransactiondetail?
        //                             <>
        //                             <Form>
        //                                 <TextArea 
        //                                     placeholder='Message to seller'
        //                                     style={{marginBottom:'.5em'}}
        //                                     value={this.state.editmessage}
        //                                     onChange={(e)=>{
        //                                         this.setState({editmessage:e.target.value})
        //                                     }}
        //                                 />
        //                             </Form>
        //                             <Header as={'span'}
        //                                 style={{fontWeight:'bold',fontSize:'15px',cursor:'pointer'}}
        //                                 color='blue'
        //                                 onClick={()=>{
        //                                     this.updateDetails(item.idtransactiondetail,{message:this.state.editmessage})
        //                                 }}
        //                             >
        //                                 Ok
        //                             </Header>
        //                             </>
        //                             :
        //                             <>
        //                             {
        //                                 item.message?
        //                                 <p style={{marginBottom:'.5em'}}>"{item.message}"</p>
        //                                 : null
        //                             }
        //                             <Header as={'span'}
        //                                 style={{fontWeight:'bold',fontSize:'15px',cursor:'pointer'}}
        //                                 color='blue'
        //                                 onClick={()=>{
        //                                     this.setState({
        //                                         editid:item.idtransactiondetail,
        //                                         editmessage:item.message
        //                                     })
        //                                 }}
        //                             >
        //                                 {item.message?'edit':'add message'}
        //                             </Header>
        //                             </>

        //                         }
        //                     </Grid.Column>
        //                     <Grid.Column width={5} style={{display:'flex',alignItems:'flex-end'}}>
        //                         <div style={{display:'inline-block',marginLeft:'auto',fontSize:'16px'}}>
        //                             <Icon 
        //                                 name='trash' 
        //                                 color='grey' 
        //                                 style={{margin:'0 .5em',cursor:'pointer'}}
        //                                 onClick={()=>{this.updateDetails(item.idtransactiondetail,{qty:0})}}
        //                             />
        //                             <Icon 
        //                                 name='minus circle' 
        //                                 color='blue' 
        //                                 style={{margin:'0 .5em',cursor:'pointer'}}
        //                                 onClick={()=>{this.updateDetails(item.idtransactiondetail,{qty:item.qty-1})}}
        //                             />
        //                             <Header 
        //                                 as={'p'} 
        //                                 style={{
        //                                     display:'inline-block',
        //                                     width:'30px',
        //                                     margin:'0',
        //                                     textAlign:'center',
        //                                     // verticalAlign:'-1px',
        //                                     fontSize:'15px'
        //                                     }}
        //                                 >
        //                                     {item.qty}
        //                                 </Header>
        //                             <Icon 
        //                                 name='plus circle' 
        //                                 color='blue' 
        //                                 style={{margin:'0 .5em',cursor:'pointer'}}
        //                                 onClick={()=>{this.updateDetails(item.idtransactiondetail,{qty:item.qty+1})}}
        //                             />
        //                         </div>
        //                     </Grid.Column>
        //                 </Grid.Row>
        //             </Grid>
        //         </Segment>
        //     )
        // })
    }

    render() { 
        return ( 
            <Container style={{paddingTop:'2em',minWidth:'900px',marginBottom:'4em'}}>

                <Grid>
                    <Grid.Row>
                        <Grid.Column width={11}>
                            <Segment style={{width:'100%'}}>
                                CART
                            </Segment>

                            {this.renderItems()}
                        </Grid.Column>
                        <Grid.Column width={5}>
                            <Segment style={{width:'100%',}}>
                                <div style={{margin:'0 0 .5em'}}>
                                    <Header as={'h5'} style={{display:'inline-block',color:'gray',margin:'0',fontWeight:'300'}}>Quantity</Header>
                                    <Header as={'h4'} style={{display:'inline-block',float:'right',margin:'0'}}>{this.props.Cart.totalqty}</Header>
                                </div>
                                <div style={{margin:'0 0 1em'}}>
                                    <Header as={'h5'} style={{display:'inline-block',color:'gray',margin:'0',fontWeight:'300'}}>Total Price</Header>
                                    <Header as={'h4'} style={{display:'inline-block',float:'right',margin:'0'}}>Rp {this.props.Cart.totalprice},00</Header>
                                </div>
                                <div style={{textAlign:'right'}}>
                                    <Button
                                        primary
                                        // color='teal'
                                        style={{margin:'auto',display:'inline-block',width:'100%'}}
                                        as={Link}
                                        to='/checkout'
                                    >
                                        Checkout
                                    </Button>

                                </div>
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>


            </Container>

        );
    }
}

const MapstatetoProps=(state)=>{
    return {
        User: state.Auth,
        Cart: state.Cart
    }
}

 
export default connect(MapstatetoProps,{LoadCart}) (Cart);