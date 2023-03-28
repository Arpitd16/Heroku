require('dotenv').config()
const express = require("express");
const bodyparsr = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encryp=require("mongoose-encryption")

const app = express();

console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyparsr.urlencoded({ extended: true }));
mongoose.connect("mongodb://127.0.0.1:27017/KADB", { useNewUrlParser: true });



const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

userSchema.plugin(encryp,{secret:process.env.SECRET, encryptedFields:["password"]});
const User = new mongoose.model("User", userSchema);

app.get("/", function (req, res) {
  res.render("home");
});
app.get("/login", function (req, res) {
  res.render("login");
});
app.get("/register", function (req, res) {
  res.render("register");
});
app.get("/secrets",function(req,res){
    res.render("secrets");
})

app.post("/register", function (req, res) {
  const newuser = new User({
    email: req.body.username,
    password: req.body.password,
  });
  newuser.save().then(function (err) {
    if (err) {
      console.log(err);
    } else {
        res.render("secrets");
    }
  });
});
app.post("/login",function(req,res){
    const username=req.body.username;
    const password=req.body.password; 
    User.findOne({email:username}).then(function(err,founduser){
        if(err){
            console.log(err);
        }
        else{
            if(founduser.password===password)
            {
                res.render("secrets");
            }
        }
    })
})

app.listen(3000, function () {
  console.log("server are on port 3000");
});
