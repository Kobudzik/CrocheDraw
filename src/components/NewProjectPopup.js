export class NewProjectPopup {
  constructor(cssSelector) {
    this.cssSelector = cssSelector;
    document.querySelector(this.cssSelector).style.display = "block";
  }

  /**
   * Closes the newProjectPopup by shrinking it with a scale transform.
   */
  close() {
    document.querySelector(this.cssSelector).style.display = "none";
  }
}
