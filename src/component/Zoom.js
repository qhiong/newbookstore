import Utils from "../utils/Utils.js";
export default class Zoom extends EventTarget {
    elem;
    static cssBool = false;
    static SCALE = 0.675;
    static MINI_SCALE = 0.5625;
    static SIZE_FINISH_EVENT="size_finish_event";
    list = {};
    maskW = 0;
    maskH = 0;
    mask;
    miniW = 0;
    miniH = 0;
    zoomW = 0;
    zoomH = 0;
    constructor() {
        super();
        this.elem = document.createElement("div");
        this.elem.className = "zoom";
        this.render();
        this.mask = this.elem.querySelector(".mask");
        this.mouseBind = e => this.mouseHandler(e);
        this.elem.firstElementChild.addEventListener("mouseenter", this.mouseBind);
        Zoom.setCss();
    }
    appendTo(parent) {
        if (typeof parent === "string") parent = document.querySelector(parent);
        if (parent) parent.appendChild(this.elem);
    }
    render() {
        this.elem.innerHTML = `
        <div class="mini-image">
             <div class="mask"></div>
        </div>
        <div class="zoom-image" style="z-index:999"></div>
        `
    }
    setImage(src) {
        for (var i = 0; i < this.elem.children.length; i++) {
            this.elem.children[i].style.backgroundImage = `url(${src})`;
        }
        if (this.list[src]) this.setMask(this.list[src].width, this.list[src].height);
        else {
            var img = new Image();
            img.src = src;
            img.addEventListener("load", e => {
                this.setMask(e.currentTarget.width, e.currentTarget.height);
                this.list[src] = e.currentTarget;
            });
        }
    }

    setMask(w, h) {
        this.miniW = Zoom.MINI_SCALE * w;
        this.miniH = Zoom.MINI_SCALE * h;
        this.maskW = Zoom.MINI_SCALE * w * Zoom.SCALE;
        this.maskH = Zoom.MINI_SCALE * h * Zoom.SCALE;
        this.zoomW = Zoom.SCALE * w;
        this.zoomH = Zoom.SCALE * h;
        Object.assign(this.elem.firstElementChild.style, {
            width: this.miniW + "px",
            height: this.miniH + "px",
        })
        Object.assign(this.elem.lastElementChild.style, {
            width: this.zoomW + "px",
            height: this.zoomH + "px",
            left:this.miniW+"px"
        })
        Object.assign(this.mask.style, {
            width: this.maskW + "px",
            height: this.maskH + "px"
        })
        this.dispatch();
    }
    dispatch(){
        var evt=new Event(Zoom.SIZE_FINISH_EVENT);
        evt.height=this.miniH;
        this.dispatchEvent(evt);
    }

    mouseHandler(e) {
        if (!this.maskW) return;
        if (e.type === "mouseenter") {
            e.currentTarget.addEventListener("mouseleave", this.mouseBind);
            e.currentTarget.addEventListener("mousemove", this.mouseBind);
            this.elem.lastElementChild.style.display=this.mask.style.display="block";
        } else if (e.type === "mouseleave") {
            e.currentTarget.removeEventListener("mouseleave", this.mouseBind);
            e.currentTarget.removeEventListener("mousemove", this.mouseBind);
            this.elem.lastElementChild.style.display=this.mask.style.display="none";
        } else {
            this.moveMask(e.clientX, e.clientY);
        }

    }
    moveMask(x, y) {
        var rect = this.elem.firstElementChild.getBoundingClientRect();
        x = x - this.maskW / 2 - rect.left;
        y = y - this.maskH / 2 - rect.top;
        if (x <= 0) x = 0;
        if (y <= 0) y = 0;
        if (x >= this.miniW - this.maskW) x = this.miniW - this.maskW;
        if (y >= this.miniH - this.maskH) y = this.miniH - this.maskH;
        Object.assign(this.mask.style, {
            left: x + "px",
            top: y + "px",
        })
        Object.assign(this.elem.lastElementChild.style, {
            backgroundPositionX: -x * (this.zoomW / this.maskW) + "px",
            backgroundPositionY: -y * (this.zoomH / this.maskH) + "px",
        })
    }
    static setCss() {
        if (Zoom.cssBool) return;
        Zoom.cssBool = true;
        Utils.setCss(`
        .zoom{
            position: relative;
        }
        .zoom>.mini-image{
            position: absolute;
            border: 1px solid #ccc;
            background-size: 100% 100%;
        }
        .zoom>.zoom-image{
            position: absolute;
            border: 1px solid #ccc;
            display: none;
        }
        .zoom .mask{
            position: absolute;
            display: none;
            background-color: rgba(230, 200, 4, 0.3);
        }
        `)
    }
}