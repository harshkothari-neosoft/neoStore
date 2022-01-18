import React, { useEffect } from 'react'
import "./Home.css";
import Naav from './Naav';
import { Link } from 'react-router-dom';

export default function Home() {

    return (
        <>
        <div id="home">
            <Naav/>
         <div className='text-center mt-3'>
             <h1>Welcome to <span style={{color:"red"}} className='font-weight-bold'>NeoSTORE</span></h1>
             <Link to="login" className='mt-3 btn btn-info'>Login</Link>
         </div>
        </div>
        </>
    )
}
