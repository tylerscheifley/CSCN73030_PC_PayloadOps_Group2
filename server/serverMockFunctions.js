const express = require("express");
const app = express();

const port = 3000;

app.get("/GroundStationPayload", (req, res) => {
  const { Longitude, Latitude, NumberOfImages } = req.query;

  if (!Longitude || !Latitude || !NumberOfImages) {
    console.log("Failed the check...");
    return res
      .status(400)
      .send(
        "Bad request. Longitude, Latitude, and NumberOfImages are required."
      );
  }

  res.status(200).send({
    message: `200 OK, Received the request for ${NumberOfImages} NumberOfImages at Longitude ${Longitude} and Latitude ${Latitude}`,
  });
});

const server = app.listen(port, () =>
  console.log(`Test Server is listening on port ${port}!`)
);

module.exports = server;
