import React, { useEffect, useState } from 'react'
import Footer from './Footer'
import Navbaar from './Navbaar'
import './dashboard.css'
import { getPopularProducts } from '../config/MyProductService'
import { Card } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import ReactStars from 'react-stars'
import "./product.css"
export default function Dashboard() {
    const [state, setstate] = useState([])
    const dispatch = useDispatch()
    const navigate = useNavigate(); 

    useEffect(() => {
        let prod = [];
        getPopularProducts().then((res) => {
          prod = res.data.products;
    
          setstate(prod);
        });
      }, []);

    // Show Rating
    const starrating = (ele)=>{
        return  {
            edit: false,
            color:"rgba(20,20,20,0.1)",
            activeColor:"tomato",
            size:window.innerWidth<600?20:25,
            value:ele.product_rating/ele.rated_by,
            isHalf:true,
        };
    }

    // Navigate to product details page
    const productDetails = (ele)=>{
        navigate("/productdetails", { state: ele })
    }

    return (
        <>
            <Navbaar />
            <div id="carouselExampleControls" className="carousel slide" data-ride="carousel">
                <div className="carousel-inner">
                    <div style={{ width: "100%", height: "80%" }}>

                        <div className="carousel-item active" >
                            <img src="https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aW5kb29yfGVufDB8fDB8fA%3D%3D&w=1000&q=80" alt="First slide" style={{ width: "100%", height: "35rem" }} />
                            <Link to="/product" className="seeMore"> See More...
                                <div className="icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"></path><path fill="currentColor" d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"></path></svg>
                                </div>
                            </Link>
                        </div>


                        <div className="carousel-item">
                            <img src="https://idus-media.di91.com/media/wysiwyg/Bed.jpg" alt="Second slide" style={{ width: "100%", height: "35rem" }} />
                            <button className="seeMore"> See More...
                                <div className="icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"></path><path fill="currentColor" d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"></path></svg>
                                </div>
                            </button>
                         
                        </div>
                        <div className="carousel-item">
                            <img src="http://static2.worldtempus.com/cache/brand/cyrus/carrousel/02-02.2021/c/y/cyrus-carousel-alarm-2021_crop_923x520.jpg" alt="Third slide" style={{ width: "100%", height: "35rem" }}  />
                            <button className="seeMore"> See More...
                                <div className="icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"></path><path fill="currentColor" d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"></path></svg>
                                </div>
                            </button>
                           
                        </div>
                    </div>
                </div>
                <a className="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="sr-only">Previous</span>
                </a>
                <a className="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="sr-only">Next</span>
                </a>
            </div>

            <div className='text-center mt-4'>
                <h2>Popular Products</h2>
                <Link to="/product" className='text-dark'>View All</Link>
            </div>

            <div className='container d-flex justify-content-center'>
            <div className='row'>
                {state.map(ele =>
                    <div className='col my-3'>
                    <Card style={{ width: '20rem'}} id='card1'>
                <Card.Img variant="top" src={"./images/"+ ele.product_image} height="300" onClick={()=> productDetails(ele)} />
                <Card.Body style={{backgroundColor:'##f6f6f6'}}>
                    <Card.Title className='font-weight-bold'> {ele.product_name}</Card.Title>
                    <Card.Text>
                   <span className='font-weight-bold text-danger'>Rs.{ele.product_cost}</span>
                   <div>
                   <ReactStars {...starrating(ele)} />
                   </div>
                   <div className='d-flex justify-content-center mt-3'>
                   <button className='btn card2' onClick={() => dispatch({ type: 'addCart', payload: ele })}>Add to Cart</button>
                   </div>
                  
                    </Card.Text>
                    </Card.Body>
                  </Card>
                    </div>
                      )}
                </div>
                </div>
            <Footer />
        </>
    )
}
