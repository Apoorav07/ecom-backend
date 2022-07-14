import express from 'express'
import User from '../services/mongodb/models/User'

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import isAdmin from '../middlewares/isAdmin'
import {body,validationResult} from 'express-validator'




const router =express.Router()
/*

type:get
path:/api/v1/auth/users
query params:none
isprotected:true(admin route)


*/ 
router.get('/users',isAdmin,async(req,res)=>{
   try {
    const users = await User.find({})
   res.json({users})
   } catch (error) {
    console.log(error.message)
    res.status(500).json({users:[]})
   }
})



/*

type:post
path:/api/v1/auth/signup
query params:none
isprotected:fasle


*/ 
router.post('/signup',
body('firstName').isLength({min:5}),
body('email').isEmail(),
body('password').isLength({min:10})
,async(req,res)=>{

const {errors} = validationResult(req)
if (errors.length > 0) return res.status(403).json({errors,message:"BAD request"})


  try {
    const {firstName,lastName='',email,password} = req.body
  
  //use bcrypt to hash passwword
   const salt = await bcrypt.genSalt(5)
   const hashedPassword = await bcrypt.hash(password,salt)
   const user = new User({firstName,lastName,email,password:hashedPassword})

   await user.save()

  res.json({user})
   } catch (error) {
    console.log(error.message)
    res.status(500).json({users:{}})
   }
  
})


/*

type:post
path:/api/v1/auth/login
query params:none
isprotected:fasle


*/ 
router.post('/login',async(req,res)=>{
  try {
    const {email,password} = req.body
  
  //find the user
  const user = await User.findOne({email})
  if(user){
    const isVerified = await bcrypt.compare(password,user.password)
    if (isVerified){
      const{_id,role} = user
      const token = jwt.sign({_id,role},process.env.JWT_SECRET,{expiresIn:"1hr"})
      return res.json({token})
    }else{
      res.json({token:null,message:"unauthorised"})
    }
    
  }
   
   return res.json({token:null,message:"user doesnot exist"})
   
  
   } catch (error) {
    console.log(error.message)
    res.status(500).json({token:null})
   }
  
})






















export default router