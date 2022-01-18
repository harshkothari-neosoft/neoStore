import React, { useState } from 'react'
import { addPost } from '../config/Myservice';
import { useNavigate } from "react-router";
import Swal from 'sweetalert2'
import SocialButton from './SocialButton';
import "./style.css"
import { Link } from 'react-router-dom';
const regForEmail = RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
const regForName = RegExp(/^[A-Za-z]{3,30}$/);
const regForContact = RegExp(/^[6-9][0-9]{9}/);
const regForpassword = RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})");

export default function Registration() {
    const [errors, seterrors] = useState({errfirstname:'', errlastname:'', erremail:'', errcontact:'', errpassword:'', errcpassword:'', errgender:'', pass: null})
    const [data, setdata] = useState({firstname:'', lastname:'', email:'', contact:'',password:'', cpassword:'', gender:''})
    const navigate = useNavigate()

    // For Validation
    const handler = (event) => {
        const { name, value } = event.target;
        switch (name) {
            case "firstname":
                let error1 = regForName.test(value) ? "" : "Invalid Name";
                seterrors({ ...errors, errfirstname: error1 });
                break;

            case "lastname":
                let error2 = regForName.test(value) ? "" : "Invalid Name";
                seterrors({ ...errors, errlastname: error2 });
                break;

            case "email":
                let error3 = regForEmail.test(value) ? "" : "Invalid Email";
                seterrors({ ...errors, erremail: error3 });
                break;

            case "contact":
                let error4 = regForContact.test(value) ? "" : "Invalid Contact";
                seterrors({ ...errors, errcontact: error4 });
                break;

            case "password":
                let error5 = regForpassword.test(value) ? "" : "Invalid Password";
                seterrors({ ...errors, errpassword: error5, pass: value });
                break;

            case "cpassword":
                let error6 = value === errors.pass ? "" : "Password does not match";
                seterrors({ ...errors, errcpassword: error6 });
                break;
        }
        setdata({...data, [name]: value})
    }

    // New User Registration
    const validate = async () => {
        if(data.firstname != '' && data.lastname != '' && data.email != '' && data.contact != '' && data.password != '' && data.cpassword != '' && data.gender != ''){
            let formData = {
                firstname:data.firstname,
                lastname:data.lastname,
                email:data.email,
                contact:data.contact,
                password:data.password,
                cpassword:data.cpassword,
                gender:data.gender
            }
            await addPost(formData)
            .then(res =>{
                if (res.data.err == 0){
                    // alert(res.data.msg)
                    navigate("/login")
                }
                else{
                    // alert(res.data.msg)
                    Swal.fire({
                        icon: 'warning',
                        title: 'Oops...',
                        text: res.data.msg,
                      })
                }
            })
        }
        else{
            // alert("Enter All Registration Details")
            Swal.fire({
                icon: 'warning',
                title: 'Oops...',
                text: 'Enter All Registration Details',
              })
        }
    }

    // Social Login Registration
    const handleSocialLogin = async (user) => {
            let formData = {
                firstname: user._profile.firstName,
                lastname: user._profile.lastName,
                email: user._profile.email,
                contact: 9999999999,
                password: user._profile.id,
                gender: 'undefined'
              };
             await addPost(formData)
             .then(res =>{
                 if (res.data.err == 0){
                     alert(res.data.msg)
                     navigate("/login")
                 }
                 else{
                    //  alert(res.data.msg)
                    Swal.fire({
                        icon: 'warning',
                        title: 'Oops...',
                        text: res.data.msg,
                      })
                 }
             })
      };

    const handleSocialLoginFailure = (err) => {
        console.error(err);
      };

    return (

        <div className="container-fluid">
		<div className="row">
			<div className="col-lg-6 col-md-6 form-container">
				<div className="col-lg-8 col-md-12 col-sm-9 col-xs-12 form-box text-center">
					<div className="logo mt-5 mb-3">
                    <h2 className='font-weight-bold text-white'>Neo<span style={{color:'red'}}>STORE</span> </h2>
					</div>
					<div className="heading mb-3">
						<h4>Create an account</h4>
					</div>
					
						<div className="form-input">
							<span><i className="fa fa-user"></i></span>
							<input type="text" id='firstname' name='firstname' value={data.firstname} onChange={handler} placeholder="First Name"/>
                            <span className="text-warning">{errors.errfirstname}</span>
						</div>
                        <div className="form-input">
							<span><i className="fa fa-user"></i></span>
							<input type="text" id='lastname' name='lastname' value={data.lastname} onChange={handler} placeholder="Last Name"/>
                            <span className="text-warning">{errors.errlastname}</span>
						</div>
						<div className="form-input">
							<span><i className="fa fa-envelope"></i></span>
							<input type="email" id='email' name='email' value={data.email} onChange={handler} placeholder="Email Address"/>
                            <span className="text-warning">{errors.erremail}</span>
						</div>
                        <div className="form-input">
							<span><i className="fa fa-phone"></i></span>
							<input type="text" id='contact' name='contact' value={data.contact} onChange={handler} placeholder="Contact Number"/>
                            <span className="text-warning">{errors.errcontact}</span>
						</div>
						<div className="form-input">
							<span><i className="fa fa-lock"></i></span>
							<input type="password" id='password' name='password' value={data.password} onChange={handler} placeholder="Password"/>
                            <span className="text-warning">{errors.errpassword}</span>
						</div>
                        <div className="form-input">
							<span><i className="fa fa-lock"></i></span>
							<input type="password" id='cpassword' name='cpassword' value={data.cpassword} onChange={handler} placeholder="Confirm Password"/>
                            <span className="text-warning">{errors.errcpassword}</span>
						</div>
                        <div className='text-left'>
                            <input type="radio" id="male" name="gen" value="male" onClick={e=> setdata({...data, gender: e.target.value})}/> <span className='text-white font-weight-bold mr-3'> Male</span> 
                            <input type="radio" id="female" name="gen" value="female" onClick={e=> setdata({...data, gender: e.target.value})}/> <span className='text-white font-weight-bold mr-3'> Female</span>
						</div>
						
						<div className="text-left my-3">
							<button className="btn" onClick={validate}>Register</button>
						</div>
						<div className="text-white mb-3">or register with</div>
						<div className="row mb-3">
							<div className="col-6">
                            <SocialButton
                                provider="facebook"
                                appId="2171649733000264"
                                onLoginSuccess={handleSocialLogin}
                                onLoginFailure={handleSocialLoginFailure} 
                                className="btn btn-block btn-social btn-facebook">
                                <i className="fa fa-facebook mr-1"></i>
                                Continue With facebook
                            </SocialButton>
							</div>
							<div className="col-6">
                            <SocialButton 
                                provider="google"
                                appId="420321224046-je2rf4df9mqcua73ve0usqqvrsoqvdi5.apps.googleusercontent.com" 
                                onLoginSuccess={handleSocialLogin}
                                onLoginFailure={handleSocialLoginFailure}
                                className="btn btn-block btn-social btn-google">
                                <i className="fa fa-google mr-1"></i>
                                Continue With Google
                            </SocialButton>
							</div>
							
						</div>
						<div className="text-white">Already have an account? 
							<Link to="/login" className='font-weight-bold' style={{textDecoration:"none",color:"white"}}> Login here</Link>
						</div>
					
				</div>
			</div>

			<div className="col-lg-6 col-md-6 d-none d-md-block image-container1"></div>
		</div>
	</div>

    )
}
