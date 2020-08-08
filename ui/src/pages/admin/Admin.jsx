import React from 'react'
import { Table,Button,Checkbox } from 'semantic-ui-react'
import { useState } from 'react'
import { useEffect } from 'react'
import Axios from 'axios'
import { APIURL } from '../../supports/ApiUrl'


const AdminTable = () => {
    const [seller,setseller]=useState([])
 
    ///// GET DATA SELLER /////
    useEffect(()=>{
        Axios.get(`${APIURL}/admin/allseller`)
        .then((res)=>{
            setseller(res.data)
        }).catch((err)=>{
            console.log(err)
        })
    },[])

    const blockseller=(idseller)=>{    
        Axios.put(`${APIURL}/admin/blocked/${idseller}`)
        .then((res)=>{
            console.log(res)
            
        }).catch((err)=>{
            console.log(err)
            
        })
    }
    const unblockseller=(idseller)=>{    
        Axios.put(`${APIURL}/admin/unblocked/${idseller}`)
        .then((res)=>{
            console.log(res)
            
        }).catch((err)=>{
            console.log(err)
            
        })
    }

    


    
    console.log(seller);
    
    const renderseller=()=>{
        return seller.map((val,index)=>{
            return (
                <Table.Row key={index}>
        <Table.Cell>{val.email}</Table.Cell>
            <Table.Cell>{val.username}</Table.Cell>
            <Table.Cell>{val.namatoko}</Table.Cell>
        <Table.Cell>{val.alamattoko}</Table.Cell>
        <Table.Cell>{val.createat}</Table.Cell>
            <Table.Cell>{val.lastlogin}</Table.Cell>
            <Table.Cell>
                {
                    val.isverified === 1 ? 'verified' 
                    : 'not verified'
                }
            </Table.Cell>   
            {
                val.isblocked === 1 ?<Button onClick={()=>unblockseller(val.idseller)}>unblock</Button>:
                <Button negative onClick={()=>blockseller(val.idseller)}>Block</Button>

            }
      </Table.Row>
            )
        })
    }
    return (
      
     <div>
         <div style={{display:'flex',marginLeft:'5%',marginTop:'2%'}}>   
         <a href="http://localhost:3000/verifyseller">click here to verify seller</a>
         </div>
  <Table singleLine>
    <Table.Header>
        <h1>
            List Seller
        </h1>
      <Table.Row>
        <Table.HeaderCell>E-mail</Table.HeaderCell>
        <Table.HeaderCell>Username</Table.HeaderCell>
        <Table.HeaderCell>Store</Table.HeaderCell>
        <Table.HeaderCell>Store Address</Table.HeaderCell>
        <Table.HeaderCell>Registration Date</Table.HeaderCell>
        <Table.HeaderCell>Last Login</Table.HeaderCell>
        <Table.HeaderCell>Status</Table.HeaderCell>
        <Table.HeaderCell>Action</Table.HeaderCell>
      </Table.Row>
    </Table.Header>

    <Table.Body>
        {
            renderseller()
        }
        
    </Table.Body>
  </Table>
     </div>
    )
}

export default AdminTable