const path = require("path");
const express = require("express");
const port = process.env.PORT || 3000;
const app = express();
require("dotenv").config();
const uri = `mongodb+srv://PlantsAdmin:${process.env.MongoDBPW}@cluster0.vikvy.mongodb.net/${process.env.MongoDB}?retryWrites=true&w=majority`;
databaseName = process.env.MongoDB;
const MongoClient = require("mongodb").MongoClient;
const { promises } = require("fs");
const { profileEnd } = require("console");

app.use(express.static(path.join(__dirname, "../Public")));

app.get("/", (req, res) => {
  res.send(`<H1>Welcome to the Native Plants API</H1>
  <H3>Directions for Use</H3>
  <P><b>/JSON/nativePlants?</B> - Retrieves a list of native plants and accepts a search using plant attributes using a JSON match</P>
  <P><B>Example<B>:  search={"strSciName":"Acer"}&partial=true</p>
  <P>Use "Partial" to indicate you want a partial match</P>
  <P><B>/JSON/fieldValues?</B> - returns the human name of the field values using the query params field and fieldID</P>
  `);
});

app.get("/JSON/nativePlants", (req, res) => {
  //var search = JSON.parse(req.query.search);
  try {
    var search = JSON.parse(req.query.search);
    Object.keys(search).forEach((element) => {
      if (req.query.partial) {
        //match(/.*\.*/)) {
        console.log("like search detected");

        searchElement = ".*" + search[element] + ".*";
        searchElement = { $regex: searchElement, $options: "i" };
        //search[element] = { $regex: searchElement, $options: "i" };
        search[element] = searchElement;
      }
    });
    console.log(search);
    //const Mongo = require("mongodb");

    //const MongoClient = require("mongodb").MongoClient;
    //const uri = "mongodb+srv://PlantsAdmin:<password>@cluster0.vikvy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    client.connect((err) => {
      const collection = client.db(process.env.MongoDB).collection("Plants");
      // perform actions on the collection object
      collection.find(search).toArray(async (err, results) => {
        if (results) {
          getFieldValues(results[0], (newResults) => {
            console.log(newResults);
            res.send(newResults);
          });
        }
        //client.close();
      });
    });
  } catch (error) {
    console.log(error);
  }
});

function parseValues(values, field, next) {
  var promises = [];
  var tmpValues = [];
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  client.connect((err) => {
    const collection = client.db(process.env.MongoDB).collection("FieldValues");
    values.forEach((value) => {
      promises.push(
        new Promise((resolve, reject) => {
          var search = { fieldName: field, ValueID: value };
          collection.find(search).toArray((err, results) => {
            if (err) {
              reject(err);
            } else {
              if (results.length > 0) {
                console.log(results);
                tmpValues.push({
                  Value: results[0].Value,
                  ValueID: results[0].ValueID,
                });
              } else {
                tmpValues.push({
                  Value: value,
                  ValueID: value,
                });
              }
            }
            resolve();
            //client.close();
          });
        })
      ); // Promise end
    }); // values loop end

    Promise.all(promises).then(() => {
      return next(tmpValues);
    });
  });
}

function getFieldValues(results, next) {
  var parsedFields = {};
  var promises = [];
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // perform actions on the collection object
  Object.keys(results).forEach((field) => {
    parsedFields[field] = {};
    parsedFields[field].Values = [];
    if (Array.isArray(results[field])) {
      promises.push(
        new Promise(async (resolve, reject) => {
          parseValues(results[field], field, (values) => {
            parsedFields[field].Values = values;
            //tmpField.values = values;
            resolve();
          });
        })
      );
    } else {
      promises.push(
        new Promise((resolve, reject) => {
          parsedFields[field].Values = results[field];
          resolve();
        })
      );
    } //is array loop end
  });
  Promise.all(promises).then(() => {
    console.log("done parsing fields");
    return next(parsedFields);
  });
}

app.get("/JSON/fieldValues", (req, res) => {
  //var search = JSON.parse(req.query.search);
  try {
    var field = req.query.field;
    var fieldID = req.query.fieldID;

    var search = { fieldName: field, ValueID: fieldID };

    //uri = `mongodb+srv://PlantsAdmin:${process.env.MongoDBPW}@cluster0.vikvy.mongodb.net/${process.env.MongoDB}?retryWrites=true&w=majority`;
    databaseName = process.env.MongoDB;

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
          results[0].forEach((field) => {
            console.log(field);
          });
          console.log(results);
          res.send(results);
        } else {
          res.send({ Value: fieldID, ValueID: fieldID, fieldName: field });
        }
        //client.close();
      });
    });
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
