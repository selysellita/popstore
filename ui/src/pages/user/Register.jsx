import React ,{Component} from 'react'
import Axios from 'axios'
import {APIURL} from '../../supports/ApiUrl'
import {
    Grid,
    Header,
    Form,
    Segment,
    Button,
    Message
} from 'semantic-ui-react'
import {LoginUser} from '../../redux/actions'
import {Redirect} from 'react-router-dom'
import { connect } from 'react-redux'



class Register extends Component {
    state = { 
        username: '',
        email: '',
        password: '',
        confirmpassword: '',
        address: '',
        
        message: '',
        loading: false,
        isregistered: false,
     }


    onRegister=()=>{
        this.setState({loading:true})
        var {username,email,password,confirmpassword,address} = this.state
        var userdata={
            username,
            email,
            password,
            address
        }
        // PROTECTION
        if( !username || !email || !password || !confirmpassword || !address ){
            this.setState({message:'All columns must be filled',loading:false})
        }else if( password!==confirmpassword ){
            this.setState({message:'Confirm password tidak sama dengan password',loading:false})
        }else{
            this.setState({message:''})
            // Backend 
            Axios.post(`${APIURL}/users`,userdata)
            .then((res)=>{
                if(res.data.status){
                    console.log('register berhasil')
                    this.props.LoginUser({username,password})
                    this.setState({message:'berhasil',isregistered:true})
                }else{
                    this.setState({message:res.data.message})
                }
            }).catch((err)=>{
                console.log(err)
            }).finally(()=>{
                this.setState({loading:false})
            })
        }
    }
    


    render() { 
        return ( 
            <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
                <Grid.Column style={{ maxWidth: 450 }}>
                <Header as='h2' color='teal' textAlign='center'>
                    Log-in to your account
                </Header>
                <Form size='large'>
                    <Segment stacked>
                        <Form.Input 
                            fluid icon='user' 
                            iconPosition='left' 
                            placeholder='Username' 
                            onChange={(e)=>{this.setState({username:e.target.value})}}
                            value={this.state.username}
                        />
                        <Form.Input 
                            fluid icon='mail' 
                            iconPosition='left' 
                            placeholder='E-mail address' 
                            onChange={(e)=>{this.setState({email:e.target.value})}}
                            value={this.state.email}
                        />
                        <Form.Input
                            fluid
                            icon='lock'
                            iconPosition='left'
                            placeholder='Password'
                            type='password'
                            onChange={(e)=>{this.setState({password:e.target.value})}}
                            value={this.state.password}
                        />
                        <Form.Input
                            fluid
                            icon='lock'
                            iconPosition='left'
                            placeholder='Confirm Password'
                            type='password'
                            onChange={(e)=>{this.setState({confirmpassword:e.target.value})}}
                            value={this.state.confirmpassword}
                        />
                        <Form.Input 
                            fluid icon='map marker alternate' 
                            iconPosition='left' 
                            placeholder='Address' 
                            onChange={(e)=>{this.setState({address:e.target.value})}}
                            value={this.state.address}
                        />

                        <Button 
                            color='blue' 
                            fluid 
                            size='large' 
                            disabled={this.state.loading}  
                            loading={this.state.loading}
                            onClick={this.onRegister}
                        >
                            Register
                        </Button>
                    </Segment>
                </Form>
                {
                    this.state.message?
                    <Message style={{color:'red'}}>
                        {this.state.message}
                    </Message>
                    : null
                }
                {
                    this.state.isregistered?
                    <Redirect to='/verification'/>
                    : null
                }
                </Grid.Column>
            </Grid>
         );
    }
}

const MapstatetoProps=(state)=>{
    return{
        User: state.Auth
    }
}

export default connect(MapstatetoProps,{LoginUser}) (Register);