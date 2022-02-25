const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");


const app = express();


app.set('view engine','ejs');
app.set('views',"./views");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

//setting connextion
mongoose.connect("mongodb://localhost:27017/todolistDB")

//creating schema

const itemSchema = new mongoose.Schema({
    name: String
});

// mongoose model
const Item = mongoose.model("Item",itemSchema)

const item1 = new Item({
    name : "welcome to our to do list"
});

const item2 = new Item({
    name : "Hit the + button to add an new item."
});

const item3 = new Item({
    name : "<-- Hit this to delete an item."
});

const defauletItems = [item1, item2, item3];

// Item.insertMany(defauletItems,function(err){
//     if(err){
//         console.log(err);
//     }else{
//         console.log("Sucessfully saved defaukt item to DB")
//     }
// })



app.get("/",function(req,res){

    let day = date.getDate();

    Item.find(function(err,foundItems){
    
        if(foundItems.length === 0) {
            Item.insertMany(defauletItems,function(err){
            if(!err){
            console.log("Sucessfully saved defaukt item to DB");
            }   
            });
            res.redirect("/")
             }else{
                res.render("list",{listTitle : day, newListItems : foundItems});
             }

        });
    



});

app.post("/",function(req,res){
    
    
    const itemName = req.body.newItem;

    const item = new Item({
        name: itemName
    });

    item.save();
    res.redirect("/")//it willshow data on the page frome DB
    });

app.post("/delete",function(req,res){
    const checkedItemId = req.body.checkbox

    Item.findByIdAndRemove(checkedItemId,function(err){
        if(err){
            console.log(err)
        } else {
            console.log("sucessfully deleted")
            res.redirect('/');
        }
        });
    });


app.get("/work",function(req,res){
    res.render("list",{listTitle: "Work list" , newListItems : workItem});
});


app.get("/about",function(req,res){
    res.render("about");
});

app.listen(3000,function(req,res){
    console.log("the server is at 3000");
});