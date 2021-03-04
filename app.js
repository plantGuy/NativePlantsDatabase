const path = require("path");
const express = require("express");
//const hbs = require("hbs");
//const { registerHelper } = require("hbs");
const port = process.env.PORT || 3000;
const app = express();
//const xlsx = require("xlsx");
//const Mongo = require("mongodb");

require("dotenv").config();

app.get("/JSON/nativePlants", (req, res) => {
  //var search = JSON.parse(req.query.search);
  var search = JSON.parse(req.query.search);
  Object.keys(search).forEach((element) => {
    if (search[element].match(/.*\.*/)) {
      console.log("like search detected");
      //search[element] = { $regex: search[element], $options: "i" };
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

  // client.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
  //   //assert.equal(null, err);
  //   if (error) {
  //     return console.log(error);
  //   } else {
  //     const db = client.db(databaseName);
  //     const collection = db.collection("Plants");
  //
  //   }
  // });
  //   .find({})
});

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
