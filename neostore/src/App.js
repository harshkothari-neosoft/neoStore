import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { lazy, Suspense } from 'react';
import ErrorBoundary from './components/ErrorBoundry'
// import Invoice from './components/Invoice';
// import ProductDetails from './components/ProductDetails';
// import ChangePassword from './components/ChangePassword';
// import Dashboard from './components/Dashboard';
// import Account from './components/Account';
// import Address from './components/Address';
// import Home from './components/Home';
// import Login from './components/Login'
// import Registration from './components/Registration'
// import Cart from './components/Cart'
// import Checkout from './components/Checkout'
// import Forgetpassword from './components/Forgetpassword'
// import Order from './components/Order'
// import Product from './components/Product'
// import Profile from './components/Profile'

const Login = lazy(()=> import('./components/Login'))
const Registration = lazy(()=> import('./components/Registration'))
const Cart = lazy(()=> import('./components/Cart'))
const Checkout = lazy(()=> import('./components/Checkout'))
const Forgetpassword = lazy(()=> import('./components/Forgetpassword'))
const Order = lazy(()=> import('./components/Order'))
const Product = lazy(()=> import('./components/Product'))
const Dashboard = lazy(()=> import('./components/Dashboard'))
const Profile = lazy(()=> import('./components/Profile'))
const Home = lazy(()=> import('./components/Home'))
const Address = lazy(()=> import('./components/Address'))
const Account = lazy(()=> import('./components/Account'))
const ChangePassword = lazy(()=> import('./components/ChangePassword'))
const ProductDetails = lazy(()=> import('./components/ProductDetails'))
const Invoice = lazy(()=> import('./components/Invoice'))


function App() {
  return (
    <div>
      <Router>
      <ErrorBoundary>
      <Suspense fallback={
    <img src="https://createwebsite.net/wp-content/uploads/2015/09/Preload.gif" width="100%" alt="..."></img>}>
        <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/registration" element={<Registration/>}/>
        <Route path="/" element={<Dashboard/>}/>
        {/* <Route path="/" element={<Home/>}/> */}
        <Route path="/cart" element={<Cart/>}/>
        <Route path="/checkout" element={<Checkout/>}/>
        <Route path="/forgetpassword" element={<Forgetpassword/>}/>  
        <Route path="/product" element={<Product/>}/>
        <Route path="/productdetails" element={<ProductDetails/>}/>
        <Route path="/invoice" element={<Invoice/>}/>

        <Route path="/account" element={<Account/>}>
          <Route path="order" element={<Order/>}/>
          <Route path="address" element={<Address/>}/>
          <Route path="profile" element={<Profile/>}/>
          <Route path="changepassword" element={<ChangePassword/>}/>
        {/* <Route path="*" element={<img width="100%" height="657px" src="./images/notfound.gif" alt="not found"/>}/> */}
        </Route>

        <Route path="*" element={<img width="100%" height="657px" src="./images/notfound.gif" alt="not found"/>}/>
        </Routes>
        </Suspense>
        </ErrorBoundary>
      </Router>
    </div>
  );
}

export default App;
