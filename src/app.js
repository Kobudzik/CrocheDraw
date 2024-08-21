import { Canvas } from "./components/Canvas.js";
import { newProject } from "./helpers/utils.js";

window.onload = function () {
  let canvasData = localStorage.getItem("pc-canvas-data");
  if (canvasData) {
    loadProject(canvasData);
  } else {
    newProject();
  }

  renderColors();

  document.querySelector("#palette").addEventListener("contextmenu", (e) => e.preventDefault());

  doGrid();
};

function doGrid() {
  alert("doing grid");
  // Select the canvas element and get the drawing context
  const canvas = document.getElementById("canvas2");
  const ctx = canvas.getContext("2d");

  // Set the grid size
  const gridSize = 10 * 2; // The size of each grid cell

  // Function to draw the grid
  function drawGrid() {
    // Clear the canvas before drawing the grid
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#gray"; // Color of the grid lines
    ctx.lineWidth = 1; // Thickness of the grid lines

    // Draw vertical lines
    for (let x = 0; x <= canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    // Draw horizontal lines
    for (let y = 0; y <= canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  }

  // Call the function to draw the grid
  drawGrid();
}

function loadProject(canvasData) {
  const data = JSON.parse(canvasData);

  window.colors = data.colors;
  window.board = new Canvas(data.width, data.height);

  const img = new Image();
  img.setAttribute("src", data.url);
  img.addEventListener("load", function () {
    window.board.ctx.drawImage(img, 0, 0);
  });

  window.board.steps = data.steps;
  window.board.redo_arr = data.redo_arr;
  window.board.setcolor(data.currColor);

  window.gif = new GIF({
    workers: 2,
    quality: 10,
    width: 10 * window.board.width,
    height: 10 * window.board.height,
  });

  window.gif.on("finished", function (blob) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "canvas.gif";
    link.href = url;
    link.click();
  });
}

function renderColors() {
  document.querySelector("#palette").innerHTML = colors
    .map(
      (x) => `
      <span
        class="item" style="background-color: rgb(${x[0]},${x[1]},${x[2]})" 
        onclick="board.setcolor([${x}]);setActiveColor(this);"
        oncontextmenu="board.setcolor([${x}]);setActiveColor(this);board.ctx.globalAlpha=+prompt('Transparency(0-1)?')"
      >
      </span>`
    )
    .join("\n");
}

document.querySelector("#close").onclick = function () {
  const width = +document.querySelector("#width").value;
  const height = +document.querySelector("#height").value;
  window.board = new Canvas(width, height);
  window.board.setcolor([0, 0, 0, 255]);
  window.dim.close();
  window.gif = new GIF({
    workers: 2,
    quality: 10,
    width: 10 * window.board.width,
    height: 10 * window.board.height,
  });

  window.gif.on("finished", function (blob) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "canvas.gif";
    link.href = url;
    link.click();
  });
};

document.querySelector(".menubtn").onclick = function () {
  document.querySelector(".menu").style.display = document.querySelector(".menu").style.display !== "block" ? "block" : "none";
};

window.onbeforeunload = function () {
  board.saveInLocal();
  return "Data will be lost if you leave the page, are you sure?";
};

window.onerror = function (errorMsg, url, lineNumber) {
  alert("Error: " + errorMsg + " Script: " + url + " Line: " + lineNumber);
};

//#region serviceWorker
function install() {
  msg.prompt();
}

const scope = {
  scope: "./",
};

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("sw.js", scope)
    .then(function (serviceWorker) {
      console.log("serviceWorker init successful");
    })
    .catch(function (error) {
      alert(error);
    });
} else {
  console.log("serviceWorker unavailable");
}

let msg;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  msg = e;
});
//#endregion
