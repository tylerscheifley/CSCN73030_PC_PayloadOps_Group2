import { render, screen } from "@testing-library/react";
import App from "./App";

test("FEB01-Renders Payload Ops Link", () => {
  render(<App />);
  const linkElement = screen.getByText(/payload ops/i);
  expect(linkElement).toBeInTheDocument();
});

test("FEB02-Checking text waiting for satellite Imagery", () => {
  render(<App />);
  render(<h1 style={{ paddingLeft: 30 }}>PC-Payload Ops</h1>);
  const PayloadElement = screen.getByText(
    /📷 Waiting for satellite imagery.../i
  );
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
