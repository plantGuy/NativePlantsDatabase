const xlsx = require("xlsx");
const Mongo = require("mongodb");
const MongoClient = Mongo.MongoClient;
const key = Mongo.ObjectID;

connectionURL = "mongodb://127.0.0.1:27017";
databaseName = "taskManager";

var workbook = xlsx.readFile("./Imports/Key.xlsx");

var Row = 0;
var Rows = workbook.Sheets.Sheet1["!rows"];
console.log(Rows);
let jSheet = xlsx.utils.sheet_to_json(workbook.Sheets.Sheet1, {
  header: "array of strings",
});

MongoClient.connect(
  connectionURL,
  { useNewUrlParser: true },
  (error, client) => {
    if (error) {
      return console.log(error);
    } else {
      console.log("connected correctly");
      const db = client.db(databaseName);

      // db.collection("plants")
      //   .find({})
      //   .toArray(function (err, results) {
      //     //loop through results

      //     results.forEach((result) => {
      //       console.log(result);
      //       //loop through each field
      //       var record = result;
      //       var rKey;

      //       Object.keys(result).forEach((field) => {
      //         //replace comma separated value with array
      //         //console.log(result[field]);
      //         if (field == "_id") {
      //           rKey = result[field].toHexString();
      //           console.log(rKey);
      //         } else {
      //           if (result[field].match) {
      //             if (result[field].match(/.*,.*/)) {
      //               record[field] = result[field].split(",");
      //             }
      //           }
      //         }
      //       });
      //       //update record

      //       console.log(record);
      //       db.collection("plants").findOneAndReplace(
      //         { _id: new key(rKey) },
      //         record
      //       );
      //});
      //});
      db.collection("fieldVals").insertMany(jSheet, (error, result) => {
        if (error) {
          console.log(error);
        } else {
          console.log(result.ops);
        }
      });
    }
  }
);

console.log("hello world");
