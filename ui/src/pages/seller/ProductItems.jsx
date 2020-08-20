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
    Divider,
    Dimmer,
    Loader
} from 'semantic-ui-react'
import {idr} from '../../supports/services'
import { connect } from 'react-redux'



class ProductItems extends Component {
    state = { 
        coverloading:true,
        itemloading:true,

        access:true,

        idseller:0,

        // Product
        pageloading:true,
        product:{
            isdeleted: false
        },
        deletecoverimageindex:-1,
        coverimage:[],
        loadingcoveradd:false,
        editproduct:false,
        deleteproduct:false,
        newproductname:'',
        newdescription:'',
        loadingeditproduct:false,

        errorcover:'',

        // Items
        items:[],
        editid:0,
        price:0,
        stock:0,
        image:[],
        loadingimageaddid:0,
        loadingedit:false,

        deleteimageiditem:-1,
        deleteimageindex:-1,

        errorimage:'',


        // Deleted Product
        permitproduct:false
    }

    componentDidMount=()=>{
        this.getProduct()
        this.getItems()
    }

    getProduct=()=>{
        
        Axios.get(`${APIURL}/products/get/${this.props.match.params.idproduct}`)
        .then((res)=>{
            console.log('product data',res.data)
            // CHECK ACCESS
            if(this.props.Seller.idseller===res.data.idseller){
                this.setState({product:res.data,coverloading:false})
            }else{
                this.setState({product:res.data,coverloading:false,access:false})
            }
        }).catch((err)=>{
            console.log(err)
        })

    }
    
    getItems=()=>{

        Axios.get(`${APIURL}/items?idproduct=${this.props.match.params.idproduct}`)
        .then((res)=>{
            console.log(res.data)
            this.setState({items:res.data,itemloading:false,pageloading:false})
        }).catch((err)=>{
            console.log(err)
        })
    }

    onAddCover=()=>{
        this.setState({loadingcoveradd:true})
        if(this.state.image.length>5){
            // error message
            this.setState({errorcover:'Jumlah upload image tidak bisa lebih dari 5',loadingcoveradd:false})
        }else{
            console.log('add cover image')

            var formdata=new FormData()

            for(var image of this.state.coverimage){
                formdata.append('photo',image)
            }

            formdata.append('data',this.state.product.imagecover)
    
            Axios.put(`${APIURL}/products/image/${this.state.product.idproduct}`,formdata,{
                headers:{
                    'Content-Type': `undefined`
                }
            }).then((res)=>{
                console.log('berhasil update cover image')
                this.setState({coverimage:[],loadingcoveradd:false})
                document.getElementById('cover').value='' // clear input file image
                this.getProduct()
            }).catch((err)=>{
                console.log(err)
            })
        }
    }

    onDeleteCover=(index,oldcover)=>{

        Axios.put(`${APIURL}/products/image/${this.state.product.idproduct}/${index}`,oldcover)
        .then((res)=>{
            console.log('berhasil delete cover')
            this.setState({deletecoverimageindex:-1})
            this.getProduct()
        }).catch((err)=>{
            console.log(err)
        })

    }

    onSubmitProduct=()=>{
        this.setState({loadingeditproduct:true})
        var edit={
            product_name: this.state.newproductname,
            description: this.state.newdescription
        }

        Axios.put(`${APIURL}/products/${this.state.product.idproduct}`,edit)
        .then((res)=>{
            console.log('berhasil update product')
            this.getProduct()
            this.setState({editproduct:false,loadingeditproduct:false})
        }).catch((err)=>{
            console.log(err)
        })

    }

    onDeleteProduct=()=>{
        var edit={
            isdeleted: true
        }

        Axios.put(`${APIURL}/products/${this.state.product.idproduct}`,edit)
        .then((res)=>{
            console.log('berhasil delete product')
            this.getProduct()
            this.setState({deleteproduct:false})
        }).catch((err)=>{
            console.log(err)
        })
    }

    onUnblockProduct=()=>{

        var edit={
            isdeleted: false
        }

        Axios.put(`${APIURL}/products/${this.state.product.idproduct}`,edit)
        .then((res)=>{
            console.log('berhasil unblock product')
            this.getProduct()
            this.setState({permitproduct:false})
        }).catch((err)=>{
            console.log(err)
        })

    }

    onAddPhoto=(iditem,oldimage)=>{
        this.setState({loadingimageaddid:iditem})
        if(this.state.image.length>5){
            // error message
            this.setState({errorimage:'Jumlah upload image tidak bisa lebih dari 5',loadingimageaddid:0})
        }else{
            console.log('add image')

            var formdata=new FormData()

            for(var image of this.state.image){
                formdata.append('photo',image)
            }
    
            formdata.append('data',oldimage)
    
            Axios.put(`${APIURL}/items/image/${iditem}`,formdata,{
                headers:{
                    'Content-Type': `undefined`
                }
            }).then((res)=>{
                console.log('berhasil update item')
                this.setState({image:[],loadingimageaddid:0})
                document.getElementById(iditem).value=''
                this.getItems()
            }).catch((err)=>{
                console.log(err)
            })
        }

    }

    onDeletePhoto=(iditem,index,oldimage)=>{

        Axios.put(`${APIURL}/items/image/${iditem}/${index}`,oldimage)
        .then((res)=>{
            console.log('berhasil delete image')
            this.setState({deleteimageiditem:-1,deleteimageindex:-1})
            this.getItems()
        }).catch((err)=>{
            console.log(err)
        })
    }

    onSubmit=()=>{
        this.setState({loadingedit:true})
        var edit={
            price:this.state.price?this.state.price:0,
            stock:this.state.stock?this.state.stock:0
        }

        Axios.put(`${APIURL}/items/${this.state.editid}`,edit)
        .then((res)=>{
            console.log('berhasil update item')
            this.setState({editid:0,stock:0,price:0,loadingedit:false})
            this.getItems()
        }).catch((err)=>{
            console.log(err)
        })

        // Axios.put(`${APIURL}/items/${this.state.editid}`,edit)
        // .then((res)=>{
        //     console.log('berhasil update item')
        //     this.setState({editid:0,stock:0,price:0})
        //     this.getItems()
        // }).catch((err)=>{
        //     console.log(err)
        // })
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

    renderProduct=()=>{
        if(this.state.product.imagecover){
            // console.log(this.state.product.imagecover)
            var coverimages=this.isJson(this.state.product.imagecover)
            // console.log('cover images',coverimages)
        }

        return (
            <Segment>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={16}>
                            <Header as={'h4'}>Cover Photo</Header>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row style={{padding:'0 1rem'}}>
                        {
                            // OPTIONAL CHAINING OPERATOR
                            coverimages?.length?
                            // Array.isArray(coverimages)&&coverimages.length?
                            coverimages.map((image,index)=>{
                                // console.log(image)
                                return (
                                    <Grid.Column key={index} width={4} style={{padding:'.5em 1em .5em 0'}}>
                                        <Segment 
                                            style={{padding:'.5em',width:'100%',textAlign:'center'}}
                                            loading={this.state.coverloading}
                                        >
                                            <div 
                                                style={{
                                                    paddingTop:'80%',
                                                    backgroundImage:`url('${APIURL+image}')`,
                                                    backgroundSize:'contain',
                                                    backgroundRepeat:'no-repeat',
                                                    backgroundPosition:'center',
                                                    marginBottom:'1em'
                                                }}
                                            />
                                            {
                                                index===this.state.deletecoverimageindex?
                                                <Button 
                                                    basic
                                                    color='red'
                                                    onClick={()=>{this.onDeleteCover(index,coverimages)}}
                                                >
                                                    Confirm
                                                </Button>
                                                :
                                                <Button 
                                                    basic
                                                    onClick={()=>{this.setState({deletecoverimageindex:index})}}
                                                >
                                                    Remove
                                                </Button>

                                            }
                                        </Segment>
                                    </Grid.Column>
                                )
                            })
                            : 
                            <Grid.Column width={4} style={{padding:'.5em 1em .5em 0'}}>
                                <Segment 
                                    style={{padding:'.5em',width:'100%',textAlign:'center'}}
                                    loading={this.state.coverloading}    
                                >
                                    <div 
                                        style={{
                                            paddingTop:'80%',
                                            backgroundImage:`url(https://react.semantic-ui.com/images/wireframe/image.png)`,
                                            backgroundSize:'contain',
                                            backgroundRepeat:'no-repeat',
                                            backgroundPosition:'center',
                                            marginBottom:'1em'
                                        }}
                                    />
                                    <Button basic disabled>No Images</Button>
                                </Segment>
                            </Grid.Column>
                        }
                        
                        <Grid.Column width={16} style={{margin:'1em 0',padding:'0'}}>
                            <Input 
                                type='file'
                                id='cover'
                                multiple
                                style={{marginRight:'1em'}}
                                onChange={(e)=>{
                                    if(e.target.files){
                                        // console.log(e.target.files)
                                        this.setState({coverimage:e.target.files})
                                    }
                                }}
                            />
                            <Button
                                basic
                                primary
                                loading={this.state.loadingcoveradd}
                                style={{height:'100%'}}
                                onClick={()=>{this.onAddCover()}}
                            >
                                Add
                            </Button>
                        </Grid.Column>
                        {
                            this.state.errorcover?
                            <Grid.Column width={16}>
                                <span style={{color:'red'}}>{this.state.errorcover}</span>
                            </Grid.Column>
                            : null
                        }
                    </Grid.Row>

                    <Divider />

                    {
                        this.state.editproduct?
                        <Grid.Row>
                            <Grid.Column width={16} style={{marginBottom:'1em'}}>
                                <span style={{display:'block'}}>Product Name</span>
                                <Input
                                    placeholder='Product Name'
                                    value={this.state.newproductname}
                                    onChange={(e)=>{this.setState({newproductname:e.target.value})}}
                                />
                            </Grid.Column>
                            <Grid.Column width={16} style={{marginBottom:'1em'}}>
                                <span style={{display:'block'}}>Description</span>
                                <Form>
                                    <TextArea
                                        placeholder='Description'
                                        style={{maxWidth:'500px'}}
                                        value={this.state.newdescription}
                                        onChange={(e)=>{this.setState({newdescription:e.target.value})}}
                                    />
                                </Form>
                            </Grid.Column>

                            <Grid.Column width={16} style={{textAlign:'right'}}>
                                <Button
                                    primary
                                    loading={this.state.loadingeditproduct}
                                    disabled={this.state.loadingeditproduct}
                                    onClick={this.onSubmitProduct}
                                >
                                    Submit
                                </Button>
                                <Button
                                    // primary
                                    onClick={()=>{this.setState({
                                        editproduct:false
                                    })}}
                                >
                                    Cancel
                                </Button>
                            </Grid.Column>

                        </Grid.Row>
                        :
                        <Grid.Row>
                            <Grid.Column width={16} style={{marginBottom:'1em'}}>
                                <span >Product Name:</span>
                                <span style={{fontWeight:600,marginLeft:'.5em'}}>{this.state.product.product_name}</span>
                            </Grid.Column>
                            <Grid.Column width={16} style={{marginBottom:'1em'}}>
                                <span>Description:</span>
                                <p style={{fontWeight:300,marginTop:'.5em'}}>{this.state.product.description}</p>
                            </Grid.Column>

                            {
                                this.state.deleteproduct?
                                <Grid.Column width={16} style={{textAlign:'right'}}>
                                    <Button
                                        color='red'
                                        onClick={this.onDeleteProduct}
                                    >
                                        Confirm
                                    </Button>
                                    <Button
                                        // primary
                                        onClick={()=>{this.setState({
                                            deleteproduct:false
                                        })}}
                                    >
                                        Cancel
                                    </Button>
                                </Grid.Column>
                                :
                                <Grid.Column width={16} style={{textAlign:'right'}}>
                                    <Button
                                        primary
                                        onClick={()=>{this.setState({
                                            editproduct:true,
                                            newproductname:this.state.product.product_name,
                                            newdescription:this.state.product.description
                                        })}}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        color='red'
                                        onClick={()=>{this.setState({
                                            deleteproduct:true
                                        })}}
                                    >
                                        Delete
                                    </Button>
                                </Grid.Column>

                            }

                        </Grid.Row>
                    }

                </Grid>
            </Segment>

        )
    }

    renderProductIsDeleted=()=>{
        if(this.state.product.imagecover){
            // console.log(this.state.product.imagecover)
            var coverimages=this.isJson(this.state.product.imagecover)
            // console.log(coverimages)
        }

        return (
            <Segment>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={16}>
                            <Header as={'h4'}>Cover Photo</Header>
                        </Grid.Column>
                        <div style={{
                            position:'absolute',
                            top:'0',
                            left:'0',
                            width:'100%',
                            height:'100%',
                            background:'rgba(255,255,255,.5)'
                        }}/>
                    </Grid.Row>
                    <Grid.Row style={{padding:'0 1rem'}}>
                        {
                            // OPTIONAL CHAINING OPERATOR
                            coverimages?.length?
                            coverimages.map((image,index)=>{
                                // console.log(image)
                                return (
                                    <Grid.Column key={index} width={4} style={{padding:'.5em 1em .5em 0'}}>
                                        <Segment style={{padding:'.5em',width:'100%',textAlign:'center'}}>
                                            <div 
                                                style={{
                                                    paddingTop:'80%',
                                                    backgroundImage:`url('${APIURL+image}')`,
                                                    backgroundSize:'contain',
                                                    backgroundRepeat:'no-repeat',
                                                    backgroundPosition:'center',
                                                    marginBottom:'1em'
                                                }}
                                            />
                                            {
                                                index===this.state.deletecoverimageindex?
                                                <Button 
                                                    basic
                                                    color='red'
                                                    onClick={()=>{this.onDeleteCover(index,coverimages)}}
                                                >
                                                    Confirm
                                                </Button>
                                                :
                                                <Button 
                                                    disabled
                                                    basic
                                                    onClick={()=>{this.setState({deletecoverimageindex:index})}}
                                                >
                                                    Remove
                                                </Button>

                                            }
                                        </Segment>
                                    </Grid.Column>
                                )
                            })
                            : 
                            <Grid.Column width={4} style={{padding:'.5em 1em .5em 0'}}>
                                <Segment 
                                    style={{padding:'.5em',width:'100%',textAlign:'center'}}
                                    loading={this.state.coverloading}    
                                >
                                    <div 
                                        style={{
                                            paddingTop:'80%',
                                            backgroundImage:`url(https://react.semantic-ui.com/images/wireframe/image.png)`,
                                            backgroundSize:'contain',
                                            backgroundRepeat:'no-repeat',
                                            backgroundPosition:'center',
                                            marginBottom:'1em'
                                        }}
                                    />
                                    <Button basic disabled>No Images</Button>
                                </Segment>
                            </Grid.Column>
                        }
                        
                        <Grid.Column width={16} style={{margin:'1em 0',padding:'0'}}>
                            <Input 
                                disabled
                                type='file'
                                id='cover'
                                multiple
                                style={{marginRight:'1em'}}
                                // onChange={(e)=>{
                                //     if(e.target.files){
                                //         // console.log(e.target.files)
                                //         this.setState({coverimage:e.target.files})
                                //     }
                                // }}
                            />
                            <Button
                                disabled
                                basic
                                primary
                                style={{height:'100%'}}
                                onClick={()=>{this.onAddCover()}}
                            >
                                Add
                            </Button>
                        </Grid.Column>
                        <div style={{
                            position:'absolute',
                            top:'0',
                            left:'0',
                            width:'100%',
                            height:'100%',
                            background:'rgba(255,255,255,.5)'
                        }}/>
                    </Grid.Row>

                    <Divider />

                        
                    <Grid.Row>
                        <Grid.Column width={16} style={{marginBottom:'1em'}}>
                            <span >Product Name:</span>
                            <span style={{fontWeight:600,marginLeft:'.5em'}}>{this.state.product.product_name}</span>
                            <div style={{
                                position:'absolute',
                                top:'0',
                                left:'0',
                                width:'100%',
                                height:'100%',
                                background:'rgba(255,255,255,.5)'
                            }}/>
                        </Grid.Column>
                        <Grid.Column width={16} style={{marginBottom:'1em'}}>
                            <span>Description:</span>
                            <p style={{fontWeight:300,marginTop:'.5em'}}>{this.state.product.description}</p>
                            <div style={{
                                position:'absolute',
                                top:'0',
                                left:'0',
                                width:'100%',
                                height:'100%',
                                background:'rgba(255,255,255,.5)'
                            }}/>
                        </Grid.Column>

                        {
                            this.state.permitproduct?
                            <Grid.Column width={16} style={{textAlign:'right'}}>
                                <Button
                                    primary
                                    onClick={this.onUnblockProduct}
                                >
                                    Confirm
                                </Button>
                                <Button
                                    // primary
                                    onClick={()=>{this.setState({
                                        permitproduct:false
                                    })}}
                                >
                                    Cancel
                                </Button>
                            </Grid.Column>
                            :
                            <Grid.Column width={16} style={{textAlign:'right'}}>
                                <Button
                                    primary
                                    onClick={()=>{this.setState({
                                        permitproduct:true
                                    })}}
                                >
                                    Unblock
                                </Button>
                                {/* <Button
                                    color='red'
                                    onClick={()=>{this.setState({
                                        deleteproduct:true
                                    })}}
                                >
                                    Delete
                                </Button> */}
                            </Grid.Column>

                        }

                    </Grid.Row>
                    <div style={{
                        position:'absolute',
                        top:'50%',
                        left:'0',
                        width:'100%',
                        // height:'100%',
                        textAlign:'center'
                    }}>
                        <Header as={'p'} style={{fontSize:'40px',color:'rgba(0,0,0,.7)'}}>Deleted</Header>
                    </div>
                </Grid>

                
            </Segment>
        )
    }

    renderItems=()=>{
        // const isJson=(data)=>{
        //     try{
        //         if(data==null||data==''){
        //             return []
        //         }
        //         return JSON.parse(data)
        //     }catch{
        //         return []
        //     }
        // }
        return this.state.items.map((item,index)=>{

            const type=this.isJson(item.type)
            const image=this.isJson(item.image)
            // console.log(type)
            return (
                <Segment key={index} style={{width:'100%'}}>
                    <Grid>
                        {
                            type.length?
                            <>
                            <Grid.Row style={{paddingBottom:'0'}}>
                                <Grid.Column width={16}>
                                    <Header as={'h4'} style={{width:'100%'}}>Type</Header>
                                </Grid.Column>
                                <Grid.Column width={4}>
                                    {
                                        type.length?
                                        type.map((itemtype,index)=>{
                                            return (
                                                <span key={index} style={{margin:'0 .5em 0 0',padding:'0'}}>{itemtype?itemtype:'no type'}</span>
                                            )
                                        })
                                        :
                                        <span key={index} style={{margin:'0 .5em 0 0',padding:'0'}}>no type</span>
                                    }
                                </Grid.Column>
                            </Grid.Row>
                            <Divider />
                            <Grid.Row style={{paddingBottom:'0'}}>
                                <Grid.Column width={16}>
                                    <Header as={'h4'} style={{width:'100%',marginBottom:'.5em'}}>Images</Header>
                                </Grid.Column>
                            </Grid.Row>
                            </>
                            : null
                        }
                        

                          
                        <Grid.Row style={{padding:'0 1rem',display:type.length?'flex':'none'}}>
                            {/* <Grid.Column 
                                width={16} 
                                style={{
                                    marginBottom:'1em',
                                    display:'flex',
                                    flexDirection:'row',
                                    alignItems:'flex-end',
                                    flexWrap:'wrap'
                                }}
                            > */}
                                {
                                    // Array.isArray(image)&&image.length?
                                    // OPTIONAL CHAINING OPERATOR
                                    image?.length?
                                    image.map((path,index)=>{
                                        return (
                                                
                                            // <div
                                            //     key={index}
                                            //     style={{
                                            //         // width:'25%',
                                            //         display:'inline-block',
                                            //         textAlign:'center',
                                            //         padding:'.5em 1em .5em 0',
                                            //         display:'flex',
                                            //         flexBasis:'25%',
                                            //         // flexDirection:'row'
                                            //     }}
                                            // >   
                                            <Grid.Column key={index} width={4} style={{padding:'.5em 1em .5em 0'}}>
                                                <Segment 
                                                    style={{padding:'.5em',width:'100%',textAlign:'center'}}
                                                    loading={this.state.itemloading}
                                                >
                                                    <div 
                                                        style={{
                                                            paddingTop:'80%',
                                                            backgroundImage:`url('${APIURL+path}')`,
                                                            backgroundSize:'contain',
                                                            backgroundRepeat:'no-repeat',
                                                            backgroundPosition:'center',
                                                            marginBottom:'1em'
                                                        }}
                                                    />
                                                    {
                                                        item.iditem===this.state.deleteimageiditem&&index===this.state.deleteimageindex?
                                                        <Button 
                                                            basic
                                                            color='red'
                                                            onClick={()=>{this.onDeletePhoto(item.iditem,index,image)}}
                                                        >
                                                            Confirm
                                                        </Button>
                                                        :
                                                        <Button 
                                                            basic
                                                            onClick={()=>{this.setState({deleteimageiditem:item.iditem,deleteimageindex:index})}}
                                                        >
                                                            Remove
                                                        </Button>

                                                    }
                                                </Segment>
                                            </Grid.Column>
                                            // </div>
                                        )
                                    })
                                    :
                                    <>
                                    <Grid.Column key={index} width={4} style={{padding:'.5em 1em .5em 0'}}>
                                        <Segment 
                                            style={{padding:'.5em',width:'100%',textAlign:'center'}}
                                            loading={this.state.itemloading}    
                                        >
                                            <div 
                                                style={{
                                                    paddingTop:'80%',
                                                    backgroundImage:`url(https://react.semantic-ui.com/images/wireframe/image.png)`,
                                                    backgroundSize:'contain',
                                                    backgroundRepeat:'no-repeat',
                                                    backgroundPosition:'center',
                                                    marginBottom:'1em'
                                                }}
                                            />
                                            <Button basic disabled>No Images</Button>
                                        </Segment>
                                    </Grid.Column>
                                    <Grid.Column width={4} style={{padding:'.5em 1em .5em 0'}}>
                                        <Message style={{height:'100%'}}>
                                            if no image uploaded, cover image(s) will be shown 
                                        </Message>
                                    </Grid.Column>
                                    </>
                                }


                                {/* ADD PHOTO */}
                                {/* <div
                                    style={{
                                        width:'25%',
                                        display:'inline-block',
                                        textAlign:'center',
                                        padding:'.5em 1em .5em 0',
                                        display:'flex',
                                        flexDirection:'row'
                                    }}
                                >   
                                    <Segment style={{padding:'.5em',width:'100%'}}>
                                        <div 
                                            style={{
                                                paddingTop:'80%',
                                                backgroundImage:`url(https://react.semantic-ui.com/images/wireframe/image.png)`,
                                                backgroundSize:'contain',
                                                backgroundRepeat:'no-repeat',
                                                backgroundPosition:'center',
                                                marginBottom:'1em'
                                            }}
                                        />
                                        <Button basic primary>Add</Button>
                                    </Segment>
                                </div> */}
                            {/* </Grid.Column> */}

                            <Grid.Column width={16} style={{margin:'1em 0',padding:'0'}}>
                                <Input 
                                    type='file'
                                    id={item.iditem}
                                    multiple
                                    style={{marginRight:'1em'}}
                                    onChange={(e)=>{
                                        if(e.target.files){
                                            // console.log(e.target.files)
                                            this.setState({image:e.target.files})
                                        }
                                    }}
                                />
                                <Button
                                    basic
                                    primary
                                    loading={item.iditem===this.state.loadingimageaddid}
                                    style={{height:'100%'}}
                                    onClick={()=>{this.onAddPhoto(item.iditem,item.image)}}
                                >
                                    Add
                                </Button>
                            </Grid.Column>
                            {
                                this.state.errorimage?
                                <Grid.Column width={16}>
                                    <span style={{color:'red'}}>{this.state.errorimage}</span>
                                </Grid.Column>
                                : null
                            }
                        </Grid.Row>

                        <Divider style={{display:type.length?'block':'none'}}/>
                            
                            {
                                item.iditem===this.state.editid?
                                <Grid.Row>
                                    <Grid.Column width={16} style={{marginBottom:'1em'}}>
                                        <Header as={'h4'} style={{width:'100%'}}>Details</Header>
                                    </Grid.Column>
                                    <Grid.Column width={16} style={{marginBottom:'1em'}}>
                                        <Input
                                            placeholder='Price'
                                            value={this.state.price}
                                            onChange={(e)=>{this.setState({price:e.target.value})}}
                                        />
                                    </Grid.Column>
                                    <Grid.Column width={16} style={{marginBottom:'1em'}}>
                                        <Input
                                            placeholder='Stock'
                                            value={this.state.stock}
                                            onChange={(e)=>{this.setState({stock:e.target.value})}}
                                        />
                                    </Grid.Column>
                                    
                                    <Grid.Column width={16} style={{textAlign:'right'}}>
                                        <Button
                                            primary
                                            loading={item.iditem===this.state.editid&&this.state.loadingedit}
                                            disabled={item.iditem===this.state.editid&&this.state.loadingedit}
                                            // style={{marginLeft:'auto'}}
                                            onClick={this.onSubmit}
                                        >
                                            Save  
                                        </Button>
                                        <Button
                                            color='red'
                                            // style={{marginLeft:'auto'}}
                                            onClick={()=>{this.setState({
                                                editid:0,
                                                price:0,
                                                stock:0
                                            })}}
                                        >
                                            No
                                        </Button>
                                    </Grid.Column>
                                </Grid.Row>
                                :
                                <Grid.Row>
                                    <Grid.Column width={16} style={{marginBottom:'1em'}}>
                                        <Header as={'h4'} style={{width:'100%'}}>Details</Header>
                                    </Grid.Column>
                                    <Grid.Column width={16} style={{marginBottom:'1em'}}>
                                        <span >Harga:</span>
                                        <span style={{fontWeight:600,marginLeft:'.5em'}}>{item.price?idr(item.price):'Not Yet'}</span>
                                    </Grid.Column>
                                    <Grid.Column width={16} style={{marginBottom:'1em'}}>
                                        <span >Stock:</span>
                                        <span style={{fontWeight:600,marginLeft:'.5em'}}>{item.stock?item.stock:'Not Yet'}</span>
                                    </Grid.Column>
                                    
                                    <Grid.Column width={16} style={{textAlign:'right'}}>
                                        <Button
                                            primary
                                            // style={{marginLeft:'auto'}}
                                            onClick={()=>{this.setState({
                                                editid:item.iditem,
                                                price:item.price?item.price:'',
                                                stock:item.stock?item.stock:''
                                            })}}
                                        >
                                            Edit    
                                        </Button>
                                    </Grid.Column>
                                </Grid.Row>
                            }

                    </Grid>
                </Segment>
            )
                
        })
    }

    renderAfterAdd=()=>{
        var isnew=true
        this.state.items.forEach((item)=>{
            if(item.price){
                isnew=false
            }
        })
        if(isnew&&!this.state.pageloading){
            return (
                <Message>Set Up Your Product's Price And Stock</Message>
            )
        }
    }

    render() { 

        if(this.props.Seller.idseller===this.state.product.idseller){
            return ( 
                <Container style={{paddingTop:'2em',width:'650px'}}>
    
                <Header 
                    as={'h1'}
                    style={{marginBottom:'1em',position:'relative',height:'36px'}}
                >
                    {this.state.items[0]?this.state.items[0].product_name:''}
                    <Dimmer active={this.state.pageloading} inverted>
                        <Loader inverted/>
                    </Dimmer>
                </Header>
    
                {this.renderAfterAdd()}
    
                {
                    this.state.product.isdeleted?
                    this.renderProductIsDeleted()
                    :
                    <>
                    {this.renderProduct()}
                    {this.renderItems()}
                    </>
                }
    
                    
                <Grid style={{marginBottom:'3em'}}>
    
                </Grid>
                </Container>
             );

        }else{
            return (
                // <Container style={{paddingTop:'2em',width:'650px',height:'80%'}}>
                    <Segment 
                        style={{
                            width:'650px',
                            position:'absolute',
                            top:'50%',
                            left:'50%',
                            transform:'translate(-50%,-50%)',
                            textAlign:'center',
                        }}
                    >
                        You have no Access to this page
                    </Segment>
                // </Container>
            )
        }
    }
}

const MapstatetoProps=(state)=>{
    return {
        Seller: state.Seller
    }
}
 
export default connect(MapstatetoProps) (ProductItems);