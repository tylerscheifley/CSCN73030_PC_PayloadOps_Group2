const request = require("supertest");
const server = require("../server/serverStubFunctions");
const fs = require("fs").promises;

describe("GET /GroundStationPayload", () => {
  it("should return a message and have a length greater than 0", async () => {
    const response = await request(server).get("/GroundStationPayload");
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toEqual("Ground Station Payload");
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
      console.log('Image file has been successfully created');

      
      await fs.access(imagePath, fs.constants.F_OK);
      console.log('File exists');
      imagecreated = true;
    } catch (err) {
      console.error('Error writing or checking image file:', err);
    }

    
    expect(imagecreated).toEqual(true);
  });
});

server.close();
