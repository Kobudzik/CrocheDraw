import { ellipse, Point, circle, line } from "../lib/Shapes.js";
export function tryDraw(canvas, x, y, skipTrack = false) {
  if (isInCanvasBounds(canvas, x, y)) {
    updateCanvasData(canvas, x, y);
    renderPixel(canvas, x, y);

    if (!skipTrack) {
      trackSteps(canvas, x, y);
    }
  }
}

export function isInCanvasBounds(canvas, x, y) {
  return x >= 0 && x < canvas.width && y >= 0 && y < canvas.height;
}

export function updateCanvasData(canvas, x, y) {
  canvas.data[x][y] = canvas.color;
}

export function renderPixel(canvas, x, y) {
  const renderPixelWidth = Math.floor(canvas.canvas.width / canvas.width);
  const renderPixelHeight = Math.floor(canvas.canvas.height / canvas.height);

  const renderX = Math.floor(x * renderPixelWidth);
  const renderY = Math.floor(y * renderPixelHeight);

  canvas.ctx.fillRect(renderX, renderY, renderPixelWidth, renderPixelHeight);
}

export function trackSteps(canvas, x, y) {
  const currentStep = [x, y, canvas.color, canvas.ctx.globalAlpha];
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
