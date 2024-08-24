export const AvailableTools = {
  pen: 0,
  eraser: 1,
  fillBucket: 2,
  line: 3,
  circle: 4,
  ellipse: 5,
  addFrame: 6,
  undo: 7,
  redo: 8,
  clearCanvas: 9,
};

/**
 * Sets the current tool mode and updates the toolbar UI.
 */
export function setToolmode(activeTools, i) {
  activeTools.fill(false);
  activeTools[i] = true;

  //diselect all colors from palette
  document.querySelectorAll("#toolbar .item").forEach((x, i) => {
    x.style.backgroundColor = activeTools[i] ? "grey" : "";
  });
}
