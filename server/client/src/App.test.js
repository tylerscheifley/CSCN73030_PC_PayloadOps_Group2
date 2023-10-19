import { getAllByText, queryAllByText, render, screen } from '@testing-library/react';
import App from './App';


test('renders learn react link', () => {
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
  const PayloadElement = getByText(/🍁Waterloo Ontario/i);
  expect(PayloadElement).toBeInTheDocument();
  });

  test("Checking text waiting for Submit Text", () => {
    render(<App />);
    const { getByText } = render(<h1 style={{  paddingLeft: 30}}>PC-Payload Ops</h1>);
    const PayloadElement = getByText(/Submit/i);
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