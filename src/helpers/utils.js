import { Popup } from "../components/Popup.js";

/**
 * Highlights the selected color in the palette by applying a box shadow effect.
 */
export function setActiveColor(htmlElement) {
  document.querySelectorAll("#palette .item").forEach((x) => (x.style.boxShadow = ""));
  htmlElement.style.boxShadow = "10px 10px 10px 10px rgba(0,0,0,0.5)";
}

export function newProject() {
  document.querySelector(".menu").style.display = "none";
  localStorage.removeItem("pc-canvas-data");

  window.dim = new Popup("#popup");

  window.colors = [
    [0, 0, 0, 255], // Black
    [127, 127, 127, 255], // Grey
    [136, 0, 21, 255], // Dark Red
    [237, 28, 36, 255], // Red
    [255, 127, 39, 255], // Orange
    [255, 242, 0, 255], // Yellow
    [34, 177, 36, 255], // Green
    [0, 162, 232, 255], // Blue
    [63, 72, 204, 255], // Dark Blue
    [163, 73, 164, 255], // Purple
    [255, 255, 255, 255], // White
    [195, 195, 195, 255], // Light Grey
    [185, 122, 87, 255], // Brown
    [255, 174, 201, 255], // Light Pink
    [255, 201, 14, 255], // Gold
    [239, 228, 176, 255], // Pale Yellow
    [181, 230, 29, 255], // Lime Green
    [153, 217, 234, 255], // Light Blue
    [112, 146, 190, 255], // Steel Blue
    [200, 191, 231, 255], // Lavender
  ];
}
