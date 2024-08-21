/**
 * Snapshots class handles the opening, displaying, interaction, and closing of the snapshots gallery.
 *
 * The gallery allows users to view, select, and delete snapshots within the application.
 */
export class Snapshots {
  /**
   * Opens the snapshots gallery, populates it with available snapshots, and sets up event handlers
   * for selecting and deleting snapshots.
   */
  static open() {
    // Display the snapshots gallery and set its initial transform properties
    const snapshotsElement = document.querySelector("#snapshots");
    snapshotsElement.style.display = "block";
    snapshotsElement.style.transform = "translate(-50%,-50%) scale(1,1)";
    snapshotsElement.focus();

    // Clear the current gallery content
    const galleryElement = document.querySelector("#snapshots #gallery");
    galleryElement.innerHTML = "";

    // Populate the gallery with snapshots from the board
    for (const frame of board.snapshots) {
      galleryElement.appendChild(frame[0]);
    }

    // Add click and context menu event listeners to each frame thumbnail
    document.querySelectorAll("#snapshots #gallery img").forEach((thumbnail, index) => {
      // On left-click, load the selected frame and close the gallery
      thumbnail.onclick = () => {
        board.loadFrame(index);
        snapshots.close();
      };

      // On right-click, confirm and delete the selected frame if confirmed
      thumbnail.oncontextmenu = (event) => {
        event.preventDefault();
        const deleteConfirmation = confirm("Delete?");
        if (deleteConfirmation) {
          board.deleteFrame(index);
          snapshots.open(); // Refresh the gallery after deletion
        }
      };
    });
  }

  /**
   * Closes the snapshots gallery by applying a scale transform that hides it.
   */
  static close() {
    const snapshotsElement = document.querySelector("#snapshots");
    snapshotsElement.style.transform = "translate(-50%,-50%) scale(0,0)";
  }
}
