import React, { useEffect, useState } from 'react'
import {useLocation } from 'react-router-dom'
import PasswordIcon from '@mui/icons-material/Password';
import { useNavigate } from "react-router";
import Swal from 'sweetalert2'
import "./style.css"
import { forgetService, resetpassService } from '../config/Myservice';
import Naav from './Naav';
const regForpassword = RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})");

export default function Forgetpassword() {
    const [state, setstate] = useState({otp:null, flag:false,  pass:'', cpass:''})
	const [otp, setOtp] = useState(0)
    const navigate = useNavigate(); 

      const location =  useLocation();
	  useEffect(()=>{
		  setOtp(location.state.otp)
	  },[])

	  // Submit OTP of Forget Password
      const submitotp = () => {
          console.log(location.state.otp, "line 13")
          console.log(state.otp, "line 14")
        if(state.otp != null){
            if(state.otp == otp){
                // alert("Otp Match")
                setstate({...state, flag:true})
            }
            else{
                // alert("OTP does not match")
				Swal.fire({
                    icon: 'warning',
                    title: 'Oops...',
                    text: 'OTP Does Not Match',
                  })
            }
        }
        else{
            // alert("Enter OTP")
			Swal.fire({
				icon: 'warning',
				title: 'Oops...',
				text: 'Enter OTP',
			  })
        }
      }

	  // Password reset
      const resetpass = () => {
        if(regForpassword.test(state.pass) && state.pass === state.cpass){
            resetpassService({email:location.state.email, password: state.pass})
            .then(res=> {
                // alert(res.data.msg)
                navigate("/login")
            })
        }
        else{
            // alert("Enter Strong Password")
			Swal.fire({
				icon: 'warning',
				title: 'Oops...',
				text: 'Enter Strong Password',
			  })
        }
      }

	  // To Resend OTP
	  const resendotp = () => {
        forgetService({ email: location.state.email })
            .then(res => {
                setOtp(res.data.otp)
            })
    }

    return (
        <div>
            <Naav/>

            <div className="container-fluid">
		<div className="row">
            {state.flag != true ?
			<div className="col-lg-6 col-md-6 form-container">
				<div className="col-lg-8 col-md-12 col-sm-9 col-xs-12 form-box">
					<div className="reset-form d-block">
						<div className="reset-password-form">
							<h4 className="mb-3">Reset Your Password</h4>
							<p className="mb-3 text-white">
								 An 4 digit OTP is sent to your registered email address
							</p>
							<div className="form-input">
								<span><i className="fa fa-envelope"></i></span>   
								<input type="email" placeholder="Email Address" value={location.state.email} disabled/>
							</div>
                            <div className="form-input">
								<span><PasswordIcon/></span>
								<input type="text" value={state.otp} onChange={(e)=> setstate({...state,otp:e.target.value})} placeholder="Enter OTP"/>
							</div>

							<div className='row'>
							<div className="col mb-3">
								<button className="btn" onClick={()=>submitotp()}>Submit</button>
							</div>

							<div className="col d-flex justify-content-end mt-1 mb-3">
								<span style={{cursor:"pointer"}} className='text-white font-weight-bold' onClick={()=>resendotp()}>Resend Link</span>
							</div>
							</div>
						</div>
					</div>
				</div>
			</div>
            :  
            
            <div className="col-lg-6 col-md-6 form-container">
				<div className="col-lg-8 col-md-12 col-sm-9 col-xs-12 form-box">
					<div className="reset-form d-block">
						<div className="reset-password-form">
							<h4 className="mb-3">Reset Your Password</h4>
							<p className="mb-3 text-white">
								 Enter Your New Password
							</p>
							<div className="form-input">
								<span><PasswordIcon/></span>   
								<input type="password" value={state.pass} placeholder="New Password" onChange={(e)=> setstate({...state, pass:e.target.value})}/>
							</div>
                            <div className="form-input">
								<span><PasswordIcon/></span>
								<input type="password" value={state.cpass} onChange={(e)=> setstate({...state,cpass:e.target.value})} placeholder="Confirm Password"/>
							</div>
							<div className="mb-3">
								<button className="btn" onClick={()=>resetpass()}>Reset</button>
							</div>
						</div>
					</div>
			
				</div>
			</div>
                
            }

			<div className="col-lg-6 col-md-6 d-none d-md-block image-container2"></div>
		</div>
	</div>
        </div>
    )
}
