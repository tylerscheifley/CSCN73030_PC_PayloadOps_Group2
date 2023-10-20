const request = require("supertest");
const server = require("../server/serverMockFunctions");
const fs = require("fs").promises;

describe("GET /GroundStationPayload", () => {
  it("Test a proper payload request with Ground Station Payload Server Mock should return a 200 OK", async () => {
    const response = await request(server).get(
      "/GroundStationPayload?Longitude=-80.520409&Latitude=43.464256&NumberOfImages=1"
    );
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toEqual(
      "200 OK, Received the request for 1 NumberOfImages at Longitude -80.520409 and Latitude 43.464256"
    );
  });
});

describe("GET /GroundStationPayload", () => {
  it("Test a improper payload request with Ground Station Payload Server Mock should return a 400 Bad Request", async () => {
    const response = await request(server).get("/GroundStationPayload");
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toEqual(
      "Bad request. Longitude, Latitude, and NumberOfImages are required."
    );
  });
});

describe("POST /payloadimage", () => {
  it("should return binary image data with response code 200", async () => {
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

server.close();
