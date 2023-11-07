import img from "./satellite.jpg";
import "./App.css";
import React from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, Stage, PresentationControls, OrbitControls } from "@react-three/drei";

const data = [
  { time: "10:22:01-2023-10-18", coordinates:  "41.40338, 2.17403", imageID: "I1" },
  { time: "10:24:11-2023-10-18", coordinates: "41.40338, 2.17403", imageID: "I2" },
  { time: "10:34:11-2023-10-18", coordinates: "41.40338, 2.17403", imageID: "I3" },
]

function Model(props) {
  const { scene } = useGLTF("/source.glb");
  return <primitive object={scene} {...props} />
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

      <div className="canvas-container">
          <Canvas dpr={[1, 2]} shadows camera={{ fov: 45 }}>
            <color attach="background" args={["#000000"]} />
            <PresentationControls speed={1.5} polar={[-0.1, Math.PI / 4]}>
              <Stage environment={"sunset"}>
                <Model scale={2} />
                <OrbitControls autoRotate autoRotateSpeed={1.0} enableZoom={false} />
              </Stage>
            </PresentationControls>
          </Canvas>
        </div>

      <div className="Table-Spacing">
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

      <p>
      📷 Waiting for satellite imagery...
      </p>
        
      </div>

      <div className="Images">

      <img src={img} className="App-logo" alt="satimg"/>

      </div> 

      <div className="ImageDesc">

        <p>
        📋Submit a script...
        </p>
        
      </div>

      <form>
        <div className="input-group">
          <input className="textbox" type="text" id="request" Insert html/>
        </div>
      </form>

      <form>
        <div className="input-group">
          <input className="textbox" type="text" id="request" Insert html/>
        </div>
      </form>

      <div className="buttonLayout">
          <button type="submit" className="submit-btn">
            Submit
          </button>
      </div>

    </div>

  );
}

export default App;
