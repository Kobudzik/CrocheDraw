export function act(clr) {
  document.querySelectorAll("#palette .item").forEach((x) => (x.style.boxShadow = ""));
  clr.style.boxShadow = "10px 10px 10px 10px rgba(0,0,0,0.5)";
}
