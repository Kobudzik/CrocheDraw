import React, { useState, useEffect } from "react";

// Initial color palette
const initialColors = [
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

const ColorPalette = ({ onColorChange }) => {
  const [colors, setColors] = useState(initialColors);

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
          }}
          onClick={() => handleColorClick(color)}
          onContextMenu={(e) => handleColorContextMenu(e, color)}
        />
      ))}
    </div>
  );
};

export default ColorPalette;
