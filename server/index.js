//needed dotenv for connection URI
require("dotenv").config();
const express = require("express");
const app = express();
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ limit: '2mb', extended: true }));
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

//let imageCollection;

// MongoClient.connect(connectionUri).then(client => {
//   console.log('Connected to database');
//   const db = client.db('PayloadImages');
//   imageCollection = db.collection('Images');

// })
// .catch(error=> console.error(error));

//Default route
app.use(express.static("client/build"));

// let the react app handle any unknown routes
// serve up the index.html if Express doesn't recognize the route
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

app.post("/request", (req, res) => {
  var Longitude = req.body.Longitude;
  var Latitude = req.body.Latitude;

  console.log("Request recieved");
  console.log("Longitude: " + Longitude);
  console.log("Latitude: " + Latitude);

  if (!Longitude || !Latitude) {
    console.log("Failed the check...");
    return res.status(400).send({
      message: "Bad request. Longitude and Latitude are required.",
    });
  }

  // var GroundStationPayloadIp = "blank";
  // var id = 0; //generateRequestID();

  // var json = {
  //   ID: id,
  //   Longitude: Longitude,
  //   Latitude: Latitude,
  // };

  // //send a post request to the GroundStationPayload with a json object
  // var options = {
  //   hostname: GroundStationPayloadIp,
  //   port: 8080,
  //   path: "/request",
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify(json),
  // };

  // var req = http.request(options, (res) => {
  //   console.log(`statusCode: ${res.statusCode}`);

  //   res.on("data", (d) => {
  //     process.stdout.write(d);
  //   });
  // });
});

//Get Image from payload
//Updated POST payloadimage
app.post("/payloadimage", async (req, res) => {
  const ImageData = req.body.raw;
  const ID = req.body.ID;
  const sequenceNumber = req.body.sequencenumber;
  const finFlag = req.body.finflag;

  // Unique file names created
  const imagePath = `../server/${ID}_Image.png`;
  const tempTxtPath = `../server/${ID}_Temp.txt`; 

  // First checking to ensure image data isn't null
  if (!ImageData || !ID || sequenceNumber === undefined || finFlag === undefined) {
    console.log("No image data sent");
    return res.status(400).send({
      message: "Bad request. Image data, ID, Sequence, and Fin flag are required.",
    });
  }

  // Convert ImageData hex data to binary
  const imageBuffer = Buffer.from(ImageData, 'hex');
  const formatedContent = `${sequenceNumber},${imageBuffer.toString('hex')}\n`;

  // Storing received image data into temp text file until fin flag is raised
  fs.appendFile(tempTxtPath, formatedContent, 'binary', (err) => {
    if (err) {
      console.error("Error writing the binary image data:", err);
      return res.status(500).send({
        message: "Error writing image data",
      });
    }
    console.log(`Image buffer ${ID} sequence number ${sequenceNumber} written to temp file`);

    // Writing image can begin once fin flag is raised
    if (finFlag) {
      // Reading the entire file of temp txt file 
      fs.readFile(tempTxtPath, 'binary', (err, data) => {
        if (err) {
          console.log("Error reading temp file: ", err);
          return res.status(500).send({
            message: "Error reading image data",
          });
        }

        // Sorting the data based on the sequence number
        const sortedData = data.split('\n')
          .filter(line => line.trim() !== '')
          .map(line => {
            const [seqNum, hexData] = line.split(',');
            return { seqNum: parseInt(seqNum), binaryData: Buffer.from(hexData, 'hex') };
          })
          .sort((a, b) => a.seqNum - b.seqNum)
          .map(item => item.binaryData);

        // Concatenating sorted data into a single Buffer

        //console.log("final sortedData: ", sortedData);
        const tempBuffer = Buffer.concat(sortedData);

        // Writing image file from sorted data
        fs.writeFile(imagePath, tempBuffer, 'binary', async (err) => {
          if (err) {
            console.error("Error writing the image:", err);
            return res.status(500).send("There was an error writing the image");
          }
          console.log(`Image ${ID} successfully created`);
          // 200 OK upon the creation of the image
          res.status(200).send({
            message: "Received the complete image data",
          });

          // Deleting temp txt file 
          fs.unlink(tempTxtPath, (err) => {
            if (err) {
              console.error("Error deleting temp file:", err);
            } else {
              console.log(`Temp file ${tempTxtPath} deleted`);
            }
          });

          // Calling database function to save sorted Data to corresponding ID
          await updateDocument(tempBuffer, ID);
        });
      });
    } else {
      // When the flag is not raised, send status 200 OK single packet received
      res.status(200).send({
        message: "Received image packet",
      });
    }
  });
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

  try {
    const saveResult = await saveStatus(ID, Status);
    console.log("Save result: ", saveResult);

  } catch(error) {
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
    payloadModel.find()
      .then(data => {
        // Exclude the first record, first record is for testing
        const recordsToDisplay = data.slice(1);

        const imageID = recordsToDisplay.map(item => item.imageID);
        const latitude = recordsToDisplay.map(item => item.latitude);
        const longitude = recordsToDisplay.map(item => item.longitude);
        const date = recordsToDisplay.map(item => item.date);
        const status = recordsToDisplay.map(item => item.status);
        
        //Sends as an array in json format
        res.json({
          imageID: imageID,
          latitude: latitude,
          longitude: longitude,
          date: date,
          status: status
        });
        //console.log("Records retrieved: ", recordsToDisplay);
      })
      .catch(err => res.json(err));
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Error retrieving command data from the database",
    });
  }
});

//Retrieves single image from the database given the image ID
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
      // Set the correct content type for the image
      res.status(200).type('image/png').send(imageDocument.imageData);
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
    const timeStamp = generateRequestID();
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
