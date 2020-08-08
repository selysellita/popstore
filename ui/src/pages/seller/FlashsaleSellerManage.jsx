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
import FlashsaleRegister from './FlashsaleRegister'
import {Link} from 'react-router-dom'
import {titleConstruct,isJson} from '../../supports/services'
import {LoadCart,UpdateCheckout,CountTotalCharge,CountTotalPayment} from '../../redux/actions'
import {Redirect} from 'react-router-dom'
import { connect } from 'react-redux'



class SellerFlashsale extends Component {
    state = { 
        
     }

    componentDidMount=()=>{
        
    }

    
    render() { 
        // console.log(this.props.Payment)
        const panes = [
            {
                menuItem: (
                  <Menu.Item key='create'>
                    Register Products
                    {/* {
                        this.props.Invoices.total?
                        <Label color='blue'>{this.props.Invoices.total}</Label>
                        : null
                    } */}
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
                // render: () => <Tab.Pane><DeliveryManage/></Tab.Pane>,
            },
            // {
            //     menuItem: (
            //         <Menu.Item key='show'>
            //             Active Flashsale
            //         </Menu.Item>
            //     ),
            //     // render: () => <Tab.Pane><AutoCompleteOrder/></Tab.Pane>,
            // },
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