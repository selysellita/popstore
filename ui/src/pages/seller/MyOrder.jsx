import React, { Component } from 'react';
import SidebarSeller from './componentseller/sidebar';
import { Button, Menu, Icon,  Input, Grid, Image, Header, Form, TextArea } from 'semantic-ui-react'
import _ from 'lodash'
import Axios from 'axios'
import { APIURL } from '../../supports/ApiUrl';


class MyOrders extends Component {
    state = { 
        products:[],
        category:[],
        searchproducts:[],
        activeItem:'',
        column:'',
        direction:''
    }
    
    componentDidMount=()=>{
        Axios.get(`${APIURL}/products/productseller`)
        .then((res)=>{
            this.setState({
                products:res.data.product,
                searchproducts:res.data.product,
                category:res.data.category,
            })
            console.log(res.data)
        }).catch((err)=>{
            console.log(err)
        })
    }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    onchangesearch=(e)=>{       
        var inputName=e.target.value
        console.log(inputName)
        var dataFilter=this.state.products.filter((product)=>{
            return (
                product.product_name.toLowerCase().includes(inputName.toLowerCase())                
            )
        })        
        this.setState({searchproducts:dataFilter})
    }

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
    

    // === Handle Table ===
    renderProducts=()=>{
        const {searchproducts}=this.state
        console.log(searchproducts)
        if(this.state.searchproducts.length){
            return searchproducts.map((val, index)=>{
                return (
                        <Grid.Row style={{backgroundColor:index%2===0?'white':'#f5deb3'}} >
                            <Grid.Column width={1}>
                                {index+1}
                            </Grid.Column>
                            <Grid.Column width={2} stretched>
                                IDseller_ IDproduct_ IDtransaction_ IDTransactionDetail
                            </Grid.Column>
                            <Grid.Column width={3}>
                                <Image style={{height:'50px'}} src={val.imagecover}/> <br/>
                                <strong>{val.product_name}</strong><br/>
                                val.qty <br/>
                                val.message 
                            </Grid.Column>
                            <Grid.Column width={2}>
                                qty*price=total
                            </Grid.Column>
                            <Grid.Column width={2}>
                                On Cart
                            </Grid.Column>
                            <Grid.Column width={2}>
                                Timeout Countdown
                            </Grid.Column>
                            <Grid.Column width={2}>
                                COD <br/>
                                <i>Invoice Number</i>
                            </Grid.Column>
                            <Grid.Column width={2}>
                                <Button 
                                    color='orange'
                                    style={{margin:'0 .5em .5em 0'}}
                                    // onClick={()=>{this.setState({idproductedit:1})}}
                                >Edit</Button>
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

    
    render() { 
        const { activeItem, column, direction } = this.state
        return ( 
            
            <div  style={{display:'flex', paddingTop:50}}>
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
                                name='unpaid'
                                active={activeItem === 'unpaid'}
                                onClick={this.handleItemClick}
                            />
                            <Menu.Item
                                name='wrapping'
                                active={activeItem === 'wrapping'}
                                onClick={this.handleItemClick}
                            />
                            <Menu.Item
                                name='ondelivery'
                                active={activeItem === 'ondelivery'}
                                onClick={this.handleItemClick}
                            />
                            <Menu.Item
                                name='done'
                                active={activeItem === 'done'}
                                onClick={this.handleItemClick}
                            />
                            <Menu.Item
                                name='cancelled'
                                active={activeItem === 'cancelled'}
                                onClick={this.handleItemClick}
                            />
                            <Menu.Item
                                name='returned'
                                active={activeItem === 'returned'}
                                onClick={this.handleItemClick}
                            />
                        </Menu>
                    </div>
                    <div style={{marginBottom: 20,}} >
                        <Input
                            action='Search'
                            placeholder='Search Products...'
                            onChange={this.onchangesearch}
                        />
                        <Input
                            action='Search'
                            placeholder='Search Products...'
                            onChange={this.onchangesearch}
                        />
                    </div>
                   
                    <div style={{paddingTop:'50px'}}>
                        <Grid style={{paddingLeft: 10, paddingRight: 10,}}>
                            <Grid.Row style={{border:'1px solid gray',borderRadius:'5px', backgroundColor:'white',}}>
                                <Grid.Column width={1}>
                                    No
                                </Grid.Column>
                                <Grid.Column width={2}>
                                    Transaction ID
                                </Grid.Column>
                                <Grid.Column width={3}
                                sorted={column === 'product_name' ? direction : null}
                                onClick={this.handleSort('product_name')}>
                                    Product Detail<Icon name={direction==='ascending'&&column=='product_name'?'angle double down':'angle double up'} />
                                </Grid.Column>
                                <Grid.Column width={2}>
                                    Total Payment
                                </Grid.Column>
                                <Grid.Column width={2}
                                sorted={column === 'price' ? direction : null}
                                onClick={this.handleSort('price')}>
                                    Transaction Status <Icon name={direction==='ascending'&&column=='price'?'angle double down':'angle double up'} />
                                </Grid.Column>
                                <Grid.Column width={2}>
                                    Timeout Countdown
                                </Grid.Column>
                                <Grid.Column width={2}>
                                    Delivery Method
                                </Grid.Column>
                                <Grid.Column width={2}>
                                    Action
                                </Grid.Column>
                            </Grid.Row>

                            {
                                this.state.idproductedit?
                                <Grid.Row style={{border:'1px solid gray',borderRadius:'5px'}}>
                                    <Grid.Column width={1}>
                                        1
                                    </Grid.Column>
                                    <Grid.Column width={3}>
                                        <Image src={this.state.imageEdit}/>
                                        <Input 
                                            placeholder='image...' 
                                            style={{width:'100%'}}
                                            onChange={(e)=>{this.setState({imageEdit:e.target.value})}}
                                        />
                                    </Grid.Column>
                                    <Grid.Column width={2}>
                                        <Header as={'h4'}>
                                            <Input
                                                placeholder='Product Name'
                                                style={{width:'100%'}}
                                                value=''
                                                onChange={(e)=>{this.setState({productNameEdit:e.target.value})}}
                                            />
                                        </Header>
                                    </Grid.Column>
                                    <Grid.Column width={3}>
                                        <Form>
                                            <TextArea 
                                                placeholder='Tell us more' 
                                                style={{width:'100%'}}
                                                value=''
                                                onChange={(e)=>{this.setState({descriptionEdit:e.target.value})}}
                                            />
                                        </Form>
                                    </Grid.Column>
                                    <Grid.Column width={2}>
                                        Rp70000,00
                                    </Grid.Column>
                                    <Grid.Column width={2}>
                                        30
                                    </Grid.Column>
                                    <Grid.Column width={3}>
                                        <Button 
                                            primary 
                                            style={{margin:'0 .5em .5em 0'}}
                                            onClick={()=>{this.setState({idproductedit:1})}}
                                        >Edit</Button>
                                        <Button color='red'>Delete</Button>
                                    </Grid.Column>
                                </Grid.Row>
                                :
                               
                                this.renderProducts()
                            }
                        </Grid>
                    </div>
                </div>

            </div>
         );
    }
}
 
export default MyOrders;