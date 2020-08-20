import React, { Component } from 'react';
import CanvasJSReact from '../../assets/canvasjs.react';
import Axios from 'axios'
import {APIURL} from '../../supports/ApiUrl'
import {
    Grid,
    Segment,
    Dropdown,
} from 'semantic-ui-react'
import {titleConstruct} from '../../supports/services'
import { connect } from 'react-redux'

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

var methods=[
    {
        key: 1,
        text: 'Category',
        value: 'category'
    },
    {
        key: 2,
        text: 'Merk',
        value: 'merk'
    },
]

var units=[
    {
        key: 1,
        text: 'Product',
        value: 'item'
    },
    {
        key:2,
        text: 'Price',
        value: 'price'
    }
]


class PieChart extends Component {
    state = { 
        listdata:[],
        listchart:[],
        by:'category',
        unit:'item',
        loading:true
     }

    componentDidMount=()=>{
        this.getSalesCount(this.state.by,this.state.unit)
    }

    getSalesCount=(method,unit)=>{
        this.setState({loading:true})
        Axios.get(`${APIURL}/admin/sales/count?method=${method}`)
        .then((list)=>{
            // console.log('sales list',list.data)
            var dataPoints=list.data.map((val,index)=>{
                return {
                    y: this.state.unit===units[0].value?val.totalcount:this.state.unit===units[1].value?val.totalprice:null,
                    label: val.title
                }
            })
            this.setState({listdata:list.data,listchart:dataPoints,loading:false})
            // console.log('datapoints',dataPoints)

        }).catch((err)=>{
            console.log(err)
        })
    }

    changeUnit=(unit)=>{
        console.log('change unit')
        var dataPoints=this.state.listdata.map((val,index)=>{
            return {
                y: unit==='item'?val.totalcount:unit==='price'?val.totalprice:null,
                label: val.title
            }
        })
        this.setState({listchart:dataPoints,loading:false})
    }


	render() {
        // this.getSalesCount(this.state.by,this.state.unit)
		const options = {
			exportEnabled: false,
			animationEnabled: true,
			title: {
				text: `Sales By ${titleConstruct(this.state.by)} (${this.state.unit===units[0].value?'unit sold':this.state.unit===units[1].value?'total price':null})`
			},
			data: [{
				type: "pie",
				startAngle: 75,
				toolTipContent: "<b>{label}</b>: {y}",
				showInLegend: "true",
				legendText: "{label}",
				indexLabelFontSize: 16,
                indexLabel: "{label} - {y}",
                dataPoints: this.state.listchart
				// dataPoints: [
				// 	{ y: 18, label: "Direct" },
				// 	{ y: 49, label: "Organic Search" },
				// 	{ y: 9, label: "Paid Search" },
				// 	{ y: 5, label: "Referral" },
				// 	{ y: 19, label: "Social" }
				// ]
			}]
		}
		
		return (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={3}>
                        <h1>Pie Chart</h1>
                        <div style={{marginBottom:'1em'}}>
                            <div>Method</div>
                            <Dropdown 
                                placeholder='Method' 
                                search 
                                selection 
                                style={{display:'inline-block'}}
                                options={methods} 
                                value={this.state.by}
                                onChange={(e,{value})=>{
                                    this.setState({list:[],by:value})
                                    this.getSalesCount(value,this.state.unit)
                                }}
                            />
                        </div>
                        <div>Unit</div>
                        <Dropdown 
                            placeholder='Unit' 
                            search 
                            selection 
                            options={units} 
                            value={this.state.unit}
                            onChange={(e,{value})=>{
                                this.setState({list:[],unit:value})
                                this.changeUnit(value)
                            }}
                        />
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Segment basic loading={this.state.loading}>
                            <CanvasJSChart options = {options} 
                                /* onRef={ref => this.chart = ref} */
                            />
                        </Segment>
                    </Grid.Column>
                    <Grid.Column width={3}>

                    </Grid.Column>
                </Grid.Row>
            </Grid>
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

export default connect(MapstatetoProps) (PieChart);