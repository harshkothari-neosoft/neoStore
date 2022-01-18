import React, { useEffect, useState } from 'react'
import {} from 'react-router-dom'
import {Button, Form, FormControl, NavDropdown} from 'react-bootstrap'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useDispatch, useSelector} from 'react-redux'
import {Link, useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { cartSaveService } from '../config/Myservice';

export default function Navbaar() {
    const [login, setlogin] = useState(false)
    const [search, setSearch] = useState('')
    const [state, setState] = useState({})
    const cartData = useSelector(state => state.cartData)
    const dispatch = useDispatch();
   const navigate = useNavigate();

   useEffect(() => {
    if (localStorage.getItem('_token') != undefined) {
        setlogin(true)
        let token = localStorage.getItem('_token');
        let decode = jwtDecode(token)
        setState(decode)
    }
}, [])

    //For Logout and remove all data from localstorage
    const logout = () => {
        let data = JSON.parse(localStorage.getItem('cart'))
        cartSaveService({ data: data, email: state.email })
            .then(res => {
                console.log(res.data)
            })
        localStorage.removeItem('_token');
        localStorage.removeItem('cart');
        dispatch({ type: "emptyCart", payload: 0 })

    }

    // Search all products from navbar
    const searchprod = () => {
        dispatch({type:"searchRedux", payload: search})
        navigate("/product")
    }
    
    return (
        <div>
             <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    <Link className="navbar-brand font-weight-bold" to="/" style={{fontSize:"1.6rem"}}>Neo<span style={{color:"red"}}>STORE</span></Link>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">

                            <li className="nav-item">
                                <Link className="nav-link" to="/">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/product">Product</Link>
                            </li>

                            <li className="nav-item">
                                {login ?
                                <Link className="nav-link" to="/account/order">Order</Link>
                                :
                                <Link className="nav-link" to="/login">Order</Link> }
                            </li>
                        </ul>
                    </div>

         <Form className="d-flex">
            <FormControl
          type="search"
          placeholder="Search"
          className="me-2"
        value={search}
        onChange={e => setSearch(e.target.value)}
          aria-label="Search"
        />
        <Button variant="outline-success" onClick={()=>searchprod()} className='ml-2 mr-4'>Search</Button>
      </Form>
        
        <div>
            <Link to="/cart" style={{color:"white", textDecoration:"none"}}><ShoppingCartIcon/> Cart<span className='badge badge-primary'>{' '} {cartData.count}</span></Link>
        </div>

        {login ?
      <NavDropdown title={<AccountCircleIcon style={{color:"white"}}/>} >
          <NavDropdown.Item><Link to="/account/profile" style={{color:"black", textDecoration:"none"}}>View Profile</Link></NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item> <Link to="/" style={{color:"black", textDecoration:"none"}} onClick={() => logout() }>Logout</Link></NavDropdown.Item>
        </NavDropdown>
        :
        <NavDropdown title={<AccountCircleIcon style={{color:"white"}}/>} >
          <NavDropdown.Item><Link to="/login" style={{color:"black", textDecoration:"none"}}>Login</Link></NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item> <Link to="/registration" style={{color:"black", textDecoration:"none"}}>Register</Link></NavDropdown.Item>
        </NavDropdown> 
        }
                    {/* <form className="d-flex">

                       <Link to="/"> <button className="btn btn-danger" type="submit" onClick={()=>logout()}>Logout</button></Link>
                    </form> */}
                </div>
            </nav>
        </div>
        </div>
    )
}