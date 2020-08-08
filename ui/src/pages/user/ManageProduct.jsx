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
    TextArea
} from 'semantic-ui-react'
import {Redirect} from 'react-router-dom'



class ManageProduct extends Component {
    state = { 
        imageEdit:'',
        productNameEdit:'',
        descriptionEdit:'',
        priceEdit:0,
        stockEdit:0,
        idproductedit:0
     }

    
    componentDidMount=()=>{

    }
    

    render() { 
        return ( 
            <Container style={{paddingTop:'2em'}}>

                <Header as={'h1'}>Manage Product</Header>
                <Grid>
                    <Grid.Row style={{border:'1px solid gray',borderRadius:'5px'}}>
                        <Grid.Column width={1}>
                            No
                        </Grid.Column>
                        <Grid.Column width={3}>
                            Image
                        </Grid.Column>
                        <Grid.Column width={2}>
                            Name
                        </Grid.Column>
                        <Grid.Column width={3}>
                            Description
                        </Grid.Column>
                        <Grid.Column width={2}>
                            Price
                        </Grid.Column>
                        <Grid.Column width={2}>
                            Stock
                        </Grid.Column>
                        <Grid.Column width={3}>
                            Action
                        </Grid.Column>
                    </Grid.Row>

                    {
                        this.state.idproductedit?
                        <Grid.Row style={{border:'1px solid gray',borderRadius:'5px'}}>
                            <Grid.Column width={1}>
                                1
                            </Grid.Column>
                            <Grid.Column width={3}>
                                <Image src={this.state.imageEdit}/>
                                <Input 
                                    placeholder='image...' 
                                    style={{width:'100%'}}
                                    onChange={(e)=>{this.setState({imageEdit:e.target.value})}}
                                />
                            </Grid.Column>
                            <Grid.Column width={2}>
                                <Header as={'h4'}>
                                    <Input
                                        placeholder='Product Name'
                                        style={{width:'100%'}}
                                        value=''
                                        onChange={(e)=>{this.setState({productNameEdit:e.target.value})}}
                                    />
                                </Header>
                            </Grid.Column>
                            <Grid.Column width={3}>
                                <Form>
                                    <TextArea 
                                        placeholder='Tell us more' 
                                        style={{width:'100%'}}
                                        value=''
                                        onChange={(e)=>{this.setState({descriptionEdit:e.target.value})}}
                                    />
                                </Form>
                            </Grid.Column>
                            <Grid.Column width={2}>
                                Rp70000,00
                            </Grid.Column>
                            <Grid.Column width={2}>
                                30
                            </Grid.Column>
                            <Grid.Column width={3}>
                                <Button 
                                    primary 
                                    style={{margin:'0 .5em .5em 0'}}
                                    onClick={()=>{this.setState({idproductedit:1})}}
                                >Edit</Button>
                                <Button color='red'>Delete</Button>
                            </Grid.Column>
                        </Grid.Row>
                        :
                        <Grid.Row style={{border:'1px solid gray',borderRadius:'5px'}}>
                            <Grid.Column width={1}>
                                1
                            </Grid.Column>
                            <Grid.Column width={3}>
                                <Image src='https://s.blanja.com/picspace/392/241032/1250.1346_2dd6e3ef13f14da9b8e8f400c464ff5a.jpg'/>
                            </Grid.Column>
                            <Grid.Column width={2}>
                                <Header as={'h4'}>
                                    Product Name
                                </Header>
                            </Grid.Column>
                            <Grid.Column width={3}>
                                <p>
                                Quisque venenatis in arcu sit amet aliquam. Donec volutpat, ipsum pretium luctus accumsan, dolor mi pulvinar lorem, a pulvinar arcu ipsum
                                </p>
                            </Grid.Column>
                            <Grid.Column width={2}>
                                Rp70000,00
                            </Grid.Column>
                            <Grid.Column width={2}>
                                30
                            </Grid.Column>
                            <Grid.Column width={3}>
                                <Button 
                                    primary 
                                    style={{margin:'0 .5em .5em 0'}}
                                    onClick={()=>{this.setState({idproductedit:1})}}
                                >Edit</Button>
                                <Button color='red'>Delete</Button>
                            </Grid.Column>
                        </Grid.Row>
                        
                    }



                </Grid>
            </Container>
         );
    }
}
 
export default ManageProduct;