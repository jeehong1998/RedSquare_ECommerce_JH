// Initialise library instances
const mysql = require("mysql");
const express = require("express");
const cors = require("cors");
const app = express();
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(cors());


// Connection config
const db = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "1234",
    database: "redsquare",
    connectionLimit: 10
})


// Check if the db connection is up
db.connect(function(error) 
{
    if (error) 
    {
        console.log("Error connecting to database:", error);
        return;
    }
    console.log("Connected to database successfully!");
});


// Start the server on port 3001
app.listen(3001, () => {
    console.log("Server is running");
})


// Listen for /register call
app.post('/register', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    db.query("INSERT INTO user (username, password) VALUES (?, ?)", [username, password], (err, result) =>{
        if(err !== null)
        {
            res.json({status: "fail", message: err.sqlMessage});
        } 
        else
        {
            res.json({status: "pass", message: "Register Successfully"});
        }
    })
})


// Listen for /login call
app.post('/login', (req, res) => 
{
    const username = req.body.username;
    const password = req.body.password;

    db.query("SELECT * FROM user WHERE username = ? AND password = ?", [username, password], (err, result) =>{
        if(err !== null)
        {
            res.send({err: err});
        } 
        else
        {
            if (result.length !== 0)
            {
                const id = result[0].username;
                const token = jwt.sign({id}, "jwtSecret", {
                    expiresIn: "1m",
                })

                res.json({auth: true, token: token, result: result[0].username, message: "Login Successfully"});
            }
            else
            {   
                res.send({message: "Username or Password is wrong"});
            }
        }
    })
})


// Verify JWT
const verifyJWT = (req, res, next) => 
{
    const token = req.headers["x-access-token"];
    var valid_token;

    if(token)
    {
        const decodedToken = jwt.decode(token, "jwtSecret");

        if (decodedToken.exp < Date.now() / 1000) 
        {
            checkTokenCallback(res, false);
        } 
        else 
        {
            db.query("SELECT * FROM user WHERE username = ?", [decodedToken.id], (err, result) =>
            {
                if(err !== null)
                {
                    checkTokenCallback(res, false);
                } 
                else
                {
                    if (result.length !== 0)
                    {
                        checkTokenCallback(res, true);
                    }
                    else
                    {   
                        checkTokenCallback(res, false);
                    }
                }
            });
        }
    }
    else
    {
        checkTokenCallback(res, false);
    }

    
}

// Send response callback function
function checkTokenCallback(res, valid_token)
{
    if(valid_token)
    {
        res.json({auth: true});
    }
    else
    {
        res.json({auth: false});
    }
}


// Check if user is authenticated
app.get('/isUserAuth', verifyJWT, (req, res) => {
    res.send("You are authenticated");
})


// Add to Cart
app.post('/addToCart', (req, res) => 
{
    // Decrypt the token
    const token = req.body.token;
    const decodedToken = jwt.decode(token, "jwtSecret");
    const product_title = req.body.product_title;
    const product_price = req.body.product_price;
    const product_image = req.body.product_image;


    db.query("SELECT * FROM cart WHERE product_title = ? AND updated_by = ?", [product_title, decodedToken.id], (err, result) =>{
        if(err !== null)
        {
            res.json({message: err.message});
        } 
        else
        {
            if (result.length !== 0)
            {
                let current_quantity = parseInt(result[0].quantity) + 1;

                // Update existing record
                db.query("UPDATE cart SET quantity = ? WHERE product_title = ? AND updated_by = ?", [current_quantity, product_title,  decodedToken.id]);
            }
            else
            {   
                // Insert new record
                db.query("INSERT INTO cart (product_title, quantity, price, image, updated_by) VALUES (?, ?, ?, ?, ?)", [product_title, 1, product_price, product_image, decodedToken.id]);
            }
            res.json({message: "Product added to cart successfully"});
        }
    })
})


// Get Cart info
app.post('/getCartDetails', (req, res) => 
{
    // Decrypt the token
    const token = req.body.token;
    const decodedToken = jwt.decode(token, "jwtSecret");

    db.query("SELECT * FROM cart WHERE updated_by = ?", [decodedToken.id], (err, result) =>{
        if(err !== null)
        {
            res.json({message: err.message});
        } 
        else
        {
            res.json({result: result});
        }
    })
})


// Add to Cart
app.post('/modifyCart', (req, res) => 
{
    // Decrypt the token
    const token = req.body.token;
    const decodedToken = jwt.decode(token, "jwtSecret");
    const product_title = req.body.product_title;
    const type = req.body.type;

    if(type == 'increase')
    {
        // Update existing record
        db.query("UPDATE cart SET quantity = (SELECT quantity + 1 FROM (SELECT * FROM cart) AS temp WHERE product_title = ? AND updated_by = ? ) WHERE product_title = ? AND updated_by = ?", [product_title,  decodedToken.id, product_title,  decodedToken.id]);
    }
    else if(type == "decrease")
    {
        // Update existing record
        db.query("UPDATE cart SET quantity = (SELECT quantity - 1 FROM (SELECT * FROM cart) AS temp WHERE product_title = ? AND updated_by = ? ) WHERE product_title = ? AND updated_by = ?", [product_title,  decodedToken.id, product_title,  decodedToken.id]);
    }
    else if(type == "remove")
    {
        // Remove existing record
        db.query("DELETE FROM cart WHERE product_title = ? AND updated_by = ?", [product_title,  decodedToken.id]);
    }

    res.json({message: "Successfully updated"});
})