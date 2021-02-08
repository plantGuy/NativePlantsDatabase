//CRUD operations (create, read, update, delete)

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
      console.log("connected correctly");
      const db = client.db(databaseName);
      db.collection("users").insertOne(
        {
          Species: "Asclepias",
          Genus: "incarnata",
        },
        (error, result) => {
          if (error) {
            console.log(error);
          } else {
            console.log(result.ops);
          }
        }
      );
    }
  }
);
