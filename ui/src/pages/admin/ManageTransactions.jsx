import React ,{Component} from 'react'
import {
    Container,
    Tab,
    Menu,
    Label
} from 'semantic-ui-react'
import PaymentVerify from './PaymentVerify'
import DeliveryManage from './DeliveryManage'
import AutoCompleteOrder from './AutoCompleteOrder'
import {LoadCart} from '../../redux/actions'
import { connect } from 'react-redux'



class Transactions extends Component {
    state = { 
        
     }

    componentDidMount=()=>{
        
    }

    
    render() { 
        // console.log(this.props.Payment)
        const panes = [
            {
                menuItem: (
                  <Menu.Item key='payment'>
                    Payment Verification
                    {
                        this.props.Invoices.total?
                        <Label color='blue'>{this.props.Invoices.total}</Label>
                        : null
                    }
                  </Menu.Item>
                ),
                render: () => <Tab.Pane><PaymentVerify/></Tab.Pane>,
            },
            {
                menuItem: (
                    <Menu.Item key='fourth'>
                        Admin Logistic
                    </Menu.Item>
                ),
                render: () => <Tab.Pane><DeliveryManage/></Tab.Pane>,
            },
            {
                menuItem: (
                    <Menu.Item key='fifth'>
                        Delivered Orders
                    </Menu.Item>
                ),
                render: () => <Tab.Pane><AutoCompleteOrder/></Tab.Pane>,
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

 
export default connect(MapstatetoProps,{LoadCart}) (Transactions);