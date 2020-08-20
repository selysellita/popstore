import React ,{Component} from 'react'
import {
    Container,
    Tab,
    Menu,
} from 'semantic-ui-react'
import TotalSales from './ChartsTotal'
import GrowthSales from './SalesGrowth'
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