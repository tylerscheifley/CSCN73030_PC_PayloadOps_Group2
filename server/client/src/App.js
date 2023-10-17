import logo from "./Earth.gif";
import "./App.css";

function MyButton() {
  return (
    <button>I'm a button</button>
  );
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img style={{ float: "right"}} src={logo} className="App-logo" alt="logo" width={250} height={250}/>
        <h1>PC-Payload Ops</h1>
        <p>
          Application Name Here
        </p>
        <div>
        <MyButton />
        </div>
      </header>
    </div>
  );
}

export default App;
