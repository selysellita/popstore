import React ,{Component} from 'react'
import Axios from 'axios'
import {APIURL} from '../../supports/ApiUrl'
import {
    Grid,
    Header,
    Button,
    Message,
    Container,
    Icon,
    Divider,
} from 'semantic-ui-react'
import {titleConstruct,getDate} from '../../supports/services'
import {listFlashsaleItemsByProduct} from '../../supports/ListAssembler'
import { connect } from 'react-redux'



class FlashsalesData extends Component {
    state = { 
        list:[],
        now: new Date(),
        clock: undefined,

        isautoupdate:true,
    }

     
    componentDidMount=()=>{
        this.getList()

        // TIMER
        var clock=setInterval(() => {
            this.setState({now:new Date()})
        }, 1000);
        this.setState({clock})
    }

    componentWillUnmount=()=>{
        clearTimeout(this.state.clock)
    }

    getList=()=>{
        Axios.get(`${APIURL}/flashsales`)
        .then((list)=>{
            console.log('flashsales data',list)
            this.setState({list:list.data.reverse()})
        }).catch((err)=>{
            console.log(err)
        })
    }

    onCreateFlashsale=(hour)=>{
        
        var obj={
            hour
        }
        Axios.post(`${APIURL}/flashsales`,obj)
        .then((res)=>{
            if(res.data.status){
                console.log('flashsales created')
                this.getList()
            }else{
                console.log(res.data.message)
            }
        }).catch((err)=>{
            console.log(err)
        })
    }

    onUpdateFlashsale=(idflashsale,update)=>{
        // UPDATE FLASHSALE STATUS
        Axios.put(`${APIURL}/flashsales/${idflashsale}`,update)
        .then((updated)=>{
            console.log('flashsale updated')
            this.getList()
        }).catch((err)=>{
            console.log(err)
        })
    }

    onUpdateProduct=(idflashsale,update)=>{
        // UPDATE PRODUCT DETAILS ISFLASHSALE
        Axios.get(`${APIURL}/flashsales/products/approved/${idflashsale}`)
        .then((res)=>{
            var ProductList=listFlashsaleItemsByProduct(res.data)
            // console.log('flashsale product list',ProductList)
            

            // ADMIN UPDATE PRODUCT STATUS ISFLASHSALE
            ProductList.forEach((product,index)=>{
                Axios.put(`${APIURL}/products/${product.idproduct}`,update)
                .then((updated)=>{

                    if(ProductList.length-1===index){
                        console.log('all product state is in flashsale')
                    }
                }).catch((err)=>{
                    console.log(err)
                })
            })
        }).catch((err)=>{
            console.log(err)
        })
    }

    renderList=()=>{
        console.log(this.state.list)
        return this.state.list.map((val,index)=>{
            var secondstostart=(-Date.parse(this.state.now)+Date.parse(val.startat))/1000
            var secondstofinish=(-Date.parse(this.state.now)+Date.parse(val.finishat))/1000

            // CLOCK FOR ACTIVE FLASHSALE
            var finishinmins=Math.floor(secondstofinish/60)
            var finishinsecs=secondstofinish%60

            // CLOCK UNTIL FLASHSALE START
            var startinmins=Math.floor(secondstostart/60)
            var startinsecs=secondstostart%60

            var isstarted=secondstostart<=0
            var isfinished=secondstofinish<=0

            // console.log('is started? ',isstarted)
            // console.log('is finish? ',isfinished)
            // console.log(secondstofinish)
            // console.log(finishinmins)


            if(isstarted && val.idflashsalestatus<2 && this.state.isautoupdate){
                // UPDATE FLASHSALE STATUS
                // TO ACTIVE
                console.log('update to active')
                this.onUpdateFlashsale(val.idflashsale,{idflashsalestatus:2})

                // UPDATE PRODUCT STATE ISFLASHSALE
                this.onUpdateProduct(val.idflashsale,{isflashsale:1})

            }

            if(isfinished && val.idflashsalestatus!==3 && this.state.isautoupdate){
                // UPDATE FLASHSALE STATUS
                // TO FINISH
                console.log('update to finish')
                this.onUpdateFlashsale(val.idflashsale,{idflashsalestatus:3})

                // UPDATE PRODUCT STATE ISFLASHSALE
                this.onUpdateProduct(val.idflashsale,{isflashsale:0})
            }

            return (
                <Grid.Row key={index}>
                    <Grid.Column width={2}>
                        ID {val.idflashsale}
                    </Grid.Column>
                    <Grid.Column width={3}>
                        {getDate(val.startat)}
                    </Grid.Column>
                    <Grid.Column width={3}>
                        {getDate(val.finishat)}
                    </Grid.Column>
                    <Grid.Column width={3}>
                        {titleConstruct(val.flashsalestatus)}
                    </Grid.Column>
                    <Grid.Column width={4}>
                        <div style={{textAlign:'center'}}>
                            {
                                isfinished?
                                <div><span style={{fontWeight:'800'}}>Flashsale has finished</span></div>
                                :isstarted?
                                <div style={{display:'inline-flex',padding:'0em 0em',border:'0px solid rgba(255,0,0,.5)',color:'rgb(178,34,34)',background:'rgba(255,0,0,.0)'}}>
                                    <div>Time Remaining</div>
                                    <span style={{fontWeight:'800',marginLeft:'.5em'}}>{finishinmins} : {finishinsecs<10&finishinsecs>=0?'0'+finishinsecs:finishinsecs}</span>
                                    <Icon name='clock' style={{fontSize:'21px',margin:'0 0 0 .3em'}}/>
                                </div>
                                :
                                <div style={{display:'inline-flex',padding:'0em 0em',border:'0px solid rgba(255,0,0,.5)',color:'rgb(178,34,34)',background:'rgba(255,0,0,.0)'}}>
                                    <div>Time to Start</div>
                                    <span style={{fontWeight:'800',marginLeft:'.5em'}}>{startinmins} : {startinsecs<10&startinsecs>=0?'0'+startinsecs:startinsecs}</span>
                                    <Icon name='clock' style={{fontSize:'21px',margin:'0 0 0 .3em'}}/>
                                </div>
                                // <div><span style={{fontWeight:'800'}}>Flashsale has not started</span></div>
                            }
                        </div>
                    </Grid.Column>
                </Grid.Row>
            )
        })
    }

    render() {
        var hourlist=[9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]
        return (
            <Container style={{paddingTop:'2em',width:'1000px',marginBottom:'4em'}}>

                <div style={{marginBottom:'2em'}}>
                    <Header as={'h3'}>Create Flashsale</Header>
                    <Message>These Buttons only allow to make flashsale schedules on today's date</Message>
                    {
                        hourlist.map((hour,index)=>{
                            return (
                                <Button
                                    key={index}
                                    color='blue'
                                    basic
                                    style={{margin:'0 1em 1em 0'}}
                                    onClick={()=>{
                                        this.onCreateFlashsale(hour)
                                    }}
                                >
                                    Hour {hour}
                                </Button>
                            )
                        })
                    }
                    
                    <Divider/>
                </div>

                {/* {this.renderByTransactionSeller(this.state.deliveryList)} */}
                <Header as={'h3'}>List</Header>
                <Grid>
                    {this.renderList()}
                </Grid>
                
            </Container>
        )
    }
}

const MapstatetoProps=(state)=>{
    return {
        User: state.Auth,
        Cart: state.Cart,
        Payment: state.Payment
    }
}

 
export default connect(MapstatetoProps) (FlashsalesData);