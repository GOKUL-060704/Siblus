const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to protect routes 
const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.user.id).select("-password"); //exclude password from user data
      next()
    } catch (err) {
      console.error("Token Error", err);
      return res.status(401).json({ message: "Not Authorized, Token Failed", error: err.message });
    }
  } else {
    res.status(401).json({ message: "Not Authorized, No Token" });
  }
}

// Middleware to check if the user is an admin 
const admin = (req,res,next) => {
    if (req.user && req.user.role === "admin"){
        next();
    }else{
      res.status(403).json({message:"Not Authorized, Admin Only"}); 
    }
}


module.exports = { protect,admin }; 