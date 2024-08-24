import React from "react";

function SnapshotsGallery({ onClose }) {
  return (
    <div id="snapshots" onBlur={onClose} tabIndex="0">
      <p>Left click to select, right click to remove.</p>
      <div className="btn" style={{ left: "10px" }} onClick={() => {}}>
        <i className="fa fa-chevron-left"></i>
      </div>
      <div className="btn" style={{ right: "10px" }} onClick={() => {}}>
        <i className="fa fa-chevron-right"></i>
      </div>
      <div id="gallery"></div>
    </div>
  );
}

export default SnapshotsGallery;
