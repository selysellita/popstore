import React, {useState,useEffect,Fragment} from 'react';
import './App.css';
import Home from './pages/user/Home'
import { Switch, Route, Redirect } from 'react-router-dom';
import {
  Grid,
  Header,
  Segment,
} from 'semantic-ui-react'
import MainHeader from './components/Header'
import Login from './pages/user/Login';
import Register from './pages/user/Register'
import Verification from './pages/user/Verification'
import ManageProduct from './pages/user/ManageProduct'
import AddProduct from './pages/seller/AddProduct'
import AllProducts from './pages/user/AllProducts'
import ProductItems from './pages/seller/ProductItems'
import Product from './pages/user/Product'
import Cart from './pages/user/Cart'
import Checkout from './pages/user/Checkout'
import Transactions from './pages/user/Transactions'
import ManageTransactions from './pages/admin/ManageTransactions'
import ManageOrders from './pages/seller/ManageOrders'
import ChangePass from './pages/user/Changepass'
import Forgotpass from './pages/user/Forgotpass'
import VerifyTable from './pages/admin/Adminverify'
import Profile from './pages/user/Profile'
import Sellerregis from './pages/user/Sellerregis'
import Admintable from './pages/admin/Admin'
// import Testimage from './pages/aaaaa'
import WishlistPage from './pages/user/Wishlist'
import CommentSection from './components/Comment'
import Sales from './pages/admin/SalesCharts'
import ManageFlashsales from './pages/admin/ManageFlashsales'
import FlashsaleSellerManage from './pages/seller/FlashsaleSellerManage'
import Flashsale from './pages/user/Flashsale'
import Popcoin from './pages/user/Popcoin'
import { KeepLogin,KeepSeller, LoadCart, LoadPayment,LoadInvoices, LoadOrders } from './redux/actions'
import { APIURL } from './supports/ApiUrl';
import { connect } from 'react-redux';
import MyProducts from './pages/seller/MyProduct';
import MyOrders from './pages/seller/MyOrder';
import Axios from'axios'
import StoreProfile from './pages/seller/StoreProfile';
import SearchProducts from './pages/user/SearchProducts';
import WomenProducts from './pages/user/WomenProducts';
import MenProducts from './pages/user/MenProducts';
import MyProduct from './pages/seller/MyProduct';


function App({KeepLogin,LoadCart,LoadPayment,LoadInvoices,LoadOrders,User,KeepSeller}) {

  const [Loading,setLoading]=useState(true)

  const [fixed,setfixed]=useState(false)

  useEffect(()=>{
    const token=localStorage.getItem('token')
    if(token){
      Axios.get (`${APIURL}/users/keeplogin`,{
        headers:
        {
          'Authorization':`Bearer ${token}`
        }
      })
      .then(res=>{
        // USER
        KeepLogin(res.data)
        LoadCart(res.data.iduser)
        LoadPayment(res.data.iduser)

        // SELLER
        if(res.data.isseller){
          KeepSeller(res.data.iduser)

          LoadOrders(res.data.iduser)
        }

        // ADMIN
        if(res.data.isadmin){
          LoadInvoices(res.data.iduser)
        }
      }).catch((err)=>{
        console.log(err)
      }).finally(()=>{
        setLoading(false)
      })
    }else{
      setLoading(false)
    }
  },[])


  const visitorAccess=!Loading&&!User.islogin
  const memberAccess=!Loading&&User.islogin&&User.isverified // only true if not loading,islogin,and isverified
  const sellerAccess=!Loading&&User.islogin&&User.isseller&&User.isverified
  const adminAccess=!Loading&&User.islogin&&User.isadmin&&User.isverified
  

  if(Loading){
    return (
      <div>
        <MainHeader 
          // fixed={fixed ? 'top' : null}
          inverted
          pointing
          secondary
          size='large'
        />
        <div style={{
          position:'absolute',
          top:'50%',
          left:'50%',
          transform:'translate(-50%,-50%)',
          paddingTop:'5em',
          height:'100%',
          overflow:'hidden',
        }}>
          <Header as={'h1'} style={{textAlign:'center',marginTop:'0',fontSize:'39px',letterSpacing:'8px'}}>Popstore</Header>
          <div><center><h3>Loading...</h3><img width="400px" src="https://static.boredpanda.com/blog/wp-content/uploads/2016/07/totoro-exercising-100-days-of-gifs-cl-terryart-2-578f80ec7f328__605.gif"/></center></div>
          {/* <Segment 
            basic 
            loading={true} 
            style={{
              width:'100%',
              display:'flex',
              alignItems:'center',
            }}
          >
            Loading
          </Segment> */}
        </div>
      </div>
    )
    return <div><center><h3>Loading...</h3><img width="400px" src="https://static.boredpanda.com/blog/wp-content/uploads/2016/07/totoro-exercising-100-days-of-gifs-cl-terryart-2-578f80ec7f328__605.gif"/></center></div>
  }
  
  return (
    <div>
      <MainHeader 
        // fixed={fixed ? 'top' : null}
        inverted
        pointing
        secondary
        size='large'
      />
      <Switch>

        {/* JAMES */}
        <Route path='/' exact component={Home}/>
        <Route path='/login' exact component={Login}/>
        <Route path='/register' exact component={Register}/>
        <Route path='/verification' exact component={User.islogin?Verification:()=><Redirect to='/'/>}/>
        <Route path='/verification/:token' exact component={User.islogin?Verification:()=><Redirect to='/'/>}/>
        <Route path='/forgotpassword' exact component={Forgotpass}/>
        <Route path='/forgotpassword/:token' exact component={ChangePass}/>
        <Route path='/profile' exact component={User.islogin?Profile:Loading?Home:()=><Redirect to='/'/>}/>
        <Route path='/Sellerregister' exact component={User.isseller?()=><Redirect to='/seller'/>:User.isverified?Sellerregis:Loading?Home:()=><Redirect to='/'/>}/>
        <Route path='/admin' exact component={adminAccess?Admintable:Loading?Home:!User.isverified?()=><Redirect to='/verification'/>:()=><Redirect to='/'/>}/>
        
        <Route path='/verifyseller' exact component={adminAccess?VerifyTable:Loading?Home:!User.isverified?()=><Redirect to='/verification'/>:()=><Redirect to='/'/>}/>
        <Route path='/wishlist' exact component={User.isverified?WishlistPage:Loading?Home:User.islogin?()=><Redirect to='/verification'/>:()=><Redirect to='/'/>}/>
        
        {/* SELY */}
        <Route path='/allproducts' exact component={AllProducts}/>
        <Route path='/search/:keyword' exact component={SearchProducts}/>
        <Route path='/seller/product' exact component={sellerAccess?MyProducts:Loading?Home:!User.isverified?()=><Redirect to='/verification'/>:()=><Redirect to='/'/>}/>
        {/* <Route path='/seller/myorder' exact component={MyOrders}/> */}
        <Route path='/seller/profile' exact component={sellerAccess?StoreProfile:Loading?Home:!User.isverified?()=><Redirect to='/verification'/>:()=><Redirect to='/'/>}/>
        <Route path='/seller/product' exact component={sellerAccess?ManageProduct:Loading?Home:!User.isverified?()=><Redirect to='/verification'/>:()=><Redirect to='/'/>}/>
               
        {/*  */}
        <Route path='/seller' exact component={sellerAccess?StoreProfile:Loading?Home:!User.isverified?()=><Redirect to='/verification'/>:()=><Redirect to='/'/>}/>
        <Route path='/allproducts/women' exact component={WomenProducts}/>
        <Route path='/allproducts/men' exact component={MenProducts}/>
        {/*  */}
        {/* <Route path='/seller/product' exact component={sellerAccess?ManageProduct:Loading?Home:()=><Redirect to='/'/>}/> */}
        
      

        {/* INDO */}
        
        {/* IF LOADING, HOME, THEN IF SELLER, MANAGEPRODUCT, IF NOT VERIFIED, REDIRECT TO VERIFICATION, IF OTHERS, REDIRECT TO HOME */}
        <Route path='/seller/product/add' exact component={sellerAccess?AddProduct:Loading?Home:!User.isverified?()=><Redirect to='/verification'/>:()=><Redirect to='/'/>}/>
        <Route path='/seller/product/:idproduct' exact component={sellerAccess?ProductItems:Loading?Home:!User.isverified?()=><Redirect to='/verification'/>:()=><Redirect to='/'/>}/>
        
        {/* SHOW PRODUCT DETAIL */}
        <Route path='/product/:idproduct' exact component={Product}/>

        <Route path='/cart' exact component={memberAccess?Cart:Loading?Home:!User.isverified?()=><Redirect to='/verification'/>:()=><Redirect to='/login'/>}/>
        <Route path='/checkout' exact component={memberAccess?Checkout:Loading?Home:!User.isverified?()=><Redirect to='/verification'/>:()=><Redirect to='/login'/>}/>

        <Route path='/transactions' exact component={memberAccess?Transactions:Loading?Home:!User.isverified?()=><Redirect to='/verification'/>:()=><Redirect to='/login'/>}/>
        <Route path='/managetransactions' exact component={adminAccess?ManageTransactions:Loading?Home:!User.isverified?()=><Redirect to='/verification'/>:()=><Redirect to='/login'/>}/>
        <Route path='/manageorders' exact component={sellerAccess?ManageOrders:Loading?Home:!User.isverified?()=><Redirect to='/verification'/>:()=><Redirect to='/'/>}/>
        
        <Route path='/admin/sales' exact component={adminAccess?Sales:Loading?Home:!User.isverified?()=><Redirect to='/verification'/>:()=><Redirect to='/login'/>}/>

        <Route path='/admin/flashsales' exact component={adminAccess?ManageFlashsales:Loading?Home:!User.isverified?()=><Redirect to='/verification'/>:()=><Redirect to='/login'/>}/>
        <Route path='/seller/flashsales' exact component={sellerAccess?FlashsaleSellerManage:Loading?Home:!User.isverified?()=><Redirect to='/verification'/>:()=><Redirect to='/login'/>}/>
        <Route path='/flashsale' exact component={Flashsale}/>

        <Route path='/popcoin' exact component={memberAccess?Popcoin:Loading?Home:!User.isverified?()=><Redirect to='/verification'/>:<Redirect to='/'/>}/>


        <Route path='/*' exact component={()=><Redirect to='/'/>}/>

      </Switch>

    </div>
  );
}

const MapstatetoProps=(state)=>{
  return {
    User: state.Auth
  }
}

// export default connect(MapstatetoProps, {KeepLogin,KeepSeller,LoadCart,LoadPayment}) (App);
export default connect(MapstatetoProps, {KeepLogin,KeepSeller,LoadCart,LoadPayment,LoadInvoices,LoadOrders}) (App);
