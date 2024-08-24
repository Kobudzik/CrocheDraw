import React from "react";

function Toolbar({ board }) {
  const handleToolModeChange = (mode) => {
    // Your setToolmode logic
    console.log(`Tool mode changed to: ${mode}`);
  };

  return (
    <div id="toolbar">
      <span className="item" onClick={() => handleToolModeChange(0)} style={{ backgroundColor: "grey" }}>
        <i className="fas fa-pencil-alt"></i>
      </span>
      <span className="item" onClick={() => handleToolModeChange(1)}>
        <i className="fas fa-eraser"></i>
      </span>
      <span className="item" onClick={() => handleToolModeChange(2)}>
        <i className="fas fa-fill"></i>
      </span>
      <span className="item" onClick={() => handleToolModeChange(3)}>
        <i className="fas fa-slash"></i>
      </span>
      <span className="item" onClick={() => handleToolModeChange(4)}>
        <i className="far fa-circle"></i>
      </span>
      <span className="item" onClick={() => handleToolModeChange(5)}>
        <i className="far fa-circle" style={{ transform: "rotateX(45deg)" }}></i>
      </span>
      <span className="item" onClick={() => board.snapshotsManager.addSnapshot(board.data, board.ctx)}>
        <i className="fas fa-plus"></i>
      </span>
      <span className="item" onClick={() => board.undo()}>
        <i className="fas fa-undo"></i>
      </span>
      <span className="item" onClick={() => board.redo()}>
        <i className="fas fa-redo"></i>
      </span>
      <span className="item" onClick={() => board.clearCanvas()}>
        <i className="fas fa-trash"></i>
      </span>
      <span className="item" onClick={() => console.log("Import Image")}>
        <i className="fa fa-upload"></i>
      </span>
      <span className="item" onClick={() => console.log("Open Snapshots Gallery")}>
        <i className="fas fa-eye"></i>
      </span>
    </div>
  );
}

export default Toolbar;
