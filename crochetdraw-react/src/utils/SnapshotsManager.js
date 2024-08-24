class SnapshotsManager {
  constructor() {
    this.snapshots = [];
  }

  addSnapshot(boardData, canvasContext) {
    const img = new Image();
    img.src = canvasContext.canvas.toDataURL();
    this.snapshots.push([img, boardData.map((inner) => inner.slice())]);
  }

  deleteSnapshot(f) {
    this.snapshots.splice(f, 1);
  }

  getSnapshot(i) {
    return this.snapshots[i] ?? null;
  }

  getSnapshots() {
    return this.snapshots;
  }
}

export default SnapshotsManager;
