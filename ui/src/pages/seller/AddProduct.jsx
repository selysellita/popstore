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
    Checkbox,
    Dropdown
} from 'semantic-ui-react'
import {Redirect} from 'react-router-dom'
import { connect } from 'react-redux'
import { titleConstruct } from '../../supports/services'



class AddProduct extends Component {
    state = { 

        // REGISTER OPTIONS
        maincategories:[],
        loadingmaincategories:true,
        merklist:[],
        // ADD MERK
        merk:'',
        merkMessage:'',
        ismerkadded:false,

        // INPUT
        fileImage:[],
        idcategory:0,
        category:'',
        idmerk:99,
        productName:'',
        description:'',
        
        isvariety:false,
        varietiesCount:1,
        
        // such color or size
        varieties:[''],

        // such as red or large
        varietytypes:[[]],
        typecount:[0],

        varietyitems:[],

        // priceAdd:0,
        // stockAdd:0,

        // STATE
        message:'',

        // FOR REDIRECT PAGE
        newidproduct:0,

        // STATE
        loading: false



     }

    
    componentDidMount=()=>{

        // GET MAIN CATEGORIES LIST
        Axios.get(`${APIURL}/categories`)
        .then((categories)=>{
            console.log(categories.data)
            this.setState({maincategories:categories.data,loadingmaincategories:false})
        }).catch((err)=>{
            console.log(err)
        })

        this.getMerkList()
        
    }

    getMerkList=()=>{
        // GET MERK LIST
        Axios.get(`${APIURL}/merk`)
        .then((merk)=>{
            console.log('merk list',merk.data)
            var list=merk.data.map((val,index)=>{
                return {
                    key: index,
                    text: val.merk_name,
                    value: val.idmerk,
                }
            })
            this.setState({merklist:list})

        }).catch((err)=>{
            console.log(err)
        })
    }

    combineVarieties=()=>{
        if(this.state.varietyone&&this.state.varietytwo){
            var arr=[this.state.varietyone,this.state.varietytwo]
        }else if(this.state.varietyone){
            var arr=[this.state.varietyone]   
        }
        this.setState({varieties:arr})
    }


    onSubmit=()=>{

        // NEED TO ADD PROTECTION
        // ONLY SELLER CAN SUBMIT
        
        if(!this.state.productName || !this.state.description || !this.state.category || !this.state.fileImage.length || !this.state.idcategory){
            this.setState({message:'Masih ada kolom yang harus diisi'})
        }else if(this.state.fileImage.length>5){
            this.setState({message:'Jumlah image yang diupload tidak bisa lebih dari 5'})
        }else{

            this.setState({loading:true})

            console.log('creating product')


            var formdata=new FormData()

            // console.log(this.state.fileImageAdd[0])

            for(const image of this.state.fileImage){
                formdata.append('photo',image)
            }

            var variant=[]
            for(var i=0;i<this.state.varieties.length;i++){
                var obj={
                    name: this.state.varieties[i],
                    types: this.state.varietytypes[i]
                }
                variant.push(obj)
            }
            
            
            var product={
                product_name: this.state.productName,
                description: this.state.description,
                variant: JSON.stringify(variant),
                idseller: this.props.Seller.idseller,
                idcategory: this.state.idcategory,
                category: this.state.category,
                idmerk: this.state.idmerk
            }

            formdata.append('data',JSON.stringify(product))



            Axios.post(`${APIURL}/products`,formdata,{
                headers: {
                    'Content-Type': 'undefined'
                }
            }).then((newproduct)=>{
                console.log('upload product berhasil')

                console.log('creating items')
                console.log('product id')
                console.log(newproduct.data.insertId)

                console.log('variety types')
                console.log(this.state.varietytypes)

                var data={
                    idproduct: newproduct.data.insertId,
                    // types: this.state.varietytypes,
                    types: this.createitems()
                    // price and stock will be updated on the next page
                }

                Axios.post(`${APIURL}/items`,data)
                .then((newitems)=>{
                    console.log('upload item berhasil')
                    console.log(newitems.data)
                    this.setState({loading:false})
                    this.setState({newidproduct:newproduct.data.insertId})
                }).catch((err)=>{
                    console.log(err)
                })
            }).catch((err)=>{
                console.log(err)
            })
        }
    }


    // CURRENTLY NOT BEING USED
    onSubmitProduct=()=>{
        var product={
            product_name: this.state.productName,
            description: this.state.description,
            variant: JSON.stringify(this.state.varieties),
            idseller: 2, // need to update this to sellerid once redux is finished
            idcategory: 2, // need to update once category table is done
        }

        console.log(product)

        if(!this.state.productName || !this.state.description || !this.state.category){
            this.setState({message:'Masih ada kolom yang harus diisi'})
        }else{
            console.log('creating product')
    
            Axios.post(`${APIURL}/products`,product)
            .then((res)=>{
                console.log('upload product berhasil')

                console.log('creating items')
                console.log('product id')
                console.log(res.data.insertId)

                console.log('variety types')
                console.log(this.state.varietytypes)

                var data={
                    idproduct: res.data.insertId,
                    // types: this.state.varietytypes,
                    types: this.createitems()
                    // price and stock will be updated on the next page
                }

                Axios.post(`${APIURL}/items`,data)
                .then((res)=>{
                    console.log('upload item berhasil')
                    console.log(res.data)
                }).catch((err)=>{
                    console.log(err)
                })


            }).catch((err)=>{
                console.log(err)
            })

        }
    }

    createitems=()=>{
        const {varietytypes}=this.state
        console.log(varietytypes.length)

        var count=varietytypes.length

        var arr=['']

        const combine = (arrone,arrtwo)=>{
            var combined=[]

            // IF ARRAY OF TYPES IS NULL
            if(!arrtwo.length){
                return arrone
            }else if(!arrone.length){
                return arrtwo
            }


            arrone.forEach((one,i)=>{
                arrtwo.forEach((two,j)=>{
                    // var item=[Array.isArray(one)?...one:one,two]
                    if(two===null||two===''){
                        console.log('two null')
                        // var item=[one]
                        // dont push
                    }else if(one===null||one===''){
                        console.log('one null')
                        console.log(arrone)
                        var item=[two]
                        combined.push(item)
                    }else{
                        if(Array.isArray(one)){
                            var item=[...one,two]
                            combined.push(item)
                        }else{
                            var item=[one,two]
                            combined.push(item)
                        }
                    }
                    
                })
            })
            return combined
        }

        var types=['']
        for(var i=0;i<count;i++){
            types = combine(types,varietytypes[i])
        }

        console.log(types)

        return types

        // this.setState({varietyitems:result})

        
    }


    renderVarietyCount=()=>{
        // Immutability React
        // Cannot use 'push' operator, 
        // Read here https://blog.logrocket.com/immutability-in-react-ebe55253a1cc/

        

        const renderTypesInput=(j)=>{
            console.log('typecount')
            console.log(this.state.typecount)

            var types=new Array(this.state.typecount[j])

            for(var count=0;count<this.state.typecount[j];count++){
                types[count]=''
            }

            // console.log(types)

            return types.map((val,q)=>{
                return (
                    <div key={q}>
                        <Input
                            placeholder='Such as small, or red'
                            style={{marginBottom:'.5em'}}
                            onChange={(e)=>{
                                var types=this.state.varietytypes
                                types[j][q]=e.target.value
                                console.log(types)
                                this.setState({varietytypes:types})
                            }}
                        />
                    </div>
                )
            })

        }


        var render=this.state.varieties.map((val,index)=>{
            return (
                <Grid.Column key={index} style={{width:'50%',margin:'1em 0 1em 0'}}>
                    <Header as={'p'} style={{fontWeight:'700',margin:'.5em 0'}}>By</Header>
                    <Input 
                        placeholder='Such as size or color'
                        style={{margin:'0 1em 0 0'}}
                        onChange={(e)=>{
                            // CONSTRUCT STATE VARIETIES
                            var arr=this.state.varieties
                            arr[index]=e.target.value
                            console.log(arr)

                            // CONSTRUCT STATE TYPECOUNT
                            var typecount=this.state.typecount
                            if(!typecount[index]){
                                typecount[index]=2
                            }
                            console.log(typecount)


                            this.setState({varieties:arr,typecount:typecount})
                        }}
                    />
                    {
                        this.state.typecount[index]?
                        <>
                            <Header as={'p'} style={{margin:'.5em 0'}}>Types</Header>
                            {renderTypesInput(index)}
                            <Header
                                as={'span'}
                                color={'blue'}
                                // basic
                                // primary
                                style={{fontSize:'15px',fontWeight:'700',cursor:'pointer'}}
                                disabled={this.state.typecount[index]===undefined?true:false}
                                onClick={()=>{
                                    var typecount=this.state.typecount
                                    typecount[index]=this.state.typecount[index]+1
                                    console.log(typecount)
                                    console.log('j')
                                    console.log(index)
                                    this.setState({typecount:typecount})
                                }}
                            >
                                more type
                            </Header>
                        </>
                        : null
                    }
                </Grid.Column>
            )
        })

        return render
    }
    

    render() { 
        return ( 
            <Container style={{paddingTop:'2em',width:'800px'}}>
                <Header as={'h1'}>Add Product</Header>
        {/* <Header as={'h1'}>{this.props.Seller.idseller}</Header> */}
                <Grid style={{marginBottom:'3em'}}>
                    <Grid.Row>
                        
                        <Segment 
                            style={{width:'100%'}}
                            loading={this.state.loadingmaincategories}
                        >
                            <Header as={'h3'}>Main Category</Header>
                            {
                                this.state.maincategories.map((cat,index)=>{
                                    return (
                                        <Checkbox 
                                            key={index}
                                            label={titleConstruct(cat.category_name)}
                                            style={{marginRight:'1.5em'}}
                                            checked={this.state.idcategory===cat.idcategory}
                                            onClick={()=>{
                                                this.setState({idcategory:cat.idcategory})
                                                // console.log('setstate to',cat.idcategory)
                                            }}
                                        />
                                    )
                                })
                            }
                            {/* <Checkbox 
                                label='Men' 
                                style={{marginRight:'1.5em'}}
                                checked={this.state.idcategory==1}
                                onClick={()=>{
                                    this.setState({idcategory:1})
                                }}
                            />
                            <Checkbox 
                                label='Women' 
                                style={{marginRight:'1.5em'}}
                                checked={this.state.idcategory==2}
                                onClick={()=>{
                                    this.setState({idcategory:2})
                                }}
                            />
                            <Checkbox 
                                label='All' 
                                style={{marginRight:'1.5em'}}
                                checked={this.state.idcategory==3}
                                onClick={()=>{
                                    this.setState({idcategory:3})
                                }}
                            /> */}
                        </Segment>
                        <Segment style={{width:'100%'}}>
                            <Header as={'h3'}>Category</Header>
                            <Input 
                                placeholder='Category'
                                value={this.state.category}
                                onChange={(e)=>{this.setState({category:e.target.value})}}
                            />
                        </Segment>
                        <Segment style={{width:'100%'}}>
                            <Header as={'h3'}>Merk</Header>
                            <Dropdown
                                placeholder='Select Product Merk'
                                selection
                                options={this.state.merklist}
                                value={this.state.idmerk}
                                onChange={(e,{value})=>{
                                    // console.log(value)
                                    this.setState({idmerk:value})
                                }}
                            />
                            <Segment style={{marginTop:'2em'}}>
                                <Message>
                                    <div style={{fontWeight:'800'}}>Note to Seller</div>
                                    <div>
                                        You can add your merk if it is not on the list yet
                                    </div>
                                </Message>
                                <Button
                                    onClick={()=>{
                                        if(!this.state.merk){
                                            this.setState({merkMessage:'Fill The Column'})
                                        }else{
                                            Axios.post(`${APIURL}/merk`,{merk_name:this.state.merk})
                                            .then((res)=>{
                                                if(res.data.status){
                                                    // reload merk list
                                                    this.getMerkList()
                                                    this.setState({ismerkadded:true})
                                                }else{
                                                    this.setState({merkMessage:res.data.message})
                                                }
                                            }).catch((err)=>{
                                                console.log(err)
                                            })
                                        }
                                    }}
                                >
                                    Add Merk
                                </Button>
                                <Input
                                    placeholder='merk'
                                    value={this.state.merk}
                                    onChange={(e)=>{this.setState({merk:e.target.value,merkMessage:''})}}
                                />
                                {
                                    this.state.merkMessage?
                                    <span style={{color:'red',marginLeft:'2em'}}>{this.state.merkMessage}</span>
                                    : null
                                }
                                {
                                    this.state.ismerkadded?
                                    <Message style={{color:'rgba(0,0,0,.65)'}}>Your Merk is Added, You Can Select It On The List</Message>
                                    : null
                                }
                            </Segment>
                        </Segment>
                        <Segment style={{width:'100%'}}>
                            <Header as={'h3'}>Cover Photo</Header>
                            <Input 
                                type='file'
                                // id={item.iditem}
                                multiple
                                style={{marginRight:'1em'}}
                                onChange={(e)=>{
                                    if(e.target.files){
                                        // console.log(e.target.files)
                                        this.setState({fileImage:e.target.files})
                                    }
                                }}
                            />
                        </Segment>
                        <Segment style={{width:'100%'}}>
                            <Header as={'h3'}>Product Name</Header>
                            <Input 
                                placeholder='Product Name'
                                style={{width:'400px'}}
                                value={this.state.productName}
                                onChange={(e)=>{this.setState({productName:e.target.value})}}
                            />
                        </Segment>
                        <Segment style={{width:'100%'}}>
                            <Header as={'h3'}>Description</Header>
                            <Form>
                                <TextArea
                                    placeholder='Description'
                                    style={{maxWidth:'500px'}}
                                    value={this.state.description}
                                    onChange={(e)=>{this.setState({description:e.target.value})}}
                                />
                            </Form>
                        </Segment>

                        <Checkbox 
                            toggle 
                            // checked={this.state.isvariety}
                            onClick={(e,data)=>{this.setState({isvariety:data.checked})}}
                            style={{margin:'1em 1em 1em 0'}}
                        />
                        <span style={{margin:'1em 0'}}>Does this product have varieties such as size or color?</span>
                        {/* {this.state.isvariety?<p>true</p>:<p>false</p>} */}

                        {
                            !this.state.isvariety?
                            // WITHOUT VARIETY
                            //////////////////
                            null
                            // <>
                            // <Segment style={{width:'100%'}}>
                            //     <Header as={'h3'}>Upload Image</Header>
                            //     <Input 
                            //         type='file'
                            //         multiple
                            //         // name='gambar'
                            //         // label={this.state.imageAdd.name}
                            //         style={{marginBottom:'1em'}}
                            //         onChange={(e)=>{
                            //             if(e.target.files){
                            //                 // var edited=this.state.fileImageAdd
                            //                 // edited=e.target.files
                            //                 // this.setState({fileImageAdd:edited})
                            //                 console.log(e.target.files)
                            //                 this.setState({fileImageAdd:e.target.files})
                            //             }
                            //         }}
                            //     />
                            //     <Container style={{textAlign:'center',position:'relative',width:'100%'}}>
                            //         <Container style={{width:'100%'}}>
                            //             <Image
                            //                 src={
                            //                         false?
                            //                         this.state.imageAdd
                            //                         :'https://react.semantic-ui.com/images/wireframe/image.png'
                            //                     }
                            //                 style={{width:'100%',display:'inline'}}
                            //             />
                            //         </Container>
                            //     </Container>
                            // </Segment>
                            // <Segment style={{width:'100%'}}>
                            //     <Header as={'h3'}>Price</Header>
                            //     Rp 
                            //     <Input
                            //         placeholder='Price'
                            //         // value={this.state.priceAdd}
                            //         onChange={(e)=>{this.setState({priceAdd:e.target.value})}}
                            //         style={{marginLeft:'.5em'}}
                            //     />,00
                            // </Segment>
                            // <Segment style={{width:'100%'}}>
                            //     <Header as={'h3'}>Stock</Header>
                            //     <Input
                            //         placeholder='Stock'
                            //         // value={this.state.stockAdd}
                            //         onChange={(e)=>{this.setState({stockAdd:e.target.value})}}
                            //         style={{marginLeft:'.5em'}}
                            //     />
                            // </Segment>
                            // </>
                            :
                            // WITH VARIETIES
                            /////////////////
                            <>
                            <Segment style={{width:'100%'}}>
                                <Header as={'h3'}>Variety</Header>
                                <Grid style={{marginBottom:'1em'}}>
                                    <Grid.Row>
                                        {this.renderVarietyCount()}
                                    </Grid.Row>
                                </Grid>
                                <Button 
                                    primary
                                    onClick={()=>{
                                        // var count=this.state.varietiesCount+1
                                        // CONSTRUCT STATE VARIETIES
                                        var arr=this.state.varieties
                                        arr[this.state.varietiesCount]=''
                                        console.log(arr)
                                        // CONSTRUCT STATE VARIETYTYPES
                                        var arrtypes=this.state.varietytypes
                                        arrtypes[this.state.varietiesCount]=[]
                                        console.log(arrtypes)
                                        //
                                        var typecount=this.state.typecount
                                        typecount[this.state.varietiesCount]=0
                                        console.log(this.state.typecount)


                                        this.setState({
                                            varieties:arr,
                                            varietiesCount:this.state.varietiesCount+1,
                                            varietytypes:arrtypes,
                                            typecount:typecount
                                        })

                                    }}
                                >
                                    More Variety
                                </Button>
                                {/* <Input 
                                    placeholder='Variety Name'
                                    style={{marginRight:'1em'}}
                                    value={this.state.varietyone}
                                    onChange={(e)=>{
                                        var arr=[e.target.value,this.state.varietytwo]
                                        this.setState({
                                            varietyone:e.target.value,
                                            varieties:arr
                                        }
                                    )}}
                                />
                                <Input 
                                    placeholder='Variety Name'
                                    value={this.state.varietytwo}
                                    onChange={(e)=>{
                                        var arr=[this.state.varietyone,e.target.value]
                                        this.setState({
                                            varietytwo:e.target.value,
                                            varieties:arr
                                        }
                                    )}}
                                /> */}
                            </Segment>

                            {/* <Segment style={{width:'100%'}}>
                                <Header as={'h3'}>Items</Header>

                                <span>1.</span>
                                {
                                    this.state.varieties.map((val,index)=>{
                                        if(val){
                                            return (
                                                <Input
                                                    key={index}
                                                    placeholder={`Type of ${val}`}
                                                    // value={this.state.stockAdd}
                                                    onChange={(e)=>{this.setState({stockAdd:e.target.value})}}
                                                    style={{margin:'.5em'}}
                                                />
                                            )
                                        }
                                    })
                                }
                                <Input
                                    placeholder='Price'
                                    // value={this.state.stockAdd}
                                    // onChange={(e)=>{this.setState({stockAdd:e.target.value})}}
                                    style={{margin:'0 .5em .5em 0'}}
                                />
                                <Input
                                    placeholder='Stock'
                                    // value={this.state.stockAdd}
                                    // onChange={(e)=>{this.setState({stockAdd:e.target.value})}}
                                    style={{margin:'0 .5em .5em 0'}}
                                />

                            </Segment> */}
                            </>

                        }


                        <Button
                            primary
                            style={{width:'100%',margin:'1em 0'}}
                            onClick={this.onSubmit}
                            // onClick={()=>{console.log(this.createitems())}}
                            loading={this.state.loading}
                            disabled={this.state.loading}
                        >
                            Submit and go to the Next Step
                        </Button>

                        {
                            this.state.message?
                            <Message style={{color:'red'}}>
                                {this.state.message}
                            </Message>
                            : null
                        }
                    </Grid.Row>


                </Grid>
                {
                    this.state.newidproduct?
                    <Redirect to={`/seller/product/${this.state.newidproduct}`}/>
                    : null
                }
            </Container>
         );
    }
}
 
const MapstatetoProps=(state)=>{
    return {
        Seller: state.Seller
    }
}

export default connect(MapstatetoProps) (AddProduct);