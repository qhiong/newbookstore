import Component from '../component/Component.js'
import ajax from '../server/Ajax.js'
export default class Register extends Component{
    spanList
    inputList
    ids
    passSpan
    form
    eye
    boolEye=false
    constructor(){
        super()
        document.body.appendChild(this.elem)
        this.render()
        this.spanList=this.elem.querySelectorAll("span[class]")
        this.inputList=this.elem.querySelectorAll("input")
        this.inputList.forEach((item)=>{
            item.addEventListener("input",(e)=>this.inputHandler(e))
        })
        this.passSpan=this.elem.querySelectorAll("[class='weak-bar']")
        this.form=this.elem.querySelector("form")
        this.form.addEventListener("submit",(e)=>this.submitHandler(e))
        this.eye=this.elem.querySelector(".eye")
        this.eye.addEventListener("click",(e)=>this.eyeHandler(e))
    }
    async inputHandler(e){
        if(this.ids) return
        var value=await this.clearTime(e.target,this.ids)
        this.changeSpan(e.target.name,value)
    }
    changeSpan(name,value){
        switch(name){
            case "username":
                this.changeSpanStyle(this.verity(name,value),this.spanList[0])
                break
            case "tel":
                this.changeSpanStyle(this.verity(name,value),this.spanList[2])
                break
            case "address":
                this.changeSpanStyle(this.verity(name,value),this.spanList[3])
                break
            case "password":
                this.changeSpanStyle(this.verity(name,value),this.spanList[1])
                if(this.verity(name,value)==="small") this.changePassColor(this.passSpan[0])
                else if(this.verity(name,value)==="middle") this.changePassColor(this.passSpan[1])
                else if(this.verity(name,value)==="big") this.changePassColor(this.passSpan[2])
                else if(!this.verity(name,value)) this.changeSpanStyle(this.verity(name,value),this.spanList[1])
        }
    }
    changePassColor(prev){
        Array.from(this.passSpan).forEach(item=>{
            if(item===prev) item.style.backgroundColor="red"
            else item.style.backgroundColor="#ddd"
        })
    }
    changeSpanStyle(bool,span){
        if(bool) span.textContent=""
        else span.textContent="输入格式错误！请重新输入！"
    }
    clearTime(input,ids){
        return new Promise(function(resolve,reject){
            ids=setTimeout(function(){
                clearTimeout(ids)
                ids=undefined
                resolve(input.value)
            },500)
        })
    }
    verity(name,value){
        switch(name){
            case "username":
                return /^[a-zA-Z]\w{7,31}$/.test(value)
            case "password":
                if(/^[0-9]{6,16}$/.test(value)) return 'small'
               else if(/^[a-zA-Z0-9]{6,16}$/.test(value)) return 'middle'
               else  if(/^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/.test(value)) return 'big'
               return false;
            case "tel":
                return /^1\d{10}$/.test(value);
            case "address":
                return /^[\u4E00-\u9FA50-9]{2,20}$/.test(value);
        }
    }
    async submitHandler(e){
        e.preventDefault()
        var fd=new FormData(this.form)
        let arr=[]
        for(let [key,value] of fd){
            arr.push(value)
        }
        let res=await ajax("http://localhost:4020/insertUser",{method:"POST",body:JSON.stringify(arr)})
        console.log(res.body.result);
        if(res.body.result) {
            location.href="./login.html"
        }else{
            alert("用户名已经存在")
        }
    }
    eyeHandler(e){
        this.boolEye=!this.boolEye
        this.eye.nextElementSibling.type=this.boolEye?"text":"password"
    }
    render(){
        this.elem.innerHTML=`
        <header>
        <div class="ceil">
            <div class="center clearFix">
                <div class="header-left">
                    <span>下午好！</span>
                    <span>找到中意的书了吗？</span>
                    <a href="./login.html">请登录</a>
                    <a href="./index.html">免费注册</a>
                </div>
                <div class="header-right">
                    <ul>
                        <li><a href="javascript:void(0)">我的学习</a></li>
                        <li><a href="javascript:void(0)">个人中心</a></li>
                        <li><a href="javascript:void(0)">我的订单</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </header>
    <div class="logo-title">
        <div class="center">
            <img src="../img/logo.jpg" alt="">
            <span>欢迎注册</span>
        </div>
    </div>
    <div class="register-form">
        <div class="register-con">
            <div class="reg-form">
                <form action="#">
                    <fieldset>
                        <div class="input-item">
                            <label for="username">
                                <span>*</span>用户名
                            </label>
                            <input id="username" type="text" name="username" placeholder="您的用户名" required>
                            <span class="username"></span>
                        </div>
                        <div class="input-item">
                            <label for="password">
                                <span>*</span>用户密码
                            </label>
                            <i class="eye eye-no-see" id="eye"></i>
                            <input id="password" type="password" name="password" placeholder="您的登录密码" required>
                            <span class="password"></span>
                        </div>
                        <div class="input-item setPass">
                            <ul>
                                <li>
                                    <div class="weak-bar">
                                        <span>弱</span>
                                    </div>
                                </li>
                                <li>
                                    <div class="weak-bar">
                                        <span>中</span>
                                    </div>
                                </li>
                                <li>
                                    <div class="weak-bar">
                                        <span>强</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div class="input-item">
                            <label for="tel">
                                <span>*</span>手机号码
                            </label>
                            <input id="tel" type="text" name="tel" placeholder="您的手机号码" required>
                            <span class="tel"></span>
                        </div>
                        <div class="input-item">
                            <label for="address">
                                <span>*</span>用户地址
                            </label>
                            <input id="address" type="text" name="address" placeholder="您的地址" required>
                            <span class="address"></span>
                        </div>
                        <div class="input-item">
                            <div class="btn">
                                <button name="btn" id="register">立即注册</button>
                            </div>
                        </div>
                    </fieldset>
                </form>
            </div>
        </div>
    </div>
    <div class="footer-reg">
        Copyright © 2015-2021 新华互联电子商务有限责任公司 版权所有
    </div>`
    }
}
new Register()