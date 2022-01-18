import React from 'react'
import {Link} from 'react-router-dom'
import {Button} from 'react-bootstrap'
export default function Naav() {
    return (
        <div>
             <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    <Link className="navbar-brand font-weight-bold" to="/" style={{fontSize:"1.6rem"}}>Neo<span style={{color:"red"}}>STORE</span></Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
        <div>
        <Button variant="outline-info" className='mr-3'><Link to="/login" style={{color:"cyan", textDecoration:"none"}}>Sign in</Link></Button>
        <Button variant="outline-info"><Link to="/registration" style={{color:"cyan", textDecoration:"none"}}>Sign up</Link></Button>
        </div>
                </div>
            </nav>
        </div>
        </div>
    )
}