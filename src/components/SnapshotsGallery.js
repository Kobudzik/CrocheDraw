/**
 * Snapshots class handles the opening, displaying, interaction, and closing of the snapshots gallery.
 *
 * The gallery allows users to view, select, and delete snapshots within the application.
 */
export class SnapshotsGallery {
  static open() {
    const snapshotsElement = document.querySelector("#snapshots");
    snapshotsElement.style.display = "block";
    snapshotsElement.focus();

    const galleryElement = document.querySelector("#snapshots #gallery");
    galleryElement.innerHTML = "";

    // Populate the gallery with snapshots from the board
    for (const frame of board.snapshotsManager.getSnapshots()) {
      galleryElement.appendChild(frame[0]);
    }

    document.querySelectorAll("#snapshots #gallery img").forEach((thumbnail, index) => {
      thumbnail.onclick = () => {
        board.loadSnapshot(index);
        this.close();
      };

      thumbnail.oncontextmenu = (event) => {
        event.preventDefault();
        const deleteConfirmation = confirm("Delete?");
        if (deleteConfirmation) {
          board.snapshotsManager.deleteSnapshot(index);
          this.open();
        }
      };
    });
  }

  static close() {
    const snapshotsElement = document.querySelector("#snapshots");
    snapshotsElement.style.display = "none";
  }
}
