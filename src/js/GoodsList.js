import Component from "../component/Component.js"
import ajax from "../server/Ajax.js"
import {Pagination} from "../component/pagination.js"
export default class GoodsList extends Component{
    lo
    list
    goodslist
    start = 0;
  end = 12;
  exit
    constructor(){
        super()
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
        this.list=document.querySelector(".list>ul")
         this.getData().then(res=>{
            this.goodslist=res
            this.changeList()
        })
    }
    async getData(){
        let data=await ajax("http://localhost:4020/selectBookAll")
        data=data.body.result
        return data
    }
    changePage(res){
        this.start = (res-1) * 18
        this.end = res * 18
        this.list.innerHTML=`${this.goodslist&&this.goodslist.reduce((value,item,i)=>{
            if(!(i >= this.start && i < this.end)) return value
            return value+=`
                <a class="li" href="./details.html?id=${item.bid}">
                    <div class="image"><img src="${item.image}"/></div>
                    <div class="title">${item.bookName}</div>
                    <div class="author">${item.authorName}</div>
                    <div class="price">
                        <em>￥</em>
                        <span>${item.lowPrice.toFixed(2)}</span>
                    </div>
                </a>
            `
        },"")}
        `
    }
    changeList(){
        this.p = new Pagination('.page',{
          pageInfo:{
            pagenum:1,
            pagesize:18,
            totalsize:this.goodslist.length,
            totalpage:Math.ceil(this.goodslist.length/18)
          },
          textInfo:{
            prev:'上一页',
            next:'下一页'
          }
        },(r)=>this.changePage(r))
      }
}

new GoodsList()