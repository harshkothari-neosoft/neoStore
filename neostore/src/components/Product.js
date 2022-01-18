import React, { useEffect, useState } from 'react'
import { Card, Container } from 'react-bootstrap'
import Footer from './Footer'
import Navbaar from './Navbaar'
import { useNavigate } from "react-router";
import {fetchProductService, getCatandCol} from '../config/MyProductService'
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Pagination from 'react-js-pagination'
import Slider from '@material-ui/core/Slider'
import ReactStars from 'react-stars'
import { useSelector, useDispatch } from 'react-redux';
import './product.css'

export default function Product() {
    const [state, setstate] = useState([])
    const [currentPage, setCurrentPage] = useState(0)
    const [resultperPage, setresultperPage] = useState(0)
    const [productCount, setproductCount] = useState(0)
    const [price, setPrice] = useState([0, 250000]);
    const [sortdata, setSortdata] = useState('all')
    const [categorys, setcategorys] = useState([])
    const [colors, setcolors] = useState([])
    const [fcategorys, setFcategorys] = useState("cate")
    const [fcolor, setFcolor] = useState("color")
    const navigate = useNavigate(); 
    const dispatch = useDispatch();

    const searchProduct = useSelector(state => state.profileReducer)

    // For all filters in product page
    useEffect(()=>{
        let prodcount = 0
        let resultPerPage = 0
        let prod = []
        fetchProductService(searchProduct.search,currentPage, price, sortdata, fcategorys, fcolor)
        .then(res =>{
            prod=res.data.products
            prodcount= res.data.productsCount
            resultPerPage = res.data.resultPerPage
            setstate(prod)
            setproductCount(prodcount)
            setresultperPage(resultPerPage)
        })
        getCatandCol()
        .then(res=>{
            setcategorys(res.data.category)
            setcolors(res.data.color)
        })

    },[searchProduct.search, currentPage, price, sortdata, fcategorys, fcolor])

    // For pagination
    const setCurrentPageNo = (e) => {
        setCurrentPage(e);
      };

      // price Slider
      const priceHandler = (event, newPrice) => {
        setPrice(newPrice);
      };

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

      // To show all data on products page
     const alldata = () => {
      setSortdata("all");
      setFcategorys("cate");
      setFcolor("color");
      setCurrentPage(1);
      if (fcategorys !== "cate" || fcolor !== "color") {
        document.getElementById(fcategorys).checked = false;
        document.getElementById(fcolor).checked = false;
      }
      };
  
      // For Color Filter
      const color = (e) => {
      setFcolor(e);
      setSortdata("alldata");
      };

      // For categories Filter
      const categories = (e) => {
        setFcategorys(e)
        setCurrentPage(1);
      }
   
   
    return (
     <>
         <Navbaar/>
         
        <div className='row'>
            <div className='col lg-2 md-4 sm-12 pl-5 mt-5'>
            <ul className="nav flex-column">
                <li className="nav-item">
                    <button className="nav-link btn w-100"  onClick={() => alldata()}>All Products</button>
                </li>
            </ul>
            <Accordion className="my-3">
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                >
                <Typography>Categories</Typography>
                </AccordionSummary>
                <AccordionDetails>
                <Typography>
                {categorys &&
                    categorys.map((cat) => (
                      <div key={cat._id}>
                        <input
                          type="radio"
                          id={cat._id}
                          onClick={(e) => categories(e.target.value)}
                          name="categories"
                          value={cat._id}
                        /> {cat.category_name}
                        <br></br>
                      </div>
                    ))}
                </Typography>
                </AccordionDetails>
            </Accordion>

            {fcategorys != "cate" ?
            <Accordion>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2a-content"
                id="panel2a-header"
                >
                <Typography>Colors</Typography>
                </AccordionSummary>
                <AccordionDetails>
                <Typography>
                {colors &&
                    colors.map((cat) => (
                      <div key={cat._id}>
                        <input
                          type="radio"
                          id={cat._id}
                          onClick={(e) => color(e.target.value)}
                          name="color"
                          value={cat._id}
                        /> {cat.color_name}
                        <br></br>
                      </div>
                    ))}
                </Typography>
                </AccordionDetails>
            </Accordion>
             : " " } 

            <div className='mt-4 font-weight-bold'>Price:</div>
            <div className="container paginationBox d-flex justify-content-center mt-5 pt-2">
        <Slider
              value={price}
              onChange={priceHandler}
              valueLabelDisplay="on"
              aria-labelledby="range-slider"
              min={0}
              max={250000}
            />
            </div>
            </div>

            <div className='col-9'>

        <div className=' text-right mt-2' style={{paddingRight:70}}>
                Sort By : <i className="fa fa-star mx-2" onClick={()=>setSortdata("star")} ></i>
                <i className="fa fa-arrow-up mx-2" onClick={()=>setSortdata("assend")}></i>
                <i className="fa fa-arrow-down mx-2" onClick={()=>setSortdata("desend")}></i>
            </div>
           
            
                <div className='row'>
                {state.map(ele =>
                    <div className='col my-3'>
                    <Card style={{ width: '18rem'}} id='card1'>
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
        </div>

            <div className="paginationBox d-flex justify-content-center">
              {fcategorys =='cate' &&
            <Pagination
              activePage={currentPage}
              itemsCountPerPage={resultperPage}
              totalItemsCount={productCount}
              onChange={setCurrentPageNo}
              nextPageText="Next"
              prevPageText="Prev"
              firstPageText="1st"
              itemClass="page-item"
              linkClass="page-link"
              activeClass="pageItemActive"
              activeLinkClass="pageLinkActive"
            />}
          </div>
         <Footer/>
     </>
    )
}
