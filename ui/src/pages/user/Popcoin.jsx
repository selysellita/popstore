import React ,{Component} from 'react'
import Axios from 'axios'
import {APIURL} from '../../supports/ApiUrl'
import {
    Header,
    Container,
    Segment,
    Icon,
    Button,
    Input
} from 'semantic-ui-react'
import {idr} from '../../supports/services'
import { connect } from 'react-redux'
import {KeepLogin} from '../../redux/actions'



class Popcoin extends Component {
    state = { 
        topup:false,
        amount:'',
        loading:false,
        error:''
     }

    
    onTopUp=()=>{
        

        if(!this.state.amount){
            this.setState({error:'Isi Jumlah TopUp'})
        }else{
            this.setState({loading:true,error:''})
            
            const token=localStorage.getItem('token')
            if(token){
                var topup={
                    popcoin: this.state.amount
                }
                Axios.put(`${APIURL}/users/popcoin`,topup,{
                    headers:
                    {
                    'Authorization':`Bearer ${token}`
                    }
                }).then((res)=>{
                    console.log('popcoin topup succeed')
                    this.props.KeepLogin(res.data)
                    this.setState({
                        topup:false,
                        amount:'',
                        loading:false
                    })
                }).catch((err)=>{
                    console.log(err)
                })
    
            }else{
                console.log('user is not logged in')
            }
        }

        
    }
    
    
    


    render() { 
        return ( 
            <Container style={{width:'600px',marginTop:'50px'}}>
                <Segment style={{width:'100%'}}>
                    <Header 
                        as={'h1'} 
                        color='blue' 
                        style={{
                            textAlign:'center',
                            fontSize:'30px',
                            fontFamily:'muli,sans-serif',
                            fontWeight:'800',
                            letterSpacing:'3px',
                            marginTop:'5px'
                        }}
                    >
                        <Icon name='bitcoin'/>POPCOIN
                    </Header>
                    <Header 
                        as={'h1'} 
                        // color='gray' 
                        style={{
                            textAlign:'center',
                            fontSize:'27px',
                            // fontFamily:'muli,sans-serif',
                            // fontWeight:'800',
                            letterSpacing:'3px',
                            margin:'5px 0 2em',
                            color:'rgba(0,0,0,.7)',
                            
                        }}
                    >
                        {idr(this.props.User.popcoin)}
                    </Header>
                    {
                        this.state.topup?
                        <div>
                            <Input
                                placeholder='Rp0.00'
                                style={{
                                    fontSize:'21px',
                                    width:'100%',
                                    marginBottom:'9px',
                                    textAlign:'center'
                                }}
                                value={this.state.amount}
                                onChange={(e)=>{
                                    this.setState({amount:e.target.value})
                                }}
                            />
                            <Button
                                color='blue'
                                style={{
                                    width:'100%',
                                    fontSize:'21px',
                                }}
                                onClick={this.onTopUp}
                            >
                                OK
                            </Button>
                        </div>
                        :
                        <Button
                            color='blue'
                            style={{
                                width:'100%',
                                fontSize:'24px'
                            }}
                            loading={this.state.loading}
                            disabled={this.state.loading}
                            onClick={()=>{
                                this.setState({topup:true})
                            }}
                        >
                            Top Up
                        </Button>
                    }
                </Segment>
                {
                    this.state.error?
                    <div style={{color:'red', textAlign:'center'}}>{this.state.error}</div>
                    : null
                }
            </Container>
            
         );
    }
}

const MapstatetoProps=(state)=>{
    return{
        User: state.Auth
    }
}

export default connect(MapstatetoProps,{KeepLogin}) (Popcoin);