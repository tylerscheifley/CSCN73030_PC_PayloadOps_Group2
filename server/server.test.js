const request = require("supertest");
const server = require("../server/serverMockFunctions");

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

server.close();
