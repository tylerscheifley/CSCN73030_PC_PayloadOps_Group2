import { getAllByText, queryAllByText, render, screen } from '@testing-library/react';
import App from './App';

//The 3d globe cannot be regression tested in this suite as these are too complex to test (they must be tested manually)

//In the test doc we can ignore the imports of these functions for the 3d model as they cannot be understood by the test file and are not used by the test file
//so set every import from drei to not do anything (null)
jest.mock('@react-three/drei', () => {
  return {
    useGLTF:() => null,
    Stage:() => null,
    PresentationControls:() => null,
    OrbitControls:() => null,
  };
});

//In the test doc we can ignore the imports of these functions for the 3d model as they cannot be understood by the test file and are not used by the test file
//so set every import from fiber to not do anything (null)
jest.mock('@react-three/fiber', () => {
  return {
    Canvas:() => null,
  };
});

test('Renders Payload Ops Link', () => {
  render(<App />);
  const linkElement = screen.getByText(/payload ops/i);
  expect(linkElement).toBeInTheDocument();
});

test("Checking text waiting for satellite Imagery", () => {
render(<App />);
const { getByText } = render(<h1 style={{  paddingLeft: 30}}>PC-Payload Ops</h1>);
const PayloadElement = getByText(/📷 Waiting for satellite imagery.../i);
expect(PayloadElement).toBeInTheDocument();
});

test("Checking text waiting for Waterloo Ontario", () => {
  render(<App />);
  const { getByText } = render(<h1 style={{  paddingLeft: 30}}>PC-Payload Ops</h1>);
  const PayloadElement = getByText(/Waterloo Ontario🍁/i);
  expect(PayloadElement).toBeInTheDocument();
  });

test("Checking text waiting for Submit Text", () => {
  render(<App />);
  const { getByText } = render(<h1 style={{  paddingLeft: 30}}>PC-Payload Ops</h1>);
  const PayloadElement = getByText(/📋Submit a script.../i);
  expect(PayloadElement).toBeInTheDocument();
  });

test("Checking text waiting for Coordiantes", () => {
  render(<App />);
  const { getByText } = render(<h1 style={{  paddingLeft: 30}}>PC-Payload Ops</h1>);
  const PayloadElement = getByText(/10:22:01-2023-10-18/i);
  expect(PayloadElement).toBeInTheDocument();
  });

test("Checking text waiting for Time", () => {
  render(<App />);
  const { getByText } = render(<h1 style={{  paddingLeft: 30}}>PC-Payload Ops</h1>);
  const PayloadElement = getByText(/10:22:01-2023-10-18/i);
  expect(PayloadElement).toBeInTheDocument();
  });

test("Checking text waiting for ID", () => {
  render(<App />);
  const { getByText } = render(<h1 style={{  paddingLeft: 30}}>PC-Payload Ops</h1>);
  const PayloadElement = getByText(/I1/i);
  expect(PayloadElement).toBeInTheDocument();
  });
