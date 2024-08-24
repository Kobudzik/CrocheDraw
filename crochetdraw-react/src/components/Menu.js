import React from "react";

function Menu({ onNewProject, onExportAsImage, onInstall }) {
  return (
    <div>
      <div className="menubtn">☰</div>
      <ul className="menu">
        <li onClick={onNewProject}>New</li>
        <li onClick={onExportAsImage}>Export image</li>
        <li onClick={onInstall}>Install PWA</li>
      </ul>
    </div>
  );
}

export default Menu;
