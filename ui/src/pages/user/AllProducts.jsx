import React, { Component } from 'react';
import { Card, Icon, Image,  Input, Rating, Button, Grid, Form, Label, Dropdown } from 'semantic-ui-react';
import Axios from 'axios';
import {APIURL} from './../../supports/ApiUrl';
import { Link } from 'react-router-dom';

class AllProducts extends Component {
    state = { 
        isloading:false,
        products:[],
        page:0,
        totalProduct:0,
        cardperPage:8,                   //jumlah card per page
        currentPage:0,
        search:'',
        minprice:null,
        maxprice:null,
        searchCategory:'',
        sorting:''
    }

    componentDidMount(){
        console.log('masuk componentDidMount')
        this.getData()
    }
    
    getData=(search, searchCategory, minprice, maxprice, sorting)=>{
        Axios.get(  
            search||searchCategory||minprice||maxprice||sorting?`${APIURL}/products/totalproduct?search=${search}&category=${searchCategory}&pmin=${minprice}&pmax=${maxprice}`:
            `${APIURL}/products/totalproduct`
        ).then((res)=>{
            Axios.get(search||searchCategory||minprice||maxprice||sorting?`${APIURL}/products/allproducts?search=${search}&category=${searchCategory}&pmin=${minprice}&pmax=${maxprice}&sort=${this.state.sorting}&page=${this.state.page}`:
                    `${APIURL}/products/allproducts?page=${this.state.page}`
                ).then((res1)=>{
                    this.setState({products:res1.data, isLoading:false, totalProduct:res.data.total, })
                    console.log(this.state.products, 'ALLPRODUCT')
                }).catch((err)=>{
                    console.log(err)
                })
        }).catch((err)=>{
            console.log(err)
        })
    }

    getpaginationdata=(val)=>{
        var {search, searchCategory, minprice, maxprice, sorting}= this.state
        this.setState({
            page:val*this.state.cardperPage,        //dikali jumlah card per page
            currentPage:val,
            isLoading:true}, function(){
            this.getData(search, searchCategory, minprice, maxprice, sorting)
        })
        console.log(val,this.state.page, 'LINE50')
    }

    renderpagination=()=>{
        console.log('masuk pagination')
        var {cardperPage,totalProduct,currentPage}=this.state
        var totalpage = Math.ceil(totalProduct/cardperPage)
        var arr=[]
        for ( var i = 0; i < totalpage; i++){
            arr.push(i)
        }
        return arr.map((val,index)=>{
            return(
                <div className="pagination p8" style={{backgroundColor:val===(currentPage)?'#f8e211':null}} key={index} onClick={()=>this.getpaginationdata(index)}>                    
                    <p>{index+1}</p>
                </div>
            )
        })
    }   

    onChangeSearch=(e, {name,value})=>{    
        this.setState(
            {page:0,[name]:value})
    }
    
    sortOptions = [
        { key: 1, text: 'Lowest Price', value: 'priceasc' },
        { key: 2, text: 'Highest Price', value: 'pricedesc' },
        { key: 3, text: 'Best Seller', value: 'bestsellerdesc' },
    ]


    renderCardProduct=()=>{      
        if(this.state.products.length){
            return this.state.products.map((val,index)=>{
                return (                  
                    <div key={index} style={{width:'22%', marginLeft:12, marginRight:12, marginBottom:20}}>
                        <Link to={`/product/${val.idproduct}`}>
                            <Card raised style={{ paddingTop:5, height:'100%'}}>
                                {/* <a style={{alignSelf:'center'}}> */}
                                    <Image src={APIURL+ JSON.parse(val.imagecover)[0]} style={{height:'150px' }}/>
                                {/* </a> */}
                                <Card.Content style={{borderColor: 'transparent',}} >
                                <Card.Header style={{display:'block', overflow: 'hidden',}}>{val.product_name}</Card.Header>
                                <Card.Meta>{val.maincategory}</Card.Meta>
                                <Card.Description >
                                    Rp.{val.price} <br/>
                                    <Rating icon='star' defaultRating={0} rating={val.product_rating} maxRating={5} />
                                </Card.Description>
                                </Card.Content>
                                <Card.Content style={{textAlign:'center',alignSelf:'center'}} extra>
                                <p style={{fontSize:'18px', width:'100%'}} >
                                    <Icon name='cart' />
                                    Detail
                                </p>
                                </Card.Content>
                            </Card>
                        </Link>
                    </div>
                )
            })
        }else{
            return (
                <div>
                    <h2 style={{color:'red'}}>Sorry! Empty Result!</h2>
                </div>
            )
        }
    }


    render() { 
        const {currentPage, search, searchCategory, minprice, maxprice, cardperPage, page, totalProduct}=this.state
        return ( 
            <Grid padded style={{padding:20}}>
                <Grid.Column width={4} style={{backgroundColor:'BC9E82', padding:10}}>
                    <Form onSubmit={()=>{this.getData(search,searchCategory,minprice,maxprice)}}>
                        <Form.Field>
                            <label><h4>Search Product</h4></label>
                            <Input  placeholder='Search Product...' name='search' value={this.state.search} onChange={this.onChangeSearch} />
                        </Form.Field>
                        <Form.Field>
                            <label><h4>Search Category</h4></label>
                            <Input icon placeholder='Search Product...' name='searchCategory' value={this.state.searchCategory} onChange={this.onChangeSearch}  />
                        </Form.Field>
                        <Form.Field>
                            <label><h4>Filter By Price</h4></label>
                            <Input type='number' placeholder='Minimum Price' name='minprice' value={this.state.minprice} onChange={this.onChangeSearch} style={{marginBottom:10}} > 
                                <Label basic>Rp</Label>
                                <input />
                                <Label>.00</Label>
                            </Input>
                            <br/>
                            <Input type='number' placeholder='Maximum Price' name='maxprice' value={this.state.maxprice} onChange={this.onChangeSearch} >
                                <Label basic>Rp</Label>
                                <input />
                                <Label>.00</Label>
                            </Input>
                        </Form.Field>
                        <Form.Field>
                            <label><h4>Sorted By</h4></label>
                            <Dropdown name='sorting' clearable options={this.sortOptions} value={this.state.sorting} selection 
                                onChange={this.onChangeSearch} />
                        </Form.Field>
                        <Button color='green' onClick={()=>{this.getData(search,searchCategory,minprice,maxprice)}} type='submit'>
                            Submit
                        </Button>
                        <Button color='yellow' onClick={()=>{this.setState({page:0, currentPage:0, search:'', searchCategory:'', minprice:'', maxprice:'', sorting:''})}}>
                            Reset
                        </Button>
                        {search?<p><h3>Search for : {search} </h3></p>:null}
                        {<p><h3>Total Product : {totalProduct} </h3></p>}
                    </Form>
                </Grid.Column>
                <Grid.Column width={12}>
                    {/* <p><h1>Menampilkan {this.state.totalProduct} products</h1></p>
                    <p><h1>Menampilkan {this.state.search} search product</h1></p>
                    <p><h1>Menampilkan {this.state.searchCategory} search category</h1></p>
                    <p><h1>Menampilkan {this.state.minprice} minprice</h1></p>
                    <p><h1>Menampilkan {this.state.maxprice} maxprice</h1></p>
                    <p><h1>Menampilkan {this.state.sorting} sorting</h1></p> */}

                    <div style={{display:'flex', flexWrap:'wrap',  padding:20, width:'100%'}}>
                    {this.renderCardProduct()}
                    </div>
                    <div style={{padding:0, textAlign:'center',justifyContent:'center', display:'flex'}}>
                        <div className="pagination p8">
                            <Icon name='angle left' disabled={this.state.page===0} onClick={()=>this.getpaginationdata((page/cardperPage)-1)} />                                
                        </div>
                        {this.renderpagination()}
                        <div className="pagination p8">
                            <Icon name='angle right' disabled={Math.ceil(totalProduct/cardperPage)===(page/cardperPage)+1} onClick={()=>this.getpaginationdata((page/cardperPage)+1)} />                             
                        </div>
                    </div>
                </Grid.Column>
            </Grid>
        );
    }
}
 
export default AllProducts;