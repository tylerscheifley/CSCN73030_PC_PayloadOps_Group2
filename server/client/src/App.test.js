import "@testing-library/user-event";
import {
  getAllByText,
  queryAllByText,
  render,
  screen,
  fireEvent,
} from "@testing-library/react";
import App from "./App";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils"; // Import act

//The 3d globe cannot be regression tested in this suite as these are too complex to test (they must be tested manually)

//In the test doc we can ignore the imports of these functions for the 3d model as they cannot be understood by the test file and are not used by the test file
//so set every import from drei to not do anything (null)
jest.mock("@react-three/drei", () => {
  return {
    useGLTF: () => null,
    Stage: () => null,
    PresentationControls: () => null,
    OrbitControls: () => null,
  };
});

//In the test doc we can ignore the imports of these functions for the 3d model as they cannot be understood by the test file and are not used by the test file
//so set every import from fiber to not do anything (null)
jest.mock("@react-three/fiber", () => {
  return {
    Canvas: () => null,
  };
});

test("FEB01-Renders Payload Ops Link", () => {
  render(<App />);
  const linkElement = screen.getByText(/payload ops/i);
  expect(linkElement).toBeInTheDocument();
});

test("FEB02-Checking text waiting for satellite Imagery", () => {
  render(<App />);
  render(<h1 style={{ paddingLeft: 30 }}>PC-Payload Ops</h1>);
  const PayloadElement = screen.getByText(/📷 Satellite imagery.../i);
  expect(PayloadElement).toBeInTheDocument();
});

test("FEB03-Checking text waiting for Waterloo Ontario", () => {
  render(<App />);
  render(<h1 style={{ paddingLeft: 30 }}>PC-Payload Ops</h1>);
  const PayloadElement = screen.getByText(/Waterloo Ontario🍁/i);
  expect(PayloadElement).toBeInTheDocument();
});

test("FEB04-Checking text waiting for Submit Text", () => {
  render(<App />);
  render(<h1 style={{ paddingLeft: 30 }}>PC-Payload Ops</h1>);
  const PayloadElement = screen.getByText(/📋Submit a script.../i);
  expect(PayloadElement).toBeInTheDocument();
});

test("FEB05-Checking text waiting for Coordiantes", () => {
  render(<App />);
  render(<h1 style={{ paddingLeft: 30 }}>PC-Payload Ops</h1>);
  const PayloadElement = screen.getByText(/10:22:01-2023-10-18/i);
  expect(PayloadElement).toBeInTheDocument();
});

test("FEB06-Checking text waiting for Time", () => {
  render(<App />);
  render(<h1 style={{ paddingLeft: 30 }}>PC-Payload Ops</h1>);
  const PayloadElement = screen.getByText(/10:22:01-2023-10-18/i);
  expect(PayloadElement).toBeInTheDocument();
});

test("FEB07-Checking text waiting for ID", () => {
  render(<App />);
  render(<h1 style={{ paddingLeft: 30 }}>PC-Payload Ops</h1>);
  const PayloadElement = screen.getByText(/I1/i);
  expect(PayloadElement).toBeInTheDocument();
});

test("button click should trigger getData function", () => {
  // Create a jest mock function
  const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});

  // Render the component
  render(<App />);

  // Get input elements using data-testid
  const latitudeInput = screen.getByTestId("latitude-input");
  const longitudeInput = screen.getByTestId("longitude-input");

  // Simulate user input
  act(() => {
    fireEvent.change(latitudeInput, { target: { value: "41.40338" } });
    fireEvent.change(longitudeInput, { target: { value: "2.17403" } });
  });

  // Get and click the submit button
  const submitButton = screen.getByText("Submit");
  act(() => {
    fireEvent.click(submitButton);
  });

  // You can add assertions based on your specific requirements
  // For example, you might want to check if the alert message is displayed.
  const expectedAlertMessage =
    "You have submitted \nLatitude: 41.40338\nLongitude: 2.17403";
  expect(alertMock).toHaveBeenCalledWith(expectedAlertMessage);

  // Clean up the mock after the test
  alertMock.mockRestore();
});
