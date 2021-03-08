const path = require("path");
const express = require("express");
const port = process.env.PORT || 3000;
const app = express();
require("dotenv").config();

app.use(express.static(path.join(__dirname, "../Public")));

app.get("/", (req, res) => {
  res.send("Welcome to the Native Plants API");
});

app.get("/JSON/nativePlants", (req, res) => {
  //var search = JSON.parse(req.query.search);
  try {
    var search = JSON.parse(req.query.search);
    Object.keys(search).forEach((element) => {
      if (req.query.partial) {
        //match(/.*\.*/)) {
        console.log("like search detected");
        searchElement = "." + element + ".";
        search[element] = { $regex: search[searchElement], $options: "i" };
      }
    });
    console.log(search);
    //const Mongo = require("mongodb");

    uri = `mongodb+srv://PlantsAdmin:${process.env.MongoDBPW}@cluster0.vikvy.mongodb.net/${process.env.MongoDB}?retryWrites=true&w=majority`;
    databaseName = process.env.MongoDB;

    const MongoClient = require("mongodb").MongoClient;
    //const uri = "mongodb+srv://PlantsAdmin:<password>@cluster0.vikvy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    client.connect((err) => {
      const collection = client.db(process.env.MongoDB).collection("Plants");
      // perform actions on the collection object
      collection.find(search).toArray((err, results) => {
        if (results) {
          res.send(results);
        }
        client.close();
      });
    });
  } catch (error) {
    console.log(error);
  }
});

function getfieldValues(field, fieldID) {
  console.log("future use");
}

app.get("/JSON/fieldValues", (req, res) => {
  //var search = JSON.parse(req.query.search);
  try {
    var field = req.query.field;
    var fieldID = req.query.fieldID;

    var search = { fieldName: field, ValueID: fieldID };

    uri = `mongodb+srv://PlantsAdmin:${process.env.MongoDBPW}@cluster0.vikvy.mongodb.net/${process.env.MongoDB}?retryWrites=true&w=majority`;
    databaseName = process.env.MongoDB;

    const MongoClient = require("mongodb").MongoClient;
    //const uri = "mongodb+srv://PlantsAdmin:<password>@cluster0.vikvy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    client.connect((err) => {
      const collection = client
        .db(process.env.MongoDB)
        .collection("FieldValues");
      // perform actions on the collection object
      console.log(search);
      collection.find(search).toArray((err, results) => {
        if (results) {
          console.log(results);
          res.send(results);
        } else {
          res.send({ Value: fieldID, ValueID: fieldID, fieldName: field });
        }
        client.close();
      });
    });
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
