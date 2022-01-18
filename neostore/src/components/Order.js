import React, { useEffect, useState } from 'react'
import { orderService } from '../config/MyProductService'
import jwtdecode from 'jwt-decode';
import { useNavigate } from "react-router";

function Order() {
    const [state, setState] = useState([])
   const navigate = useNavigate()

    useEffect(() => {
        let token = localStorage.getItem('_token');
        let decode = jwtdecode(token)
        orderService({email:decode.email}).then(res => {
            console.log(res.data);
            setState(res.data)
        })
    }, [])

    // Navigate to Invoice Page
    const productInvoice = (ele) =>{
        console.log(ele, "line 20")
        navigate("/invoice", {state: ele})
    }
    
    return (
        <>
        {state.length>0 ?
            <div className='container-justify p-4 mt-5' style={{ border: "2px solid black", borderRadius: " 10px", boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px", fontFamily: "'Bree Serif', serif", width: "90%", maxHeight: '60vh', overflow: 'auto', backgroundColor:"white" }}>
                { state.map(ele =>
                        <>
                            <h5>TRANSIT ORDER BY:{ele.card_name}</h5>
                            <h6>Placed On {ele.created_at} / Rs. {ele.subtotal+ele.gst}</h6>
                            {/* <hr /> */}
                            <div>
                                {ele.totalCart.map(data =>
                                    <>
                                        <img src={`/images/${data.product_image}`} height='100px' width='100px' className="ml-3" alt="..." />
                                    </>
                                )}
                            </div>
                            <button className='btn btn-primary mt-2' onClick={()=> productInvoice(ele)}>Download Invoice as pdf</button>
                            <hr />
                        </>
                    )}
            </div>
            : "No Order" }
        </>
    )
}

export default Order