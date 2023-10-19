const express = require("express");
const app = express();

const port = 3000;

app.get("/GroundStationPayload", (req, res) => {
  res.status(200).send({ message: "Ground Station Payload" });
});

const server = app.listen(port, () =>
  console.log(`Test Server is listening on port ${port}!`)
);

module.exports = server;
