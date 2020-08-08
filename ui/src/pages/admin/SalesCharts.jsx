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
import TotalSales from './ChartsTotal'
import GrowthSales from './SalesGrowth'
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
                  <Menu.Item key='create'>
                    Total Sales
                    {/* {
                        this.props.Invoices.total?
                        <Label color='blue'>{this.props.Invoices.total}</Label>
                        : null
                    } */}
                  </Menu.Item>
                ),
                render: () => <Tab.Pane><TotalSales/></Tab.Pane>,
            },
            {
                menuItem: (
                    <Menu.Item key='add'>
                        Store Sales
                    </Menu.Item>
                ),
                render: () => <Tab.Pane><GrowthSales/></Tab.Pane>,
            },
          ]

        return ( 
            <Container style={{padding:'2em 4em',width:'100%',minWidth:'1100px',marginBottom:'4em'}}>

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