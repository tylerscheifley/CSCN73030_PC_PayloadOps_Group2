//needed dotenv for connection URI
require("dotenv").config();
const axios = require("axios");
const express = require("express");
const app = express();
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ limit: "2mb", extended: true }));
//Database connection
const mongoose = require("mongoose");
const connectDB = require("./dbConnection");
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
const fs = require("fs");
const serverfunction = require("./ServerFunctions");

//Default route
app.use(express.static("client/build"));

// let the react app handle any unknown routes
// serve up the index.html if Express doesn't recognize the route
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

app.post("/request", async (req, res) => {
  const longitude = req.body.Longitude;
  const latitude = req.body.Latitude;

  console.log("Request received");
  console.log("Longitude: " + longitude);
  console.log("Latitude: " + latitude);

  if (!longitude || !latitude) {
    console.log("Failed the check...");
    return res.status(400).send({
      message: "Bad request. Longitude and Latitude are required.",
    });
  }

  const groundStationPayloadIp = "http://25.55.209.53:5000";
  const id = serverfunction.generateRequestID();

  const json = {
    ID: id,
    Longitude: longitude,
    Latitude: latitude,
    NumberOfImages: 2, // remove
  };

  try {
    const response = await axios.post(
      `${groundStationPayloadIp}/request`,
      json,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log(`statusCode: ${response.status}`);
    console.log(response.data);

    // Handle the response as needed
    //const timeStamp = (new Date()).toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const timeStamp = serverfunction.generateRequestID();
    const payloadData = new payloadModel({
      latitude: latitude,
      longitude: longitude,
      date: timeStamp,
      imageID: timeStamp,
    });

    await payloadData.save();
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

//Get Image from payload
//Updated POST payloadimage
// Get Image from payload
// Updated POST payloadimage
app.post("/payloadimage", async (req, res) => {
  const ImageData = req.body.raw;
  const ID = req.body.ID;
  const sequenceNumber = req.body.sequencenumber;
  const finFlag = req.body.finflag;

  // Unique file names created
  const imagePath = `../server/${ID}_Image.png`;
  const tempTxtPath = `../server/${ID}_Temp.txt`;

  // First checking to ensure image data isn't null
  if (
    !ImageData ||
    !ID ||
    sequenceNumber === undefined ||
    finFlag === undefined
  ) {
    console.log("No image data sent");
    return res.status(400).send({
      message:
        "Bad request. Image data, ID, Sequence, and Fin flag are required.",
    });
  }

  const formatedContent = `${sequenceNumber},${ImageData}\n`;
  fs.appendFile(tempTxtPath, formatedContent, "utf8", (err) => {
    if (err) {
      console.log(err);
      // Get the file contents after the append operation
      console.log("Error writing image file: ", err);
      res.status(500).send({
        message: "Error writing image data",
      });
    }
  });

  console.log("" + `${sequenceNumber}` + " Packet Received and saved");

  // Writing image can begin once fin flag is raised
  if (finFlag === true) {
    // Reading the entire file of temp txt file
    fs.readFile(tempTxtPath, "utf8", async (err, data) => {
      if (err) {
        console.log("Error reading temp file: ", err);
        return res.status(500).send({
          message: "Error reading image data",
        });
      }

      // Sorting the data based on the sequence number
      const sortedData = data
        .split("\n")
        .filter((line) => line.trim() !== "")
        .map((line) => {
          const [seqNum, hexData] = line.split(",");
          return {
            seqNum: parseInt(seqNum),
            binaryData: hexData,
          };
        })
        .sort((a, b) => a.seqNum - b.seqNum)
        .map((item) => item.binaryData);

      // Concatenating sorted data into a single Buffer
      const concatenatedData = sortedData.join("");

      try {
        // Creating a write stream for binary output
        const imageFile = fs.createWriteStream(imagePath, {
          encoding: "binary",
        });

        // Loop through hex string, convert to binary, and write to binary output file
        for (let i = 0; i < concatenatedData.length; i += 2) {
          const byteString = concatenatedData.slice(i, i + 2);
          const byte = parseInt(byteString, 16);
          imageFile.write(Buffer.from([byte]));
        }

        imageFile.close();
      } catch (error) {
        console.log("Error writing image data to file");
        res.status(500).send({
          message: "Error writing image data to file",
        });
      }

      // Deleting temp txt file
      fs.unlink(tempTxtPath, (err) => {
        if (err) {
          console.error("Error deleting temp file:", err);
        } else {
          console.log(`Temp file ${tempTxtPath} deleted`);
        }
      });

      // Calling database function to save sorted Data to corresponding ID
      res.status(200).send({
        message: "Received image received",
      });
      await serverfunction.updateDocument(concatenatedData, ID);
    });
  } else {
    // When the flag is not raised, send status 200 OK single packet received
    res.status(200).send({
      message: "Received image packet",
    });
  }
});

app.post("/Status", async (req, res) => {
  //json object with a status and id
  const ID = req.body.ID;
  const Status = req.body.Status;

  if (!ID || !Status) {
    console.log("Failed the check...");
    return res.status(400).send({
      message: "Bad request.ID and Status is required.",
    });
  }
  var stringStatus;

  switch (parseInt(Status)) {
    case 0:
      console.log("Request ID: " + ID + "\n" + "Status: " + "Success");
      stringStatus = "Success";

      break;
    case 1:
      console.log("Request ID: " + ID + "\n" + "Status: " + "Reject By Logic");
      stringStatus = "Reject By Logic";
      break;
    case 2:
      console.log(
        "Request ID: " + ID + "\n" + "Status: " + "Reject By Structure"
      );
      stringStatus = "Reject By Structure";
      break;
    case 3:
      console.log(
        "Request ID: " +
          ID +
          "\n" +
          "Status: " +
          "Rejected because it was lost."
      );
      stringStatus = "lost";
      break;
    default:
      console.log("Request ID: " + ID + "\n" + "Status: " + "Unknown");
      stringStatus = "unknown";
      break;
  }

  try {
    console.log("BEFORE ID " + ID + "Status" + stringStatus);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const saveResult = await serverfunction.saveStatus(ID, stringStatus);
    console.log("Save result: ", saveResult);
  } catch (error) {
    console.log("Error saving status:", error);
  }

  res.status(200).send({
    message: "Recieved the status",
  });
});

//Database Routes to be used by the client

//Returns all documents in the database
app.post("/retrieveallcommands", async (req, res) => {
  try {
    payloadModel
      .find()
      .then((data) => {
        // Exclude the first record, first record is for testing
        const recordsToDisplay = data.slice(1);

        const imageID = recordsToDisplay.map((item) => item.imageID);
        const latitude = recordsToDisplay.map((item) => item.latitude);
        const longitude = recordsToDisplay.map((item) => item.longitude);
        const date = recordsToDisplay.map((item) => item.date);
        const status = recordsToDisplay.map((item) => item.status);

        //Sends as an array in json format
        res.json({
          imageID: imageID,
          latitude: latitude,
          longitude: longitude,
          date: date,
          status: status,
        });
        //console.log("Records retrieved: ", recordsToDisplay);
      })
      .catch((err) => res.json(err));
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Error retrieving command data from the database",
    });
  }
});

// Retrieves single image from the database given the image ID
app.post("/retrieveimage", async (req, res) => {
  const ID = req.body.ID;

  if (!ID) {
    console.log("No ID was sent");
    return res.status(400).send({
      message: "Bad request. Image ID is required.",
    });
  }

  try {
    const imageDocument = await payloadModel
      .findOne({ imageID: ID })
      .lean()
      .exec();

    if (imageDocument && imageDocument.imageData) {
      // Set the correct content type for the image
      res.status(200).type("image/png").send(imageDocument.imageData.buffer);
    } else {
      console.log("Image data not found.");
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

//Route save inputted coordinates send from client GUI
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
    //const timeStamp = (new Date()).toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const timeStamp = serverfunction.generateRequestID();
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

//Delete record provided image ID
app.post("/deleterecord", async (req, res) => {
  const ID = req.body.ID;

  if (!ID) {
    console.log("No ID was sent");
    return res.status(400).send({
      message: "Bad request. Image ID is required.",
    });
  }

  try {
    const result = await payloadModel.deleteOne({ imageID: ID }).exec();

    if (result.deletedCount > 0) {
      console.log("Record Successfully completed");
      res.status(200).send({
        message: "Record deleted successfully",
      });
    } else {
      console.log("No matching record found for deletion.");
      res.status(404).send({
        message: "No matching record found for deletion",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Error deleting image data from the database",
    });
  }
});

// if not in production use the port 5000
const PORT = process.env.PORT || 8080;
console.log("server started on port:", PORT);
//Server only listens once connection to DB has been established.
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT);
});
