const express = require('express');
const route = express.Router()
const User = require('../models/User');
const auth = require('../middleware/auth');
const {check, validationResult} = require('express-validator/check')
const Contact = require('../models/Contacts')
// @route  GET api/contacts
// @route  get logged in user contacts
// @acess  Private
route.get('/', auth, async (req, res) => {
    try{
        const contacts =  await Contact.find({user:req.user.id}).sort({date:-1})
        
        res.json(contacts)
    } catch (error) {
       console.error(error.message);
       res.status(500).send('Server error')
    }
   
})

// @route  POST api/contacts
// @route  add logged in user contact
// @acess  private
route.post('/', [auth, [
      check('name', 'Name is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
           return res.status(400).json({ errors:errors.array() })
    }

    const {name, email, phone, type} = req.body;

    try{
         const newContact =  new Contact({
             name,
             email,
             phone,
             type,
             user:req.user.id

         })

         const contact = await newContact.save();
         res.json(contact)
    } catch(error){
          console.error(error.message);
          res.status(500).send('Server error')
    }
})

// @route  PUT api/contacts/:id
// @route  update logged in user contact
// @acess  private
route.put('/:id', auth, async (req, res) => {
    const {name, email, phone, type} = req.body;
    
    // build contact object
    let  contactField = {}

    if(name) contactField.name = name;
    if(email) contactField.email = email;
    if(phone) contactField.phone = phone;
    if(type) contactField.type = type;

    try {
          let contact = await Contact.findById(req.params.id)

          if(!contact) return res.status(404).json({message: "Contact not found"})

          if(contact.user.toString() !== req.user.id){
              return res.status(401).json({message:"Not authorized"});
          }

          contact = await Contact.findByIdAndUpdate(
              req.params.id,
              { $set: contactField },
              {new: true});

          res.json(contact)

    } catch(error){
          console.error(error)
          res.status(500).send('Server error')
    }
})

// @route  DELETE api/contacts/:id
// @route  add logged in user contact
// @acess  private
route.delete('/:id', auth, async (req, res) => {
    try {
        let contact = await Contact.findById(req.params.id)

        if(!contact) return res.status(404).json({message: "Contact not found"})

        if(contact.user.toString() !== req.user.id){
            return res.status(401).json({message:"Not authorized"});
        }

        contact = await Contact.findByIdAndRemove(req.params.id);

        res.json({message:"Contact Removed"});

  } catch(error){
        console.error(error)
        res.status(500).send('Server error')
  }
 
})
module.exports = route