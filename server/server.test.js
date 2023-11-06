const request = require("supertest");
const server = require("../server/serverMockFunctions");
const exp = require("constants");
const fs = require("fs").promises;
const XMLHttpRequest = require("xhr2");

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

describe("POST /payloadimage", () => {
  it("BEB03- should return binary image data with response code 200", async () => {
    const response = await request(server).post("/payloadimage");
    var imagePath = "../server/testimagerecieved.png";
    var imagecreated = false;

    // Write binary data to the image file and wait for the operation to complete
    try {
      await fs.writeFile(imagePath, response.body);
      console.log("Image file has been successfully created");

      await fs.access(imagePath, fs.constants.F_OK);
      console.log("File exists");
      imagecreated = true;
    } catch (err) {
      console.error("Error writing or checking image file:", err);
    }

    expect(imagecreated).toEqual(true);
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
server.close();
