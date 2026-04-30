const mongoose = require("mongoose"); 
const dotenv = require("dotenv"); 
const Product = require("./models/Product"); 
const User = require("./models/User"); 
const Cart = require("./models/Cart");
const products = require("./data/products");  

dotenv.config();

// Connect to MongoDB 
mongoose.connect(process.env.MOGO_URI);

// Function to seed data 

const seedData = async()=>{
    try{
        // clear existing data 
        await Product.deleteMany();
        await User.deleteMany();
        await Cart.deleteMany(); 

        //  create a default admin user 
        const createdUser = await User.create({
            name:"Admin User",
            email : "admin@example.com",
            password : "123456",
            role : "admin"
        }); 

        // Assign the default user ID to each Product 
        const userID = createdUser._id; 

        const sampleProducts = products.map((product)=>{
            return { ...product, user: userID };
        }); 

        // Insert products into the database 
        await Product.insertMany(sampleProducts);
        console.log("Data Seeded Successfully");
        process.exit();

    }catch(err){
        console.error("Error Seeding Data",err);
        process.exit(1);
    }
}

seedData();
