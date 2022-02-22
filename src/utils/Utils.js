export default class Utils {
    static IMG_FINISH_EVENT = "img_finish_event";
    static loadImage(sourceArr, finishHandler, basePath, suffix) {
        if (typeof sourceArr === "string") sourceArr = [sourceArr];
        if (basePath && typeof basePath === "string") {
            basePath = basePath.endsWith("/") ? basePath : basePath + "/";
            sourceArr = sourceArr.map(function (item) {
                item = String(item);
                return basePath + (item.startsWith("/") ? item.slice(1) : item);
            })
        }

        if (suffix && typeof suffix === "string") {
            suffix = suffix.startsWith(".") ? suffix : "." + suffix;
            sourceArr = sourceArr.map(function (item) {
                item = String(item);
                // if(item.endsWith(".",item.length-3) || item.endsWith(".",item.length-4))
                if (![item.slice(-5, -4), item.slice(-4, -3)].includes(".")) item += suffix;
                return item;
            })
        }

        var img = new Image();
        img.src = sourceArr[0];
        img.n = 0;
        img.finishList = [];
        img.sourceArr = sourceArr;
        img.finishHandler = finishHandler;
        img.addEventListener("load", this.loadHandler);
        img.addEventListener("error", this.errorHandler);
    }
    static loadHandler(e) {
        this.finishList.push(this.cloneNode(false));
        if (Utils.nextImg(this)) return;
    }

    static errorHandler(e) {
        this.finishList.push(null);
        if (Utils.nextImg(this)) return;

    }

    static nextImg(img) {
        img.n++;
        if (img.n > img.sourceArr.length - 1) {
            img.removeEventListener("load", Utils.loadHandler)
            img.removeEventListener("error", Utils.errorHandler)
            if (typeof img.finishHandler === "function") img.finishHandler(img.sourceArr.length === 1 ? img.finishList[0] : img.finishList);
            else {
                var evt = new Event(Utils.IMG_FINISH_EVENT);
                evt.finishList = img.sourceArr.length === 1 ? img.finishList[0] : img.finishList;
                document.dispatchEvent(evt);
            }
            return true;
        }
        img.src = img.sourceArr[img.n];
        return false;
    }
    static dragOn(elem, rect) {
        elem.addEventListener("mousedown", this.mouseHandler);
        elem.self = this;
        elem.rect = rect;
    }
    static dragOff(elem) {
        elem.removeEventListener("mousedown", this.mouseHandler);
    }
    static mouseHandler(e) {
        if (e.type === "mousedown") {
            // this div
            e.preventDefault();
            document.offsetX = e.offsetX;
            document.offsetY = e.offsetY;
            document.div = this;
            document.addEventListener("mousemove", this.self.mouseHandler);
            document.addEventListener("mouseup", this.self.mouseHandler);
        } else if (e.type === "mousemove") {
            // console.log(this)document
            var bool = true;
            if (this.div.rect) {
                rect = this.div.rect;
                if (!rect.width) rect.width = 0;
                if (!rect.height) rect.height = 0;
                if (!rect.x) rect.x = 0;
                if (!rect.y) rect.y = 0;
                if (this.div.parentElement) {
                    rect.x = this.div.parentElement.getBoundingClientRect().x;
                    rect.y = this.div.parentElement.getBoundingClientRect().y;
                }
                bool = !(!rect.width && !rect.height)
            } else {
                rect = this.div.parentElement.getBoundingClientRect();
                if (this.div.parentElement === document.body) {
                    bool = false;
                }
                if (this.div.parentElement.clientLeft) rect.width -= this.div.parentElement.clientLeft * 2;
                if (this.div.parentElement.clientTop) rect.height -= this.div.parentElement.clientTop * 2;
            }
            var x = e.clientX - this.offsetX - rect.x;
            var y = e.clientY - this.offsetY - rect.y;
            if (bool) {
                if (x <= 0) x = 0;
                if (y <= 0) y = 0;
                var w = (!rect.width) ? 0 : (rect.width - this.div.offsetWidth);
                var h = (!rect.height) ? 0 : (rect.height - this.div.offsetHeight);
                if (x >= w) x = w;
                if (y >= h) y = h;
            }
            this.div.style.left = x + "px";
            this.div.style.top = y + "px";
        } else if (e.type === "mouseup") {
            // this document
            this.removeEventListener("mousemove", this.div.self.mouseHandler);
            this.removeEventListener("mouseup", this.div.self.mouseHandler);
        }
    }
    static randomColor(a, r, g, b) {
        if (a === undefined) a = 1;
        var color = "rgba(";
        for (var i = 0; i < 3; i++) {
            color += (arguments[i + 1] === undefined ? ~~(Math.random() * 256) : arguments[i + 1]) + ",";
        }
        color += (a < 0 ? Math.random().toFixed(2) : a) + ")";
        return color;
    }
    static random(min,max){
        return ~~(Math.random()*(max-min)+min);
    }
    static setCss(str){
        if(document.styleSheets.length===0){
            var style=document.createElement("style");
            document.head.appendChild(style);
        }
        var styleSheet=document.styleSheets[document.styleSheets.length-1];
        str.replace(/\n/g,"").replace(/(.*?)\{(.*?)\}/g,function(t,$1,$2){
            styleSheet.addRule($1,$2,styleSheet.cssRules.length);
        })
    }
}