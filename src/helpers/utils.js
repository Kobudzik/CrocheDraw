/**
 * Highlights the selected color in the palette by applying a box shadow effect.
 */
export function setActiveColor(htmlElement) {
  document.querySelectorAll("#palette .item").forEach((x) => (x.style.boxShadow = ""));
  htmlElement.style.boxShadow = "10px 10px 10px 10px rgba(0,0,0,0.5)";
}
