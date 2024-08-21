import { Tool, activeTools } from "./Tool.js";
import { filler } from "../helpers/filler.js";

/**
 * The Canvas class represents the drawing canvas within the application.
 *
 * This class manages the canvas setup, event listeners, drawing operations,
 * and other related functionalities like frame management, undo/redo, and image handling.
 */
export class Canvas {
  constructor(width, height) {
    this.canvas = document.querySelector("#canvas");
    this.canvas.width = 10 * width;
    this.canvas.height = 10 * height;
    this.width = width;
    this.height = height;
    this.canvas.style.display = "block";
    this.canvas.style.height = Math.floor((height / width) * this.canvas.clientWidth) + "px";
    this.w = +this.canvas.width;
    this.h = +this.canvas.height;
    this.ctx = this.canvas.getContext("2d");
    this.ctx.fillStyle = "white";
    this.ctx.globalAlpha = 1;
    this.ctx.fillRect(0, 0, this.w, this.h);
    this.data = [...Array(this.width)].map(() => Array(this.height).fill([255, 255, 255, 255]));
    this.steps = [];
    this.redo_arr = [];
    this.snapshots = [];
    this.setupEventListeners();
    this.lc = [];
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
    const rect = this.canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    x = Math.floor((this.width * x) / this.canvas.clientWidth);
    y = Math.floor((this.height * y) / this.canvas.clientHeight);

    if (activeTools[Tool.fillBucket]) {
      filler(x, y, this.data[x][y]);
    } else if (activeTools[Tool.eraser]) {
      this.erase(x, y);
    } else if (activeTools[Tool.line]) {
      this.drawLine(x, y);
    } else if (activeTools[Tool.circle]) {
      this.drawCircle(x, y);
    } else if (activeTools[Tool.ellipse]) {
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

      if (activeTools[Tool.pen]) {
        this.draw(x, y);
      } else if (activeTools[Tool.eraser]) {
        this.erase(x, y);
      }
    }
  }

  /**
   * Handles touch movement events on touch-enabled devices, enabling drawing or erasing
   * based on the active tool.
   */
  handleTouchMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    let x = e.touches[0].clientX - rect.left;
    let y = e.touches[0].clientY - rect.top;
    x = Math.floor((this.width * x) / this.canvas.clientWidth);
    y = Math.floor((this.height * y) / this.canvas.clientHeight);

    if (activeTools[Tool.pen]) {
      this.draw(x, y);
    } else if (activeTools[Tool.eraser]) {
      this.erase(x, y);
    }
  }

  /**
   * Draws on the canvas at the specified (x, y) coordinates.
   * Tracks the steps taken for undo/redo functionality if applicable.
   *
   * @param {number} x - The x-coordinate on the canvas.
   * @param {number} y - The y-coordinate on the canvas.
   * @param {boolean} [count=false] - Flag indicating whether to track the step or not.
   */
  draw(x, y, count = false) {
    if (this.isInBounds(x, y)) {
      this.updateCanvasData(x, y);
      this.renderPixel(x, y);

      if (!count) {
        this.trackSteps(x, y);
      }
    }
  }

  /**
   * Helper method to check if the coordinates are within canvas bounds.
   *
   * @param {number} x - The x-coordinate to check.
   * @param {number} y - The y-coordinate to check.
   * @returns {boolean} - Returns true if the coordinates are within bounds, false otherwise.
   */
  isInBounds(x, y) {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  /**
   * Updates the canvas data at the specified coordinates with the current color.
   *
   * @param {number} x - The x-coordinate on the canvas.
   * @param {number} y - The y-coordinate on the canvas.
   */
  updateCanvasData(x, y) {
    this.data[x][y] = this.color;
  }

  /**
   * Renders a pixel on the canvas at the specified coordinates.
   *
   * @param {number} x - The x-coordinate on the canvas.
   * @param {number} y - The y-coordinate on the canvas.
   */
  renderPixel(x, y) {
    const pixelWidth = Math.floor(this.w / this.width);
    const pixelHeight = Math.floor(this.h / this.height);
    this.ctx.fillRect(Math.floor(x * pixelWidth), Math.floor(y * pixelHeight), pixelWidth, pixelHeight);
  }

  /**
   * Tracks the drawing steps taken, storing them for undo/redo functionality.
   *
   * @param {number} x - The x-coordinate on the canvas.
   * @param {number} y - The y-coordinate on the canvas.
   */
  trackSteps(x, y) {
    const currentStep = [x, y, this.color, this.ctx.globalAlpha];
    if (this.steps.length === 0 || !this.isLastStepEqual(currentStep)) {
      this.steps.push(currentStep);
    }
  }

  /**
   * Compares the current step with the last step in the stack.
   *
   * @param {Array} step - The current step to compare.
   * @returns {boolean} - Returns true if the current step is equal to the last step, false otherwise.
   */
  isLastStepEqual(step) {
    const lastStep = this.steps[this.steps.length - 1];
    return JSON.stringify(lastStep) === JSON.stringify(step);
  }

  /**
   * Erases a pixel on the canvas by setting it to white.
   *
   * @param {number} x - The x-coordinate on the canvas.
   * @param {number} y - The y-coordinate on the canvas.
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
   *
   * @param {number} i - The tool index to activate.
   */
  setmode(i) {
    activeTools.fill(false);
    activeTools[i] = true;
    document.querySelectorAll("#toolbar .item").forEach((x, i) => {
      x.style.backgroundColor = activeTools[i] ? "grey" : "";
    });
  }

  /**
   * Saves the current canvas as an image file.
   */
  save() {
    this.canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = "canvas.png";
      link.href = url;
      link.click();
    });
  }

  /**
   * Clears the canvas, resetting it to a white background.
   */
  clear() {
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(0, 0, this.w, this.h);
    this.data = [...Array(this.width)].map(() => Array(this.height).fill([255, 255, 255, 255]));
    this.setcolor(this.color);
    this.setmode(Tool.pen);
  }

  /**
   * Adds the current frame to the list of snapshots, storing its data.
   *
   * @param {string} [data=null] - Optional image data URL to store.
   */
  addFrame(data = null) {
    const img = new Image();
    img.src = data || this.canvas.toDataURL();
    this.snapshots.push([img, this.data.map((inner) => inner.slice())]);
  }

  /**
   * Deletes a frame from the list of snapshots.
   *
   * @param {number} f - The index of the frame to delete.
   */
  deleteFrame(f) {
    this.snapshots.splice(f, 1);
  }

  /**
   * Loads a specific frame and redraws it on the canvas.
   *
   * @param {number} f - The index of the frame to load.
   */
  loadFrame(f) {
    this.clear();
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
      gif.addFrame(frame[0], {
        copy: true,
        delay: 100,
      });
    });
    gif.render();
  }

  /**
   * Undoes the last drawing action by restoring the previous state.
   */
  undo() {
    this.clear();
    this.redo_arr.push(this.steps.pop());
    this.steps.forEach((step) => {
      this.setcolor(step[2]);
      this.ctx.globalAlpha = step[3];
      this.draw(step[0], step[1], true);
    });
  }

  /**
   * Redoes the last undone drawing action.
   */
  redo() {
    this.steps.push(this.redo_arr.pop());
    this.steps.forEach((step) => {
      this.setcolor(step[2]);
      this.ctx.globalAlpha = step[3];
      this.draw(step[0], step[1], true);
    });
  }

  /**
   * Saves the current canvas state in local storage for later retrieval.
   */
  saveInLocal() {
    const d = {
      colors: window.colors,
      currColor: this.color,
      width: this.width,
      height: this.height,
      url: this.canvas.toDataURL(),
      steps: this.steps,
      redo_arr: this.redo_arr,
      dim: window.dim,
    };
    localStorage.setItem("pc-canvas-data", JSON.stringify(d));
  }

  /**
   * Adds an image from the user's file system to the canvas, processing it
   * to fit within the canvas dimensions.
   */
  addImage() {
    const _this = this;
    const fp = document.createElement("input");
    fp.type = "file";
    fp.click();
    fp.onchange = function (e) {
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = function () {
        const uimg = new Image();
        uimg.src = reader.result;
        uimg.width = _this.w;
        uimg.height = _this.h;
        uimg.onload = function () {
          const pxc = document.createElement("canvas");
          pxc.width = _this.w;
          pxc.height = _this.h;
          const pxctx = pxc.getContext("2d");
          pxctx.drawImage(uimg, 0, 0, _this.w, _this.h);
          for (let i = 0; i < _this.width; i++) {
            for (let j = 0; j < _this.height; j++) {
              let ctr = 0;
              let avg = [0, 0, 0, 0];
              const pix = pxctx.getImageData(10 * i, 10 * j, 10, 10).data;
              pix.forEach((x, k) => {
                avg[k % 4] += x;
                if (k % 4 === 0) ctr++;
              });
              avg = avg.map((x) => Math.floor(x / ctr));
              _this.setcolor(avg);
              _this.draw(i, j);
            }
          }
        };
      };
    };
  }

  /**
   * Draws a line between two points on the canvas.
   *
   * @param {number} x - The x-coordinate of the starting point.
   * @param {number} y - The y-coordinate of the starting point.
   */
  drawLine(x, y) {
    this.lc.push(new Point(x, y));
    if (this.lc.length === 2) {
      const lp = line(this.lc[0], this.lc[1]);
      this.lc = [];
      lp.forEach((p) => this.draw(p.x, p.y));
    }
  }

  /**
   * Draws a circle on the canvas at the specified coordinates with a specified radius.
   *
   * @param {number} x - The x-coordinate of the circle's center.
   * @param {number} y - The y-coordinate of the circle's center.
   */
  drawCircle(x, y) {
    const centre = new Point(x, y);
    const radius = +prompt("radius?");
    const lp = circle(radius, centre);
    lp.forEach((p) => this.draw(p.x, p.y));
  }

  /**
   * Draws an ellipse on the canvas at the specified coordinates with specified radii.
   *
   * @param {number} x - The x-coordinate of the ellipse's center.
   * @param {number} y - The y-coordinate of the ellipse's center.
   */
  drawEllipse(x, y) {
    const center = new Point(x, y);
    const radiusX = +prompt("X radius?");
    const radiusY = +prompt("Y radius?");
    const lp = ellipse(radiusX, radiusY, center);
    lp.forEach((p) => this.draw(p.x, p.y));
  }
}
