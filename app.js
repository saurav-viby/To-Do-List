const express = require("express");

const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const params =require('params');
const _ =require('lodash');
const app = express();




mongoose.connect("mongodb+srv://admin-saurav:vibeServer1234@cluster0.539zo.mongodb.net/todoDb");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

const itemsSchema = {
  name: String
};



const Item = mongoose.model("Item", itemsSchema);

const eat = new Item({
  name: "eat"
});

const sleep = new Item({
  name: "sleep"
});
const code = new Item({
  name: "code"
});
const repeat = new Item({
  name: "repeat"
});

const defaultItems = [eat, sleep, code, repeat];

const listSchema={
  name:String,
  items:[itemsSchema]
};

const List=mongoose.model("List",listSchema);

app.get("/", function(req, res) {

  Item.find({}, function(err, foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("added");
        }

      });
      res.render("/");
    } else {
      res.render("list", {
        wDay: "Today",
        nItem: foundItems
      });
    };



  });



});



app.post("/", function(req, res) {
  const itemName = req.body.items;
  const listname=req.body.list;

  const item = new Item({
    name: itemName
  });

  if(listname==="Today"){
    item.save();

    res.redirect("/");

  }else {
    List.findOne({name:listname},function (err,foundlist) {
      foundlist.items.push(item);
      foundlist.save();
res.redirect("/" + listname );


    })
  }


});

app.post("/delete", function(req, res) {
  const checkedItems = req.body.checkbox;
  const listName=req.body.listName;
  if (listName==="Today"){
    Item.findByIdAndRemove(checkedItems, function(err) {


      if (!err) {

        res.redirect("/")

      };

    });
  }else {
    List.findOneAndUpdate({name:listName}, {$pull:{items:{_id:checkedItems}}},function (err,foundlist) {
      if (!err) {
        res.redirect("/" + listName);

      }


    });
  }


});



app.get("/:customlist",function (req,res) {
  const customlist= _.capitalize(req.params.customlist);
  List.findOne({name:customlist},function (err,foundlist) {
    if (!err) {
      if(!foundlist){
        const list=new List({
          name:customlist,
          items:defaultItems
        });

        list.save();
        res.redirect("/" + customlist);
      }else {
        res.render("list", {
          wDay:foundlist.name,
          nItem: foundlist.items
        });
      }

    }

  })

});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}


app.listen(port, function() {
  console.log("server running Well");

});
