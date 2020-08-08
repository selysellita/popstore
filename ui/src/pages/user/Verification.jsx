import React, { Component } from 'react'
import {Container,Message,Header,Button} from 'semantic-ui-react'
import Axios from 'axios'
import { APIURL } from '../../supports/ApiUrl'
import {connect} from 'react-redux'
import {KeepLogin} from '../../redux/actions'
import { Redirect } from 'react-router-dom'



class Verification extends Component {
    state = { 
        message: 'wait...',
        redirect: false,
        loading: true,
     }

    componentDidMount=()=>{

        if(this.props.User.isverified){
            this.setState({message:'Your Account Is Already Verified'})
        }else{
            var token=this.props.match.params.token

            if(!token){
                this.setState({
                    message:'An Email verification has been sent to your email, click the verification link to verify your account',
                    loading:false
                })
            }else{
                Axios.put(`${APIURL}/users/verify`,{token})
                .then((res)=>{

                    // ACTION KEEPLOGIN
                    this.props.KeepLogin(res.data.update)
                    this.setState({
                        message:'Your Account Has been verified, Enjoy our product',
                        loading:false
                    })

                }).catch((err)=>{
                    console.log(err)
                })
            }
        }
    }

    onResend=()=>{
        this.setState({loading:true})
        var datauser={
            iduser:this.props.User.iduser,
            username:this.props.User.username,
            email:this.props.User.email
        }
        Axios.post(`${APIURL}/users/resendmail`,datauser)
        .then((res)=>{
            this.setState({message:'Resend Email berhasil',loading:false})
        }).catch((err)=>{
            this.setState({loading:false})
            console.log(err)
        })
    }

    render() { 
        return ( 

            <Container style={{paddingTop:'100px'}}>
                <Header as={'h1'}>Verify your account</Header>
                <Message style={{marginBottom:'50px'}}>
                    {this.state.message}
                </Message>

                {
                    !this.props.User.isverified?
                    <Button 
                        primary 
                        onClick={this.onResend}
                        loading={this.state.loading}
                        disabled={this.state.loading}
                    >
                        Resend Email
                    </Button>
                    : null
                }

                {
                    this.state.redirect?
                    <Redirect to='/'/>
                    : null
                }
            </Container>

         );
    }
}

const MapstatetoProps=(state)=>{
    return {
        User: state.Auth
    }
}
 
export default connect(MapstatetoProps,{KeepLogin}) (Verification);