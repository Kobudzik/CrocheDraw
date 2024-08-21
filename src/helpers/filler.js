/**
 * Recursively fills connected pixels on the canvas that match the target color.
 *
 * @param {number} x - The x-coordinate of the starting pixel.
 * @param {number} y - The y-coordinate of the starting pixel.
 * @param {Array} cc - The target color to be replaced, represented as an array [R, G, B, A].
 */
export function filler(x, y, cc) {
  const board = window.board;

  // Check if the coordinates are within the board boundaries
  if (x >= 0 && x < board.width && y >= 0 && y < board.height) {
    // Check if the current pixel's color matches the target color and is different from the new color
    if (JSON.stringify(board.data[x][y]) === JSON.stringify(cc) && JSON.stringify(board.data[x][y]) !== JSON.stringify(board.color)) {
      // Draw the new color on the current pixel
      board.draw(x, y);

      // Recursively fill the adjacent pixels
      filler(x + 1, y, cc);
      filler(x, y + 1, cc);
      filler(x - 1, y, cc);
      filler(x, y - 1, cc);
    }
  }
}
