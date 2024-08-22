import { Canvas } from "./components/Canvas.js";
import { newProject, loadProject, initWindowGIF } from "./helpers/utils.js";

window.onload = function () {
  let canvasData = localStorage.getItem("pc-canvas-data");
  if (canvasData) {
    loadProject(canvasData);
  } else {
    newProject();
  }

  renderColors();

  document.querySelector("#palette").addEventListener("contextmenu", (e) => e.preventDefault());
};

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

  document.querySelector("#newProjectPopup").style.display = "none";

  initWindowGIF();
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
