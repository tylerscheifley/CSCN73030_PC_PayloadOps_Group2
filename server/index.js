const express = require("express");
const app = express();
var querystring = require("querystring");
var http = require("http");
// serve up production assets
app.use(express.static("client/build"));
app.use(express.json());
// let the react app to handle any unknown routes
// serve up the index.html if express does'nt recognize the route
const path = require("path");
//Default route
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

//Get Image from payload
app.get("/ImagePayloadRequest", (req, res) => {
  res.sendFile(path.resolve(__dirname, "sclient", "build", "index.html"));
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
app.listen(PORT);
