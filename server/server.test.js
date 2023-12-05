const request = require("supertest");
const server = require("../server/serverMockFunctions");
const exp = require("constants");
const fs = require("fs").promises;
const XMLHttpRequest = require("xhr2");
const {
  generateRequestID,
  updateDocument,
  saveStatus,
} = require("./ServerFunctions");
const { default: mongoose } = require("mongoose");
const payloadModel = require("./model");

describe("POST /GroundStationPayload", () => {
  it("BEB01- Test a proper payload request with Ground Station Payload Server Mock should return a 200 OK", async () => {
    const json = {
      ID: "20231105_000000",
      NumberOfImages: "1",
      Longitude: "-80.520409",
      Latitude: "43.464256",
    };

    // Make sure server is an instance of your express app
    await request(server)
      .post("/GroundStationPayload")
      .set("Content-Type", "application/json")
      .send(json) // supertest will set the Content-Type to application/json for you
      .expect(200) // supertest's expect functions can check the status code
      .then((response) => {
        // You can make further assertions about the response here
        expect(response.body.message).toEqual(
          "200 OK, Received the request 20231105_000000 for 1 NumberOfImages at Longitude -80.520409 and Latitude 43.464256"
        );
      })
      .catch((err) => {
        // If there's an error in the request, it will be caught here
        console.error(`Error: ${err.message}`);
      });
  });
});

describe("POST /GroundStationPayload", () => {
  it("BEB02- Test a improper payload request with Ground Station Payload Server Mock should return a 400 Bad Request", async () => {
    const json = {};

    // Make sure server is an instance of your express app
    await request(server)
      .post("/GroundStationPayload")
      .set("Content-Type", "application/json")
      .send(json) // supertest will set the Content-Type to application/json for you
      .expect(400) // supertest's expect functions can check the status code
      .then((response) => {
        // You can make further assertions about the response here
        expect(response.body.message).toEqual(
          "Bad request. Longitude, Latitude, and NumberOfImages are required."
        );
      })
      .catch((err) => {
        // If there's an error in the request, it will be caught here
        console.error(`Error: ${err.message}`);
      });
  });
});

//Outdated unit test, new implementation of payloadimage route created in sprint 2

// describe("POST /payloadimage", () => {
//   it("BEB03- should return binary image data with response code 200", async () => {
//     const response = await request(server).post("/payloadimage");
//     var imagePath = "../server/testimagerecieved.png";
//     var imagecreated = false;

//     // Write binary data to the image file and wait for the operation to complete
//     try {
//       await fs.writeFile(imagePath, response.body);
//       console.log("Image file has been successfully created");

//       await fs.access(imagePath, fs.constants.F_OK);
//       console.log("File exists");
//       imagecreated = true;
//     } catch (err) {
//       console.error("Error writing or checking image file:", err);
//     }

//     expect(imagecreated).toEqual(true);
//   });
// });
// POST PayloadImage, null data being sent
describe("POST /payloadimage", () => {
  it("BEB03- Send Invalid request with no image data, expect 400 response", async () => {
    //ID is used to set the name of the image since its unique
    const json = {
      ID: "20231106_000000",
      Data: null,
    };
    await request(server)
      .post("/payloadimage")
      .send(json)
      //Expected 400, if 500 status code, the Data isn't null and proceeded to the writing of the image data
      .expect(400)
      .then((response) => {
        expect(response.body.message).toEqual(
          "Bad request. Image data, ID, Sequence, and Fin flag are required."
        );
      });
  });
});

describe("POST /Status", () => {
  it("BEB04- After a Request is sent we should receive a status from ground station payload", async () => {
    const json = {
      ID: "20231105_000000",
      Status: "0",
    };

    // Make sure server is an instance of your express app
    await request(server)
      .post("/Status")
      .set("Content-Type", "application/json")
      .send(json) // supertest will set the Content-Type to application/json for you
      .expect(200) // supertest's expect functions can check the status code
      .then((response) => {
        // You can make further assertions about the response here
        expect(response.body.message).toEqual("Recieved the status");
      })
      .catch((err) => {
        // If there's an error in the request, it will be caught here
        console.error(`Error: ${err.message}`);
      });
  });
});

//Post Status with a bad request
describe("POST /Status with a bad request", () => {
  it("BEB05- After a Request is sent we should receive a status from ground station payload", async () => {
    const json = {};

    // Make sure server is an instance of your express app
    await request(server)
      .post("/Status")
      .set("Content-Type", "application/json")
      .send(json) // supertest will set the Content-Type to application/json for you
      .expect(400) // supertest's expect functions can check the status code
      .then((response) => {
        // You can make further assertions about the response here
        expect(response.body.message).toEqual(
          "Bad request.ID and Status is required."
        );
      })
      .catch((err) => {
        // If there's an error in the request, it will be caught here
        console.error(`Error: ${err.message}`);
      });
  });
});

//Post Status with a reject by logic
describe("POST /Status with reject by logic", () => {
  it("BEB06- After a Request is sent we should receive a status from ground station payload", async () => {
    const json = {
      ID: "20231105_000000",
      Status: "1",
    };

    // Make sure server is an instance of your express app
    await request(server)
      .post("/Status")
      .set("Content-Type", "application/json")
      .send(json) // supertest will set the Content-Type to application/json for you
      .expect(200) // supertest's expect functions can check the status code
      .then((response) => {
        // You can make further assertions about the response here
        expect(response.body.message).toEqual("Recieved the status");
      })
      .catch((err) => {
        // If there's an error in the request, it will be caught here
        console.error(`Error: ${err.message}`);
      });
  });
});

//Post Status with a reject by structure
describe("POST /Status with a reject by structure", () => {
  it("BEB07- After a Request is sent we should receive a status from ground station payload", async () => {
    const json = {
      ID: "20231105_000000",
      Status: "2",
    };

    // Make sure server is an instance of your express app
    await request(server)
      .post("/Status")
      .set("Content-Type", "application/json")
      .send(json) // supertest will set the Content-Type to application/json for you
      .expect(200) // supertest's expect functions can check the status code
      .then((response) => {
        // You can make further assertions about the response here
        expect(response.body.message).toEqual("Recieved the status");
      })
      .catch((err) => {
        // If there's an error in the request, it will be caught here
        console.error(`Error: ${err.message}`);
      });
  });
});

//Post Status with an Lost Status
describe("POST /Status with a Lost request", () => {
  it("BEB08- After a Request is sent we should receive a status from ground station payload", async () => {
    const json = {
      ID: "20231105_000000",
      Status: "3",
    };

    // Make sure server is an instance of your express app
    await request(server)
      .post("/Status")
      .set("Content-Type", "application/json")
      .send(json) // supertest will set the Content-Type to application/json for you
      .expect(200) // supertest's expect functions can check the status code
      .then((response) => {
        // You can make further assertions about the response here
        expect(response.body.message).toEqual("Recieved the status");
      })
      .catch((err) => {
        // If there's an error in the request, it will be caught here
        console.error(`Error: ${err.message}`);
      });
  });
});

//Post Status with an unknown Status using the default switch case
describe("POST /Status with an unknown Status", () => {
  it("BEB09- After a Request is sent we should receive a status from ground station payload", async () => {
    const json = {
      ID: "20231105_000000",
      Status: "4",
    };

    // Make sure server is an instance of your express app
    await request(server)
      .post("/Status")
      .set("Content-Type", "application/json")
      .send(json) // supertest will set the Content-Type to application/json for you
      .expect(200) // supertest's expect functions can check the status code
      .then((response) => {
        // You can make further assertions about the response here
        expect(response.body.message).toEqual("Recieved the status");
      })
      .catch((err) => {
        // If there's an error in the request, it will be caught here
        console.error(`Error: ${err.message}`);
      });
  });
});

describe("Test the request ID generation", () => {
  it("BEB10- The ID should be generated using the function and match the expected", () => {
    var actual = generateRequestID();

    var date = new Date();
    var year = date.getFullYear();
    var month = String(date.getMonth() + 1).padStart(2, "0");
    var day = String(date.getDate()).padStart(2, "0");
    var hour = String(date.getHours()).padStart(2, "0");
    var minute = String(date.getMinutes()).padStart(2, "0");
    var seconds = String(date.getSeconds()).padStart(2, "0");
    var ID =
      year + "" + month + "" + day + "_" + hour + "" + minute + "" + seconds;

    console.log("Actual: " + actual + "\n" + "Expected: " + ID);
    expect(actual).toEqual(ID);
  });
});
//server.close();
// POST PayloadImage valid image being sent
describe("Post /payloadimage", () => {
  it("BEB10- Send valid testing image and receive 200 OK response code", async () => {
    const imagePath = "../server/TestingImage.png";
    //Need to convert binary data to base64 for server to write correctly
    const imageData = await fs.readFile(imagePath);
    const hexString = imageData.toString("hex"); // Read the image file asynchronously
    // Split the hex string into lines
    const firstTwoLines = hexString.substring(500, 10000);
    //console.log(hexString);
    //Json packet creation
    const json = {
      ID: "20231106_000000",
      raw: firstTwoLines,
      sequencenumber: 10,
      finflag: false,
    };

    await request(server)
      .post("/payloadimage")
      .send(json)
      //Checking for 200 OK and Correct response message
      .expect(200)
      .then((response) => {
        expect(response.body.message).toEqual("Received image packet");
      })
      .catch((err) => {
        console.error(`Error: ${err.message}`);
      });
  });
});

describe("Post /payloadimage", () => {
  it("BEB19- Send full image and receive 200 OK response code complete image", async () => {
    const imagePath = "../server/TestingImage.png";
    //Need to convert binary data to base64 for server to write correctly
    const imageData = await fs.readFile(imagePath);
    const hexString = imageData.toString("hex"); // Read the image file asynchronously
    //Json packet creation
    const json = {
      ID: "111_1111",
      raw: hexString,
      sequencenumber: 0,
      finflag: true,
    };

    await request(server)
      .post("/payloadimage")
      .send(json)
      //Checking for 200 OK and Correct response message
      .expect(200)
      .then((response) => {
        expect(response.body.message).toEqual(
          "Received the complete image data"
        );
      })
      .catch((err) => {
        console.error(`Error: ${err.message}`);
      });
  });
});

describe("Post /savecommand", () => {
  it("BEB11- Save valid command: longitude and latitude with return status 200 OK", async () => {
    const json = {
      longitude: 123.456,
      latitude: 789.1,
    };

    await request(server)
      .post("/savecommand")
      .send(json)
      //Checking for 200 OK and Correct response message
      .expect(200)
      .then((response) => {
        expect(response.body.message).toEqual(
          "Command successfully saved to the database"
        );
      })
      .catch((err) => {
        console.error(`Error: ${err.message}`);
      });
  });
});

describe("Post /uploadimage", () => {
  it("BEB12- Recieve binary image data and save to database with status 200 OK response", async () => {
    const imagePath = "../server/TestingImage.png";
    const targetImageID = "20231109_211612";
    //Need to convert binary data to base64 for server to write correctly
    const imageData = await fs.readFile(imagePath, "binary");
    const base64ImageData = Buffer.from(imageData, "binary").toString("base64");

    const json = {
      filename: "Testing1Image.png",
      ID: targetImageID,
      raw: base64ImageData,
    };

    await request(server)
      .post("/uploadimage")
      .send(json)
      //Checking for 200 OK and Correct response message
      .expect(200)
      .then((response) => {
        expect(response.body.message).toEqual(
          "Image data successfully uploaded"
        );
      })
      .catch((err) => {
        console.error(`Error: ${err.message}`);
      });
  });
});

describe("Post /retrieveimage", () => {
  it("BEB13- Sent request for image using ID, receive 200 OK Status and save the image to file", async () => {
    const targetImageID = "20231109_211612";
    let exists = false;

    const json = {
      ID: targetImageID,
    };

    await request(server)
      .post("/retrieveimage")
      .send(json)
      // Checking for 200 OK and Correct response message
      .expect(200)
      .then(async (response) => {
        var imageBuffer = Buffer.from(response.body.imageData, "base64");
        const filename = response.body.filename;

        try {
          await fs.writeFile(filename, imageBuffer, "binary");
          console.log("Image successfully written to file.");
          // Check if the file exists
          exists = await fs
            .access(filename)
            .then(() => true)
            .catch(() => false);
        } catch (err) {
          console.error("Error writing the image:", err);
        }
      })
      .catch((err) => {
        console.error(`Error: ${err.message}`);
      });

    expect(exists).toEqual(true);
  });
});

describe("Post /retrieveimage", () => {
  it("BEB14- Sent an invalid request for image using ID, receive 404 image not found", async () => {
    const targetImageID = 99;

    const json = {
      ID: targetImageID,
    };

    await request(server)
      .post("/retrieveimage")
      .send(json)
      //Checking for 404 Image not found and Correct response message
      .expect(404)
      .then((response) => {
        expect(response.body.message).toEqual("Image data not found");
      })
      .catch((err) => {
        console.error(`Error: ${err.message}`);
      });
  });
});

describe("Post /retrieveimage", () => {
  it("BEB15- Sent an invalid request with null ID", async () => {
    const targetImageID = null;

    const json = {
      ID: targetImageID,
    };

    await request(server)
      .post("/retrieveimage")
      .send(json)
      //Checking for 400 ID must not be null
      .expect(400)
      .then((response) => {
        expect(response.body.message).toEqual(
          "Bad request. Image ID is required."
        );
      })
      .catch((err) => {
        console.error(`Error: ${err.message}`);
      });
  });
});

describe("Post /uploadimage", () => {
  it("BEB16- Upload invalid id and recieve a 400 status code", async () => {
    const imagePath = "../server/TestingImage.png";
    const targetImageID = null;
    //Need to convert binary data to base64 for server to write correctly
    const imageData = await fs.readFile(imagePath, "binary");
    const base64ImageData = Buffer.from(imageData, "binary").toString("base64");

    const json = {
      filename: "Testing1Image.png",
      ID: targetImageID,
      raw: base64ImageData,
    };

    await request(server)
      .post("/uploadimage")
      .send(json)
      //Checking for 200 OK and Correct response message
      .expect(400)
      .then((response) => {
        expect(response.body.message).toEqual(
          "Bad request. Image Data and Image ID are required."
        );
      })
      .catch((err) => {
        console.error(`Error: ${err.message}`);
      });
  });
});

describe("Post /uploadimage", () => {
  it("BEB17- Upload invalid id with no image and recieve a 404 status code", async () => {
    const imagePath = "../server/TestingImage.png";
    const targetImageID = 99;
    //Need to convert binary data to base64 for server to write correctly
    const imageData = await fs.readFile(imagePath, "binary");
    const base64ImageData = Buffer.from(imageData, "binary").toString("base64");

    const json = {
      filename: "Testing1Image.png",
      ID: targetImageID,
      raw: base64ImageData,
    };

    await request(server)
      .post("/uploadimage")
      .send(json)
      //Checking for 200 OK and Correct response message
      .expect(404)
      .then((response) => {
        expect(response.body.message).toEqual("Image data not found");
      });
  });
});

describe("Post /savecommand", () => {
  it("BEB18- Invalid longitude json object, should cause 400 status code", async () => {
    const json = {
      longitude: null,
      latitude: 789.1,
    };

    await request(server)
      .post("/savecommand")
      .send(json)
      //Checking for 200 OK and Correct response message
      .expect(400)
      .then((response) => {
        expect(response.body.message).toEqual(
          "Bad request. longitude and latitude are required."
        );
      })
      .catch((err) => {
        console.error(`Error: ${err.message}`);
      });
  });
});

describe("Test updating status", () => {
  it("BEB20- The status should be saved to the corresponding ID ", async () => {
    var expected = "Status Saved";
    var ID = "20231109_211612";
    var Status = "Success";
    var result = await saveStatus(ID, Status);

    expect(result).toEqual(expected);
  });
});

describe("Test updating status invalid ID", () => {
  it("BEB21- The function should return no record found", async () => {
    var expected = "Record not found";
    var ID = "10_1";
    var Status = "Reject By Logic";
    var result = await saveStatus(ID, Status);

    expect(result).toEqual(expected);
  });
});

describe("POST /retrieveallcommands", () => {
  it("BEB22- should retrieve all commands excluding the first record", async () => {
    await request(server)
      .post("/retrieveallcommands")
      //Checking for 200 OK and Correct response message
      .expect(200)
      .catch((err) => {
        console.error(`Error: ${err.message}`);
      });
  });
});

describe("Post /deleterecord", () => {
  it("BEB23- Delete valid record with given ID", async () => {
    const id = "1";
    const testingLatitude = "123";
    const testingLongitude = "567";

    const json = {
      ID: id,
    };

    const payloadData = new payloadModel({
      latitude: testingLatitude,
      longitude: testingLongitude,
      date: id,
      imageID: id,
    });

    await payloadData.save();
    await request(server)
      .post("/deleterecord")
      .send(json)
      //Checking for 200 OK and Correct response message
      .expect(200)
      .then((response) => {
        expect(response.body.message).toEqual("Record deleted successfully");
      });
  });
});

describe("Post /deleterecord", () => {
  it("BEB24- Recieve invalid ID with 404 not found response", async () => {
    const id = "testingid";

    const json = {
      ID: id,
    };

    await request(server)
      .post("/deleterecord")
      .send(json)
      //Checking for 404 not found and Correct response message
      .expect(404)
      .then((response) => {
        expect(response.body.message).toEqual(
          "No matching record found for deletion"
        );
      });
  });
});

//Cleanup function, runs once all tests have completed
afterAll(async () => {
  const imagePath = "../server/20231109_211612_Image.png";
  //const retrieveimagePath = '../server/Testing1Image.png'
  // Delete the image file after the test
  await fs.unlink(imagePath);
  //await fs.unlink(retrieveimagePath);
  await server.close();
  await mongoose.disconnect();
});
