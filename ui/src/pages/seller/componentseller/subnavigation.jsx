import React, { Component } from 'react';

import { Input, Menu } from 'semantic-ui-react'
import { NavLink, useRouteMatch } from 'react-router-dom';

class SubNavigation extends Component {
    state = { 
        activeItem: 'bio'
    }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })



    render() { 
        const { activeItem } = this.state
        // const {path, url}= useRouteMatch()
        return ( 
            <div>
                <Menu pointing secondary>
                    <Menu.Item>
                        {/* <NavLink to={`${url}/myproducts/all`} exact style={{color:'black'}} activeStyle={{color:'red'}}> All </NavLink> */}
                        <NavLink to='seller/myproducts/all' exact style={{color:'black'}} activeStyle={{color:'red'}}> All </NavLink>
                    </Menu.Item>
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
         );
    }
}
 
export default SubNavigation;