require('dotenv').config();
const express = require("express");
//Database connection
const mongoose = require("mongoose");
const connectDB = require('./dbConnection');
const payloadModel = require("./model");
const app = express();
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ limit: '2mb', extended: true }));
const fs = require("fs");
const fps = require('fs/promises');
const { generateRequestID, updateDocument } = require('./ServerFunctions');
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
          await updateDocument(sortedData, ID);
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


app.post("/uploadimage", async (req, res) => {
  const imageData = req.body.Data;
  const ID = req.body.ID;
  //var Filename = `${ID}_Image.png`;

  if (!imageData || !ID) {
    console.log("No Data: image data or ID not sent");
    return res.status(400).send({
      message: "Bad request. Image Data and Image ID are required.",
    });
  }
  const binaryData = Buffer.from(imageData, 'base64');

  const result = await updateDocument(binaryData, ID);

  if(result == 'Uploaded')
  {
    
    res.status(200).send({
      message: "Image data successfully uploaded",
    });

  }
  else if(result == "Not Found")
  {
    res.status(404).send({
      message: "Image data not found",
    });

  }
  else {
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
