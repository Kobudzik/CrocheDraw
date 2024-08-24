import { AvailableTools, activeTools, setToolmode } from "./Tools.js";
import { bucketFill } from "../helpers/bucketFill.js";
import { calculateAverageColor } from "../helpers/utils.js";
import SnapshotsManager from "./SnapshotsManager.js";
import { drawLine, drawCircle, drawEllipse, tryDraw } from "../helpers/drawHelper.js";
import { Point } from "../../lib/Shapes.js";

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
    this.drawLineCoordinates = [];

    this.setupEventListeners();

    this.snapshotsManager = new SnapshotsManager();
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
      bucketFill(this, x, y, this.data[x][y]);
    } else if (activeTools[AvailableTools.eraser]) {
      this.erase(x, y);
    } else if (activeTools[AvailableTools.line]) {
      this.tryDrawLine(x, y);
    } else if (activeTools[AvailableTools.circle]) {
      drawCircle(this, x, y);
    } else if (activeTools[AvailableTools.ellipse]) {
      drawEllipse(this, x, y);
    } else {
      tryDraw(this, x, y);
    }
  }

  /**
   * Handles mouse movement events, enabling drawing or erasing based on the active tool
   * when the mouse button is pressed.
   */
  handleMouseMove(e) {
    if (this.active) {
      const { clientX, clientY } = e;
      const { x, y } = this.calculateCanvasCoordinates(clientX, clientY);
      this.handleToolAction(x, y);
    }
  }

  /**
   * Handles touch movement events on touch-enabled devices, enabling drawing or erasing
   * based on the active tool.
   */
  handleTouchMove(e) {
    const { clientX, clientY } = e.touches[0];
    const { x, y } = this.calculateCanvasCoordinates(clientX, clientY);
    this.handleToolAction(x, y);
  }

  /**
   * Handles the action based on the currently active tool.
   *
   * @param {number} x - The x-coordinate on the canvas.
   * @param {number} y - The y-coordinate on the canvas.
   */
  handleToolAction(x, y) {
    if (activeTools[AvailableTools.pen]) {
      tryDraw(this, x, y);
    } else if (activeTools[AvailableTools.eraser]) {
      this.erase(x, y);
    }
  }

  /**
   * Calculates the canvas coordinates from the clientX and clientY values.
   *
   * @param {number} clientX - The X coordinate of the mouse/touch event.
   * @param {number} clientY - The Y coordinate of the mouse/touch event.
   * @returns {Object} - The canvas coordinates as { x, y }.
   */
  calculateCanvasCoordinates(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();

    const x = Math.floor((this.width * (clientX - rect.left)) / this.canvas.clientWidth);
    const y = Math.floor((this.height * (clientY - rect.top)) / this.canvas.clientHeight);

    return { x, y };
  }

  tryDrawLine(x, y) {
    this.drawLineCoordinates.push(new Point(x, y));
    if (this.drawLineCoordinates.length === 2) {
      drawLine(this, this.drawLineCoordinates);
      this.drawLineCoordinates = [];
    }
  }

  erase(x, y) {
    const temp = this.color;
    const tga = this.ctx.globalAlpha;
    this.setcolor([255, 255, 255, 255]);
    tryDraw(this, x, y);
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

  clearCanvas() {
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.data = [...Array(this.width)].map(() => Array(this.height).fill([255, 255, 255, 255]));
    this.setcolor(this.color);
    setToolmode(AvailableTools.pen);
  }

  undo() {
    this.clearCanvas();

    if (this.redoStack.length === 0) {
      console.warn("No steps to redo.");
      return;
    }

    this.undoStack.push(this.redoStack.pop());

    this.redoStack.forEach((step) => {
      this.setcolor(step[2]);
      this.ctx.globalAlpha = step[3];
      tryDraw(step[0], step[1], true);
    });
  }

  redo() {
    if (this.undoStack.length === 0) {
      console.warn("No steps to redo.");
      return;
    }

    this.redoStack.push(this.undoStack.pop());

    this.redoStack.forEach((step) => {
      this.setcolor(step[2]);
      this.ctx.globalAlpha = step[3];

      tryDraw(step[0], step[1], true);
    });
  }

  replaceCanvasWithOther(canvasContext) {
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        const pixelData = canvasContext.getImageData(10 * i, 10 * j, 10, 10).data;
        const avgColor = calculateAverageColor(pixelData);

        this.setcolor(avgColor);
        tryDraw(i, j);
      }
    }
  }

  //#region snapshots
  /**
   * Loads a specific frame and redraws it on the canvas.
   *
   * @param {number} index - The index of the frame to load.
   */
  loadSnapshot(index) {
    this.clearCanvas();

    const img = this.snapshotsManager.getSnapshot(index)[1];

    const tmp_color = this.color;
    const tmp_alpha = this.ctx.globalAlpha;
    this.ctx.globalAlpha = 1;

    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        this.setcolor(img[i][j]);
        tryDraw(i, j);
      }
    }

    this.setcolor(tmp_color);
    this.ctx.globalAlpha = tmp_alpha;
  }
}
