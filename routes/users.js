const express = require('express');
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const config = require('config');
const route = express.Router()
const {check, validationResult}  = require('express-validator/check');
const { genSalt } = require('bcryptjs');
// @route  POST api/users
// @route  Register a user
// @acess  Public
route.post('/', [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please enter a valid email').isEmail(),
        check('password', 'Please enter a password with 6 or more characters').isLength({min:6})

], async (req, res) => {
        const errors =  validationResult(req);
        if(!errors.isEmpty()){
                  return res.status(400).json({errors:errors.array()})
        }
        const {name, email, password} = req.body;
        try {
                let user = await User.findOne({email});
                if(user){
                        res.status(400).json({message:"User with that email already exists"})
                 }
                 user = new User({
                         name,
                         email,
                         password
                 })
                 const salt = await bcrypt.genSalt(10)
                 user.password = await bcrypt.hash(password, salt)
                 await user.save()
                 const payload = {
                         user: {
                                 id:user.id
                         }
                 }
                 jwt.sign(payload, config.get('jwtSecret'), {expiresIn: 36000}, 
                          (error, token) => {
                                  if(error) throw error;
                                  res.json({token:token});
                          })
                
        } catch (error) {
             console.log(error.message)   
             res.status(500).send("Server error")
        }

})
module.exports = route