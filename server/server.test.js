const request = require("supertest");
const server = require("../server/serverStubFunctions");

describe("GET /GroundStationPayload", () => {
  it("should return a message and have a length greater than 0", async () => {
    const response = await request(server).get("/GroundStationPayload");
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toEqual("Ground Station Payload");
  });
});

server.close();
