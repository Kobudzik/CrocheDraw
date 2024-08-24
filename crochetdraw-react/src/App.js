import React, { useState, useEffect } from "react";
import Menu from "./components/Menu";
import Canvas from "./components/Canvas";
import NewProjectPopup from "./components/NewProjectPopup";
import SnapshotsGallery from "./components/SnapshotsGallery";
import Toolbar from "./components/Toolbar";
import "./style.css";

function App() {
  const [showNewProjectPopup, setShowNewProjectPopup] = useState(false);
  const [showSnapshots, setShowSnapshots] = useState(false);

  useEffect(() => {
    // Set up initializations and similar effects here
  }, []);

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
      <Canvas />
      <Toolbar />
      <div id="palette"></div>
    </div>
  );
}

export default App;
