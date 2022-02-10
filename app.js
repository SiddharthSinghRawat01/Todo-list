//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");


const app = express();

let items = ["Buy food","Cook food","Eat food"]; // it goes form item as string to item as array so we can store more item in it
let workItem =[];


app.set('view engine','ejs');//this line make ejs work(this line says we set viewengion as ejs)
app.set('views',"./views");// this line is seting the path of viewsfile

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'))

app.get("/",function(req,res){

    let today = new Date(); //new Date() create a new date object
    

    let option ={
        weekday: 'long',
        day: 'numeric',
        month: 'long'

    }
    let day = today.toLocaleDateString("en-US",option)

    res.render("list",{listTitle : day, newListItems : items});// we got error that item is not defined because it was a local variabel

});

app.post("/",function(req,res){
    
    console.log(req.body)
    
    // item = req.body.newItem; // this is a local variabe so we have to declare it golbally so we make an empty vae = item on top
    let item = req.body.newItem; //this time we pe push item intp itmes

    if(req.body.list === "newList"){
        workItem.push(item)
        res.redirect("/work")
    }else{
        items.push(item);//pushing item into items so we can store more item
    // console.log(items)
    return res.redirect("/");
    }
    

    });


app.get("/work",function(req,res){
    res.render("list",{listTitle: "Work list" , newListItems : workItem})
});

app.post("/work", function(req,res){
    let item = req.body.newItem
    workItem.push(item)
    res.redirect("/work")
    
});

app.get("/about",function(req,res){
    res.render("about");
});

app.listen(3000,function(req,res){
    console.log("the server is at 3000");
});