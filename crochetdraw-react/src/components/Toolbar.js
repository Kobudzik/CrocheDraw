import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faEraser, faFill, faSlash, faPlus, faUndo, faRedo, faTrash, faUpload, faEye } from "@fortawesome/free-solid-svg-icons";
import { faCircle } from "@fortawesome/free-regular-svg-icons";

function Toolbar({ board }) {
  const handleToolModeChange = (mode) => {
    console.log(`Tool mode changed to: ${mode}`);
  };

  return (
    <div id="toolbar">
      <span className="item" onClick={() => handleToolModeChange(0)} style={{ backgroundColor: "grey" }}>
        <FontAwesomeIcon icon={faPencilAlt} />
      </span>
      <span className="item" onClick={() => handleToolModeChange(1)}>
        <FontAwesomeIcon icon={faEraser} />
      </span>
      <span className="item" onClick={() => handleToolModeChange(2)}>
        <FontAwesomeIcon icon={faFill} />
      </span>
      <span className="item" onClick={() => handleToolModeChange(3)}>
        <FontAwesomeIcon icon={faSlash} />
      </span>
      <span className="item" onClick={() => handleToolModeChange(4)}>
        <FontAwesomeIcon icon={faCircle} />
      </span>
      <span className="item" onClick={() => handleToolModeChange(5)}>
        <FontAwesomeIcon icon={faCircle} style={{ transform: "rotateX(45deg)" }} />
      </span>
      <span className="item" onClick={() => board.snapshotsManager.addSnapshot(board.data, board.ctx)}>
        <FontAwesomeIcon icon={faPlus} />
      </span>
      <span className="item" onClick={() => board.undo()}>
        <FontAwesomeIcon icon={faUndo} />
      </span>
      <span className="item" onClick={() => board.redo()}>
        <FontAwesomeIcon icon={faRedo} />
      </span>
      <span className="item" onClick={() => board.clearCanvas()}>
        <FontAwesomeIcon icon={faTrash} />
      </span>
      <span className="item" onClick={() => console.log("Import Image")}>
        <FontAwesomeIcon icon={faUpload} />
      </span>
      <span className="item" onClick={() => console.log("Open Snapshots Gallery")}>
        <FontAwesomeIcon icon={faEye} />
      </span>
    </div>
  );
}

export default Toolbar;
