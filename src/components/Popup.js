export class Popup {
  constructor(cssSelector) {
    this.cssSelector = cssSelector;
    document.querySelector(this.cssSelector).style.display = "block";
    document.querySelector(this.cssSelector).style.transform = "translate(-50%,-50%) scale(1,1)";
  }

  /**
   * Closes the popup by shrinking it with a scale transform.
   */
  close() {
    document.querySelector(this.cssSelector).style.transform = "translate(-50%,-50%) scale(0,0)";
  }
}
