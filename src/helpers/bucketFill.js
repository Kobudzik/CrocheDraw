/**
 * Recursively fills connected pixels on the canvas that match the target color.
 *
 * @param {number} x - The x-coordinate of the starting pixel.
 * @param {number} y - The y-coordinate of the starting pixel.
 * @param {Array} cc - The target color to be replaced, represented as an array [R, G, B, A].
 */
export function bucketFill(canvasInstance, x, y, targetColor) {
  const withinBounds = x >= 0 && x < canvasInstance.width && y >= 0 && y < canvasInstance.height;
  const matchTargetColor = (color) => JSON.stringify(color) === JSON.stringify(targetColor);
  const differentFromNewColor = (color) => JSON.stringify(color) !== JSON.stringify(canvasInstance.color);

  if (withinBounds && matchTargetColor(canvasInstance.data[x][y]) && differentFromNewColor(canvasInstance.data[x][y])) {
    canvasInstance.tryDraw(x, y);

    bucketFill(canvasInstance, x + 1, y, targetColor);
    bucketFill(canvasInstance, x, y + 1, targetColor);
    bucketFill(canvasInstance, x - 1, y, targetColor);
    bucketFill(canvasInstance, x, y - 1, targetColor);
  }
}
