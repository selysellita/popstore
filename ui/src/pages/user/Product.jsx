import React ,{Component} from 'react'
import Axios from 'axios'
import {APIURL} from '../../supports/ApiUrl'
import {
    Grid,
    Header,
    Form,
    Segment,
    Button,
    Message,
    Container,
    Input,
    TextArea,
    Icon,
    Rating,
    Dimmer,
    Loader,
} from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import {titleConstruct,idr} from '../../supports/services'
import {LoadCart} from '../../redux/actions'
import { connect } from 'react-redux'
import CommentSection from '../../components/Comment'

// how many number of images in slider
const slidercount=4


class Product extends Component {
    state = { 
        pageloading:true,
        product:{},
        items:[],

        imageshow:'',
        imageList:[],
        // image slider
        order:0,
        maxorder:0,
        imageselectorder:0,
        ///////////////
        itemimageorder:[],

        typeselect:[],
        itemselect:{},
        qty:1,
        message:'',

        // MESSAGES
        err:'',
        buy:false,
        qtymessage:'',

        loading:false,

        // timeout
        timeout:'',

        //flashsale
        flashsaleprice:0

     }
     
     
     componentDidMount=()=>{
        this.handleseen()
        this.getProduct()
        this.getItems()

        this.checkWishlist()
    }

    componentWillUnmount=()=>{
        clearTimeout(this.state.timeout)
    }

    handleseen=()=>{
        console.log(this.props.match.params.idproduct)
        Axios.get(`${APIURL}/products/getseen/${this.props.match.params.idproduct}`)
        .then((res)=>{
            console.log(res)
        }).catch((err)=>{
            console.log(err)
        })
    }

    getProduct=()=>{

        Axios.get(`${APIURL}/products/get/${this.props.match.params.idproduct}`)
        .then((res)=>{
            console.log('product details',res.data)
            this.setState({
                product:res.data,
                pageloading:false,
                // imageshow:this.isJson(res.data.imagecover)[0],
                // imageselectorder:0,
            })
            this.constructImageList()
            this.selectImage(0)
            // IF FLASHSALE
            if(res.data.isflashsale){
                this.getFlashsalePrice()
            }
            // console.log(res.data)
        }).catch((err)=>{
            console.log(err)
            this.setState({pageloading:false})
        })

    }
    
    getItems=()=>{

        Axios.get(`${APIURL}/items?idproduct=${this.props.match.params.idproduct}`)
        .then((res)=>{
            // console.log(res.data)
            this.setState({items:res.data})
            this.constructImageList()
            // IF ONLY SINGLE TYPE PRODUCT
            if(res.data.length===1){
                this.setState({itemselect:res.data[0]})
            }
        }).catch((err)=>{
            console.log(err)
        })
    }

    onAddToCart=()=>{
        // CLEAR MESSAGE
        this.setState({err:''})

        // if item is selected
        console.log(this.state.itemselect)

        if(!this.props.User.isverified){

            this.setState({err:'Please Verify Your Account'})

        }else if(this.state.itemselect.iduser===this.props.User.iduser){

            this.setState({err:'You cannot buy your own product'})

        }else if(!this.state.itemselect.iditem){

            this.setState({err:'Item is not selected'})

        }else if(!this.state.itemselect.stock){

            this.setState({err:'Stock is empty'})

        }else if(!this.state.itemselect.price){

            this.setState({err:'Item is not available'})

        }else if( this.state.qty==='' || this.state.qty===0 || !this.state.qty>0 ){

            this.setState({err:'Quantity is empty'})

        }else if( this.state.message.length>200 ){

            this.setState({err:'Message cannot be more than 200 characters'})

        }else{

            // NEW STRUCTURE
            // ADDING ITEM TO CART, WILL NOT CREATE TRANSACTION, ONLY CREATE TRANSACTION DETAIL
            // STATUS WILL BE IN TRANSACTION DETAIL COLUMN, NOT IN TRANSACTION

            this.setState({loading:true})

            var td={
                // idtransaction: res.data.idtransaction,
                iduser: this.props.User.iduser,
                iditem: this.state.itemselect.iditem,
                qty: this.state.qty,
                message: this.state.message,
            }
            Axios.post(`${APIURL}/transactiondetails`,td)
            .then((res)=>{
                if(res.data.status){
                    console.log('item added to cart')
                    this.props.LoadCart(this.props.User.iduser)
                    this.setState({buy:true,loading:false})

                    var delay = setTimeout(()=>{
                        this.setState({buy:false})
                    },2000)

                    this.setState({timeout:delay})
                    
                }else{
                    console.log(res.data.message)
                    this.setState({err:res.data.message})
                }
            }).catch((err)=>{
                console.log(err)
                this.setState({loading:false})
            })



            // PREVIOUS STRUCTURE

            // var tr={
            //     iduser: this.props.User.iduser
            // }
            // Axios.post(`${APIURL}/transactions`,tr)
            // .then((res)=>{
            //     console.log('create transaction successful')
            //     console.log(res.data)
            //     // CREATE TRANSACTION DETAILS
            //     var td={
            //         idtransaction: res.data.idtransaction,
            //         iditem: this.state.itemselect.iditem,
            //         qty: this.state.qty,
            //         message: this.state.message,
            //     }

            //     Axios.post(`${APIURL}/transactiondetails`,td)
            //     .then((res)=>{
            //         if(res.data.status){
            //             console.log('transaction details updated')
            //             this.props.LoadCart(this.props.User.iduser)
            //             this.setState({buy:true})

            //             setTimeout(()=>{
            //                 this.setState({buy:false})
            //             },3000)
                        
            //         }else{
            //             console.log(res.data.message)
            //             this.setState({err:res.data.message})
            //         }
            //     }).catch((err)=>{
            //         console.log(err)
            //     })

            // }).catch((err)=>{
            //     console.log(err)
            // })

        }

    }

    onAddToWishlist=()=>{

        if(this.state.iswishlist){
            Axios.delete(`${APIURL}/wishlist/product?iduser=${this.props.User.iduser}&idproduct=${this.state.product.idproduct}`)
            .then((deleted)=>{
                console.log('product deleted from wishlist')
                this.checkWishlist()
                this.getProduct()
            }).catch((err)=>{
                console.log(err)
            })
        }else{
            var update={
                idproduct:this.state.product.idproduct,
                iduser:this.props.User.iduser
            }
            console.log(update)
            Axios.post(`${APIURL}/wishlist/getproduct`,update)
            .then((added)=>{
                console.log('product added to wishlist')
                this.checkWishlist()
                this.getProduct()
            }).catch((err)=>{
                console.log(err)
            })
        }
        
    }

    checkWishlist=()=>{
        console.log('check wishlist',this.props.User.iduser)
        Axios.get(`${APIURL}/wishlist/getallwishlist?iduser=${this.props.User.iduser}`)
        .then((res)=>{
            this.setState({iswishlist:false})
            res.data.forEach((val,index)=>{
                if(val.idproduct===this.state.product.idproduct){
                    this.setState({iswishlist:true})
                }
            })
        }).catch((err)=>{
            console.log(err)
        })
    }

    getFlashsalePrice=()=>{
        console.log('get product flashsale price')
        Axios.get(`${APIURL}/flashsales/product/active/approved?idproduct=${this.state.product.idproduct}`)
        .then((product)=>{
            this.setState({flashsaleprice:product.data.flashsale_price})
        }).catch((err)=>{
            console.log(err)
        })
    }

    constructImageList=()=>{
        // GET COVER IMAGES AND ITEM IMAGES INTO ONE ARRAY

        var imagecover=this.isJson(this.state.product.imagecover)

        var itemimages=[]
        var itemimageorder=[]
        // for(const item of this.state.items){
        //     var image=this.isJson(item.image)
        //     itemimages=itemimages.concat(image)

        //     // get image item order
        //     var order={
        //         iditem: item.iditem,
        //         order: 
        //     }
        // }

        for(var i=0;i<this.state.items.length;i++){
            var image=this.isJson(this.state.items[i].image)

            
            // get image item order
            var order={
                iditem: this.state.items[i].iditem,
                index: image.length?imagecover.length+itemimages.length:0
            }
            itemimageorder.push(order)

            // merge image
            itemimages=itemimages.concat(image)

            // console.log('itemimages',itemimages)

        }

        // console.log('order',itemimageorder)

        // console.log(imagecover)
        // console.log(itemimages)

        var imageList=imagecover.concat(itemimages)

        // console.log(imageList)

        //counting maxorder
        var maxorder=imageList.length-slidercount

        // console.log('itemimageorder',itemimageorder)

        this.setState({
            imageList:imageList,
            maxorder:maxorder<0?0:maxorder,
            itemimageorder:itemimageorder
        })
    }

    selectImage=(index)=>{
        // var imageshow=this.state.imageList[index]
        // var imageselectorder=index
        var order=index>=this.state.maxorder?this.state.maxorder:index

        // console.log(index)
        this.setState({
            imageshow:this.state.imageList[index],
            imageselectorder:index,
            order:order
        })
    }

    selectItem=()=>{
        // var selected=this.state.items[0]

        for(var item of this.state.items){
            
            if(item.type===JSON.stringify(this.state.typeselect)){
                console.log('item selected')
                // SELECT ITEM IMAGE TO SHOW
                for(var order of this.state.itemimageorder){
                    if(order.iditem===item.iditem){
                        var neworder=order.index>=this.state.maxorder?this.state.maxorder:order.index // for image slider
                        console.log('neworder',neworder)
                        // console.log('imagelist',this.state.imageList)
                        this.selectImage(order.index)
                    }
                }

                // SET DETAILS SHOW
                this.setState({
                    itemselect:item
                })
            }
        }
    }

    isJson=(data)=>{
        try{
            if(data===null||data===''){
                return []
            }
            return JSON.parse(data)
        }catch{
            return []
        }
    }


    renderImageList=()=>{

        return this.state.imageList.map((image,index)=>{
            return (
                <div
                    key={index}
                    
                    style={{
                        flex:`0 0 calc(100%/${slidercount})`,
                        // marginRight:'10px',
                        padding:'1em .25rem 1em .25rem',
                        // paddingRight:'10px',
                        // padding:'2px',
                        // margin:'0',
                        // borderRadius:'4px',
                        // overflow:'hidden',
                        
                }}>
                    <div
                        className={index===this.state.imageselectorder?'product-image selected':'product-image'}
                        
                        style={{
                            width:'100%',
                            paddingTop:'80%',
                            backgroundImage:`url(${APIURL+image})`,
                            backgroundSize:'contain',
                            backgroundRepeat:'no-repeat',
                            backgroundPosition:'center',
                            borderRadius:'4px',
                            // border:
                            // index==this.state.imageselectorder?
                            // '1px solid red'
                            // : '0 px'
                        }}
                        onClick={()=>{
                            // console.log(index)
                            // console.log(this.state.imageselectorder)
                            this.setState({
                                imageshow:image,
                                imageselectorder:index,
                            })
                        }}
                    />
                </div>
            )
        })
        
    }
    
    renderTypes=()=>{
        var variant=this.isJson(this.state.product.variant)
        

        return variant.map((val,index)=>{
            if(!val.name){
                return null
            }
            return (
                <Grid.Row key={index} style={{margin:'0em 0 0em'}}>
                    <Grid.Column width={3} style={{display:'flex',alignItems:'center'}}>
                        <Header as={'span'} style={styles.detail}>{titleConstruct(val.name)}</Header>
                    </Grid.Column>
                    <Grid.Column width={13}>
                        {
                            val.types.map((type,j)=>{
                                var focus=this.state.typeselect[index]===type
                                return (
                                    <Button
                                        key={j}
                                        basic
                                        primary={focus}
                                        onClick={()=>{
                                            var select=this.state.typeselect
                                            select[index]=type
                                            // console.log(select)
                                            this.setState({typeselect:select})
                                            this.selectItem()
                                        }}
                                    >
                                        {type}
                                    </Button>
                                )
                            })
                        }
                    </Grid.Column>

                </Grid.Row>
            )
        })
    }

    renderDetails=()=>{
        // if(!this.state.items.length){
        //     return null
        // }
        var priceList=this.state.items.map((item)=>{
            return item.price
        })
        // console.log('price list'+priceList)
        // console.log(Math.max(...priceList))
        
        return (
            <Grid.Row>
                <Grid.Column width={3} style={{display:'flex'}}>
                    <Header as={'span'} style={styles.detail}>Harga</Header>
                </Grid.Column>
                <Grid.Column width={13}>
                    {
                        this.state.flashsaleprice?
                        <Header as={'span'} color='blue' style={{fontSize:'18px',display:'block',margin:'0 0 .2em'}}>
                            {idr(this.state.flashsaleprice)} 
                            <span style={{color:'black',marginLeft:'1em',fontSize:'14px'}}>flashsale</span>
                        </Header>
                        : null
                    }
                    <Header as={'span'} style={{fontSize:'18px',opacity:this.state.itemselect.price?'1':'.7',position:'relative'}}>
                        {this.state.itemselect.price?idr(this.state.itemselect.price):idr(Math.max(...priceList))}
                        {
                            this.state.flashsaleprice?
                            <div
                                style={{
                                    width:'100%',
                                    height:'1.5px',
                                    backgroundColor:'rgba(0,0,0,.8)',
                                    position:'absolute',
                                    top:'50%',
                                }}
                            />
                            : null
                        }
                    </Header>
                </Grid.Column>
            </Grid.Row>
        )
    }

    render() { 
        this.renderImageList()
        // const imagecover=this.isJson(this.state.product.imagecover)
        return ( 
            <Container style={{paddingTop:'2em',width:'600px',marginBottom:'4em'}}>

                <Segment style={{width:'100%',paddingBottom:'2em'}}>
                    <Grid>
                        <Grid.Row style={{position:'relative'}}>
                            <Grid.Column width={16} style={{marginBottom:'1em'}}>
                                <Header as={'h2'} style={{letterSpacing:'1px'}}>
                                    {titleConstruct(this.state.product.product_name)}
                                    <Dimmer active={this.state.pageloading} inverted>
                                        <Loader inverted/>
                                    </Dimmer>

                                    {/* {this.state.items[0]?this.state.items[0].product_name:''}
                                    <Dimmer active={this.state.pageloading} inverted>
                                        <Loader inverted/>
                                    </Dimmer> */}
                                </Header>
                            </Grid.Column>
                            <Grid.Column width={16}>
                                <div
                                    style={{
                                        width:'100%',
                                        paddingTop:'75%',
                                        backgroundImage:`url(${APIURL+this.state.imageshow})`,
                                        backgroundSize:'contain',
                                        backgroundRepeat:'no-repeat',
                                        backgroundPosition:'center',
                                    }}
                                />
                            </Grid.Column>
                            <Grid.Column 
                                width={16} 
                                style={{
                                    // margin:'.5em 0',
                                    // overflow:'hidden',
                                    padding:'0 .75rem'

                                }}
                            >   
                                <div style={{overflowX:'hidden'}}>
                                    
                                    <div style={{
                                        display:'flex',
                                        flexDirection:'row',
                                        // overflow:'hidden',
                                        transform:`translate(${-this.state.order*100/slidercount}%,0)`,
                                        transition:'all .3s ease 0s'
                                    }}>
                                        {this.renderImageList()}

                                    </div>

                                    <Button 
                                        icon='chevron left' 
                                        size='big'
                                        style={{
                                            position:'absolute',
                                            bottom:'70px',
                                            left:'0',
                                            transform:'translate(-0%,50%)',
                                            marginLeft:'.25em',
                                            visibility:this.state.order===0?'hidden':'visible'
                                        }}
                                        onClick={()=>{
                                            this.setState({
                                                order: this.state.order===0?0:this.state.order-1
                                            })
                                        }}
                                    />
                                    <Button 
                                        icon='chevron right' 
                                        size='big'
                                        style={{
                                            position:'absolute',
                                            bottom:'70px',
                                            right:'0',
                                            transform:'translate(0%,50%)',
                                            visibility:this.state.order===this.state.maxorder?'hidden':'visible'
                                        }}
                                        onClick={()=>{
                                            this.setState({
                                                order: this.state.order===this.state.maxorder?this.state.order:this.state.order+1
                                            })
                                        }}
                                    />
                                </div>
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row style={{paddingTop:'.5em'}}>
                            <Grid.Column width={16}>
                                <div style={{display:'inline-block',marginRight:'1em'}}>
                                    <Rating 
                                        icon='star' 
                                        style={{marginRight:'.5em'}}
                                        defaultRating={this.state.product.product_rating} 
                                        maxRating={5} 
                                        disabled
                                    />
                                    <span>({this.state.product.product_rating?this.state.product.product_rating:'no rating'})</span>
                                </div>
                                seen({this.state.product.seen})
                            </Grid.Column>
                            
                        </Grid.Row>

                        {this.renderTypes()}

                        {this.renderDetails()}

                        <Grid.Row>
                            <Grid.Column width={16} style={{display:'flex',alignItems:'center',marginBottom:'.5em'}}>
                                <Header as={'span'} style={styles.detail}>Description</Header>
                            </Grid.Column>
                            {
                                this.state.product.description?
                                <Grid.Column width={16}>
                                    {this.state.product.description}
                                </Grid.Column>
                                : null
                            }
                        </Grid.Row>

                        <Grid.Row>
                            <Grid.Column width={3} style={{display:'flex',alignItems:'center'}}>
                                <Header as={'span'} style={styles.detail}>Jumlah</Header>
                            </Grid.Column>
                            <Grid.Column width={13}>
                                
                                <Button
                                    basic
                                    style={{height:'100%',margin:'0 .5em'}}
                                    onClick={()=>{
                                        this.setState({qtymessage:''})
                                        if(this.state.qty===0||this.state.qty===''||this.state.qty===null||this.state.qty===undefined){
                                            this.setState({qty:0})
                                        }else{
                                            this.setState({qty:this.state.qty-1})
                                        }
                                    }}
                                >
                                    -
                                </Button>
                                <Input
                                    // type='number'
                                    style={{
                                        width:'45px',
                                        // display:'inline-block',
                                        textAlign:'center'
                                    }}
                                    value={this.state.qty}
                                    onChange={(e)=>{
                                        // protection
                                        // integer
                                        var value=Number.isInteger(parseInt(e.target.value))?parseInt(e.target.value):''
                                        // console.log(Number.isInteger(e.target.value))
                                        this.setState({qty:value})
                                    }}
                                />
                                <Button
                                    basic
                                    style={{height:'100%',margin:'0 1.5em 0 .5em'}}
                                    onClick={()=>{
                                        // CHECK STOCK
                                        if(this.state.itemselect.stock<this.state.qty+1){
                                            this.setState({qtymessage:'Stock is not enough'})
                                        }else{
                                            this.setState({qtymessage:''})
                                        }
                                        // ADD QTY
                                        if(this.state.qty===''||this.state.qty===null||this.state.qty===undefined){
                                            this.setState({qty:1})
                                        }else{
                                            this.setState({qty:this.state.qty+1})
                                        }
                                    }}
                                    disabled={this.state.itemselect.stock<this.state.qty}
                                >
                                    +
                                </Button>
                                {
                                    this.state.qtymessage?
                                    <div style={{display:'inline-block'}}>
                                        <Message style={{position:'absolute',top:'0',color:'red'}}>{this.state.qtymessage}</Message>
                                    </div>
                                    : null
                                }
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row>
                            <Grid.Column width={3} style={{display:'flex',alignItems:'center'}}>
                                <Header as={'span'} style={styles.detail}>Message to Seller</Header>
                            </Grid.Column>
                            <Grid.Column width={13}>
                            <Form>
                                <TextArea 
                                    placeholder='Message (max 200 characters)' 
                                    value={this.state.message}
                                    onChange={(e)=>{
                                        this.setState({message:e.target.value})
                                    }}
                                />
                            </Form>
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row>
                            <Grid.Column style={{display:'flex',justifyContent:'flex-end',alignItems:'center'}}>
                                {
                                    this.state.err?
                                    <Message style={{color:'red',display:'inline-block',margin:'0'}}>
                                        {this.state.err}
                                    </Message>
                                    : null
                                }
                                {
                                    this.props.User.islogin?
                                    <Button 
                                        icon 
                                        basic
                                        // style={{padding:'0',width:'',height:''}}
                                        onClick={this.onAddToWishlist}
                                    >
                                        <Icon 
                                            name={this.state.iswishlist?'heart':'heart outline'}
                                            color={this.state.iswishlist?'red':'grey'}
                                            size='large'
                                            // style={{fontSize:'21px',verticalAlign:'-5px'}}
                                            style={{marginLeft:'2em'}}
                                        />
                                    </Button>
                                    : null
                                }
                                {
                                    this.props.User.islogin?
                                    <Button
                                        primary
                                        style={{marginLeft:'1em',height:'100%'}}
                                        onClick={this.onAddToCart}
                                        loading={this.state.loading}
                                        disabled={this.state.loading}
                                    >
                                        Add to Cart
                                    </Button>
                                    :
                                    <Button
                                        primary
                                        style={{marginLeft:'2em'}}
                                        as={Link}
                                        to='/register'
                                    >
                                        Register to purchase
                                    </Button>
                                }

                            </Grid.Column>
                        </Grid.Row>

                    <CommentSection idproduct={this.state.product.idproduct}/>

                    </Grid>
                </Segment>
                
                {
                    this.state.buy?
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
                        Product is added to the cart <Icon name='check'/>
                    </Message>
                    : null
                }

            </Container>
         );
    }
}

const styles={
    detail:{
        fontSize:'15px',
        color:'rgba(0,0,0,.6)'
    }
}

const MapstatetoProps=(state)=>{
    return {
        User: state.Auth
    }
}

 
export default connect(MapstatetoProps,{LoadCart}) (Product);