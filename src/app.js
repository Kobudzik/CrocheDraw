import { Canvas } from "./components/Canvas.js";
import { Popup } from "./components/Popup.js";

window.onload = function () {
  let canvasData = localStorage.getItem("pc-canvas-data");
  if (canvasData) {
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
  } else {
    newProject();
  }

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

  document.querySelector("#palette").addEventListener("contextmenu", (e) => e.preventDefault());
};

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
