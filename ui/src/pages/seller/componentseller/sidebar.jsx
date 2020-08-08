import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react'
import { NavLink } from 'react-router-dom';

class SidebarSeller extends Component {
  state = {}

  handleItemClick = (e, { name }) => this.setState({ activeItem: name});

  render() {
    const { activeItem } = this.state

    return (
        <div style={{paddingLeft:'20px', width:'20%', paddingRight:'5px'}}>
            <Menu vertical>
                <Menu.Item > 
                    <Menu.Header>Products</Menu.Header>
                    <Menu.Menu>
                        <Menu.Item>
                            <NavLink to='/seller/product' style={{color:'black'}} activeStyle={{color:'red'}}> My Product </NavLink>
                        </Menu.Item>
                        <Menu.Item>
                            <NavLink to='/seller/product/add' style={{color:'black'}} activeStyle={{color:'red'}}> Add Product </NavLink>
                        </Menu.Item>
                    </Menu.Menu>
                </Menu.Item>
                <Menu.Item>
                    <Menu.Header>Order</Menu.Header>
                    <Menu.Menu>
                        <Menu.Item>
                            <NavLink to='/seller/myorder' exact style={{color:'black'}} activeStyle={{color:'red'}}> My Order </NavLink>
                        </Menu.Item>
                        <Menu.Item>
                            <NavLink to='/seller/cancelled' style={{color:'black'}} activeStyle={{color:'red'}}> Cancelled Order </NavLink>
                        </Menu.Item>
                    </Menu.Menu>
                </Menu.Item>
                <Menu.Item>
                <Menu.Header>Store Profile</Menu.Header>
                    <Menu.Menu>
                        <Menu.Item>
                            <NavLink to='/seller/profile' exact style={{color:'black'}} activeStyle={{color:'red'}}> Store Profile </NavLink>
                        </Menu.Item>
                        <Menu.Item>
                            <NavLink to='/seller/rating' style={{color:'black'}} activeStyle={{color:'red'}}> Rating </NavLink>
                        </Menu.Item>
                    </Menu.Menu>
                </Menu.Item>
            </Menu>
        </div>
    )
  }
}

export default SidebarSeller