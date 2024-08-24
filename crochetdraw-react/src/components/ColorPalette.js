import React, { useState, useEffect } from "react";

const ColorPalette = ({ colors, activeColor, onColorChange }) => {
  useEffect(() => {
    // Any additional setup can be done here if needed
  }, []);

  const handleColorClick = (color) => {
    onColorChange(color);
  };

  const handleColorContextMenu = (e, color) => {
    e.preventDefault();
    const alpha = parseFloat(prompt("Transparency (0-1)?", "1"));
    if (!isNaN(alpha) && alpha >= 0 && alpha <= 1) {
      onColorChange([...color.slice(0, 3), Math.round(alpha * 255)]);
    }
  };

  return (
    <div id="palette" style={{ display: "flex", flexWrap: "wrap" }}>
      {colors.map((color, index) => (
        <span
          key={index}
          className="item"
          style={{
            backgroundColor: `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3] / 255})`,
            width: "30px",
            height: "30px",
            display: "inline-block",
            margin: "2px",
            cursor: "pointer",
            boxShadow: activeColor === color ? "rgba(255, 255, 255, 0.5) 0 0 10px 5px" : "",
          }}
          onClick={() => handleColorClick(color)}
          onContextMenu={(e) => handleColorContextMenu(e, color)}
        />
      ))}
    </div>
  );
};

export default ColorPalette;
