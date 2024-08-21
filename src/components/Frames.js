export class Frames {
  static open() {
    document.querySelector("#frames").style.display = "block";
    document.querySelector("#frames").style.transform = "translate(-50%,-50%) scale(1,1)";
    document.querySelector("#frames").focus();
    document.querySelector("#frames #gallery").innerHTML = "";

    for (const frame of board.frames) {
      document.querySelector("#frames #gallery").appendChild(frame[0]);
    }

    document.querySelectorAll("#frames #gallery img").forEach((x, i) => {
      x.onclick = () => {
        board.loadFrame(i);
        Frames.close();
      };

      x.oncontextmenu = (e) => {
        e.preventDefault();
        const del_confirmation = confirm("Delete?");
        if (del_confirmation) {
          board.deleteFrame(i);
          Frames.open();
        }
      };
    });
  }

  static close() {
    document.querySelector("#frames").style.transform = "translate(-50%,-50%) scale(0,0)";
  }
}
