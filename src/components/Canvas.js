import { AvailableTools, activeTools } from "./Tools.js";
import { bucketFill } from "../helpers/bucketFill.js";

/**
 * The Canvas class represents the drawing canvas within the application.
 *
 * This class manages the canvas setup, event listeners, drawing operations,
 * and other related functionalities like frame management, undo/redo, and image handling.
 */
export class Canvas {
  constructor(width, height) {
    this.canvas = document.querySelector("#canvas");
    this.canvas.style.display = "block";
    this.canvas.style.height = Math.floor((height / width) * this.canvas.clientWidth) + "px";

    this.canvas.width = 10 * width; //width of the canvas drawing area in pixels.
    this.canvas.height = 10 * height;

    this.width = width; //number of grid cells
    this.height = height;

    this.ctx = this.canvas.getContext("2d");
    this.ctx.fillStyle = "white";
    this.ctx.globalAlpha = 1;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.data = [...Array(this.width)].map(() => Array(this.height).fill([255, 255, 255, 255]));

    this.redoStack = [];
    this.undoStack = [];
    this.snapshots = [];
    this.drawLineCoordinates = [];

    this.setupEventListeners();
  }

  /**
   * Sets up event listeners for canvas interaction, including click, mouse move,
   * touch move, and mouse button events.
   */
  setupEventListeners() {
    this.canvas.addEventListener("click", (e) => this.handleClick(e));
    this.canvas.addEventListener("mousemove", (e) => this.handleMouseMove(e));
    this.canvas.addEventListener("touchmove", (e) => this.handleTouchMove(e));
    this.canvas.addEventListener("mousedown", () => (this.active = true));
    this.canvas.addEventListener("mouseup", () => (this.active = false));
  }

  /**
   * Handles click events on the canvas, determining the tool in use and
   * executing the appropriate action (e.g., filling, erasing, drawing shapes).
   */
  handleClick(e) {
    const { clientX, clientY } = e;
    const { left, top } = this.canvas.getBoundingClientRect();
    const { clientWidth, clientHeight } = this.canvas;

    const x = Math.floor((this.width * (clientX - left)) / clientWidth);
    const y = Math.floor((this.height * (clientY - top)) / clientHeight);

    if (activeTools[AvailableTools.fillBucket]) {
      bucketFill(x, y, this.data[x][y]);
    } else if (activeTools[AvailableTools.eraser]) {
      this.erase(x, y);
    } else if (activeTools[AvailableTools.line]) {
      this.drawLine(x, y);
    } else if (activeTools[AvailableTools.circle]) {
      this.drawCircle(x, y);
    } else if (activeTools[AvailableTools.ellipse]) {
      this.drawEllipse(x, y);
    } else {
      this.draw(x, y);
    }
  }

  /**
   * Handles mouse movement events, enabling drawing or erasing based on the active tool
   * when the mouse button is pressed.
   */
  handleMouseMove(e) {
    if (this.active) {
      const rect = this.canvas.getBoundingClientRect();
      let x = e.clientX - rect.left;
      let y = e.clientY - rect.top;
      x = Math.floor((this.width * x) / this.canvas.clientWidth);
      y = Math.floor((this.height * y) / this.canvas.clientHeight);

      if (activeTools[AvailableTools.pen]) {
        this.draw(x, y);
      } else if (activeTools[AvailableTools.eraser]) {
        this.erase(x, y);
      }
    }
  }

  /**
   * Handles touch movement events on touch-enabled devices, enabling drawing or erasing
   * based on the active tool.
   */
  handleTouchMove(e) {
    const { clientX, clientY } = e.touches[0];
    const { left, top } = this.canvas.getBoundingClientRect();
    const { clientWidth, clientHeight } = this.canvas;

    const x = Math.floor((this.width * (clientX - left)) / clientWidth);
    const y = Math.floor((this.height * (clientY - top)) / clientHeight);

    if (activeTools[AvailableTools.pen]) {
      this.draw(x, y);
    } else if (activeTools[AvailableTools.eraser]) {
      this.erase(x, y);
    }
  }

  /**
   * Draws on the canvas at the specified (x, y) coordinates.
   * Tracks the steps taken for undo/redo functionality if applicable.
   */
  draw(x, y, skipTrack = false) {
    if (this.isInBounds(x, y)) {
      this.updateCanvasData(x, y);
      this.renderPixel(x, y);

      if (!skipTrack) {
        this.trackSteps(x, y);
      }
    }
  }

  /**
   * Helper method to check if the coordinates are within canvas bounds.
   */
  isInBounds(x, y) {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  /**
   * Updates the canvas data at the specified coordinates with the current color.
   */
  updateCanvasData(x, y) {
    this.data[x][y] = this.color;
  }

  /**
   * Renders a pixel on the canvas at the specified coordinates.
   */
  renderPixel(x, y) {
    const renderPixelWidth = Math.floor(this.canvas.width / this.width);
    const renderPixelHeight = Math.floor(this.canvas.height / this.height);

    const renderX = Math.floor(x * renderPixelWidth);
    const renderY = Math.floor(y * renderPixelHeight);

    this.ctx.fillRect(renderX, renderY, renderPixelWidth, renderPixelHeight);
  }

  /**
   * Tracks the drawing steps taken, storing them for undo/redo functionality.
   */
  trackSteps(x, y) {
    const currentStep = [x, y, this.color, this.ctx.globalAlpha];
    if (this.redoStack.length === 0 || !this.isLastStepEqual(currentStep)) {
      this.redoStack.push(currentStep);
    }
  }

  /**
   * Compares the current step with the last step in the stack.
   *
   * @param {Array} step - The current step to compare.
   * @returns {boolean} - Returns true if the current step is equal to the last step, false otherwise.
   */
  isLastStepEqual(step) {
    const lastStep = this.redoStack.at(-1);
    return JSON.stringify(lastStep) === JSON.stringify(step);
  }

  /**
   * Draws a line between two points on the canvas.
   */
  drawLine(x, y) {
    this.drawLineCoordinates.push(new Point(x, y));
    if (this.drawLineCoordinates.length === 2) {
      const lp = line(this.drawLineCoordinates[0], this.drawLineCoordinates[1]);
      this.drawLineCoordinates = [];
      lp.forEach((p) => this.draw(p.x, p.y));
    }
  }

  /**
   * Draws a circle on the canvas at the specified coordinates with a specified radius.
   */
  drawCircle(x, y) {
    const centre = new Point(x, y);
    const radius = +prompt("radius?");
    const lp = circle(radius, centre);
    lp.forEach((p) => this.draw(p.x, p.y));
  }

  /**
   * Draws an ellipse on the canvas at the specified coordinates with specified radii.
   */
  drawEllipse(x, y) {
    const center = new Point(x, y);
    const radiusX = +prompt("X radius?");
    const radiusY = +prompt("Y radius?");
    const lp = ellipse(radiusX, radiusY, center);
    lp.forEach((p) => this.draw(p.x, p.y));
  }

  /**
   * Erases a pixel on the canvas by setting it to white.
   */
  erase(x, y) {
    const temp = this.color;
    const tga = this.ctx.globalAlpha;
    this.setcolor([255, 255, 255, 255]);
    this.draw(x, y);
    this.setcolor(temp);
    this.ctx.globalAlpha = tga;
  }

  /**
   * Sets the current drawing color.
   *
   * @param {Array} color - The RGBA color array to set as the current color.
   */
  setcolor(color) {
    this.ctx.globalAlpha = 1;
    this.color = color;
    this.ctx.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},${color[3]})`;
  }

  /**
   * Sets the current tool mode and updates the toolbar UI.
   */
  setmode(i) {
    activeTools.fill(false);
    activeTools[i] = true;

    //diselect all colors from palette
    document.querySelectorAll("#toolbar .item").forEach((x, i) => {
      x.style.backgroundColor = activeTools[i] ? "grey" : "";
    });
  }

  exportAsImage() {
    this.canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = "canvas.png";
      link.href = url;
      link.click();
    });
  }

  clearCanvas() {
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.data = [...Array(this.width)].map(() => Array(this.height).fill([255, 255, 255, 255]));
    this.setcolor(this.color);
    this.setmode(AvailableTools.pen);
  }

  addSnapshot(data = null) {
    const img = new Image();
    img.src = data || this.canvas.toDataURL();
    this.snapshots.push([img, this.data.map((inner) => inner.slice())]);
  }

  deleteSnapshot(f) {
    this.snapshots.splice(f, 1);
  }

  /**
   * Loads a specific frame and redraws it on the canvas.
   *
   * @param {number} f - The index of the frame to load.
   */
  loadSnapshot(f) {
    this.clearCanvas();
    const img = this.snapshots[f][1];
    const tmp_color = this.color;
    const tmp_alpha = this.ctx.globalAlpha;
    this.ctx.globalAlpha = 1;

    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        this.setcolor(img[i][j]);
        this.draw(i, j);
      }
    }

    this.setcolor(tmp_color);
    this.ctx.globalAlpha = tmp_alpha;
  }

  /**
   * Renders a GIF from the snapshots stored in the canvas.
   */
  renderGIF() {
    this.snapshots.forEach((frame) => {
      gif.addSnapshot(frame[0], {
        copy: true,
        delay: 100,
      });
    });
    gif.render();
  }

  undo() {
    this.clearCanvas();

    this.undoStack.push(this.redoStack.pop());

    this.redoStack.forEach((step) => {
      this.setcolor(step[2]);
      this.ctx.globalAlpha = step[3];
      this.draw(step[0], step[1], true);
    });
  }

  redo() {
    this.redoStack.push(this.undoStack.pop());

    this.redoStack.forEach((step) => {
      this.setcolor(step[2]);
      this.ctx.globalAlpha = step[3];

      this.draw(step[0], step[1], true);
    });
  }

  /**
   * Saves the current canvas state in local storage for later retrieval.
   */
  saveInLocal() {
    const currentData = {
      colors: window.colors,
      currColor: this.color,
      width: this.width,
      height: this.height,
      url: this.canvas.toDataURL(),
      steps: this.redoStack,
      redo_arr: this.undoStack,
      dim: window.dim,
    };
    localStorage.setItem("pc-canvas-data", JSON.stringify(currentData));
  }

  //#region import image
  importImage() {
    const inputFile = document.createElement("input");
    inputFile.type = "file";
    inputFile.accept = "image/*";

    inputFile.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file) {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);

        fileReader.onload = () => {
          this.processImage(fileReader.result);
        };
      }
    });

    inputFile.click();
  }

  processImage(imageDataURL) {
    const image = new Image();
    image.src = imageDataURL;

    image.onload = () => {
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = this.canvas.width;
      tempCanvas.height = this.canvas.height;
      const tempCtx = tempCanvas.getContext("2d");
      tempCtx.drawImage(image, 0, 0, this.canvas.width, this.canvas.height);

      this.updateCanvasWithImage(tempCtx);
    };
  }

  updateCanvasWithImage(ctx) {
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        const pixelData = ctx.getImageData(10 * i, 10 * j, 10, 10).data;
        const avgColor = this.calculateAverageColor(pixelData);

        this.setcolor(avgColor);
        this.draw(i, j);
      }
    }
  }

  calculateAverageColor(pixelData) {
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
  //#endregion import
}
