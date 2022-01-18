import React, { useState, useEffect } from 'react'
import Footer from './Footer'
import Navbaar from './Navbaar'
import {useLocation } from 'react-router-dom'
import ReactStars from 'react-stars'
import ReactImageMagnify from 'react-image-magnify'
import {WhatsappShareButton, FacebookShareButton, TwitterShareButton, PinterestShareButton, FacebookIcon, PinterestIcon,TwitterIcon,WhatsappIcon} from 'react-share';
import { Box, Tab } from '@mui/material'
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { useDispatch } from 'react-redux'
import Swal from 'sweetalert2'
import { BsStarFill, BsStarHalf } from 'react-icons/bs';
import { fetchRateProduct, rateProductService } from '../config/MyProductService'
export default function ProductDetails() {
  const location = useLocation();
  const dispatch = useDispatch();

  const [value, setValue] = useState('1');
  const [index, setIndex] = useState(0)
  const [state, setstate] = useState({})

  useEffect(() => {
    fetchRateProduct({id:location.state._id}).then(res=>{
     setstate(res.data)
   })
 }, [])

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // To Show Rating
  const rating = (ele) => {
    return{
      edit: false,
    color:"rgba(20,20,20,0.1)",
    activeColor:"tomato",
    size:window.innerWidth<600?20:25,
    value:ele.product_rating/ele.rated_by,
    isHalf:true,
    };
  }

  // To Rate Product
  const rateProduct = {
    size: 20,
    count: 5,
    color: "black",
    activeColor: "red",
    value: 7.5,
    a11y: true,
    isHalf: true,
    emptyIcon: <BsStarFill />,
    halfIcon: <BsStarHalf />,
    filledIcon: <BsStarFill />,
    onChange: newValue => {
        chngeRating(newValue)
    }
};

  //  To Change rating
  const chngeRating = (value) => {
    rateProductService({ value: (state.product_rating + value/state.rated_by), rated: state.rated_by + 1,id:state._id }).then(res =>
        setstate(res.data)
    )
        // alert("thanks for the rating")
        Swal.fire({
          icon: 'success',
          title: 'Thanks for Rating...',
        })
  }

    return (
        <>
        <Navbaar/>
        <div className="container-fluid">
         <div className="row">
             <div className="col lg-6 md-6 sm-12 mt-5">
             <ReactImageMagnify
                    {...{
                        smallImage: {
                            alt: "product",
                            src: `images/${location.state.product_subimages[index]}`,
                            width: 300,
                            height: 300
                        },
                        largeImage: {
                            src: `images/${location.state.product_subimages[index]}`,
                            width: 800,
                            height: 1000,
                        },
                    }}
                />
                
             </div>
             
             <div className="col lg-6 md-6 sm-12">
                 <h2 className="mt-5">{state.product_name}</h2>
                 <ReactStars {...rating(state)} />
                  <hr/>
                  <div>
                    Price: <span className='text-danger font-weight-bold'>{state.product_cost}/-</span> <br/>
                      Color: <span style={{ display: "inline-block", height: '15px', width: "30px", background: location.state.color_id.color_name}}></span>
                  </div>
                  <div>
                    <h5 className="mt-3">Share</h5>
                    <div>
                    <WhatsappShareButton
                            url={`http://localhost:3000/images/${location.state.product_subimages[0]}`}
                            // title={"Checkout " + postdata.product_name}
                            hashtag="#react">
                            <WhatsappIcon
                              logofillColor="white"
                              round={true}
                              size="2rem"
                            ></WhatsappIcon>
                          </WhatsappShareButton>

                      <FacebookShareButton
                            url={`http://localhost:3000/images/${location.state.product_subimages[0]}`}
                            // title={"Checkout " + postdata.product_name}
                            hashtag="#react"
                            className='mx-2' 
                            >
                          
                            <FacebookIcon
                              logofillColor="white"
                              round={true}
                              size="2rem"
                            ></FacebookIcon>
                          </FacebookShareButton>
                      
                          <TwitterShareButton
                            url={`http://localhost:3000/images/${location.state.product_subimages[0]}`}
                            // title={"Checkout " + postdata.product_name}
                            hashtag="#react">
                            <TwitterIcon
                              logofillColor="white"
                              round={true}
                              size="2rem"
                            ></TwitterIcon>
                          </TwitterShareButton>

                     </div>
                     <div className="mt-4">
                     <button className="btn btn-info mr-3" onClick={() => dispatch({ type: 'addCart', payload: state })}>Add to Cart</button>
                     <button className="btn btn-warning"><ReactStars {...rateProduct}/> Rate Product</button>
                     </div>
                  </div>
             </div>
         </div>
         
         <div className='row'>
             <div className='col lg-6 md-6 sm-12 my-4 ml-3'>
                 <img src={`images/${location.state.product_subimages[0]}`} height="100" width="100" onClick={()=> setIndex(0)}/>
                 <img src={`images/${location.state.product_subimages[1]}`} height="100" width="100" className='mx-3' onClick={()=> setIndex(1)}/>
                 <img src={`images/${location.state.product_subimages[2]}`} width="100" onClick={()=> setIndex(2)}/>
                 <img src={`images/${location.state.product_subimages[3]}`} width="100" className='ml-3' onClick={()=> setIndex(3)}/>
             </div>
             <div className='col lg-6 md-6 sm-12'></div>
         </div>

         <Box sx={{ width: '100%', typography: 'body1' }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange} aria-label="lab API tabs example">
                <Tab label="Description" value="1" />
                <Tab label="Feature" value="2" />
              </TabList>
            </Box>
            <TabPanel value="1">{state.product_desc}</TabPanel>
            <TabPanel value="2">{state.product_fet}</TabPanel>
          </TabContext>
        </Box>
         </div>
         <Footer/>
        </>
    )
}
