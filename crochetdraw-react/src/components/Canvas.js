import React, { useRef, useState, useEffect } from "react";
import { AvailableTools, activeTools, setToolmode } from "../utils/Tools.js";
import { bucketFill } from "../utils/bucketFill.js";
import { calculateAverageColor } from "../utils/utils.js";
import SnapshotsManager from "../utils/SnapshotsManager.js";
import { drawLine, drawCircle, drawEllipse, tryDraw } from "../utils/drawHelper.js";
import { Point } from "../lib/Shapes.js";

const Canvas = ({ width, height }) => {
  const canvasRef = useRef(null);
  const [color, setColor] = useState([255, 255, 255, 255]);
  const [active, setActive] = useState(false);
  const [drawLineCoordinates, setDrawLineCoordinates] = useState([]);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const snapshotsManager = new SnapshotsManager();
  const data = [];

  useEffect(() => {
    const canvasElement = canvasRef.current;
    const ctx = canvasElement.getContext("2d");

    canvasElement.style.display = "block";
    canvasElement.style.height = Math.floor((height / width) * canvasElement.clientWidth) + "px";

    canvasElement.width = 10 * width;
    canvasElement.height = 10 * height;

    ctx.fillStyle = "white";
    ctx.globalAlpha = 1;
    ctx.fillRect(0, 0, canvasElement.width, canvasElement.height);

    // Event listeners
    const handleMouseMove = (e) => {
      if (active) {
        const { x, y } = calculateCanvasCoordinates(e.clientX, e.clientY);
        handleToolAction(x, y);
      }
    };

    const handleClick = (e) => {
      const { x, y } = calculateCanvasCoordinates(e.clientX, e.clientY);
      if (activeTools[AvailableTools.fillBucket]) {
        bucketFill(canvasRef.current, x, y, data[x][y]);
      } else if (activeTools[AvailableTools.eraser]) {
        erase(x, y);
      } else if (activeTools[AvailableTools.line]) {
        tryDrawLine(x, y);
      } else if (activeTools[AvailableTools.circle]) {
        drawCircle(canvasRef.current, x, y);
      } else if (activeTools[AvailableTools.ellipse]) {
        drawEllipse(canvasRef.current, x, y);
      } else {
        tryDraw(canvasRef.current, x, y);
      }
    };

    const handleTouchMove = (e) => {
      const { x, y } = calculateCanvasCoordinates(e.touches[0].clientX, e.touches[0].clientY);
      handleToolAction(x, y);
    };

    canvasElement.addEventListener("mousemove", handleMouseMove);
    canvasElement.addEventListener("click", handleClick);
    canvasElement.addEventListener("touchmove", handleTouchMove);
    canvasElement.addEventListener("mousedown", () => setActive(true));
    canvasElement.addEventListener("mouseup", () => setActive(false));

    return () => {
      canvasElement.removeEventListener("mousemove", handleMouseMove);
      canvasElement.removeEventListener("click", handleClick);
      canvasElement.removeEventListener("touchmove", handleTouchMove);
    };
  }, [active, color, drawLineCoordinates, undoStack, redoStack]);

  const calculateCanvasCoordinates = (clientX, clientY) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((width * (clientX - rect.left)) / canvas.clientWidth);
    const y = Math.floor((height * (clientY - rect.top)) / canvas.clientHeight);
    return { x, y };
  };

  const handleToolAction = (x, y) => {
    if (activeTools[AvailableTools.pen]) {
      tryDraw(canvasRef.current, x, y);
    } else if (activeTools[AvailableTools.eraser]) {
      erase(x, y);
    }
  };

  const tryDrawLine = (x, y) => {
    setDrawLineCoordinates((prev) => {
      const newCoords = [...prev, new Point(x, y)];
      if (newCoords.length === 2) {
        drawLine(canvasRef.current, newCoords);
        return [];
      }
      return newCoords;
    });
  };

  const erase = (x, y) => {
    const tempColor = color;
    const tempAlpha = canvasRef.current.getContext("2d").globalAlpha;
    setColor([255, 255, 255, 255]);
    tryDraw(canvasRef.current, x, y);
    setColor(tempColor);
    canvasRef.current.getContext("2d").globalAlpha = tempAlpha;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setColor([255, 255, 255, 255]);
    setToolmode(AvailableTools.pen);
  };

  const undo = () => {
    clearCanvas();
    if (redoStack.length === 0) {
      console.warn("No steps to redo.");
      return;
    }
    setUndoStack((prev) => [...prev, redoStack.pop()]);
    redoStack.forEach((step) => {
      setColor(step[2]);
      canvasRef.current.getContext("2d").globalAlpha = step[3];
      tryDraw(step[0], step[1], true);
    });
  };

  const redo = () => {
    if (undoStack.length === 0) {
      console.warn("No steps to redo.");
      return;
    }
    setRedoStack((prev) => [...prev, undoStack.pop()]);
    redoStack.forEach((step) => {
      setColor(step[2]);
      canvasRef.current.getContext("2d").globalAlpha = step[3];
      tryDraw(step[0], step[1], true);
    });
  };

  const replaceCanvasWithOther = (canvasContext) => {
    const canvas = canvasRef.current;
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        const pixelData = canvasContext.getImageData(10 * i, 10 * j, 10, 10).data;
        const avgColor = calculateAverageColor(pixelData);

        setColor(avgColor);
        tryDraw(canvasRef.current, i, j);
      }
    }
  };

  const loadSnapshot = (index) => {
    clearCanvas();
    const img = snapshotsManager.getSnapshot(index)[1];

    const tmpColor = color;
    const tmpAlpha = canvasRef.current.getContext("2d").globalAlpha;
    canvasRef.current.getContext("2d").globalAlpha = 1;

    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        setColor(img[i][j]);
        tryDraw(canvasRef.current, i, j);
      }
    }

    setColor(tmpColor);
    canvasRef.current.getContext("2d").globalAlpha = tmpAlpha;
  };

  return <canvas ref={canvasRef} />;
};

export default Canvas;
