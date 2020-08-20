import React, { Component } from 'react';
import CanvasJSReact from '../../assets/canvasjs.react';
import Axios from 'axios'
import {APIURL} from '../../supports/ApiUrl'
import {listSalesByTime} from '../../supports/ListAssembler'
import { Grid, Dropdown } from 'semantic-ui-react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

var methods=[
    {
        key: 1,
        text: 'Last 12 Hour',
        value: 12
    },
    {
        key: 2,
        text: 'Last 24 Hour',
        value: 24
    },
    {
        key: 3,
        text: 'Last 7 Days',
        value: 24*7
    },
    {
        key: 4,
        text: 'Last 2 Weeks',
        value: 24*7*2
    },
]

class ColumnChart extends Component {
        state = {
            listgrowth:[],
            period:24,
        }

        componentDidMount=()=>{
            this.getSalesData()
        }

        getSalesData=()=>{
            
            Axios.get(`${APIURL}/admin/sales/growth`)
            .then((res)=>{
                console.log('sales growth list',res.data)

                // console.log('sales growth list with hour',listSalesByTime(res.data))

                this.rangeList(res.data)
                
            }).catch((err)=>{
                console.log(err)
            })
        }

        rangeList=(list)=>{
            console.log('period',this.state.period)
            var listgrowth=listSalesByTime(list).map((order,index)=>{
                return {
                    // label: new Date(order.milliseconds),
                    label: order.subhour+'h',
                    y: order.checkout_price // MUST BE A NUMBER
                    // y: `${idr(order.checkout_price)}`
                }
            })
            // console.log('list growth',listgrowth)

            var listRanged=[]
            listgrowth.forEach((val,index)=>{
                if(index>=listgrowth.length-1-this.state.period){
                    // console.log('index',index,list.length-1-this.state.period)
                    listRanged.push(val)
                }
            })
            console.log('list ranged',listRanged)
            this.setState({listgrowth:listRanged})
        }

		render() {
		const options = {
			title: {
				text: `Last ${this.state.period} Hours`
			},
			animationEnabled: true,
			data: [
			{
				// Change type to "doughnut", "line", "splineArea", etc.
				type: "column",
				dataPoints: this.state.listgrowth
			}
			]
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
                                value={this.state.period}
                                onChange={(e,{value})=>{
                                    this.setState({period:value})
                                    this.getSalesData()
                                }}
                            />
                        </div>
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <div>
                            <h1>Total Sales Growth</h1>

                            <CanvasJSChart options = {options} 
                                /* onRef={ref => this.chart = ref} */
                            />
                            {/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
                        </div>
                    </Grid.Column>
                    <Grid.Column width={3}>

                    </Grid.Column>
                </Grid.Row>
            </Grid>
		);
	}
}

export default ColumnChart;