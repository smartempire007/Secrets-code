require("dotenv").config();
const express = require("express");
const mongoose =  require("mongoose");
const encrypt = require('mongoose-encryption');
const ejs = require("ejs");


const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});


userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedField: ["password"]});

const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res) {
    res.render("home");
});

app.get("/login", function(req, res) {
    res.render("login");
});

app.get("/register", function(req, res) {
    res.render("register");
});

app.post("/register", function(req, res) {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save(function(err){
        if(!err){
            res.render("secrets");
        }else {
            console.log(err);
        }
    });
});


app.post("/login", function(req, res) {
    const username =  req.body.username;
    const password = req.body.password;

    User.findOne({email: username}, function(err, foundUser) {
        if(err) {
            console.log(err);
        }else {
            if(foundUser) {
                if(foundUser.password === password) {
                    res.render("secrets")
                }
            }
        }
    });
});


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
    console.log("Server has started successfully");
});
