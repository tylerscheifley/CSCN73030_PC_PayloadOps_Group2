require('dotenv').config();
const express = require("express");
//Database connection
const mongoose = require("mongoose");
const connectDB = require('./dbConnection');
const payloadModel = require("./model");
const app = express();
const fs = require("fs");
const port = 3000;
app.use(express.json());

connectDB();

app.post("/GroundStationPayload", (req, res) => {
  const ID = req.body.ID;
  const NumberOfImages = req.body.NumberOfImages;
  const Longitude = req.body.Longitude;
  const Latitude = req.body.Latitude;

  if (!Longitude || !Latitude || !NumberOfImages) {
    console.log("Failed the check...");
    return res.status(400).send({
      message:
        "Bad request. Longitude, Latitude, and NumberOfImages are required.",
    });
  }

  res.status(200).send({
    message: `200 OK, Received the request ${ID} for ${NumberOfImages} NumberOfImages at Longitude ${Longitude} and Latitude ${Latitude}`,
  });
});

// app.post("/payloadimage", function (req, res) {
//   var imagePath = "../server/TestingImage.png";

//   fs.readFile(imagePath, (err, data) => {
//     if (err) {
//       res.status(500).send("There was an error reading the image");
//     } else {
//       res.setHeader("Content-Type", "image/jpeg");
//       res.status(200).send(data);
//       console.log(data);
//     }
//   });
// });

//Updated POST payloadimage
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

const server = app.listen(port, () =>
  console.log(`Test Server is listening on port ${port}!`)
);


//Database Routes 

// async function getNextSequenceValue(sequenceName) {
//   try {
//     const sequenceDocument = await payloadModel.findOneAndUpdate(
//       { _id: sequenceName },
//       { $inc: { commandID: 1 } },
//       { new: true, upsert: true }
//     );

//     if (!sequenceDocument) {
//       // If sequenceDocument is null (no document found), create a new one
//       const newSequenceDocument = await payloadModel.create({ _id: sequenceName, commandID: 1 });
//       return newSequenceDocument;
//     }

//     return sequenceDocument;
//   } catch (error) {
//     console.error(error);
//     throw error; // Handle the error according to your use case
//   }
// }






//Intented to be called by the front end for saving the input of coordinates to be send
app.post("/savecommand", async (req, res) => {
  const longitude = req.body.longitude;
  const latitude = req.body.latitude;

  if (!longitude || !latitude) {
    console.log("No coordinates sent");
    return res.status(400).send({
      message: "Bad request. longitude and latitude are required.",
    });
  }

  try {
    const timeStamp = (new Date()).toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    
    const payloadData = new payloadModel({
      latitude: latitude,
      longitude: longitude,
      date: timeStamp,
      imageID: timeStamp,
    });

    await payloadData.save();
    
    res.status(200).send({
      message: "Command successfully saved to the database",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Error saving command to the database",
    });
  }
});

app.post("/uploadimage", async (req, res) => {
  const imageData = req.body.Data;
  const ID = req.body.ID;
  var Filename = req.body.filename;

  if (!imageData || !ID) {
    console.log("No Data: image data or ID not sent");
    return res.status(400).send({
      message: "Bad request. Image Data and Image ID are required.",
    });
  }
  const binaryData = Buffer.from(imageData, 'base64');

  try {
    const updatedDocument = await payloadModel.findOneAndUpdate(
      { imageID: ID }, // Search criteria
      { $set: { filename: Filename, imageData: binaryData } }, // Fields to update
      { new: true, upsert: false } 
    ).exec();

    if (updatedDocument) {
      console.log('Updated document:', updatedDocument);
      res.status(200).send({
        message: "Image data successfully uploaded",
      });
    } else {
      console.log('Record not found.');
      // Update later to implement if ID can't find one 
      res.status(404).send({
        message: "Image data not found",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Error saving image to the database",
    });
  }
});

//Intended to be used internally by the client searching 
app.post("/retrieveimage", async (req, res) => {
 
  const ID = req.body.ID;

  if (!ID) {
    console.log("No ID was sent");
    return res.status(400).send({
      message: "Bad request. Image ID is required.",
    });
  }

  try {
    const imageDocument = await payloadModel.findOne({ imageID: ID }).lean().exec();

    if (imageDocument && imageDocument.imageData) {

      // Send the binary image data as the response body
      console.log(imageDocument.imageData)
      res.status(200).send({
        imageData: imageDocument.imageData,
        filename: imageDocument.filename,
      });
    } else {
      console.log('Image data not found.');
      res.status(404).send({
        message: "Image data not found",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Error retrieving image data from the database",
    });
  }
});




module.exports = server;
