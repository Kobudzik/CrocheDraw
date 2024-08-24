export function InitColors() {
  window.colors = [
    [0, 0, 0, 255], // Black
    [255, 255, 255, 255], // White
    [127, 127, 127, 255], // Grey
    [195, 195, 195, 255], // Light Grey
    [136, 0, 21, 255], // Dark Red
    [237, 28, 36, 255], // Red
    [255, 127, 39, 255], // Orange
    [255, 242, 0, 255], // Yellow
    [239, 228, 176, 255], // Pale Yellow
    [34, 177, 36, 255], // Green
    [181, 230, 29, 255], // Lime Green
    [0, 162, 232, 255], // Blue
    [63, 72, 204, 255], // Dark Blue
    [153, 217, 234, 255], // Light Blue
    [112, 146, 190, 255], // Steel Blue
    [163, 73, 164, 255], // Purple
    [185, 122, 87, 255], // Brown
    [255, 174, 201, 255], // Light Pink
    [255, 201, 14, 255], // Gold
    [200, 191, 231, 255], // Lavender
  ];
}

export function renderColors() {
  document.querySelector("#palette").innerHTML = colors
    .map(
      (x) => `
      <span
        class="item" style="background-color: rgb(${x[0]},${x[1]},${x[2]})" 
        onclick="board.setcolor([${x}]);markActiveColor(this);"
        oncontextmenu="board.setcolor([${x}]);markActiveColor(this);board.ctx.globalAlpha=+prompt('Transparency(0-1)?')"
      >
      </span>`
    )
    .join("\n");
}
