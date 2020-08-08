import React ,{Component} from 'react'
import Axios from 'axios'
import {APIURL} from '../../supports/ApiUrl'
import {
    Grid,
    Header,
    Image,
    Form,
    Segment,
    Button,
    Message,
    Container,
    Input,
    TextArea,
    Checkbox,
    Icon,
    Divider,
    Dropdown,
    Tab,
    Menu,
    Label
} from 'semantic-ui-react'
import PaymentList from './PaymentList'
import TransactionHistory from './TransactionHistory'
import OnTheWay from './TransactionOnDelivery'
import {Link} from 'react-router-dom'
import {titleConstruct,isJson} from '../../supports/services'
import {LoadCart,UpdateCheckout,CountTotalCharge,CountTotalPayment} from '../../redux/actions'
import {Redirect} from 'react-router-dom'
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
                    Payment Due
                    {
                        this.props.Payment.total?
                        <Label color='blue'>{this.props.Payment.total}</Label>
                        : null
                    }
                  </Menu.Item>
                ),
                render: () => <Tab.Pane><PaymentList/></Tab.Pane>,
            },
            {
              menuItem: { key: 'history', icon: 'list ul', content: 'History Transactions' },
              render: () => <Tab.Pane><TransactionHistory/></Tab.Pane>,
            },
            {
                menuItem: { key: 'delivery', icon: 'shipping fast', content: 'Items On Delivery' },
                render: () => <Tab.Pane><OnTheWay/></Tab.Pane>,
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
        Payment: state.Payment
    }
}

 
export default connect(MapstatetoProps,{LoadCart}) (Transactions);