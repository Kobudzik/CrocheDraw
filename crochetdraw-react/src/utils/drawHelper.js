import { ellipse, Point, circle, line } from "../lib/Shapes.js";
export function tryDraw(canvas, width, height, setDataAt, x, y, skipTrack = false) {
  alert("tryDraw in helper");
  if (isInCanvasBounds(canvas, x, y)) {
    updateCanvasData(canvas, setDataAt, x, y);
    renderPixel(canvas, x, y, width, height);

    if (!skipTrack) {
      //trackSteps(canvas, x, y);
    }
  }
}

export function isInCanvasBounds(canvas, x, y) {
  return x >= 0 && x < canvas.width && y >= 0 && y < canvas.height;
}

export function updateCanvasData(canvas, setDataAt, x, y) {
  alert("updating canvas data");
  setDataAt(x, y, canvas.color);
}

export function renderPixel(canvas, x, y, width, height) {
  alert("rendering pixel");
  const renderPixelWidth = Math.floor(canvas.width / width);
  const renderPixelHeight = Math.floor(canvas.height / height);

  const renderX = Math.floor(x * renderPixelWidth);
  const renderY = Math.floor(y * renderPixelHeight);

  let ctx = canvas.getContext("2d");
  ctx.fillRect(renderX, renderY, renderPixelWidth, renderPixelHeight);
}

export function trackSteps(canvas, x, y) {
  let ctx = canvas.getContext("2d");

  const currentStep = [x, y, canvas.color, ctx.globalAlpha];
  if (canvas.redoStack.length === 0 || !isLastStepEqual(canvas, currentStep)) {
    canvas.redoStack.push(currentStep);
  }
}

export function isLastStepEqual(canvas, step) {
  const lastStep = canvas.redoStack.at(-1);
  return JSON.stringify(lastStep) === JSON.stringify(step);
}

export function drawLine(canvas, points) {
  const lp = line(points[0], points[1]);
  lp.forEach((p) => tryDraw(canvas, p.x, p.y));
}

export function drawCircle(canvas, x, y) {
  const radius = +prompt("radius?");
  const centre = new Point(x, y);
  const lp = circle(radius, centre);
  lp.forEach((p) => tryDraw(canvas, p.x, p.y));
}

export function drawEllipse(canvas, x, y) {
  const radiusX = +prompt("X radius?");
  const radiusY = +prompt("Y radius?");
  const center = new Point(x, y);
  const lp = ellipse(radiusX, radiusY, center);

  lp.forEach((p) => tryDraw(canvas, p.x, p.y));
}
