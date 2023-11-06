const express = require("express");
const app = express();
const fs = require("fs");
const port = 3000;

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

app.post("/payloadimage", function (req, res) {
  var imagePath = "../server/TestingImage.png";

  fs.readFile(imagePath, (err, data) => {
    if (err) {
      res.status(500).send("There was an error reading the image");
    } else {
      res.setHeader("Content-Type", "image/jpeg");
      res.status(200).send(data);
      console.log(data);
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

module.exports = server;
