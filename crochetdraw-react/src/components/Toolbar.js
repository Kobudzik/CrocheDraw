import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faEraser, faFill, faSlash, faPlus, faUndo, faRedo, faTrash, faUpload, faEye } from "@fortawesome/free-solid-svg-icons";
import { faCircle } from "@fortawesome/free-regular-svg-icons";
import { AvailableTools } from "../utils/Tools";

const tools = [
  { icon: faPencilAlt, toolIndex: 0, action: AvailableTools.pen },
  { icon: faEraser, toolIndex: 1, action: AvailableTools.eraser },
  { icon: faFill, toolIndex: 2, action: AvailableTools.fillBucket },
  { icon: faSlash, toolIndex: 3, action: AvailableTools.line },
  { icon: faCircle, toolIndex: 4, action: AvailableTools.circle },
  { icon: faCircle, toolIndex: 5, action: AvailableTools.ellipse, style: { transform: "rotateX(45deg)" } },
  { icon: faPlus, toolIndex: 6 }, //save snapshot
  { icon: faUndo, toolIndex: 7 }, //undo
  { icon: faRedo, toolIndex: 8 }, //redo
  { icon: faTrash, toolIndex: 9 }, //clear
  { icon: faUpload, toolIndex: 10 }, //upload
  { icon: faEye, toolIndex: 11 }, //view snaphsots
];

function Toolbar({ activeTools, setActiveTools }) {
  const handleToolModeChange = (toolIndex) => {
    const updatedState = activeTools.map((_, index) => index === toolIndex);
    setActiveTools(updatedState);
  };

  return (
    <div id="toolbar">
      {tools.map((tool) => (
        <span key={tool.toolIndex} className="item" onClick={() => handleToolModeChange(tool.toolIndex)} style={{ backgroundColor: activeTools[tool.toolIndex] ? "gray" : "" }}>
          <FontAwesomeIcon icon={tool.icon} />
        </span>
      ))}
    </div>
  );
}

export default Toolbar;
