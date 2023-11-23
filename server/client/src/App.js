import "./App.css";
import React, { useState } from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { Canvas } from "@react-three/fiber";
import {
  useGLTF,
  Stage,
  PresentationControls,
  OrbitControls,
} from "@react-three/drei";

const data = [
  {
    time: "10:22:01-2023-10-18",
    coordinates: "41.40338, 2.17403",
    imageID: "I1",
    status: "Success",
  },
  {
    time: "10:24:11-2023-10-18",
    coordinates: "41.40338, 2.17403",
    imageID: "I2",
    status: "Reject-By-Structure",
  },
  {
    time: "10:34:11-2023-10-18",
    coordinates: "41.40338, 2.17403",
    imageID: "I3",
    status: "Unknown",
  },
  {
    time: "10:34:11-2023-10-18",
    coordinates: "41.40338, 2.17403",
    imageID: "I4",
    status: "Reject-By-Logic",
  },
  {
    time: "10:24:11-2023-10-18",
    coordinates: "41.40338, 2.17403",
    imageID: "I5",
    status: "Success",
  },
  {
    time: "10:34:11-2023-10-18",
    coordinates: "41.40338, 2.17403",
    imageID: "I6",
    status: "Reject-By-Loss",
  },
  {
    time: "10:34:11-2023-10-18",
    coordinates: "41.40338, 2.17403",
    imageID: "I7",
    status: "Success",
  },
];

function Model(props) {
  const { scene } = useGLTF("/source.glb");
  return <primitive object={scene} {...props} />;
}

function App() {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const handleLatitudeChange = (event) => {
    setLatitude(event.target.value);
  };

  const handleLongitudeChange = (event) => {
    setLongitude(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(
      `You have submitted \nLatitude: ${latitude}\nLongitude: ${longitude}`
    );

    //send the data to the server in json
    const data = {
      Latitude: latitude,
      Longitude: longitude,
    };

    fetch("/Request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  };

  const [imagePath, setImagePath] = useState('./defaultNoImage.png');

  const handleImgView = (imgName, imgStatus) => {
    if(imgStatus == "Success")
    {
      setImagePath(imgName + ".jpg");
    }
    else
    {
      setImagePath("./defaultNoImage.png");
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1 style={{ paddingLeft: 30 }}>PC-Payload Ops</h1>
        <p style={{ padding: 30 }}>Waterloo Ontario🍁</p>
      </header>

      <div className="canvas-container">
        <Canvas dpr={[1, 2]} shadows camera={{ fov: 45 }}>
          <color attach="background" args={["#000000"]} />
          <PresentationControls speed={1.5} polar={[-0.1, Math.PI / 4]}>
            <Stage environment={"sunset"}>
              <Model scale={2} />
              <OrbitControls
                autoRotate
                autoRotateSpeed={-1.0}
                enableZoom={false}
              />
            </Stage>
          </PresentationControls>
        </Canvas>
      </div>

      <div className="shape-spacer">
      </div>

      <div className="Table-Spacing">
        <table className="table">
          <thead>
            <tr>
              <th className="imageID">Image ID</th>
              <th className="time">Time</th>
              <th className="coordinates">Coordinates</th>
              <th className="status">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((val, key) => (
              <tr key={key}>
                <td onClick={() => handleImgView(val.imageID, val.status)}>🔎 {val.imageID}</td>
                <td onClick={() => handleImgView(val.imageID, val.status)}>📅 {val.time}</td>
                <td onClick={() => handleImgView(val.imageID, val.status)}>🌍 {val.coordinates}</td>
                <td className="statusContent" onClick={() => handleImgView(val.imageID, val.status)}> <span className={`status status-${val.status}`}>{val.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="ImageDesc">
        <p>📷 Satellite imagery...</p>
      </div>

      <div className="Images">
        <img src={imagePath} className="image" alt="satimg" />
      </div>

      <div className="ImageDesc">
        <p>📋Submit a script...</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            onChange={handleLatitudeChange}
            value={latitude}
            className="textbox"
            type="text"
            data-testid="latitude-input"
            placeholder="Enter latitude"
          />
        </div>

        <div className="input-group">
          <input
            onChange={handleLongitudeChange}
            value={longitude}
            className="textbox"
            type="text"
            data-testid="longitude-input"
            placeholder="Enter longitude"
          />
        </div>

        <div className="buttonLayout">
          <button type="submit" className="submit-btn">
            Submit
          </button>
        </div>
      </form>

      <div className="ImageDesc">
        <p>📄 Request an image from the database...</p>
        <p>Enter the image id below:</p>
      </div>

      <form onSubmit={null}>
        <div className="input-group">
          <input
            onChange={null}
            className="textbox"
            type="text"
            id="request1"
          />
        </div>

        <div className="buttonLayout">
          <button type="submit" className="submit-btn">
            Load Image
          </button>
        </div>
      </form>

      <div className="input-group">
        <br></br>
        <Popup
          trigger={<button type="submit" className="submit-btn">Database Tools</button>}
          modal
          nested
          contentStyle={{ backgroundColor: 'lightblue', padding: '20px' }} 
        >
          {(close) => (
            <div>
              <div className="buttonLayoutCol">
                <h1>Database Tools</h1>
                <Popup
                contentStyle={{ backgroundColor: 'lightblue', padding: '20px' }} 
                trigger={<button type="submit" className="popup-btn">Create</button>} modal nested>
                  {(close) => (
                    <div>
                      <h2>Longitude</h2>
                      <input type="text"></input> <br></br>
                      <h2>Latitude</h2>
                      <input type="text"></input> <br></br>
                      <h2>Image Upload</h2>
                      <input type="file" id="myFile" name="filename"></input>
                      <input type="submit"></input>
                      <button onClick={() => close()}>Close</button>
                    </div>
                  )}
                </Popup>
                <div className="ButtonLayoutRow"> 
                <button button type="submit" className="popup-btn">Read</button>
                <button button type="submit" className="popup-btn">Update</button>
                <button button type="submit" className="popup-btn">Delete</button>
                <button button type="submit" className="popup-btn"onClick={() => close()}>Close</button>
                </div>
              </div>
            </div>
          )}
        </Popup>
      </div>
    </div>
  );
}

export default App;
