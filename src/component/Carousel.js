import Utils from "../utils/Utils.js";
import TimeManager from "../utils/TimeManager.js";
export default class Carousel {
    static LEFT=Symbol();
    static RIGHT=Symbol();
    static cssBool=false;
    elem;
    autoBool = false;
    time = 300;
    dot;
    imgCon;
    list = [];
    itemList = [];
    bnList = [];
    pos=0;
    x=0;
    prev;
    moveBool=false;
    speed=50;
    direction=Carousel.LEFT;

    
    constructor(list) {
        this.elem = document.createElement("div");
        this.elem.className = "carousel";
        if (list) this.setData(list);
        Carousel.setCss();
        this.elem.addEventListener("mouseenter", e => this.mouseHandler(e));
        this.elem.addEventListener("mouseleave", e => this.mouseHandler(e));
        TimeManager.getInstance().add(this);
    }
    appendTo(parent) {
        if (typeof parent === "string") parent = document.querySelector(parent);
        if (parent) {
            parent.appendChild(this.elem);
            this.elem.style.height=parent.offsetHeight+"px";
            
        }
        
    }
    setData(list) {
        this.list = list;
        this.itemList.length = 0;
        this.pos=0;
        this.time=200;
        this.autoBool=true;
        this.createImageCon(this.elem);
        this.createDot(this.elem);
        this.createBnList(this.elem);
        this.changePrev();
    }

    mouseHandler(e) {
        this.autoBool = e.type === "mouseenter" ? false : (this.time = 300 && true);
    }
    createImageCon(carousel) {
        this.imgCon = document.createElement("div");
        this.imgCon.className = "img-con";
        this.imgCon.appendChild(this.getImageItem(0));
        carousel.appendChild(this.imgCon);
    }
    createDot(carousel) {
        this.dot = document.createElement("ul");
        this.dot.className = "dot";
        this.dot.innerHTML = this.list.reduce((value, item, i) => {
            return value += `<li><a href='#${i}'></a></li>`;
        }, "");
        carousel.appendChild(this.dot);
        this.dot.addEventListener("click", e => this.dotClickHandler(e));
    }
    createBnList(carousel) {
        for (var i = 0; i < 2; i++) {
            var bn = this.createBn(i === 0);
            bn.className = i === 0 ? "left" : "right";
            carousel.appendChild(bn);
            this.bnList.push(bn);
            bn.addEventListener("click", e => this.bnClickHandler(e));
        }
    }
    createBn(left) {
        var canvas = document.createElement("canvas");
        canvas.width = 25;
        canvas.height = 50;
        canvas.style.backgroundColor = "rgba(0,0,0,0.1)";
        canvas.style.borderRadius="2px"
        var ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.moveTo(7.5, 25);
        ctx.lineTo(17.5, 10);
        ctx.stroke()
        ctx.strokeStyle="#fff"
        ctx.moveTo(7.5, 25);
        ctx.lineTo(17.5, 40);
        ctx.stroke()
        ctx.strokeStyle="#fff"
        if (!left) canvas.style.transform = "scale(-1,1) translate(0,-50%)";
        return canvas;
    }
    getImageItem(n) {
        if(this.itemList[n]) return this.itemList[n];
        var div=document.createElement("div");
        div.className="image-item";
        div.innerHTML=`<img src="${this.list[n].img}">
            `
        this.itemList[n]=div;
        return this.itemList[n];
    }
    changePrev() {
        if(this.prev){
            this.prev.style.backgroundColor="rgba(128,128,128,1)";
        }
        this.prev=this.dot.children[this.pos].firstElementChild;
        this.prev.style.backgroundColor="rgba(255,0,0,1)";
    }
    dotClickHandler(e) {
        if(e.target.nodeName!=="A") return;
        var index=Array.from(this.dot.children).indexOf(e.target.parentElement);
        this.direction=index>this.pos ? Carousel.LEFT : Carousel.RIGHT;
        this.pos=index;
        this.createNextImg();
    }
    bnClickHandler(e) {
        if(this.className==="left"){
            this.pos--;
            if(this.pos<0) this.pos=this.list.length-1;
            this.direction=Carousel.RIGHT;
        }else{
            this.pos++;
            if(this.pos>this.list.length-1) this.pos=0;
            this.direction=Carousel.LEFT;
        }
        this.createNextImg();
    }
    createNextImg(){
        if(this.direction===Carousel.LEFT){
            this.x=0;
            this.imgCon.appendChild(this.getImageItem(this.pos));
        }else if(this.direction===Carousel.RIGHT){
            this.imgCon.insertBefore(this.getImageItem(this.pos),this.imgCon.firstElementChild);
            this.x=-this.getImageItem(this.pos).offsetWidth;
        }
        this.imgCon.style.left=this.x+"px";
        this.moveBool=true;
        this.changePrev();
    }
    moveAnimation(){
        if(!this.moveBool) return;
        if(this.direction===Carousel.LEFT){
            this.x-=this.speed;
            if(this.x<=-this.imgCon.firstElementChild.offsetWidth){
                this.imgCon.firstElementChild.remove();
                this.x=0;
                this.moveBool=false;
            }
        }else if(this.direction===Carousel.RIGHT){
            this.x+=this.speed;
            if(this.x>=0){
                this.imgCon.lastElementChild.remove();
                this.x=0;
                this.moveBool=false;
            }
        }
        this.imgCon.style.left=this.x+"px";
    }
    autoMove(){
        if(!this.autoBool) return;
        this.time--;
        if(this.time>0) return;
        this.time=300;
        this.bnList[1].dispatchEvent(new MouseEvent("click"));
    }
    update(){
        this.moveAnimation()
        this.autoMove();
    }
   
    static setCss(){
        if(Carousel.cssBool) return;
        Carousel.cssBool=true;
        Utils.setCss(`body{
            margin: 0;
            padding: 0;
        }
        .carousel{
            width: 100%;
            position: relative;
            overflow: hidden;
        }
        .img-con{
            width: 200%;
            height: 100%;
            position: absolute;
            left: 0;
        }
        .img-con img{
            width: 100%;
            height: 100%;
        }

        .img-con .title{
            position: absolute;
            left: 15%;
            top:10%;
            color:white;
            font-size: 20px;
            user-select: none;
        }
        .img-con .day{
            font-size: 30px;
        }
        .img-con .image-item{
            width: 50%;
            height: 100%;
            float: left;
            position: relative;
        }
        .dot{
            list-style: none;
            position: absolute;
            margin: 0;
            padding: 0;
            bottom: 20px;
            left: 50%;
            transform: translate(-50%,0);
        }
        .dot a{
            display: block;
            width: 10px;
            height: 10px;
            border-radius: 10px;
            background:grey;
            transition:  all 0.5s;
        }
        .dot>li{
            margin-left: 3px;
            float: left;
        }
        .dot>li:first-child{
            margin-left: 0;
        }

        .left,.right{
            position: absolute;
            top: 50%;
            transform: translate(0,-50%);
        }
        .left{
            left:20px;
        }
        .right{
            right: 20px;
        }`)
    }
}