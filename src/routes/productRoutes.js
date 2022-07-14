import express from "express";
import {body,validationResult} from 'express-validator'
import Category from "../services/mongodb/models/Category";
import Product from "../services/mongodb/models/Product";

const router = express.Router()

/*

type:get
path:/api/v1/product/all
query params:none
isprotected:false


*/ 

router.get('/all',async(req,res)=>{
  try {
    const products = await Product.find({})
    res.json({products,message:"succesfully fetched products"})
  } catch (error) {
    console.log(error.message)
   return res.status(500).json({categories:[],message:"error fetching products"})
  }
})

/*

type:post
path:/api/v1/product/add
query params:none
isprotected:true


*/ 

router.post('/add',
body('name').isLength({min:1}),
body('price').isNumeric(),
body('listPrice').isNumeric(),
body('color').isLength({min:1}),
body('description').isLength({min:10}),

body('category').isLength({min:5}),
body('imageUrl').isURL(),
body('stock').isNumeric(),
async(req,res)=>{

  const {errors} = validationResult(req)
  if (errors.length > 0) return res.status(403).json({errors,message:"BAD request"})
  


  try {
    //check if the category is valid/exists
    const category = await Category.findById(req.body.category)
    if(!category) return res.status(300).json({
      product:null,
      message:"INVALID Category"
    })
    
     const product = new Product(req.body)
     await product.save()
     res.json({product,message:"saved succesfully"})
  } catch (error) {
    return res.status(500).json({product:null,message:"unable to save"})
  }

})

/*

type:put
path:/api/v1/product/:id
query params:id
isprotected:true(admin)


*/ 

router.put('/update/:id',async(req,res)=>{

  const {id} = req.params
  
  try {

    if(req.body.category){
      const category = await Category.findById(req.body.category)
    if(!category) return res.status(300).json({
      product:null,
      message:"INVALID Category"
    })
    }
    
     const product = await Product.findOneAndUpdate({_id:id},req.body,{new:true})
     
     res.json({product,message:"updated succesfully"})
  } catch (error) {
    return res.status(500).json({product:null,message:"unable to update"})
  }

})




/*

type:delete
path:/api/v1/product/:id
query params:none
isprotected:true(admin)


*/ 

router.delete('/delete/:id',async(req,res)=>{

  const {id} = req.params
  
  try {
    
     const product = await Product.findOneAndRemove(id)
     
     res.json({product,message:"deleted succesfully"})
  } catch (error) {
    return res.status(500).json({product:null,message:"unable to delete"})
  }

})


/*

type:get
path:/api/v1/product/all?category=""
query :categoryId
params:none
isprotected:false


*/ 

router.get('/all',async(req,res)=>{
  try {
    const {categoryId}= req.query
    const products = await Product.find({category:categoryId})
    res.json({products,message:"succesfully fetched products"})
  } catch (error) {
    console.log(error.message)
   return res.status(500).json({categories:[],message:"error fetching products"})
  }
})


export default router