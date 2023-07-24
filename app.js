// Blog Post Project using EJS and MongoDB
// Udemy Course: The Complete 2023 Web Developement Bootcamp
// Acknowledgement: Angela Yu (App Brewery)
// By: sys-unknwn7645

const express = require("express");
const bodyParser = require("body-parser");
const _ = require('lodash');
const mongoose = require("mongoose");
const date = require(__dirname+"/date.js");

/// dotenv parameters ///
require("dotenv").config();
const USER_ID = process.env.userId;
const PASS = process.env.password;
///    

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

// mongoose.connect("mongodb://127.0.0.1:27017/blogpostDB"); //placeholder when running locally
mongoose.connect("mongodb+srv://"+USER_ID+":"+PASS+"@cluster0.9kyl5he.mongodb.net/blogpostDB");

let today = date.getDate();

const blogSchema = {
    title: String,
    post: String
};

const Post = mongoose.model("post", blogSchema);

app.get("/",async function (req,res){
  const result = await Post.find({});

  if (result.length > 0){
    res.render("home",{homeStartingContent: homeStartingContent, postArray:result})
  } else{
    const example = new Post ({
      title:"Example",
      post: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."
    });
  
    await example.save();
    await res.redirect("/");

  }
});

app.get("/post/:first",async function (req,res){
  console.log("Post Visited: " + _.capitalize(req.params.first))

  const result = await Post.find({});

  let ind = result.findIndex(function (i){
    return _.snakeCase(i.title) == _.snakeCase(req.params.first);
  });

  if (ind >= 0){
    res.render("post",{postArray:result[ind]})

  } else {
    console.log("Nothing Here or Something Went Wrong")
    res.redirect("/")
  }
});

app.get("/about", function(req,res){
  res.render("about", {aboutContent:aboutContent})
});

app.get("/post", function(req,res){
  res.redirect("/")
});

app.get("/contact", function(req,res){
  res.render("contact", {contactContent: contactContent})
});

app.get("/compose", function(req,res){
  res.render("compose")
});

app.post("/compose", async function (req, res){
  
  const postNew = new Post ({  
    title: req.body.userInpTitle,
    post: req.body.userInpPost
  });

  console.log("New Post Added: "+postNew.title)

  await postNew.save();
  await res.redirect("/")
});

app.post("/delete", async function (req, res){
  console.log("Deleted Post: "+req.body.title);
  await Post.deleteOne({title:req.body.title});
  res.redirect("/")
});


app.listen(process.env.PORT || 3000, function() {
  console.log("Server started");
});

