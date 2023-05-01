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