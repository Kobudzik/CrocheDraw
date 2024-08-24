import { Canvas } from "../components/Canvas.js";
import { initColors } from "../components/Colors.js";

/**
 * Highlights the selected color in the palette by applying a box shadow effect.
 */
export function markActiveColor(htmlElement) {
  document.querySelectorAll("#palette .item").forEach((x) => (x.style.boxShadow = ""));
  htmlElement.style.boxShadow = "10px 10px 10px 10px rgba(0,0,0,0.5)";
}

export function newProject() {
  document.querySelector(".menu").style.display = "none";

  localStorage.removeItem("pc-canvas-data");

  document.querySelector("#newProjectPopup").style.display = "block";
  initColors();
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
