import React, { useState } from "react";

function NewProjectPopup({ onClose }) {
  const [width, setWidth] = useState(16);
  const [height, setHeight] = useState(16);

  const handleConfirm = () => {
    console.log(`New project dimensions: ${width}x${height}`);
    onClose();
  };

  return (
    <div id="newProjectPopup">
      <h3>Select the Dimensions Of the grid</h3>
      <input type="text" id="width" value={width} onChange={(e) => setWidth(e.target.value)} />
      X
      <input type="text" id="height" value={height} onChange={(e) => setHeight(e.target.value)} />
      <button id="close" onClick={handleConfirm}>
        OK
      </button>
    </div>
  );
}

export default NewProjectPopup;
