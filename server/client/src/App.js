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
        <img src={logo} className="App-logo" alt="logo" width={250} height={250}/>
        <title>
          PC-Payload Ops
        </title> 
        <p>
          Application Name
        </p>
        <div>
        <h1>Welcome to my app</h1>
        <MyButton />
        </div>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    
    </div>
  );
}

export default App;
