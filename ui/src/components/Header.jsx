import React, { Component } from 'react'
import {
    Button,
    Container,
    Header,
    Menu,
    Icon,
    Label,
    Dropdown
  } from 'semantic-ui-react'
import { connect } from "react-redux";
import {Link} from 'react-router-dom'
import {isLogout} from './../redux/actions'
import {titleConstruct,idr} from '../supports/services'
import Axios from 'axios';
import { APIURL } from '../supports/ApiUrl';


class MainHeader extends Component {
    state = { 
      useroptions : [
        { key: 1, text: 'Logout', value: 1 ,onClick:()=>{this.props.isLogout()}},
        { key: 2, text: 'Profile', value: 2, as:Link, to:'/profile' },
        { key: 3, text: 'Become A Seller', value: 3, as:Link, to:'/Sellerregister' },
      ]
     }
    render() { 
        return ( 
            <Menu
              fixed={this.props.fixed ? 'top' : null}
              inverted={!this.props.fixed}
              pointing={!this.props.fixed}
              secondary={!this.props.fixed}
              size={this.props.size}
              style={{backgroundColor:'rgb(27, 28, 29)',margin:'0',padding:'14px 0 0px'}}
            >
              <Container style={{display:'block'}}>
                <Menu.Item as={Link} to='/' style={style.menu} active>
                  POPSTORE
                </Menu.Item>
                {
                  this.props.isseller?
                  <Menu.Item as={Link} to='/seller' style={style.menu}>Seller</Menu.Item>
                  : null
                }
        {/* <span style={{color:'white'}}>{this.props.Seller.idseller}</span> */}
                {/* SALES */}
                {
                  this.props.User.isadmin?
                  <Menu.Item as={Link} to='/admin/sales' style={style.menu}>Sales</Menu.Item>
                  : null
                }
                {
                  this.props.User.isseller?
                  <Menu.Item as={Link} to='/seller/flashsales' style={style.menu}>Flashsale</Menu.Item>
                  : null
                }
                {
                  this.props.User.isadmin?
                  <Menu.Item as={Link} to='/admin/flashsales' style={style.menu}>Manage Flashsale</Menu.Item>
                  : null
                }
                

                <Menu.Item style={{float:'right',padding:'16px 0 18px'}}>
                  
                  {
                    !this.props.User.islogin?
                    <>
                      <Button as={Link} to='/login' inverted={!this.props.fixed}>
                        Log in
                      </Button>
                      <Button as={Link} to='/register' inverted={!this.props.fixed} primary={this.props.fixed} style={{ marginLeft: '0.5em' }}>
                        Sign Up
                      </Button>
                    </>
                    :  null
                    // <Button as={Link} to='/' inverted onClick={()=>{this.props.isLogout()}}>
                    //   Log out
                    // </Button>
                  }
                </Menu.Item>
                
                {
                  this.props.User.islogin?
                  <>
                    <Menu.Item 
                      as='span' 
                      style={style.menuRight}
                    >
                      {/* Hi, {this.props.User.username} */}
                      {/* <Menu> */}
                        <Dropdown
                          item
                          simple
                          text={`Hi, ${titleConstruct(this.props.User.username)}`}
                          style={{
                            paddingTop:'0px',
                            // paddingBottom:'1px',
                            marginTop:'0px',
                            display:'flex',
                            alignItems:'center',
                            height:'100%',
                          }}
                          className='header-dropdown'
                          // direction=''
                          options={this.state.useroptions}
                        />
                      {/* </Menu> */}
                    </Menu.Item>
                    {// CART
                      this.props.User.isuser?
                      <Menu.Item 
                        as={Link}
                        to='/cart'
                        style={style.menuRight}
                        // icon='cart'
                      >
                        <Icon name='cart'/>
                        Cart
                        {
                          this.props.Cart.totalitems?
                          <Label 
                            color='blue' 
                            // floating 
                            // style={{top:'-.5em',left:'85%',}}
                            style={{marginLeft:'.4em'}}
                          >
                            {this.props.Cart.totalitems}
                          </Label>
                          : null
                        }
                      </Menu.Item>
                      : null
                    }
                    {
                      this.props.User.isverified?
                      <Menu.Item 
                        as={Link}
                        to='/popcoin'
                        style={style.menuRight}
                        // icon='cart'
                      >
                        <Icon name='bitcoin' color='blue'/>
                        {idr(this.props.User.popcoin)}
                      </Menu.Item>
                      : null
                    }
                    {// USER MANAGE TRANSACTION
                      this.props.User.isuser?
                      <Menu.Item 
                        as={Link}
                        to='/transactions'
                        style={style.menuRight}
                        // icon='cart'
                      >
                        <Icon name='list alternate'/>
                        Transactions
                        {
                          this.props.Payment.total?
                          <Label 
                            color='blue' 
                            // floating 
                            // style={{top:'-.5em',left:'85%',}}
                            style={{marginLeft:'.4em'}}
                          >
                            {this.props.Payment.total}
                          </Label>
                          : null
                        }
                      </Menu.Item>
                      : null
                    }
                    {// SELLER MANAGE ORDERS
                      this.props.User.isseller?
                      <Menu.Item 
                        as={Link}
                        to='/manageorders'
                        style={style.menuRight}
                        // icon='cart'
                      >
                        <Icon name='list alternate'/>
                        Orders
                        {
                          this.props.Store.total?
                          <Label 
                            color='blue' 
                            // floating 
                            // style={{top:'-.5em',left:'85%',}}
                            style={{marginLeft:'.4em'}}
                          >
                            {this.props.Store.total}
                          </Label>
                          : null
                        }
                      </Menu.Item>
                      : null
                    }
                    {// ADMIN MANAGE ORDERS
                      this.props.User.isadmin?
                      <Menu.Item 
                        as={Link}
                        to='/managetransactions'
                        style={style.menuRight}
                        // icon='cart'
                      >
                        <Icon name='list alternate'/>
                        Manage Transactions
                        {
                          this.props.Invoices.total?
                          <Label 
                            color='blue' 
                            // floating 
                            // style={{top:'-.5em',left:'85%',}}
                            style={{marginLeft:'.4em'}}
                          >
                            {this.props.Invoices.total}
                          </Label>
                          : null
                        }
                      </Menu.Item>
                      : null
                    }
                  </>
                  : null
                }

                
              </Container>
            </Menu>
         );
    }
}

const style={
  menu:{
    display:'inline-block',
    marginTop:'5px',
    padding:'.6em 1em'
  },
  menuRight:{
    display:'inline-block',
    marginTop:'5px',
    padding:'.6em 1em',
    float:'right',
    height:'100%'
  }
}

const MapstatetoProps=(state)=>{
    return {
        User: state.Auth,
        Cart: state.Cart,
        Payment: state.Payment,
        Store: state.Store,
        Invoices: state.Invoices,
        Seller: state.Seller,
    }
}
 
export default connect (MapstatetoProps,{isLogout}) (MainHeader);