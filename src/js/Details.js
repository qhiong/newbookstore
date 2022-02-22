import ajax from "../server/Ajax.js";
import Component from "../component/Component.js";
import ZoomShow from "../component/ZoomShow.js";
import StepNumber from "../component/StepNumber.js";
import ThreeMune from "../component/ThreeMune.js";

export default class Details extends Component{
    lo
    bookInfo
    detailImage
    carts
    _step=1
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
        this.getData().then(res=>{
            this.bookInfo=res[0]
            this.render()
            this.detailImage=[].concat(this.bookInfo,this.bookInfo)
            document.querySelector(".details-show").appendChild(this.elem)
            let zoom= new ZoomShow(this.detailImage)
            zoom.appendTo(this.elem.querySelector(".det-img"))
            let stepNumber=new StepNumber()
            stepNumber.appendTo(this.elem.querySelector(".step-number"))
            stepNumber.addEventListener(StepNumber.STEP_CHANGE_EVENT,(e)=>this.stepHandler(e))
            this.carts=this.elem.querySelector(".cart")
            this.carts.addEventListener("click",(e)=>this.clickCartHandler(e))
            let th=new ThreeMune()
            th.appendTo(".choice-address")
        })
    }
    async getData(){
        let data=await ajax("http://localhost:4020/selectBookById?id="+location.href.split("=")[1])
        data=data.body.result
        console.log(data);
        return data
    }
    stepHandler(e){
        this._step=e.step
    }
    async clickCartHandler(e){
        let bid=Number(location.href.split("=")[1])
        let uid=Number(JSON.parse(localStorage.user)[0].id)
        let ids=[bid,uid]
        let arr=[bid,uid,this._step,this.bookInfo.lowPrice*this._step,0]
        let jusity=await ajax("http://localhost:4020/selectCart",{method:"post",body:JSON.stringify(ids)})
        if(jusity.body.result.length!==0){
            let cid=Number(jusity.body.result[0].cid)
            let num=Number(jusity.body.result[0].number)+1
            let add=[cid,num,this.bookInfo.lowPrice*num]
            let data=await ajax("http://localhost:4020/addStepNum",{method:"post",body:JSON.stringify(add)})
            if(data.body.result){
                location.href="./goodCart.html"
            }else{
                console.log("错误");
            }
        }else{
            let data=await ajax("http://localhost:4020/insertCart",{method:"post",body:JSON.stringify(arr)})
            if(data.body.result){
                location.href="./goodCart.html"
            }else{
                console.log("错误");
            }
        }
    }
    render(){
        this.elem.innerHTML=`
        <div class="center cru">
            <div class="crumbs">
                <span class="crumbs-item">
                    <a href="javascript:void(0)">文学艺术</a>&nbsp;&nbsp;>
                    <a href="javascript:void(0)" class="label">小说</a>&nbsp;&nbsp;>
                    <a href="javascript:void(0)" class="label">外国小说</a>&nbsp;&nbsp;>
                    <a href="javascript:void(0)" class="label label-name">${this.bookInfo.bookName}</a>
                </span>
            </div>
        </div>
        <div class="center" style="height:570px">
            <div class="det-img"></div>
            <div class="det-info">
                <div class="det-title">
                    <h3><span>${this.bookInfo.bookName}</span></h3>
                </div>
                <div class="publ"><a href="#">${this.bookInfo.publisher}</a>编</div>
                <div class="publ"><a href="#">${this.bookInfo.authorName}</a>著</div>
                <div class="det-price">
                    <label class="first-line">销售价</label>
                    <span>￥${this.bookInfo.lowPrice}</span>
                </div>
                <div class="det-address">
                    <label>配送至</label>
                    <div class="choice-address"></div>
                    <label class="huo">该地区有货</label>
                </div>
                <div class="det-num">
                    <label>数量</label>
                    <div class="step-number"></div>
                </div>
                <div class="btn">
                    <button class="cart">加入购物车</button>
                    <button>立即购买</button>
                </div>
            </div>
        </div>
        <div class="center good-nav">
            <ul class="tabs-nav">
                <li class="active">商品详情</li>
                <li class="nav">规格属性</li>
                <li class="nav">售后政策</li>
                <li class="nav">累计评价(1)</li>
                <li class="add-cart">
                    <button class="cart">加入购物车</button>
                </li>
            </ul>
            <div class="good-detail">
                <ul class="detail-good clearFix">
                
                    <li>
                        <span>商品编码(ISBN)</span>
                        <span>${this.bookInfo.productCode}</span>
                    </li>
                    <li>
                        <span>字数</span>
                        <span>${this.bookInfo.wordNumber}</span>
                    </li>
                    <li>
                        <span>中国分类号</span>
                        <span>${this.bookInfo.CLC}</span>
                    </li>
                    <li>
                        <span>页数</span>
                        <span>${this.bookInfo.pageNumber}</span>
                    </li>
                    <li>
                        <span>首版时间</span>
                        <span>${this.bookInfo.firstPublishTime}</span>
                    </li>
                    <li>
                        <span>包装</span>
                        <span>${this.bookInfo.packing}</span>
                    </li>
                    <li>
                        <span>出次</span>
                        <span>${this.bookInfo.outTimes}</span>
                    </li>
                    <li>
                        <span>出版时间</span>
                        <span>${this.bookInfo.publishTime}</span>
                    </li>
                    <li>
                        <span>出版社</span>
                        <span>${this.bookInfo.publisher}</span>
                    </li>
                    <li>
                        <span>作者</span>
                        <span>${this.bookInfo.authorName}</span>
                    </li>
                    <li>
                        <span>中国分类号</span>
                        <span>${this.bookInfo.CLC}</span>
                    </li>
                </ul>
                <div class="detail-info">
                    ${[this.bookInfo.details,this.bookInfo.intro,this.bookInfo.catalog].reduce((value,item,i)=>{
                        value+=`<h3>${i===0?'内容推荐':i===1?'作者简介':i===2?'目录':''}</h3><i></i>`
                        value+=`<p>${i!==2?item:item.replace(/\s\s/g,`章<br/>`)}</p>`
                        return value
                    },"")}
                </div>
            </div> 
        </div>
    `
    }
}
new Details()