import React from 'react'
import { Button, Comment, Form, Header } from 'semantic-ui-react'
import Axios from 'axios'
import { useEffect,useState } from 'react';
import { APIURL } from './../supports/ApiUrl';
import {connect} from 'react-redux'
import { isJson } from './../supports/services'
const CommentSection = (props) => {
    const [commentdata,setcomment]=useState([])
    
    const [newcomment,setnewcomment]=useState({
      comment:'',
      iduser:props.iduser
    })
    
   
    
    useEffect(()=>{
      Axios.get(`${APIURL}/comments/comment?idproduct=${props.idproduct}`)
      .then((res)=>{
        setcomment(res.data)
        console.log(res);
      }).catch((err)=>{
        console.log(err)
      })
    },[])

    console.log(props.idproduct)
    
    const postComment=()=>{
      Axios.post(`${APIURL}/comments/newcomment/${props.idproduct}`,newcomment)
      .then((res)=>{
        console.log(res.data);
        Axios.get(`${APIURL}/comments/comment?idproduct=${props.idproduct}`)
        .then((res)=>{
          setcomment(res.data)
          console.log(res);
        }).catch((err)=>{
          console.log(err)
        })
      }).catch((err)=>{
        console.log(err)
        
      })
    }

    const renderComment=()=>{
      return commentdata.map((val,index)=>{
        return(
          <Comment key={index}>
          <Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/elliot.jpg'/>
          <Comment.Content>
          <Comment.Author as='a'>{val.username}</Comment.Author>
            <Comment.Metadata>
                <div>{val.createat}</div>
            </Comment.Metadata>
            <Comment.Text>{val.comment}</Comment.Text>
            <Comment.Actions>
              <Comment.Action>Reply</Comment.Action>
            </Comment.Actions>
          </Comment.Content>
        </Comment>
        )
      })
    }

  return (
  <Comment.Group>
    <Header as='h3' dividing>
      Comments
    </Header>

    {
      renderComment()
    }

    

    <Form reply>
      <Form.TextArea onChange={(e)=>setnewcomment({...newcomment,comment:e.target.value})} placeholder='Insert Your Comment here' />
      <Button content='Add Reply' labelPosition='left' icon='edit' primary onClick={postComment} />
    </Form>
  </Comment.Group>
  )
}

const MapstatetoProps=(state)=>{
  return  state.Auth
          
}
export default connect(MapstatetoProps)(CommentSection)