const express = require('express');
require("./db/config");
const User = require("./db/user");
const Product = require("./db/Product")
const bodyParser = require('body-parser');
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.post('/register', async (req, res) => {
    console.log('Received registration request:', req.body);
    let users = new User(req.body);
    try {
        if(req.body.email && req.body.password)
            {
                let emailUser = req.body.email;
                
                let user = await User.findOne({ email: emailUser });
                console.log("User is :" ,user);
                if(user)
                    {
                        res.json('Email Already Exist')
                        console.log('Email Already Exist')
                    }
                    else 
                    {
                        let result = await users.save();
                        console.log('User saved successfully:', result); 
                        res.json('User Created successfully')
                         result = result.toObject();
                         delete result.password;
                    }
            }
            else
            {
                res.send('Please fill fields')
            }
    } catch (error) {
      console.error('Error saving user:', error);
      res.status(500).send({ error: 'An error occurred while saving the user' });
    }
  });

  app.post("/login" , async (req,res)=>{
    console.log(req.body);
   
 
    if(req.body.email && req.body.password)
        {
          
                    console.log("true")
                    let users = await User.findOne(req.body).select("-password");
                    console.log(users)
                    if(users)
                        {
                            res.json(users);
                        }
                        else
                        {
                            res.json("Incorrect Email or Password");
                        }
                
        }
        else
        {
            res.json("Please Enter Fields")
        }
   
   
  });
  app.post("/addproduct", async (req, res) => {
    console.log('Received Product:', req.body);
    
        
            let product = new Product(req.body);
            let result = await product.save();
        
            res.json("Product Added");
            console.log(result);
  
  });

  app.get("/getproducts", async (req,res) =>{
    let products = await Product.find();
    if(products.length > 0)
        {
            res.send(products)
        }
        else
        {
            res.json("No Products Found")
        }
  })
  
app.delete("/product/:id" , async (req,res)=>{
   try
   {
    let result = await Product.deleteOne({_id:req.params.id})
    res.json("Product Deleted");
   }
    
    catch (error) {
      console.error('Error deting produc:', error);
      res.json({ error: 'An error occurred' });
    }
});

  app.listen(5000, () => {
    console.log('Server is running on port 5000');
  });
