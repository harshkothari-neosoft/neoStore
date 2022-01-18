import express from "express";
import productModel from "../db/Product.js";
import colorModel from "../db/Color.js";
import categoryModel from "../db/Category.js";
import CheckoutSchema from "../db/CheckoutSchema.js"
import ApiFeatures from "../filter/apiFeatures.js";
const proRouter = express.Router();

proRouter.get("/fetchProductService/:id/:cate/:color", async (req, res) => {
  const price = req.params.id;
  const resultPerPage = 6;
  const productsCount = await productModel.countDocuments();
  let apiFeature = {};
  if (price == "assend") {
    apiFeature = new ApiFeatures(
      productModel
        .find()
        .populate(["color_id", "category_id"])
        .sort({ product_cost: 1 }),
      req.query
    )
      .search()
      .filter()
      .pagination(resultPerPage);
  } else if (price == "desend") {
    apiFeature = new ApiFeatures(
      productModel
        .find()
        .populate(["color_id", "category_id"])
        .sort({ product_cost: -1 }),
      req.query
    )
      .search()
      .filter()
      .pagination(resultPerPage);
  } else if (price == "star") {
    apiFeature = new ApiFeatures(
      productModel
        .find()
        .populate(["color_id", "category_id"])
        .sort({ product_rating: -1 }),
      req.query
    )
      .search()
      .filter()
      .pagination(resultPerPage);
  } else if (price == "alldata") {
    if (req.params.cate == "cate") {
      apiFeature = new ApiFeatures(
        productModel.find().populate(["color_id", "category_id"]),
        req.query
      )
        .search()
        .filter()
        .pagination(resultPerPage);
    } else {
      apiFeature = new ApiFeatures(
        productModel
          .find({ category_id: req.params.cate, color_id: req.params.color })
          .populate(["color_id", "category_id"]),
        req.query
      )
        .search()
        .filter()
        .pagination(resultPerPage);
    }
  } else if (price == "all") {
    if (req.params.cate !== "cate") {
      apiFeature = new ApiFeatures(
        productModel
          .find({ category_id: req.params.cate })
          .populate(["color_id", "category_id"]),
        req.query
      )
        .search()
        .filter()
        .pagination(resultPerPage);
    } else {
      apiFeature = new ApiFeatures(
        productModel.find().populate(["color_id", "category_id"]),
        req.query
      )
        .search()
        .filter()
        .pagination(resultPerPage);
    }
  }

  const products = await apiFeature.query;
  res.json({
    products,
    productsCount,
    resultPerPage,
  });
});

proRouter.get("/getCatandCol", async (req, res) => {
  let catmodel = [];
  await categoryModel.find({}).then((cate) => (catmodel = cate));

  let colmodel = [];
  await colorModel.find({}).then((cate) => (colmodel = cate));
  res.json({ color: colmodel, category: catmodel });
});

proRouter.post("/checkOutService",async(req,res)=>{
    console.log(req.body,"checkout service")
    await CheckoutSchema.create(req.body).then(data=>{
        res.json({msg:"Order Placed Successfully"})

    })
})

proRouter.post("/orderService", (req, res) => { 
  CheckoutSchema.find({user_email: req.body.email}, (err, data)=>{
      if(err){
          console.log(err)
      }
      else{
          res.send(data)
      } 
  })
})

proRouter.get("/getPopularProducts", async (req, res) => {
  const products = await productModel
    .find()
    .populate(["color_id", "category_id"])
    .sort({ product_rating: -1 })
    .limit(6);
  res.json({products});
});

proRouter.post("/rateProductService", async (req, res) => {
  console.log(req.body)
  await productModel.findOneAndUpdate({_id:req.body.id}, {$set:{product_rating:req.body.value,rated_by:req.body.rated}},{new:true}).populate(["color_id", "category_id"])
  .then(pro => res.send(pro))
})

proRouter.post("/fetchRateProduct", async (req, res) => {
  console.log(req.body)
  await productModel.findOne({_id:req.body.id}).populate(["color_id", "category_id"])
  .then(pro => res.send(pro))
})

export default proRouter;

// proRouter.post("/addpro", async (req,res)=>{
//     const color = await colorModel.create(req.body);
//     res.json({"color added": color})
// })

// proRouter.post("/addcategory", async (req,res)=>{
//     const category = await categoryModel.create(req.body);
//     res.json({"category added": category})
// })

// proRouter.post("/addproduct", async (req,res)=>{
//     const prod = await productModel.create(req.body);
//     res.json({"Product added": prod})
// })

// proRouter.get("/getpro", async (req,res)=>{
//    productModel.find({})
//    .then(ele=>{
//      console.log(ele.length)
//    })
// })