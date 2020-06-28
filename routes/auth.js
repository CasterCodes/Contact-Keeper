
const express = require('express');
const route = express.Router()
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/auth');
const {check, validationResult} = require('express-validator/check')
// @route  GET api/users
// @route  Get Logged in user
// @acess  Private
route.get('/', auth, async (req, res) => {
     try {
         let user = await User.findById(req.user.id).select('-password');
         res.json(user)
     } catch (error) {
         console.log(error.message)
         res.status.send('Server error')
     } 
})

// @route  POST api/users
// @route  AUTH user and get token
// @acess  public
route.post('/',[
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Please enter a password').exists()
    
], async (req, res) => {
   const errors = validationResult(req);
   if(!errors.isEmpty()){
          return res.status(400).json({errors:errors.array()})
   }
   const {email, password} = req.body;

   try {
       let user = await User.findOne({email});

       if(!user){
             return res.status(400).json({message:'Invalid Credentials'})
       }

       const isMatch = bcrypt.compare(password, user.password)

       if(!isMatch){
             return res.status(400).json({message:'Invalid Credentials'})
       }

       const payload = {
           user:{
               id:user.id
           }
       }
       jwt.sign(payload,config.get('jwtSecret'),{expiresIn: 36000}, (error, token) => {
            if(error) throw error
            res.json({token:token})
       })
   }catch (error) {
        console.log(error.message)
        res.status(500).send('Server error');
  }
})
module.exports = route
