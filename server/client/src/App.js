import img from "./satellite.jpg";
import "./App.css";
import React from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, Stage, PresentationControls } from "@react-three/drei";
import { OrbitControls } from '@react-three/drei';

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
            <PresentationControls speed={1.5} global zoom={0.5} polar={[-0.1, Math.PI / 4]}>
              <Stage environment={"sunset"}>
                <Model scale={0.01} />
                <OrbitControls autoRotate autoRotateSpeed={1.0} enableZoom={false} />
              </Stage>
            </PresentationControls>
          </Canvas>
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
        📷 Waiting for satellite imagery...
        </p>
          
      </div>

      <div className="Images">
        
        <img style={{ paddingLeft: 30, paddingTop: 30}} src={img} className="App-logo" alt="satimg" width={700} height={400}/>
        
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
