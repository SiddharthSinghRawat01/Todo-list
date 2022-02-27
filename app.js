const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
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

const defaultItems = [item1, item2, item3];

const listSchema = {
    name: String,
    items: [itemSchema]
}

const List = mongoose.model("List",listSchema);





app.get("/",function(req,res){

    // let day = date.getDate();

    Item.find(function(err,foundItems){
    
        if(foundItems.length === 0) {
            Item.insertMany(defaultItems,function(err){
            if(!err){
            console.log("Sucessfully saved default item to DB");
            }   
            });
            res.redirect("/")
             }else{
                res.render("list",{listTitle : "TODAY!", newListItems : foundItems});
             }

        });
    
});

app.get('/:coustomeListName',function(req,res){
    const coustomeListName = _.capitalize(req.params.coustomeListName);
    //capitlise no == we use capitalize
    

    List.findOne({name: coustomeListName},function(err,foundlist){
        if(!err){
            if(!foundlist){
    
                //creat new list
                const list = new List({
                    name: coustomeListName,
                    items: defaultItems
                });
                list.save();
                res.redirect("/" + coustomeListName);
            } else {

                //show existing list
                res.render("list",{listTitle : foundlist.name, newListItems : foundlist.items});
            }
        }
    })

});



app.post("/",function(req,res){
    
    
    const itemName = req.body.newItem;
    const listName = req.body.list;

    const item = new Item({
        name: itemName
    });

    if(listName === "TODAY!"){
        item.save();
    res.redirect("/")//it willshow data on the page frome DB
    } else {
        List.findOne({name: listName}, function(err,foundlist){
         foundlist.items.push(item);
         foundlist.save();
         res.redirect("/" + listName)
        })
    }

    
    });

app.post("/delete",function(req,res){
    const checkedItemId = req.body.checkbox
    const listName = req.body.listName   // this "listName" is different from what we used above it is for check box and 

    if(listName === "TODAY!"){
        Item.findByIdAndRemove(checkedItemId,function(err){
            if(err){
                console.log(err)
            } else {
                console.log("sucessfully deleted")
                res.redirect('/');
            }
            });
    } else {
        List.findOneAndUpdate({name: listName},{$pull : {items: {_id: checkedItemId}}},function(err,foundlist){
// above we used pull method of mongoose and findOne and update from JS which is collection.findOneAndUpdat({id},{update},callback) update = $pull    
            if(!err){
                res.redirect('/' + listName);
            }
        })
    }
    
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