const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// @route POST /api/users/register 
// @desc Register a new user 
// @access Public
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User Already Exists" });
    }
    user = new User({ name, email, password });
    await user.save();

    // create json web token 
    const payload = { user: { id: user._id, role: user.role } };

    // Sign and return the token along the user data 
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" }, (err, token) => {
      if (err) throw err;

      // Send the user and token in response 
      res.status(201).json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token: token
      });
    });
  } catch (err) {
    console.error("Error Registering User", err);
    res.status(500).json({ message: "Server Error" });
  }
});


// @ @route POST /api/users/login 
// @desc Login a user and return token  
// @access Public
router.post("/login",async(req,res)=>{
  const { email, password } = req.body; 
  try {
      // find user by email 
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid Credentials" });
      }
      const isMatch = await user.matchPassword(password);
      if(!isMatch){
        return res.status(400).json({ message: "Invalid Credentials" });
      }
      // create json web token 
      const payload = { user: { id: user._id, role: user.role } };

      // Sign and return the token along the user data 
      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" }, (err, token) => {
      if (err) throw err;

      // Send the user and token in response 
      res.json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token: token
      });
    });

  }catch(err){ 
    console.error("Error Logging In", err);
    res.status(500).json({ message: "Server Error" });
  }
})


// @route GET /api/users/profile
// @desc Get logged in users profile(Protected Route)
// @access Private
router.get("/profile",protect, async (req, res) => {
    res.json(req.user);
});

module.exports = router;


