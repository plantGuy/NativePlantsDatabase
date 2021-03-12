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
const e = require("express");
//const hbs = require("hbs");
//const viewsPath = path.join(__dirname, "../templates/views");
//const partialsPath = path.join(__dirname, "../templates/partials");

app.use(express.static(path.join(__dirname, "../Public")));

app.get("/", (req, res) => {
  res.send(`
  <!DOCTYPE html>
  <head>
    <title>Native Plants API</title>
  </head>
  <H1>Welcome to the Native Plants API</H1>
  <H3>Directions for Use</H3>
  <P><b>/JSON/nativePlants?</B> - Retrieves a list of native plants and accepts a search using plant attributes using a JSON match</P>
  <P><B>Example</B>:  search={"strSciName":"Acer"}&partial=true</p>
  <P>Use "Partial" to indicate you want a partial match</P>
  <P><B>/JSON/fieldValues?</B> - returns the human name of the field values using the query params field and fieldID</P>
  <P><B>/JSON/fields?</B> - returns the fields currently defined and their values</P>
  <p>You can find some examples here:<OL>
  <LI><a href="/Example.html">Example Search Page</a></LI>
  <LI><a href="/formattedExample.html">Style Suggestion for formatting</a></LI>
  </p>
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
        client.close();
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
  if (!Array.isArray(values)) {
    // if not an array then convert it to one.
    tmpArray = [];
    tmpArray.push(values);
    values = tmpArray;
  }
  client.connect((err) => {
    const collection = client.db(process.env.MongoDB).collection("FieldValues");
    values.forEach((value) => {
      if (!Number.isInteger) {
        value = value.trim();
      }
      promises.push(
        new Promise((resolve, reject) => {
          var search = { fieldName: field, ValueID: value };
          collection.find(search).toArray((err, results) => {
            if (err) {
              reject(err);
            } else {
              if (results.length > 0) {
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
      client.close();
      return next(tmpValues);
    });
  });
}

function getFieldValues(results, next) {
  var parsedFields = {};
  var promises = [];
  try {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    if (results) {
      // perform actions on the collection object
      Object.keys(results).forEach((field) => {
        parsedFields[field] = {};
        parsedFields[field].Values = [];
        if (
          Array.isArray(results[field]) ||
          (results[field].length < 3 &&
            results[field] != "Y" &&
            results[field].trim().length > 0) ||
          (Number.isInteger(results[field]) && results[field] < 100)
        ) {
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
  } catch (error) {
    console.log(error);
  }
}

app.get("/JSON/parseFields", (req, res) => {
  //var search = JSON.parse(req.query.search);
  try {
    var parsedFields = {};

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

      collection.find({}).toArray((err, results) => {
        if (results) {
          results.forEach((field) => {
            if (!parsedFields[field.fieldName]) {
              //parsedFields.push(field.fieldName);
              parsedFields[field.fieldName] = {};
              parsedFields[field.fieldName].values = [];
            }
            if (isNaN(field.ValueID)) {
              field.ValueID = field.ValueID.replace(/\s/g, "");
            }

            parsedFields[field.fieldName].values.push({
              Value: field.Value,
              ValueID: field.ValueID,
            });
          });
          client.close();
          res.send(parsedFields);
        } else {
          res.send({});
        }
        //client.close();
      });
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/JSON/fields", (req, res) => {
  //var search = JSON.parse(req.query.search);
  try {
    //uri = `mongodb+srv://PlantsAdmin:${process.env.MongoDBPW}@cluster0.vikvy.mongodb.net/${process.env.MongoDB}?retryWrites=true&w=majority`;
    databaseName = process.env.MongoDB;

    //const uri = "mongodb+srv://PlantsAdmin:<password>@cluster0.vikvy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    client.connect((err) => {
      const collection = client.db(process.env.MongoDB).collection("Fields");
      // perform actions on the collection object

      collection.find({}).toArray((err, results) => {
        if (results) {
          client.close();
          res.send(results);
        }
      });
      //client.close();
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/JSON/normalize", (req, res) => {
  try {
    var newDocument = {};
    databaseName = process.env.MongoDB;

    //const uri = "mongodb+srv://PlantsAdmin:<password>@cluster0.vikvy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    client.connect((err) => {
      const collection = client.db(process.env.MongoDB).collection("Fields");
      // perform actions on the collection object

      collection.find({}).toArray((err, results) => {
        if (results) {
          results.forEach((field) => {
            if (results.values) {
              if (results.values[0].relatedField) {
              }
            }
          });

          client.close();
          res.send(results);
        }
      });
      //client.close();
    });
  } catch (error) {
    console.log(error);
  }
});

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
          //results[0].forEach((field) => {});
          client.close();
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
