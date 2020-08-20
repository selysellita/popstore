import React, { Component } from 'react';
import SidebarSeller from './componentseller/sidebar';
import { Button, Menu, Icon,  Input, Grid, Image, Header, Form, TextArea, Dropdown } from 'semantic-ui-react'
import _ from 'lodash'
import Axios from 'axios'
import { APIURL } from '../../supports/ApiUrl';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';


class MyProducts extends Component {
    state = { 
        isloading:false,
        products:[],
        page:0,
        totalProduct:0,
        cardperPage:5,                   //jumlah card per page
        currentPage:0,
        search:'',
        minprice:null,
        maxprice:null,
        searchCategory:'',
        sorting:'',
        activeItem:'',
        column:'',
        direction:'',
        seller:{},
        limit:null
    }
    
    componentDidMount(){
        console.log('masuk componentDidMount')
        this.getData()
    }
    
    getData=(search, searchCategory, minprice, maxprice, sorting)=>{
        console.log(this.props.seller)
        Axios.get(`${APIURL}/sellers/getseller?iduser=${this.props.auth.iduser}`)
        .then((seller)=>{
            Axios.get(  
                search||searchCategory||minprice||maxprice||sorting?`${APIURL}/products/totalsellerproducts?search=${search}&category=${searchCategory}&pmin=${minprice}&pmax=${maxprice}&idseller=${this.props.seller.idseller}`:
                `${APIURL}/products/totalsellerproducts?idseller=${this.props.seller.idseller}`
            ).then((res)=>{
                Axios.get(search||searchCategory||minprice||maxprice||sorting?`${APIURL}/products/sellerproducts?search=${search}&category=${searchCategory}&pmin=${minprice}&pmax=${maxprice}&sort=${this.state.sorting}&idseller=${this.props.seller.idseller}&page=${this.state.page}`:
                        `${APIURL}/products/sellerproducts?page=${this.state.page}&idseller=${this.props.seller.idseller}`
                    ).then((res1)=>{
                        this.setState({products:res1.data, isLoading:false, totalProduct:res.data.total, seller:seller })
                        console.log(this.state.products, 'SELLERPRODUCT Masuk')
                        console.log(this.props.seller)
                    }).catch((err)=>{
                        console.log(err)
                    })
            }).catch((err)=>{
                console.log(err)
            })
        }).catch((err)=>{
            console.log(err)
        })
    }


    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

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

    handleSort = (clickedColumn) => () => {
        const { column, searchproducts, direction } = this.state
    
        if (column !== clickedColumn) {
          this.setState({
            column: clickedColumn,
            searchproducts: _.sortBy(searchproducts, [clickedColumn]),
            direction: 'ascending',
          })
    
          return
        }
        this.setState({
          searchproducts: searchproducts.reverse(),
          direction: direction === 'ascending' ? 'descending' : 'ascending',
        })
    }
    
    // onClickCategory= (e) =>{
    //     var kategori=e.target.value
    //     var hasilFilter=this.state.products.filter((val)=>{
    //         if(kategori==='all'){
    //             return this.state.products
    //         }else{
    //             return (
    //                 val.namecategory.toLowerCase().includes(kategori.toLowerCase())                
    //             )
    //         }
    //     })
    //     this.setState({searchproducts:hasilFilter}) 
    // }
  

    // === Handle Table ===
    renderProducts=()=>{
        if(this.state.products.length){
            return this.state.products.map((val,index)=>{
                return (
                    <Grid.Row style={{backgroundColor:index%2===0?'white':'#f5deb3'}} >
                        <Grid.Column width={1}>
                            {this.state.page+index+1} 
                        </Grid.Column>
                        <Grid.Column width={4}>
                            <Image src={APIURL+ JSON.parse(val.imagecover)[0]} style={{height:'100px' }}/>
                            <Header as={'h4'}>
                                {val.product_name}
                                <Header.Subheader>
                                    {val.description}
                                </Header.Subheader>
                            </Header>
                        </Grid.Column>
                        <Grid.Column width={2}>
                            <Link to={`/seller/product/${val.idproduct}`}>
                                Detail Product
                            </Link>
                        </Grid.Column>
                        <Grid.Column width={2}>
                            {val.price}
                        </Grid.Column>
                        <Grid.Column width={2}>
                            {val.stock}
                        </Grid.Column>
                        <Grid.Column width={2}>
                            {val.sold}
                        </Grid.Column>
                        <Grid.Column width={2}>
                            {val.isdeleted===0 && val.isblocked ===0? 'Active':'Inactive'}
                        </Grid.Column>
                    </Grid.Row>
                )
            })
        }else{
            return(
                   <center> <h3 style={{color:'red'}}>Empty Product!!! You have not input any product. </h3></center> 
                
            )
        }
    }

    renderHeadTable=()=>{
        const { activeItem, column, direction } = this.state
        return(
            // <Grid style={{paddingLeft: 10, paddingRight: 10,}}>
                <Grid.Row style={{ backgroundColor:'white',}}>
                    <Grid.Column width={1}>
                        No
                    </Grid.Column >
                    <Grid.Column width={4}>
                        Product Name
                        <Icon name={direction==='ascending'&&column==='product_name'?'angle double down':'angle double up'} />
                    </Grid.Column>

                    <Grid.Column width={2}
                    sorted={column === 'product_name' ? direction : null}
                    onClick={this.handleSort('product_name')}>
                        Detail
                    </Grid.Column>

                    <Grid.Column width={2}
                    sorted={column === 'price]' ? direction : null}
                    onClick={this.handleSort('price')}>
                        Price
                        <Icon name={direction==='ascending'&&column==='price'?'angle double down':'angle double up'} />
                    
                    </Grid.Column>

                    <Grid.Column width={2}
                    sorted={column === 'stock]' ? direction : null}
                    onClick={this.handleSort('stock')}>
                        Stock 
                        <Icon name={direction==='ascending'&&column==='stock'?'angle double down':'angle double up'} />
                    </Grid.Column>

                    <Grid.Column width={2}>
                        Sold
                        <Icon name={direction==='ascending'&&column==='sold?'?'angle double down':'angle double up'} />
                    </Grid.Column>

                    <Grid.Column width={2}>
                        Status
                    </Grid.Column>
                </Grid.Row>
        )
    }
    
    render() { 
        const { activeItem,search, searchCategory,minprice, maxprice, cardperPage, page, totalProduct } = this.state
        return ( 
            
            <div  style={{display:'flex', paddingTop:50, marginBottom:50}}>
                <div>
                    <SidebarSeller/>
                </div>
                <div style={{backgroundColor:'#f6f6f6',padding: 10, width:'80%', display:'flex', flexDirection:'column'}}>
                    <div style={{backgroundColor:'#fff', marginBottom:20}}>
                        <Menu pointing secondary>
                            <Menu.Item
                                name='all'
                                active={activeItem === 'all'}
                                onClick={this.handleItemClick}
                            />
                            <Menu.Item
                                name='live'
                                active={activeItem === 'live'}
                                onClick={this.handleItemClick}
                            />
                            <Menu.Item
                                name='soldout'
                                active={activeItem === 'soldout'}
                                onClick={this.handleItemClick}
                            />
                            <Menu.Item
                                name='blocked'
                                active={activeItem === 'blocked'}
                                onClick={this.handleItemClick}
                            />
                            <Menu.Item
                                name='archived'
                                active={activeItem === 'archived'}
                                onClick={this.handleItemClick}
                            />
                        </Menu>
                    </div>
                    <div style={{marginBottom: 20,}} >
                        <Form onSubmit={()=>{this.getData(search,searchCategory,minprice,maxprice)}}>
                            <Form.Group>
                                <Form.Field width={5}>
                                    <label><h4>Search Product</h4></label>
                                    <Input  placeholder='Search Product...' name='search' value={this.state.search} onChange={this.onChangeSearch} />
                                </Form.Field>
                                <Form.Field width={5}>
                                    <label><h4>Search Category</h4></label>
                                    <Input placeholder='Search Product...' name='searchCategory' value={this.state.searchCategory} onChange={this.onChangeSearch}  />
                                </Form.Field>
                                <Form.Field width={5}>
                                    <label><h4>Sorted By</h4></label> {this.state.sorting}
                                    <Dropdown name='sorting' clearable options={this.sortOptions} value={this.state.sorting} selection 
                                        onChange={this.onChangeSearch} />
                                </Form.Field>
                            </Form.Group>
                            <Form.Group inline>
                                {/* <Form.Field width={8}> */}
                                    <label><h4>Filter By Price</h4></label>
                                    <Form.Input type='number' placeholder='Minimum Price' name='minprice' value={this.state.minprice} onChange={this.onChangeSearch} />
                                    <Form.Input type='number' placeholder='Maximum Price' name='maxprice' value={this.state.maxprice} onChange={this.onChangeSearch} />
                                    {/* <Form.Field width={5}>
                                    <label><h4>Limit</h4></label>
                                    <Input type='number' placeholder='Show Limit' name='cardPerPage' value={this.state.cardperPage} onChange={this.onChangeSearch} />
                                    </Form.Field> */}
                                {/* </Form.Field> */}
                            </Form.Group>
                            <Form.Group>
                                
                            </Form.Group>
                            <Button color='green' onClick={()=>{this.getData(search,searchCategory,minprice,maxprice)}} type='submit'>
                                Submit
                            </Button>
                            <Button color='yellow' onClick={()=>{this.setState({page:0, currentPage:0, search:'', searchCategory:'', minprice:'', maxprice:'', sorting:''})}}>
                                Reset
                            </Button>
                        </Form>
                    </div>

                    <div style={{paddingTop:'50px'}}>
                        <Grid style={{paddingLeft: 10, paddingRight: 10,}}>

                        {this.renderHeadTable()}
                        </Grid>

                    </div>
                    <div style={{paddingTop:'30px', marginBottom:30}}>
                        <Grid style={{paddingLeft: 10, paddingRight: 10,}}>
                            {this.renderProducts()}
                        </Grid>
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
                </div>

            </div>
         );
    }
}

const MapstatetoProps=(state)=>{
    return  {
      auth:state.Auth,
      seller:state.Seller
    }           
  }
 
export default connect(MapstatetoProps) (MyProducts);