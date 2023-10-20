const express = require("express");
const app = express();
const fs = require("fs");

const port = 3000;

app.get("/GroundStationPayload", (req, res) => {
  res.status(200).send({ message: "Ground Station Payload" });
});

app.post('/payloadimage', function (req, res) {
    var imagePath = "../server/TestingImage.png";
    
    fs.readFile(imagePath, (err, data) => {
      if (err) {
          res.status(500).send('There was an error reading the image');
      } else {
          res.setHeader('Content-Type', 'image/jpeg');
          res.status(200).send(data);
          console.log(data);
      }
  });

});

const server = app.listen(port, () =>
  console.log(`Test Server is listening on port ${port}!`)
);

module.exports = server;
