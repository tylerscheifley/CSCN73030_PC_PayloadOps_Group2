//needed dotenv for connection URI
require('dotenv').config();
const express = require("express");
const app = express();
//Database connection
const mongoose = require("mongoose");
const connectDB = require('./dbConnection');
const payloadModel = require("./model");
//Server hosting variables
var querystring = require("querystring");
var http = require("http");
// serve up production assets
app.use(express.static("client/build"));
app.use(express.json());
// let the react app to handle any unknown routes
// serve up the index.html if express does'nt recognize the route
const path = require("path");

// Calling dbconnection.js database connection
connectDB();

//let imageCollection;

// MongoClient.connect(connectionUri).then(client => {
//   console.log('Connected to database');
//   const db = client.db('PayloadImages');
//   imageCollection = db.collection('Images');

// })
// .catch(error=> console.error(error));

//Default route
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

//Get Image from payload
app.post("/payloadimage", function (req, res) {
  const ImageData = req.body.Data;
  const ID = req.body.ID;
  //Unique name generated
  var imagePath = `../server/${ID}_Image.png`;
  
  //First checking to ensure image data isn't null
  if(!ImageData) 
  {
    console.log("No image data sent");
    return res.status(400).send({
      message: "Bad request. Image data is required.",
    });
  }
  //Convert ImageData binary data to base64
  var imageBuffer = Buffer.from(ImageData, 'base64');

  fs.writeFile(imagePath, imageBuffer, (err) => {
    if (err) {
      //Error 500 is an internal server error writing to a file
      console.error("Error writing the image:", err);
      res.status(500).send("There was an error writing the image");
    } else {
      console.log('Image: ', ID, ' Sucessfully created');
      //200 OK upon the creation of the image
      res.status(200).send({
        message: "Recieved the image data",
      })
    }
  });

  //Insert Saving image to database functionality below 

});

app.post("/Status", (req, res) => {
  //json object with a status and id
  const ID = req.body.ID;
  const Status = req.body.Status;

  if (!ID || !Status) {
    console.log("Failed the check...");
    return res.status(400).send({
      message: "Bad request.ID and Status is required.",
    });
  }

  switch (parseInt(Status)) {
    case 0:
      console.log("Request ID: " + ID + "\n" + "Status: " + "Success");
      break;
    case 1:
      console.log("Request ID: " + ID + "\n" + "Status: " + "Reject By Logic");
      break;
    case 2:
      console.log(
        "Request ID: " + ID + "\n" + "Status: " + "Reject By Structure"
      );
      break;
    case 3:
      console.log(
        "Request ID: " +
          ID +
          "\n" +
          "Status: " +
          "Rejected because it was lost."
      );
      break;
    default:
      console.log("Request ID: " + ID + "\n" + "Status: " + "Unknown");
      break;
  }

  res.status(200).send({
    message: "Recieved the status",
  });
});

// if not in production use the port 5000
const PORT = process.env.PORT || 8080;
console.log("server started on port:", PORT);
//Server only listens once connection to DB has been established.
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT);
});

