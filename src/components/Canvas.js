import { Tool, tools } from "./Tool.js";
import { filler } from "../helpers/filler.js";

export class Canvas {
  constructor(width, height) {
    this.canvas = document.querySelector("#canvas");
    this.canvas.width = 10 * width;
    this.canvas.height = 10 * height;
    this.width = width;
    this.height = height;
    this.canvas.style.display = "block";
    this.canvas.style.height = Math.floor((height / width) * this.canvas.clientWidth) + "px";
    this.w = +this.canvas.width;
    this.h = +this.canvas.height;
    this.ctx = this.canvas.getContext("2d");
    this.ctx.fillStyle = "white";
    this.ctx.globalAlpha = 1;
    this.ctx.fillRect(0, 0, this.w, this.h);
    this.data = [...Array(this.width)].map(() => Array(this.height).fill([255, 255, 255, 255]));
    this.steps = [];
    this.redo_arr = [];
    this.frames = [];
    this.setupEventListeners();
    this.lc = [];
  }

  setupEventListeners() {
    this.canvas.addEventListener("click", (e) => this.handleClick(e));
    this.canvas.addEventListener("mousemove", (e) => this.handleMouseMove(e));
    this.canvas.addEventListener("touchmove", (e) => this.handleTouchMove(e));
    this.canvas.addEventListener("mousedown", () => (this.active = true));
    this.canvas.addEventListener("mouseup", () => (this.active = false));
  }

  handleClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    x = Math.floor((this.width * x) / this.canvas.clientWidth);
    y = Math.floor((this.height * y) / this.canvas.clientHeight);

    if (tools[Tool.fillBucket]) {
      filler(x, y, this.data[x][y]);
    } else if (tools[Tool.eraser]) {
      const temp = this.color;
      const tga = this.ctx.globalAlpha;
      this.setcolor([255, 255, 255, 255]);
      this.draw(x, y);
      this.setcolor(temp);
      this.ctx.globalAlpha = tga;
    } else if (tools[Tool.line]) {
      this.lc.push(new Point(x, y));
      if (this.lc.length === 2) {
        const lp = line(this.lc[0], this.lc[1]);
        this.lc = [];
        lp.forEach((p) => this.draw(p.x, p.y));
      }
    } else if (tools[Tool.circle]) {
      const centre = new Point(x, y);
      const radius = +prompt("radius?");
      const lp = circle(radius, centre);
      lp.forEach((p) => this.draw(p.x, p.y));
    } else if (tools[Tool.ellipse]) {
      const center = new Point(x, y);
      const radiusX = +prompt("X radius?");
      const radiusY = +prompt("Y radius?");
      const lp = ellipse(radiusX, radiusY, center);
      lp.forEach((p) => this.draw(p.x, p.y));
    } else {
      this.draw(x, y);
    }
  }

  handleMouseMove(e) {
    if (this.active) {
      const rect = this.canvas.getBoundingClientRect();
      let x = e.clientX - rect.left;
      let y = e.clientY - rect.top;
      x = Math.floor((this.width * x) / this.canvas.clientWidth);
      y = Math.floor((this.height * y) / this.canvas.clientHeight);

      if (tools[Tool.pen]) {
        this.draw(x, y);
      } else if (tools[Tool.eraser]) {
        this.erase(x, y);
      }
    }
  }

  handleTouchMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    let x = e.touches[0].clientX - rect.left;
    let y = e.touches[0].clientY - rect.top;
    x = Math.floor((this.width * x) / this.canvas.clientWidth);
    y = Math.floor((this.height * y) / this.canvas.clientHeight);

    if (tools[Tool.pen]) {
      this.draw(x, y);
    } else if (tools[Tool.eraser]) {
      this.erase(x, y);
    }
  }

  draw(x, y, count) {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      this.data[x][y] = this.color;
      this.ctx.fillRect(Math.floor(x * (this.w / this.width)), Math.floor(y * (this.h / this.height)), Math.floor(this.w / this.width), Math.floor(this.h / this.height));
      if (!count && JSON.stringify(this.steps[this.steps.length - 1]) !== JSON.stringify([x, y, this.color, this.ctx.globalAlpha])) {
        this.steps.push([x, y, this.color, this.ctx.globalAlpha]);
      }
    }
  }

  erase(x, y) {
    const temp = this.color;
    const tga = this.ctx.globalAlpha;
    this.setcolor([255, 255, 255, 255]);
    this.draw(x, y);
    this.setcolor(temp);
    this.ctx.globalAlpha = tga;
  }

  setcolor(color) {
    this.ctx.globalAlpha = 1;
    this.color = color;
    this.ctx.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},${color[3]})`;
  }

  setmode(i) {
    tools.fill(false);
    tools[i] = true;
    document.querySelectorAll("#toolbar .item").forEach((x, i) => {
      x.style.backgroundColor = tools[i] ? "grey" : "";
    });
  }

  save() {
    this.canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = "canvas.png";
      link.href = url;
      link.click();
    });
  }

  clear() {
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(0, 0, this.w, this.h);
    this.data = [...Array(this.width)].map(() => Array(this.height).fill([255, 255, 255, 255]));
    this.setcolor(this.color);
    this.setmode(Tool.pen);
  }

  addFrame(data = null) {
    const img = new Image();
    img.src = data || this.canvas.toDataURL();
    this.frames.push([img, this.data.map((inner) => inner.slice())]);
  }

  deleteFrame(f) {
    this.frames.splice(f, 1);
  }

  loadFrame(f) {
    this.clear();
    const img = this.frames[f][1];
    const tmp_color = this.color;
    const tmp_alpha = this.ctx.globalAlpha;
    this.ctx.globalAlpha = 1;

    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        this.setcolor(img[i][j]);
        this.draw(i, j);
      }
    }

    this.setcolor(tmp_color);
    this.ctx.globalAlpha = tmp_alpha;
  }

  renderGIF() {
    this.frames.forEach((frame) => {
      gif.addFrame(frame[0], {
        copy: true,
        delay: 100,
      });
    });
    gif.render();
  }

  undo() {
    this.clear();
    this.redo_arr.push(this.steps.pop());
    this.steps.forEach((step) => {
      this.setcolor(step[2]);
      this.ctx.globalAlpha = step[3];
      this.draw(step[0], step[1], true);
    });
  }

  redo() {
    this.steps.push(this.redo_arr.pop());
    this.steps.forEach((step) => {
      this.setcolor(step[2]);
      this.ctx.globalAlpha = step[3];
      this.draw(step[0], step[1], true);
    });
  }

  saveInLocal() {
    const d = {
      colors: window.colors,
      currColor: this.color,
      width: this.width,
      height: this.height,
      url: this.canvas.toDataURL(),
      steps: this.steps,
      redo_arr: this.redo_arr,
      dim: window.dim,
    };
    localStorage.setItem("pc-canvas-data", JSON.stringify(d));
  }

  addImage() {
    const _this = this;
    const fp = document.createElement("input");
    fp.type = "file";
    fp.click();
    fp.onchange = function (e) {
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = function () {
        const uimg = new Image();
        uimg.src = reader.result;
        uimg.width = _this.w;
        uimg.height = _this.h;
        uimg.onload = function () {
          const pxc = document.createElement("canvas");
          pxc.width = _this.w;
          pxc.height = _this.h;
          const pxctx = pxc.getContext("2d");
          pxctx.drawImage(uimg, 0, 0, _this.w, _this.h);
          for (let i = 0; i < _this.width; i++) {
            for (let j = 0; j < _this.height; j++) {
              let ctr = 0;
              let avg = [0, 0, 0, 0];
              const pix = pxctx.getImageData(10 * i, 10 * j, 10, 10).data;
              pix.forEach((x, k) => {
                avg[k % 4] += x;
                if (k % 4 === 0) ctr++;
              });
              avg = avg.map((x) => Math.floor(x / ctr));
              _this.setcolor(avg);
              _this.draw(i, j);
            }
          }
        };
      };
    };
  }
}
