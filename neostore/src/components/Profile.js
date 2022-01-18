import React, { useEffect, useState } from "react";
import { Button, Card, Modal } from "react-bootstrap";
import { profileeditService, profilePicService} from "../config/Myservice";
import { useNavigate } from "react-router";
import jwtdecode from "jwt-decode";
import { IoCloseCircle } from "react-icons/io5";
import { useDispatch, useSelector} from 'react-redux'
import { Navigate } from "react-router-dom";

const regForEmail = RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
const regForName = RegExp(/^[A-Za-z]{3,30}$/);
const regForContact = RegExp(/^[6-9][0-9]{9}/);

export default function Profile() {
  const [state, setstate] = useState({data: {}, firstname: "", lastname: "", gender: "", contact: "", email: "", profileImg:""});
  const [show, setShow] = useState({ flag: false, count: 1 });
  const [errors, seterrors] = useState({ errfirstname: "", errlastname: "", errgender: "", errcontact: "", erremail: "",});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClose = () => setShow({ ...show, flag: false });

  useEffect(() => {
    if (localStorage.getItem("_token") != undefined) {
      let token = localStorage.getItem("_token");
      let decode = jwtdecode(token);
      console.log(decode);
      setstate({ data: decode, firstname: decode.firstname, lastname: decode.lastname, gender: decode.gender, contact: decode.contact, email: decode.email, profileImg:decode.profilepic});
    }
  }, [show.count]);

  // To edit Profile
  const editProfile = () => {
    setShow({ ...show, flag: true });
  };

  // To update Profile
  const updateProfile = () => {
    let formData = {
      firstname: state.firstname,
      lastname: state.lastname,
      gender: state.gender,
      contact: state.contact,
      email: state.email,
      originalEmail: state.data.email
    };
  
    profileeditService(formData)
    .then((res) => {
      dispatch({type: "updateProfile", payload: state.firstname + " "+ state.lastname})
      localStorage.setItem("_token", res.data.token);
      setstate({ ...state, data: res.data.values });
    });
    setShow({ flag: false });
  };


  // For validation
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
    }
    setstate({ ...state, [name]: value });
  };

  // For Profile Pic Change
  const filechange = (e) => {
    const formData = new FormData()
    console.log(state.profileImg)
    formData.append('profileImg', state.profileImg)
    formData.append('email', state.data.email)
    profilePicService(formData)
    .then((res) => {
      dispatch({type: "updatePicture", payload: res.data.values.profilepic})
      localStorage.setItem("_token", res.data.token);
      setstate({ ...state, data: res.data.values });
    });
    setShow({ flag: false });
  }


  return (
    <>
      {localStorage.getItem('_token')!=undefined ?
    <div>
      <div className="mt-5 d-flex justify-content-center">
        <Card id="trans" className="text-white" style={{backgroundColor:"#343a40",width: "80%" }}>
          <Card.Body>
            <Card.Title className="text-center">
              <h3>{state.data.firstname}'s Profile </h3>
            </Card.Title>

            <Card.Text>
              <div className="row">
                <div className="col-2 font-weight-bold">First Name :</div>
                <div className="col-10 font-weight-bold">{state.data.firstname}</div>
              </div>
            </Card.Text>

            <Card.Text>
              <div className="row">
                <div className="col-2 font-weight-bold">Last Name :</div>
                <div className="col-10 font-weight-bold">{state.data.lastname}</div>
              </div>
            </Card.Text>

            <Card.Text>
              <div className="row">
                <div className="col-2 font-weight-bold">Gender :</div>
                <div className="col-10 font-weight-bold">{state.data.gender}</div>
              </div>
            </Card.Text>

            <Card.Text>
              <div className="row">
                <div className="col-2 font-weight-bold">Mobile Number :</div>
                <div className="col-10 font-weight-bold">{state.data.contact}</div>
              </div>
            </Card.Text>

            <Card.Text>
              <div className="row">
                <div className="col-2 font-weight-bold">Email :</div>
                <div className="col-10 font-weight-bold">{state.data.email}</div>
              </div>
            </Card.Text>

            <Button onClick={() => editProfile()}> Edit</Button>
          </Card.Body>
        </Card>
      </div>

      <Modal show={show.flag} onHide={handleClose}>
        <Modal.Header style={{backgroundColor:"whitesmoke"}}>
          <Modal.Title>Edit Profile</Modal.Title>
          <IoCloseCircle
            onClick={handleClose}
            className="close"
            style={{ width: "5rem", height: "4rem" }}
          />
        </Modal.Header>

        <Modal.Body style={{backgroundColor:"whitesmoke"}}>
          <div className="row">
            <div className="col">
            <Card.Text>
                First Name :{" "}
                <input type="text" className='form-control' name="firstname" value={state.firstname} onChange={handler}/>
                <span className="text-danger">{errors.errfirstname}</span>
          </Card.Text>
            </div>
            <div className="col">
              <Card.Text>
                Last Name :{" "}
                <input type="text" className='form-control' name="lastname" value={state.lastname} onChange={handler}/>
                <span className="text-danger">{errors.errlastname}</span>
          </Card.Text>
            </div>
          </div>

          <Card.Text>
            Email :{" "}
            <input type="text" className='form-control' name="email" value={state.email} onChange={handler}/>
            <span className="text-danger">{errors.erremail}</span>
          </Card.Text>

          <Card.Text>
            Contact Number :{" "}
            <input type="text" className='form-control' name="contact" value={state.contact} onChange={handler}/>
            <span className="text-danger">{errors.errcontact}</span>
          </Card.Text>

          <Card.Text>
            Gender : &nbsp;
            <input type="radio" id="male" name="gender" value="male" onClick={handler}/>{" "}
            <span className="mr-3"> Male</span>
            <input type="radio" id="female" name="gender" value="female" onClick={handler}/>{" "}
            <span className="mr-3"> Female</span>
          </Card.Text>
          <Modal.Footer style={{backgroundColor:"whitesmoke"}}>
          <button className="btn btn-info" variant="primary" onClick={() => updateProfile()}>
            Save Changes
          </button>
        </Modal.Footer>

          <Card.Text>
            Profile Picture :{" "}
            <input type="file" className='form-control' onChange={(e) => setstate({...state, profileImg:e.target.files[0]})} name="profilepic"/>
          </Card.Text>

        </Modal.Body>

        <Modal.Footer style={{backgroundColor:"whitesmoke"}}>
          <button className="btn btn-info" variant="primary" onClick={() => filechange()}>
            Update Profile Picture
          </button>
        </Modal.Footer>
      </Modal>
    </div>
      : <Navigate to="/"></Navigate>}
      </>
  );
}
