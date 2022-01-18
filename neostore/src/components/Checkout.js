import React, { useState, useEffect } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { checkOutService } from "../config/MyProductService";
import jwtdecode from "jwt-decode";
import { useNavigate } from "react-router";
import Navbaar from "./Navbaar";
import Footer from "./Footer";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { cartSaveService } from "../config/Myservice";
import './checkout.css'

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [state, setState] = useState({ cardNum: "", cvv: "", name: "", expDate: "", userEmail: ""});
  const [errors, setErrors] = useState({ cardNum: "", cvv: "", name: "", expDate: ""});
  const [isSumbit, setIsSubmit] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("_token") != undefined) {
      let token = localStorage.getItem("_token");
      let decode = jwtdecode(token);
      setState({ ...state, userEmail: decode.email });
    } else {
      navigate("/login");
    }
  }, []);

  // Order checkout 
  const checkout = () => {
    setErrors(null);
    setIsSubmit(true);
    let temp = validate(state);
    if ( state.cardNum != "" && state.cvv != "" && state.expDate != "" && state.name != "" && state.userEmail != "" && temp.length === 0) {
      let formData = {
        user_email: state.userEmail,
        card_name: state.name,
        subtotal: location.state.subTotalState.subTotal,
        gst: location.state.subTotalState.gst,
        totalCart: location.state.cart,
        addresses: location.state.address,
      };
      checkOutService(formData)
      .then(res => {
          cartSaveService({ data: [], email: state.userEmail })
          .then(res => {
              localStorage.setItem('_token',res.data.token)
          })
          // alert(res.data.msg)
          Swal.fire({
            icon: "success",
            title: "Thank You for Shopping with Us!",
            text: res.data.msg,
          });
          localStorage.removeItem('cart')
          dispatch({ type: "emptyCart", payload: 0 })
          navigate('/')
      })
    } else {
      // alert('All fields are required')
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "All Fields Are Required or You Enter Wrong Details",
      });
    }
  };

  // Card Details Validation
  const validate = (values) => {
    const e = [];
    const errors = {};
    if (!values.cardNum) {
      e.push({ cardNum: "card number required" });
      errors.cardNum = "Card Number is Required";
    } else if (values.cardNum.length !== 16) {
      e.push({ cardNum: "Card number should be  16 digits" });
      errors.cardNum = "Card number should be 16 digits";
    }
    if (!values.cvv) {
      e.push({ cvv: "cvv is required" });
      errors.cvv = "CVV  is Required";
    } else if (values.cvv.length !== 3) {
      e.push({ cvv: "CVV  should be  3 digits" });
      errors.cvv = "CVV  Should be of 3 digits";
    }
    if (!values.name) {
      e.push({ name: "Name is required" });
      errors.name = "Name  is Required";
    } else if (values.name.length < 3) {
      e.push({ name: "Name  should be greater than 3 letter" });
      errors.name = "Name  should be greater than 3 letter";
    }
    if (!values.expDate) {
      e.push({ expDate: "Expiration Date is required" });
      errors.expDate = "Date is required";
    }
    setErrors(errors);
    return e;
  };

  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSumbit) {
      console.log(errors);
    }
  }, [errors]);
  return (
    <>
    {localStorage.getItem('_token')!=undefined ?
    <>
      <Navbaar/>

<div className="container1">

<div className="card3">
     <h3 className="head3"><i>visa</i></h3>
    <div className="top">
        <h1><i>visa</i></h1>
        <h2 className="head2">credit card</h2>
    </div>

    <div className="mid">
        <h2 className="head2">card number</h2>
        <div className="card-number">
            <input type="text" className="form-control w-50" value={state.cardNum} name='cardNum' onChange={e => setState({ ...state, cardNum: e.target.value })} />
        </div>
    </div>

    <div className="bottom">
        <div className="card-holder">
            <h2 className="head2">card holder</h2>
            <input type="text" className="form-control h-25" name='name' value={state.name} onChange={e => setState({ ...state, name: e.target.value })}/>
        </div>   
        <div className="express pl-5">
            <h2 className="head2">Expiry</h2>
           <input type="text" className="form-control w-75 h-25" name='expDate' value={state.expDate} onChange={e => setState({ ...state, expDate: e.target.value })}/>
        </div>      
        <div className="cvv">
            <h2 className="head2">cvv</h2>
            <input type="text" name='cvv' className="form-control h-25 w-50" value={state.cvv} onChange={e => setState({ ...state, cvv: e.target.value })}/>
        </div>
    </div>
    <button className='btn btn-info w-100 mt-5' onClick={() => checkout()}>Pay Rs.{location.state.subTotalState.subTotal + location.state.subTotalState.gst}</button>

</div>

</div>
      <Footer />
      </>
      : <Navigate to="/login"></Navigate> }
    </>
  );
}

export default Checkout;
