import React ,{Component} from 'react'
import {
    Container,
    Tab,
    Menu,
} from 'semantic-ui-react'
import FlashsaleRegister from './FlashsaleRegister'
import {LoadCart} from '../../redux/actions'
import { connect } from 'react-redux'



class SellerFlashsale extends Component {
    state = { 
        
     }

    componentDidMount=()=>{
        
    }

    
    render() { 
        const panes = [
            {
                menuItem: (
                  <Menu.Item key='create'>
                    Register Products
                    
                  </Menu.Item>
                ),
                render: () => <Tab.Pane><FlashsaleRegister/></Tab.Pane>,
            },
            {
                menuItem: (
                    <Menu.Item key='add'>
                        On Flashsale
                    </Menu.Item>
                ),
              },
          
          ]

        return ( 
            <Container style={{paddingTop:'2em',width:'900px',marginBottom:'4em'}}>

                <Tab panes={panes} />
                
            </Container>
        );
    }
}

const MapstatetoProps=(state)=>{
    return {
        User: state.Auth,
        Cart: state.Cart,
        Payment: state.Payment,
        Store: state.Store,
        Invoices: state.Invoices
    }
}

 
export default connect(MapstatetoProps,{LoadCart}) (SellerFlashsale);