//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoode = require("mongoose");
const {
  default: mongoose
} = require("mongoose");
const date = require(__dirname + "/date.js");
const _ = require("lodash")
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cu8e9.${process.env.DB_HOST}/blogDB`, 
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

const itemsSchema = {
  name: String
};

const Item = mongoode.model("item", itemsSchema);

const firstTask = new Item({
  name: "Go to Bed"
})
const secondtTask = new Item({
  name: "Buy Milk"
})
const thirdTask = new Item({
  name: "Finish Homework"
})

const defaultItems = [firstTask, secondtTask, thirdTask];

const listSchema = {
  name: String,
  items: [itemsSchema]
}

const List = mongoode.model("list", listSchema);

app.get("/", function (req, res) {
  const day = date.getDate();

  Item.find({}, function (err, foundItem) {
    if (err) {
      console.log(err);
    } else {
      res.render("list", {
        listTitle: "Today",
        newListItems: foundItem
      });
    }
  });
});

app.get("/:costumeList", function (req, res) {
  const listName = _.capitalize(req.params.costumeList);

  List.findOne({
    name: listName
  }, function (err, result) {
    if (!err) {
      if (!result) {
        //create a new list
        const list = new List({
          name: listName,
          items: defaultItems
        });

        list.save();
        res.redirect("/" + listName);
      } else {
        //show an existing list

        res.render("list", {
          listTitle: result.name,
          newListItems: result.items
        });
      }
    }
  });



});

app.post("/delete", function (req, res) {
  const checkedItemID = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemID, function (err) {
      if (!err) {
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate({
        name: listName
      }, {
        $pull: {
          items: {
            _id: checkedItemID
          }
        }
      },
      function (err, result) {
        if (!err) {
          res.redirect("/" + listName);
        } else {
          console.log(err);
        }

      });
  }
});

app.post("/", function (req, res) {

  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  });

  if (listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({
      name: listName
    }, function (err, foundList) {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    })
  }

});

app.get("/about", function (req, res) {
  res.render("about");
});

// app.listen(process.env.PORT, function () {
//   console.log("Server started on port 3000");
// });

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port);