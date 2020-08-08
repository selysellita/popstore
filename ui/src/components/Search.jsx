import React, { Component }from 'react';
import { Icon, Form, Input } from 'semantic-ui-react'
import {withRouter} from 'react-router-dom';

class Search extends Component {

    state={
        keyword:''
    }

    dataOnChange=(e)=>{
        this.setState({[e.target.name]:e.target.value})
        console.log(this.state.keyword)
    }

    onSubmit =(e)=>{
        e.preventDefault()
        if(this.state.keyword!==''){
            return(
                this.props.history.push({
                    pathname: `/search/${this.state.keyword}`,
                })
            )
        }
        console.log(this.props.history)
    }

    render(){
        return(
            <Form style={{display: 'flex',}} onSubmit={this.onSubmit}> 
                <Input  
                name="keyword" type="text" 
                placeholder="Search product..." 
                label="Search" labelPosition='right'
                onChange={this.dataOnChange} />
            </Form>
        )
        }
}

// export default Search
export default withRouter (Search)