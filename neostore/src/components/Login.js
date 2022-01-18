import React, {useState} from 'react'
import { useNavigate } from "react-router";
import SocialButton from './SocialButton';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2'
import { forgetService, loginpage } from '../config/Myservice';
import jwtDecode from 'jwt-decode'
import  {useDispatch} from 'react-redux'
import "./style.css"
import Navbaar from './Navbaar';

export default function Login() {
    const [state, setstate] = useState({email:'', password:''})
    const navigate = useNavigate(); 

    const dispatch = useDispatch();

    // Item added to cart before login and if item already added then it will only increase quantity
    const cartData = (data)=>{   
        let decode = jwtDecode(data)
        let cart = JSON.parse(localStorage.getItem('cart'))
        if(localStorage.getItem('cart')!=undefined){
            let arr = [...cart]
                decode.cart.forEach(element => {
                    if (!cart.find(ele => ele._id === element._id)) {
                        arr.push(element)
                    }
                });
                localStorage.setItem('cart', JSON.stringify([...arr]))
        }
        
        else{
            if(decode.cart!=null){
                localStorage.setItem('cart',JSON.stringify([...decode.cart]))
            }
            else{
                localStorage.setItem('cart',JSON.stringify([]))
            }
        }
        dispatch({ type: "onLogin", payload:decode.cart})    
        return 10
    }

    // Check email and password at login time
    const checkdata = () => {
        console.log("hellooo")
        // event.preventDefault()
        if(state.email != '' && state.password != ''){
            console.log("line 16")
            loginpage({email:state.email, password:state.password})
            .then(res=>{
                if(res.data.err==0){
                  console.log(res.data)
                   localStorage.setItem("_token",res.data.token);
                   cartData(res.data.token)
                   navigate("/")
                }
                else{
                    //   alert(res.data.msg)
                    Swal.fire({
                        icon: 'warning',
                        title: 'Oops...',
                        text: 'Email and Password Does Not Match',
                      })
                }
            })
        }
        else{
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please Enter Login Details',
              })
        }
    }

    // Social Login Success
    const handleSocialLogin = (user) => {
        console.log(user._profile)
        loginpage({email:user._profile.email, password:user._profile.id})
            .then(res=>{
                if(res.data.err==0){
                  console.log(res.data)
                   localStorage.setItem("_token",res.data.token);
                   let c= cartData(res.data.token)
                   navigate("/")
                }
                else{
                    //   alert(res.data.msg)
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: res.data.msg,
                      })
                }
            })
    }

    // Social Login Failure
    const handleSocialLoginFailure = (err) => {
        console.error(err);
      };

      // Forget Password
    const forgetpass = () => {
        
        if(state.email != ''){
            forgetService({email:state.email})
            .then(res=>{
                if(res.data.err==0){
                     navigate("/forgetpassword", {state:{email:state.email, otp:res.data.otp}})
                  }
                  else{
                        // alert(res.data.msg)
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: res.data.msg,
                          })
                  }
            })
        }
        else{
            // alert("Please enter email")
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please enter email',
              })
        }
    }

    return (
        <>
        <Navbaar/>
        <div className="container-fluid">
		<div className="row">
			<div className="col-lg-6 col-md-6 form-container">
				<div className="col-lg-8 col-md-12 col-sm-9 col-xs-12 form-box text-center">
					<div className="logo mt-5 mb-3">
						<h2 className='font-weight-bold text-white'>Neo<span style={{color:'red'}}>STORE</span> </h2>
					</div>
					<div className="heading mb-3">
						<h4>Login into your account</h4>
					</div>
				
						<div className="form-input">
							<span><i className="fa fa-envelope"></i></span>
							<input type="text" onChange={e => setstate({...state, email: e.target.value})} value={state.email}  placeholder="Email Address"/>
						</div>
						<div className="form-input">
							<span><i className="fa fa-lock"></i></span>
							<input type="password" onChange={e => setstate({...state, password: e.target.value})} value={state.password} placeholder="Password"/>
						</div>
						<div className="row mb-3">
							<div className="col-6 d-flex">
								
							</div>
							<div className="col-6 text-right">
								<a className='font-weight-bold' onClick={()=>forgetpass()} style={{textDecoration:"none",color:"white" , cursor:"pointer"}}> Forget password</a> 
							</div>
						</div>
						<div className="text-left mb-3">
							<button className="btn" onClick={() =>checkdata()}>Login</button>
						</div>
						<div className="text-white mb-3">or login with</div>
						<div className="row mb-3">
							<div className="col-6">
							
                                <SocialButton
                                    provider="facebook"
                                    appId="2171649733000264"
                                    onLoginSuccess={handleSocialLogin}
                                    onLoginFailure={handleSocialLoginFailure} 
                                    className="btn btn-block btn-social btn-facebook">
                                    <i className="fa fa-facebook mr-1"></i>
                                    Continue With Facebook
                                </SocialButton>

							</div>
							<div className="col-6">
							
                            <SocialButton 
                                provider="google"
                                appId="420321224046-je2rf4df9mqcua73ve0usqqvrsoqvdi5.apps.googleusercontent.com" 
                                onLoginSuccess={handleSocialLogin}
                                onLoginFailure={handleSocialLoginFailure}
                                className="btn btn-block btn-social btn-google ml-2">
                                <i className="fa fa-google mr-1"></i>
                            Continue With Google
                            </SocialButton>

							</div>
						</div>
						<div className="text-white">Don't have an account?
						<Link to="/registration" className='font-weight-bold' style={{textDecoration:"none",color:"white"}}> Register here</Link>
						</div>
					
				</div>
			</div>
			<div className="col-lg-6 col-md-6 d-none d-md-block image-container"></div>
		</div>
	</div>
    </>
    )
}
