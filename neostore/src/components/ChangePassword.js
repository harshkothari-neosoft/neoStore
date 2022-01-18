import React, {useState, useEffect} from 'react'
import jwtdecode from 'jwt-decode'
import { changePasswordService } from '../config/Myservice'
import Swal from 'sweetalert2'
import bcrypt from 'bcryptjs'
import { Card } from 'react-bootstrap'
export default function ChangePassword() {
    const [state, setstate] = useState({oldpassword: "", newpassword: "", confpassword: "" })
    const [pass, setpass] = useState({password:'',email:''})

    useEffect(()=>{ 
        if(localStorage.getItem('_token')!== undefined){
            let token = localStorage.getItem('_token');
            let decode = jwtdecode(token)
            console.log(decode)
            setpass({password:decode.password,email:decode.email})
        }
       },[])

    const handler = (event) => {
        const { name, value } = event.target
        setstate({ ...state, [name]: value })
    }

    // Change password
    const submit = () => {
        if (state.oldpassword !== '' && bcrypt.compareSync(state.oldpassword,pass.password)) {
            if(state.newpassword !== '' && state.confpassword !== '' && state.newpassword === state.confpassword){
                changePasswordService({ email:pass.email, password: state.newpassword})
				.then(res => {
					// alert(res.data.msg)
                    Swal.fire({
                        icon: 'success',
                        title: res.data.msg,
                      })
                    localStorage.setItem("_token",res.data.token);				
				})
            }
            else{
                // alert('Password does not match')
                Swal.fire({
                    icon: 'warning',
                    title: 'Oops...',
                    text: 'Password Does Not Match',
                  })
            }            
        }
        else {
            // alert("Please enter correct password")
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please Enter Correct Password',
              })
        }
    }

    return (
        <>
            <div className='d-flex justify-content-center'>
            <Card className='mt-5 text-white font-weight-bold' style={{backgroundColor:'#343a40', width:"80%"}}>
                <Card.Title className='text-center mt-3'>
                 <h3>Change Password</h3>
                </Card.Title>

                <Card.Body>
                <Card.Text>
                    <div>
                    Old Password :
                        <input type="password" className="form-control mt-2" id="oldpassword" placeholder="Old password" name="oldpassword" onChange={handler} value={state.oldpassword}/>
                    </div>
                    <div className='my-3'>
                    New Password :
                        <input type="password" className="form-control mt-2" id="newpassword" placeholder="New password" name="newpassword" onChange={handler} value={state.newpassword}/>
                    </div>
                    <div>
                    Confirm Password :
                        <input type="password" className="form-control mt-2" id="confpassword" placeholder="Confirm password" name="confpassword" value={state.confpassword} onChange={handler}/>
                        <button className="btn btn-primary mt-4" onClick={() => submit()}>Submit</button>
                   </div>
                </Card.Text>
                </Card.Body>
            </Card>
            </div>
        </>
    )
}
