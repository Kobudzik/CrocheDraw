/**
 * Frames class handles the opening, displaying, interaction, and closing of the frames gallery.
 *
 * The gallery allows users to view, select, and delete frames within the application.
 */
export class Frames {
  /**
   * Opens the frames gallery, populates it with available frames, and sets up event handlers
   * for selecting and deleting frames.
   */
  static open() {
    // Display the frames gallery and set its initial transform properties
    const framesElement = document.querySelector("#frames");
    framesElement.style.display = "block";
    framesElement.style.transform = "translate(-50%,-50%) scale(1,1)";
    framesElement.focus();

    // Clear the current gallery content
    const galleryElement = document.querySelector("#frames #gallery");
    galleryElement.innerHTML = "";

    // Populate the gallery with frames from the board
    for (const frame of board.frames) {
      galleryElement.appendChild(frame[0]);
    }

    // Add click and context menu event listeners to each frame thumbnail
    document.querySelectorAll("#frames #gallery img").forEach((thumbnail, index) => {
      // On left-click, load the selected frame and close the gallery
      thumbnail.onclick = () => {
        board.loadFrame(index);
        Frames.close();
      };

      // On right-click, confirm and delete the selected frame if confirmed
      thumbnail.oncontextmenu = (event) => {
        event.preventDefault();
        const deleteConfirmation = confirm("Delete?");
        if (deleteConfirmation) {
          board.deleteFrame(index);
          Frames.open(); // Refresh the gallery after deletion
        }
      };
    });
  }

  /**
   * Closes the frames gallery by applying a scale transform that hides it.
   */
  static close() {
    const framesElement = document.querySelector("#frames");
    framesElement.style.transform = "translate(-50%,-50%) scale(0,0)";
  }
}
