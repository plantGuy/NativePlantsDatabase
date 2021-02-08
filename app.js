const path = require("path");
const express = require("express");
//const hbs = require("hbs");
//const { registerHelper } = require("hbs");
const port = process.env.PORT || 3000;
const app = express();
const xlsx = require("xlsx");
const Mongo = require("mongodb");
const MongoClient = Mongo.MongoClient;

app.get("/JSON/nativePlants", (req, res) => {
  //var search = JSON.parse(req.query.search);
  var search = req.query;
  Object.keys(search).forEach((element) => {
    if (search[element].match(/.*\.*/)) {
      console.log("like search detected");
      search[element] = { $regex: search[element], $options: "i" };
    }
  });
  console.log(search);
  const Mongo = require("mongodb");
  const MongoClient = Mongo.MongoClient;

  connectionURL = "mongodb://127.0.0.1:27017";
  databaseName = "taskManager";

  MongoClient.connect(
    connectionURL,
    { useNewUrlParser: true },
    (error, client) => {
      if (error) {
        return console.log(error);
      } else {
        const db = client.db(databaseName);
        db.collection("plants")
          .find(search)
          .toArray((err, results) => {
            if (results) {
              res.send(results);
            }
          });
      }
    }
  );
  //   .find({})
});

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
