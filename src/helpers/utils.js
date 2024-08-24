import { Canvas } from "../components/Canvas.js";

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

  document.querySelector("#newProjectPopup").style.display = "block";

  window.colors = [
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
}

export function loadProject(canvasData) {
  const data = JSON.parse(canvasData);

  window.colors = data.colors;

  window.board = new Canvas(data.width, data.height);
  window.board.steps = data.steps;
  window.board.redo_arr = data.redo_arr;
  window.board.setcolor(data.currColor);

  const img = new Image();
  img.setAttribute("src", data.url);
  img.addEventListener("load", function () {
    window.board.ctx.drawImage(img, 0, 0);
  });
}

export function calculateAverageColor(pixelData) {
  let count = 0;
  const avgColor = [0, 0, 0, 0];

  for (let i = 0; i < pixelData.length; i += 4) {
    for (let j = 0; j < 4; j++) {
      avgColor[j] += pixelData[i + j];
    }
    count++;
  }

  return avgColor.map((value) => Math.floor(value / count));
}

export function exportAsImage(htmlCanvas) {
  htmlCanvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "canvas.png";
    link.href = url;
    link.click();
  });
}

/**
 * Saves the current canvas state in local storage for later retrieval.
 */
export function saveInLocal(canvasObject) {
  const currentData = {
    colors: window.colors,
    currColor: canvasObject.color,
    width: canvasObject.width,
    height: canvasObject.height,
    url: canvasObject.canvas.toDataURL(),
    steps: canvasObject.redoStack,
    redo_arr: canvasObject.undoStack,
    dim: window.dim,
  };
  localStorage.setItem("pc-canvas-data", JSON.stringify(currentData));
}
