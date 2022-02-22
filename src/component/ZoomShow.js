import Zoom from "../component/Zoom.js";
import Carousel from "../component/Carou.js";
export default class ZoomShow{
    zoom;
    carousel;
    list;
    constructor(list){
        this.list=list;
        this.elem=document.createElement("div");
        this.elem.style.position="absolute";
        this.zoom=new Zoom();
        this.zoom.appendTo(this.elem);
        this.carousel=new Carousel();
        this.carousel.appendTo(this.elem);
        this.carousel.addEventListener(Carousel.CHANGE_IMAGE_EVENT,e=>this.changeImageHandler(e))
    }
    appendTo(parent){
        if (typeof parent === "string") parent = document.querySelector(parent);
        if (parent) parent.appendChild(this.elem);
        this.carousel.setData(this.list)
    }
    changeImageHandler(e){
        var data=this.list.find(item=>item.bid==e.ids);
        if(data) this.zoom.setImage(data.imageBig);
    }
}
