import express from 'express'
import Category from '../services/mongodb/models/Category'
const router = express.Router()
import {body,validationResult} from 'express-validator'
/*

type:get
path:/api/v1/category/all
query params:none
isprotected:false


*/ 

router.get('/all',async(req,res)=>{
  try {
    const categories = await Category.find({})
    res.json({categories,message:"succesfully fetched categories"})
  } catch (error) {
    console.log(error.message)
   return res.status(500).json({categories:[],message:"error fetching categories"})
  }
})

/*

type:post
path:/api/v1/category/add
query params:none
isprotected:true(admin)


*/ 

router.post('/add',
body('name').isLength({min:1}),
body('description').isLength({min:10}),
async(req,res)=>{

  const {errors} = validationResult(req)
  if (errors.length > 0) return res.status(403).json({errors,message:"BAD request"})
  


  try {
    
     const category = new Category(req.body)
     await category.save()
     res.json({category,message:"saved succesfully"})
  } catch (error) {
    return res.status(500).json({category:null,message:"unable to save"})
  }

})

/*

type:put
path:/api/v1/category/:id
query params:none
isprotected:true(admin)


*/ 

router.put('/update/:id',async(req,res)=>{

  const {id} = req.params
  
  try {
    
     const category = await Category.findOneAndUpdate({_id:id},req.body,{new:true})
     
     res.json({category,message:"updated succesfully"})
  } catch (error) {
    return res.status(500).json({category:null,message:"unable to update"})
  }

})



/*

type:delete
path:/api/v1/category/:id
query params:none
isprotected:true(admin)


*/ 

router.delete('/delete/:id',async(req,res)=>{

  const {id} = req.params
  
  try {
    
     const category = await Category.findOneAndRemove(id)
     
     res.json({category,message:"deleted succesfully"})
  } catch (error) {
    return res.status(500).json({category:null,message:"unable to delete"})
  }

})



export default router