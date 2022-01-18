import React, {useEffect, useState} from 'react'
import jwtDecode from 'jwt-decode';
import { Button, Card,Modal } from 'react-bootstrap'
import { addAddressService } from '../config/Myservice';
import CancelIcon from '@mui/icons-material/Cancel';
import { IoCloseCircle } from "react-icons/io5";
import Swal from 'sweetalert2'
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

const regForAddress = RegExp(/^([A-Za-z]|[0-9]|[\w\s])+$/);
const regForPincode = RegExp(/^[1-9][0-9]{5}/);
const regForName = RegExp(/^[a-zA-Z]/);
export default function Address() {
    const [add, setadd] = useState({})
    const [state, setstate] = useState({addresses:[] ,address:'' , city:'', pincode:'', states:'', country:'', flag1:true, flag2: false, index: null})
    const [show, setShow] = useState(false)
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [errors, seterrors] = useState({erraddress:'', errpincode:'', errcity:'', errstates:'', errcountry:''})
    const [flagProceed,setFlagProceed] = useState(false)
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(()=>{
        if(localStorage.getItem('_token')!= undefined){
            let token = localStorage.getItem('_token');
            let decode = jwtDecode(token)
            console.log(decode)
            setadd(decode)
            setstate({...state, addresses:decode.addresses})
        }
        if(location.state!=null){
            setFlagProceed(true)
        }
       },[])

       // Select Address at Checkout time
       const SelectAddress = (ele)=>{
        navigate("/checkout", { state: {subTotalState:location.state.subTotalState,cart:location.state.cart,address:ele} })
    }

    // Close the Modal
    const handleClose = () => {
    setShow(false);
    setstate({ ...state, address: '', city: '', pincode: '', states: '', country: '' })
    }

    const handleCloseAddresss = () => setShowAddressModal(false);

    // Add new Address
    const addAddress = () => {
        const email= add.email;
        if(state.address !='' && state.city != '' && state.pincode !='' &&  state.states != '' && state.country !=''){
            let formData={
                address: state.address,
                pincode:parseInt(state.pincode),
                city:state.city,
                states: state.states,
                country:state.country
            }
            // Check New address with old address from database
            if(state.addresses.find(ele=> JSON.stringify(ele)===JSON.stringify(formData)) === undefined){
                let data = state.addresses
                data.push(formData)
                setstate({...state, addresses:data, flag1:true, address:'' , city:'', pincode:'', states:'', country:''}, ()=>console.log("updateddd"))
                addAddressService({data:data, email})
                .then(res =>{
                    localStorage.setItem("_token",res.data.token);
                })
            }
            else{
                // alert("Address already addedd")
                Swal.fire({
                    icon: 'warning',
                    title: 'Oops...',
                    text: 'Address Already Added',
                  })
            }
            setShowAddressModal(false)
        }
        
    }


    // For validation
    const handler = (event) =>{
        const { name, value } = event.target;

        switch(name){
            case "address":
                let error1 = regForAddress.test(value) ? "" : "Invalid Address";
                seterrors({ ...errors, erraddress: error1 });
                break;

            case "pincode":
                let error2 = regForPincode.test(value) ? "" : "Invalid Pincode";
                seterrors({ ...errors, errpincode: error2 });
                break;

            case "city":
                let error3 = regForName.test(value) ? "" : "Invalid City";
                seterrors({ ...errors, errcity: error3 });
                break;

            case "states":
                let error4 = regForName.test(value) ? "" : "Invalid State";
                seterrors({ ...errors, errstates: error4 });
                break;

            case "country":
                let error5 = regForName.test(value) ? "" : "Invalid Country";
                seterrors({ ...errors, errcountry: error5 });
                break;
        }
        setstate({...state, [name]: value})
    }

    // Edit Address
    const editAddress = (ele, index) => {
        setShow(true)
        setstate({...state, flag2:true, index:index, address:ele.address , city:ele.city, pincode:ele.pincode, states:ele.states, country:ele.country })
    }

    // Update Address
    const updateAddress = () => {
        let data = state.addresses
        let formData={
            address: state.address,
            city:state.city,
            pincode:state.pincode,
            states: state.states,
            country:state.country
        }
        data[state.index] = formData
        setstate({...state, addresses:data, flag2:false, address:'' , city:'', pincode:'', states:'', country:'' })
        addAddressService({data:state.addresses, email:add.email})
          .then(res =>{
            localStorage.setItem("_token",res.data.token);
          })
          setShow(false)
    }

    // Delete Address
    const deleteaddress = (index) => {
        let data = state.addresses
        data.splice(index, 1)

        setstate({...state, addresses:data}, ()=>console.log("deleteddd"))
        addAddressService({data:data, email:add.email})
        .then(res =>{
          localStorage.setItem("_token",res.data.token);
        })
    }

    return (
        <>
         {localStorage.getItem('_token')!=undefined ?
         <>
         
        <div className='my-4 d-flex justify-content-center'>
            <Card style={{backgroundColor:'#343a40', width:"80%", maxHeight:'77vh', overflow:'auto'}}>
                <Card.Body>
                    <Card.Title className='text-white'>
                        Addresses
                    </Card.Title>
                    <hr/>

                    {state.addresses.map((ele,index)=>
                    <Card className='my-3'>
                        
                        <Card.Body>
                        <div className='row'>
                        <div className='col'>
                        <Card.Text>{ele.address}, <br/>
                        {ele.city} - {ele.pincode}, <br/>
                        {ele.states} - {ele.country} 
                        </Card.Text>
                        </div>
                
                            <div className='col'>
                            <div className='text-right'>
                             <CancelIcon onClick={()=>deleteaddress(index)}/>
                            </div>
                            </div>
                        </div>
                       
                        <div className='mt-2'>
                        <Button onClick={()=>editAddress(ele, index)}>Edit</Button>
                        {flagProceed &&
                            <button className="btn btn-success ml-3" onClick={() => SelectAddress(ele)}>Select Address</button>
                         }
                        </div>
                        
                        </Card.Body>
                    </Card>
                    )}
                    <hr/>
                    <button className='btn' onClick={()=>{setShowAddressModal(true)}}>Add New Address</button>  
                </Card.Body>
            </Card>
        </div>

        <Modal show={show} onHide={handleClose}>
        <Modal.Header >
          <Modal.Title>Edit Address</Modal.Title>
          <IoCloseCircle onClick={handleClose} className="close" style={{ width: "5rem", height: "4rem" }} />
        </Modal.Header>
        <Modal.Body>
                Address : <input type="text" className='form-control' value={state.address} onChange={e => setstate({ ...state, address: e.target.value })} />

                City : <input type="text" className='form-control' value={state.city} onChange={e => setstate({ ...state, city: e.target.value })} />

                Pincode : <input type="text" className='form-control' value={state.pincode} onChange={e => setstate({ ...state, pincode: e.target.value })} />

                State : <input type="text" className='form-control' value={state.states} onChange={e => setstate({ ...state, states: e.target.value })} />

                Country : <input type="text" className='form-control' value={state.country} onChange={e => setstate({ ...state, country: e.target.value })} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => updateAddress()}>
           Update
          </Button>
        </Modal.Footer>
        </Modal>

        <Modal show={showAddressModal} onHide={handleCloseAddresss}>
        <Modal.Header >
          <Modal.Title>Add Address</Modal.Title>
          <IoCloseCircle onClick={handleCloseAddresss} className="close" style={{ width: "5rem", height: "4rem" }} />
        </Modal.Header>
        <Modal.Body>
                Address : <input type="text" className='form-control' name="address" value={state.address} onChange={handler} />
                <span className="text-danger">{errors.erraddress}</span> <br/>
                City : <input type="text" className='form-control' name="city" value={state.city} onChange={handler} />
                <span className="text-danger">{errors.errcity}</span> <br/>
                Pincode : <input type="text" className='form-control'name="pincode" value={state.pincode} onChange={handler} />
                <span className="text-danger">{errors.errpincode}</span> <br/>
                State : <input type="text" className='form-control' name="states" value={state.states} onChange={handler} />
                <span className="text-danger">{errors.errstates}</span> <br/>
                Country : <input type="text" className='form-control'name="country" value={state.country} onChange={handler} />
                <span className="text-danger">{errors.errcountry}</span> <br/>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => addAddress()}>
           Add
          </Button>
        </Modal.Footer>
      </Modal>
      </>
       : <Navigate to="/login"></Navigate> }
        </>
    )
}
