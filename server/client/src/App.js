import logo from "./Earth.gif";
import "./App.css";

function MyButton() {
  return (
    <button >I'm a button</button>
  );
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img style={{ float: "right", padding: 20}} src={logo} className="App-logo" alt="logo" width={250} height={250}/>
        <h1 style={{ paddingTop: 80, paddingLeft: 30}}>PC-Payload Ops</h1>
        <p style={{ padding: 30}}>
        🍁Waterloo Ontario
        </p>
        <div>
        <MyButton />
        </div>
      </header>
    </div>
  );
}

export default App;
