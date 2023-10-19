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
    <button >I'm a button</button>
  );
}

function App() {
  return (
    <div className="App">
     
      <header className="App-header">

              <h1 style={{  paddingLeft: 30}}>PC-Payload Ops</h1>
              <p style={{ padding: 30}}>
              🍁Waterloo Ontario
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
      
      <MyButton />

      <div className="Table">
            <table style={{ float: "right"}}>
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
  );
}

export default App;
