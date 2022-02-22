import Utils from "../utils/Utils.js";
import TimeManager from "../utils/TimeManager.js";

export default class Component extends EventTarget{
    elem;
    static cssBool=false;
    constructor(){
        super();
        this.elem=document.createElement("div");
    }
    appendTo(parent){
        if (typeof parent === "string") parent = document.querySelector(parent);
        if (parent) parent.appendChild(this.elem);
    }
    insertTo(parent,next){
        if (typeof parent === "string") parent = document.querySelector(parent);
        if(typeof next==="string") next=document.querySelector(next);
        if(parent && next) parent.insertBefore(this.elem,next);
    }
    static setCss(css){
        if(Component.cssBool) return;
        Component.cssBool=true;
        Utils.setCss(css);
    }
}