const express = require("express");  
const Subscriber = require("../models/Subscriber"); 


const router = express.Router();

// @route POST /api/subscribe 
// @Handle news letter subscription
// @access Public 
router.post("/",async(req,res)=>{
    const {email} = req.body; 
    if(!email){
        return res.status(400).json({message:"Email is required"});
    } 
    try{
        // Check if email is already subscribed 
        const existingSubscriber = await Subscriber.findOne({email});
        if(existingSubscriber){
            return res.status(400).json({message:"Email is already subscribed"});
        }
        // Create new subscriber
        const newSubscriber = new Subscriber({email});
        await newSubscriber.save(); 
        res
          .status(201)
          .json({message:"Scessfully subscribed to newsletter"});
    }catch(err){
      return res.status(500).json({message:"Internal server error"});
    }
})


module.exports = router;
