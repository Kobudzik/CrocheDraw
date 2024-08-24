import React, { useState, useEffect } from "react";
import Menu from "./components/Menu";
import Canvas from "./components/Canvas";
import NewProjectPopup from "./components/NewProjectPopup";
import SnapshotsGallery from "./components/SnapshotsGallery";
import Toolbar from "./components/Toolbar";
import "./style.css";
import ColorPalette from "./components/ColorPalette";

function App() {
  const [showNewProjectPopup, setShowNewProjectPopup] = useState(false);
  const [showSnapshots, setShowSnapshots] = useState(false);
  const [activeTools, setActiveTools] = useState([true, false, false, false, false, false]);
  const [availableColors, setAvailableColors] = useState([]);

  useEffect(() => {
    initColors();
  }, []);

  const initColors = () => {
    let defaultColors = [
      [0, 0, 0, 255], // Black
      [255, 255, 255, 255], // White
      [127, 127, 127, 255], // Grey
      [195, 195, 195, 255], // Light Grey
      [136, 0, 21, 255], // Dark Red
      [237, 28, 36, 255], // Red
      [255, 127, 39, 255], // Orange
      [255, 242, 0, 255], // Yellow
      [239, 228, 176, 255], // Pale Yellow
      [34, 177, 36, 255], // Green
      [181, 230, 29, 255], // Lime Green
      [0, 162, 232, 255], // Blue
      [63, 72, 204, 255], // Dark Blue
      [153, 217, 234, 255], // Light Blue
      [112, 146, 190, 255], // Steel Blue
      [163, 73, 164, 255], // Purple
      [185, 122, 87, 255], // Brown
      [255, 174, 201, 255], // Light Pink
      [255, 201, 14, 255], // Gold
      [200, 191, 231, 255], // Lavender
    ];

    setAvailableColors(defaultColors);
  };

  const handleNewProject = () => {
    // Your newProject logic
    console.log("New project created");
  };

  const handleExportAsImage = () => {
    // Your exportAsImage logic
    console.log("Export as image");
  };

  const handleInstall = () => {
    // Your PWA install logic
    console.log("Install PWA");
  };

  return (
    <div className="App">
      <Menu onNewProject={handleNewProject} onExportAsImage={handleExportAsImage} onInstall={handleInstall} />
      {showNewProjectPopup && <NewProjectPopup onClose={() => setShowNewProjectPopup(false)} />}
      {showSnapshots && <SnapshotsGallery onClose={() => setShowSnapshots(false)} />}
      <Canvas activeTools={activeTools} />
      <Toolbar />
      <ColorPalette colors={availableColors} />
      <div id="palette"></div>
    </div>
  );
}

export default App;
