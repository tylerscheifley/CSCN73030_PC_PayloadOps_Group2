import logo from "./Earth.gif";
import img from "./satellite.jpg";
import "./App.css";


const data = [
  { time: "10:22:01-2023-10-18", coordinates:  "41.40338, 2.17403", imageID: "I1" },
  { time: "10:24:11-2023-10-18", coordinates: "41.40338, 2.17403", imageID: "I2" },
  { time: "10:34:11-2023-10-18", coordinates: "41.40338, 2.17403", imageID: "I3" },
]

function MyButton() {
  return (
    <button className="Button">I'm a button 1</button>
  );
}

function MyButton1() {
  return (
    <button className="Button">I'm a button 2</button>
  );
}

function MyButton2() {
  return (
    <button className="Button">I'm a button 3</button>
  );
}

function MyButton3() {
  return (
    <button className="Button">I'm a button 4</button>
  );
}

function App() {
  return (
    <div className="App">
     
      <header className="App-header">

        <h1 style={{  paddingLeft: 30}}>PC-Payload Ops</h1>
        <p style={{ padding: 30}}>
        Waterloo Ontario🍁
        </p>
         
      </header>

      <div className="Images">
        
        <img style={{ paddingLeft: 30, paddingRight: 30}} src={img} className="App-logo" alt="satimg" width={800} height={500}/>

        <img style={{ padding: 30}} src={logo} className="App-logo" alt="logo" width={500} height={500}/>

      </div> 

      <div className="ImageDesc">

        <p style={{ padding: 30}}>
        📷 Waiting for satellite imagery...
        </p>
          
      </div>
      
      <div className="HorizontalLayout">

        <div className="ButtonLayoutCol">
          <div className="ButtonLayoutRow">

          <MyButton />
          <MyButton1 />

          </div>
          <div className="ButtonLayoutRow">

          <MyButton2 />
          <MyButton3 />

          </div>
        </div>

        <div className="Table">
            <table>
              <tr>
                  <th>Image ID</th>
                  <th>Time</th>
                  <th>Coordinates</th>
              </tr>
              {data.map((val, key) => {
                  return (
                      <tr key={key}>
                          <td>{val.imageID}</td>
                          <td>{val.time}</td>
                          <td>{val.coordinates}</td>
                      </tr>
                  )
              })}
            </table>
        </div>

      </div>

      <div className="ImageDesc">

        <p style={{ padding: 30}}>
        📋Submit a script...
        </p>
        
      </div>

      <form>
        <div className="input-group">
          <label htmlFor="request">request</label>
          <input className="textbox" type="text" id="request" Insert html/>
          <button type="submit" className="submit-btn">
            Submit
          </button>
        </div>
      </form>

    </div>
  );
}

export default App;
