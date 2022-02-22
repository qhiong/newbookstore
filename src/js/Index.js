import Carousel from "../component/Carousel.js";
import {
    bigList,
    middleList,
    small1List,
    small2List
} from '../utils/CarouselList.js'

export default class Index {
    carousel
    carousel1
    carousel2
    carousel3
    lo
    exit
    constructor() {
        this.carousel = new Carousel(bigList);
        this.carousel.appendTo("#big");
        this.carousel1 = new Carousel(middleList);
        this.carousel1.appendTo("#middle");
        this.carousel2 = new Carousel(small1List);
        this.carousel2.appendTo("#small1");
        this.carousel3 = new Carousel(small2List);
        this.carousel3.appendTo("#small2");
        this.lo=document.querySelectorAll(".lo")
        this.exit=document.querySelector(".exit")
        this.lo=document.querySelectorAll(".lo")
        if(localStorage.user){
            this.lo.forEach((item,index)=>{
                if(index===0) item.textContent="欢迎"
                else item.textContent=JSON.parse(localStorage.user)[0].user
            })
            this.exit.style.display="block"
        }else{
            this.exit.style.display="none"
        }
        this.exit.addEventListener("click",e=>{
            localStorage.clear()
            location.reload()
        })
    }
}
new Index()