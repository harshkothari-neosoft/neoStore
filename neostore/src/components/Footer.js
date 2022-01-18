import React, {useState} from 'react'
import { useNavigate } from 'react-router'
import Swal from 'sweetalert2'
import { emailSubscribeService } from '../config/Myservice'

export default function Footer() {
    const [stateemail, setemail] = useState('')
    const navigate = useNavigate()

    // Mail send for subscribe us
    const subscribe = () => {
        if (stateemail !== '') {
            emailSubscribeService({ email: stateemail })
                .then(res => {
                    if (res.data.err === 0) {
                        console.log(res.data)
                        Swal.fire({ 
                            icon: 'success',
                            text: "Thank You Subscribing US!!",
                          })
                          setemail('')
                    }
                    else {
                        Swal.fire({ 
                            icon: 'error',
                            title: 'Oops...',
                            text: res.data.msg,
                          })
                    }
                })
        }
        else {
            Swal.fire(
                'Empty!!?',
                'Please enter Email!!!',
                'question'
            )
        }
    }

    return (
        <>
            <div className='container-fluid bg-dark text-white'>
            <div className='container text-center row ml-5'>
            <div className='col-lg-4 col-md-12 col-sm-12 mt-2'>
                <h5>About Company</h5>
                <ul style={{listStyle:"none"}} className='mt-3'>
                <li>NeoSOFT Technologies is here at your quick and easy service for shopping.</li>
                <li className='font-weight-bold mt-2'>Contact information</li>
                <li>Email: contact@neosofttech.com</li>
                <li>Phone: +91 0000000000</li>
                <li>MUMBAI, INDIA</li>
                </ul>
                
            </div>
            <div className='col-lg-4 col-md-12 col-sm-12 mt-2'>
                <h5 className='ml-5'>Information</h5>
                <ul style={{listStyle:"none"}} className='mt-3'>
                    <li><a href='images/Terms and Conditions.pdf' target="_blank">Terms and Conditions</a></li>
                    <li>Guarantee and Return Policy</li>
                    <li>Contact Us</li>
                    <li>Privacy Policy</li>
                    <li><a href="https://www.google.com/maps/place/Apollo+Premier/@22.7500177,75.8966811,15z/data=!4m5!3m4!1s0x0:0x5bef82fe270e4409!8m2!3d22.7500177!4d75.8966811" target="_blank">Locate Us</a></li>
                </ul>

            </div>
            <div className='col-lg-4 col-md-12 col-sm-12 mt-2'>
                <h5>Newsletter</h5> 
                <ul style={{listStyle:"none"}} className='mt-3'>
                    <li>Signup to get exclusive offer from our favourite brand and to well up in the news</li>
                    <li><input className='form-control w-75 ml-5 mt-2' type="search" placeholder='your email...' value={stateemail} onChange={e=>setemail(e.target.value)}></input></li>
                    <li><button className='btn mt-3' onClick={() =>subscribe()}>Subscribe</button></li>
                </ul>
            </div>
            </div>
            <div className='text-white text-center pb-3'>© 2022 NeoSOFT Technologies All rights reserved | Designed By <span className='font-weight-bold'>Harsh Kothari</span></div>
            </div>
        </>
    )
}
