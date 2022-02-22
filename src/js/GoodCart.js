import Component from "../component/Component.js"
import ajax from "../server/Ajax.js"
import StepNumber from "../component/StepNumber.js"
export default class GoodCart extends Component {
    cartList
    alls
    lo
    deleteList
    itemsSelect
    stepList
    num_id
    delete_id
    totalPrice
    hadSelect = 0
    cul
    exit
    constructor() {
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
        document.querySelector(".cart-table").appendChild(this.elem)
        this.renderPage()
    }
    allClickHandler(e) {
        this.itemsSelect.forEach(async item => {
           let arr = [e.target.checked, Number(item.getAttribute("data"))]
            let data = await ajax("http://localhost:4020/updateSelect", {
                method: "POST",
                body: JSON.stringify(arr)
            })
            data ? this.renderPage() : console.log("错误");
        })
    }
    async itemSelectHandler(e) {
        let arr = [e.target.checked, Number(e.target.getAttribute("data"))]
        let data = await ajax("http://localhost:4020/updateSelect", {
            method: "POST",
            body: JSON.stringify(arr)
        })
        if (data.body.result) {
            this.renderPage()
        } else {
            console.log("错误");
        }
    }
    renderPage() {
        this.getData().then(res => {
            this.cartList = res
            this.countCount()
            this.render()
            this.alls = this.elem.querySelectorAll(".all")
            this.alls.forEach(item => {
                item.addEventListener("click", (e) => this.allClickHandler(e))
            })
            this.itemsSelect = this.elem.querySelectorAll(".item")
            this.itemsSelect.forEach((item, index) => {
                this.cartList.forEach((t, i) => {
                    if (Number(item.getAttribute("data")) === t.cid) {
                        item.checked = Boolean(Number(t.selected))
                    }
                })
                item.addEventListener("click", (e) => this.itemSelectHandler(e))
            })
            this.cartList.every(item => item.selected === '1') ? this.alls.forEach(item => item.checked = true) : this.alls.forEach(item => item.checked = false)
            this.changeStep()
            this.changeCulStyle()
            this.deleteItem()
        })
    }
    changeStep() {
        this.stepList = this.elem.querySelectorAll(".number-step")
        this.stepList.forEach(item => {
            let stepNum = new StepNumber()
            stepNum.appendTo(item)
            stepNum.setStep(item.getAttribute("data"))
            stepNum.addEventListener(StepNumber.STEP_CHANGE_EVENT, (e) => {
                this.num_id = item.getAttribute("id")
                this.changeNumber(e)
            })
        })
    }
    deleteItem() {
        this.deleteList = this.elem.querySelectorAll(".delete")
        this.deleteList.forEach(item => {
            item.addEventListener("click", (e) => {
                this.deleteClickHandler(e)
            })
        })
    }
    changeCulStyle() {
        this.cul = this.elem.querySelector(".calculation")
        if (this.cartList.some(item => item.selected === '1')) {
            Object.assign(this.cul.style, {
                backgroundColor: "#C62E2D",
                color: "#fff"
            })
        } else {
            Object.assign(this.cul.style, {
                backgroundColor: "#bbb",
                color: "#000"
            })
        }
    }
    countCount() {
        this.totalPrice = this.cartList.reduce((value, item) => {
            if (item.selected === '1') value += item.total
            return value
        }, 0)
        this.hadSelect = this.cartList.reduce((value, item) => {
            if (item.selected === '1') value++
            return value
        }, 0)
    }
    async changeNumber(e) {
        let id = Number(this.num_id)
        let total
        this.cartList.forEach(item => {
            if (item.cid === id) total = item.lowPrice * e.step
        })
        let arr = [id, e.step, total]
        let res = await ajax("http://localhost:4020/changeNum", {
            method: "POST",
            body: JSON.stringify(arr)
        })
        if (res.body.result) {
            this.renderPage()
        }
    }
    async deleteClickHandler(e) {
        let id = e.target.getAttribute("data");
        let bool = window.confirm("确定要删除吗？")
        if (!bool) return
        let data = await ajax("http://localhost:4020/deleteCart?id=" + Number(id))
        if (data.body.result) {
            this.renderPage()
        } else {
            console.log("错误");
        }
    }
    async getData() {
        let uid=Number(JSON.parse(localStorage.user)[0].id)
        let data = await ajax("http://localhost:4020/selectCartAll?uid="+uid)
        data = data.body.result
        return data
    }

    render() {
        this.elem.innerHTML = `
            <div class="total">
                全部商品  (${this.cartList.length})
            </div>
            <table>
                <thead>
                    <tr>
                        <th width="44"><input type="checkbox" class="all"></th>
                        <th width="96">全选</th>
                        <th width="415">商品信息</th>
                        <th width="220">价格(元)</th>
                        <th width="175">数量</th>
                        <th width="135">小计(元)</th>
                        <th width="98">操作</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.cartList && this.cartList.reduce((value,item)=>{
                        value+=`
                            <tr style="border-bottom: 1px solid grey;">
                                ${Object.keys(item).reduce((v,t,i)=>{
                                    if(t==="cid") return ''
                                    else if(t==="selected") v+=`<td style="padding-left: 12px;"><input type="checkbox" class="item" data="${item.cid}" ></td>`
                                   else if(t==="image")  v+=`<td style="padding-left:0"><img src="${item[t]}" style="width:96px;height:96px"></td>`
                                   else if(t==="number") v+=`<td class="number-step" data="${item[t]}" id="${item.cid}"></td>`
                                   else v+=`<td>${item[t]}</td>`
                                    return v
                                },"")}
                         <td><button data="${item.cid}" class="delete">删除</button></td>   </tr>
                        `
                        return value
                    },"")}
                </tbody>
            </table>
            <div class="tfoot">
                <div class="tfoot-left">
                    <input type="checkbox" class="all">
                    <span>全选</span>
                    <span class="all-delete">批量删除</span>
                    <span>移到我的收藏</span>
                </div>
                <div class="calculation">去结算</div>
                
                <div class="cart-result">
                    <span>已选  <i>${this.hadSelect}</i>  件产品</span>
                    <div class="total-price">
                        <span>共计(不含运费):</span>￥${this.totalPrice}
                    </div>
                </div>
            </div>
        `
    }
}

new GoodCart()