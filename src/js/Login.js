import Component from '../component/Component.js'
import ajax from '../server/Ajax.js';
export default class Login extends Component{
    spanList
    form
    eye
    boolEye=false
    constructor() {
        super()
        document.body.appendChild(this.elem)
        this.render()
        this.spanList=this.elem.querySelectorAll("span[class]")
        this.form=this.elem.querySelector("form")
        this.form.addEventListener("input",(e)=>this.inputHandler(e))
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
            case "password":
                this.changeSpanStyle(this.verity(name,value),this.spanList[1])
                break
        }
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
        }
    }
    async submitHandler(e){
        e.preventDefault()
        var fd=new FormData(this.form)
        let arr=[]
        for(let [key,value] of fd){
            arr.push(value)
        }
        let res=await ajax("http://localhost:4020/login",{method:"POST",body:JSON.stringify(arr)})
        console.log(res.body.result);
        if(res.body.result) {
            localStorage.user=JSON.stringify(res.body.result)
            location.href="./index.html"
        }else{
            alert("用户信息错误")
        }
    }
    eyeHandler(e){
        this.boolEye=!this.boolEye
        this.eye.nextElementSibling.type=this.boolEye?"text":"password"
    }

    render(){
        this.elem.innerHTML=`<div class="logo-title">
        <div class="center">
            <img src="../img/logo.jpg" alt="">
            <span>欢迎登录</span>
        </div>
    </div>

    <div class="login-main">
        <div class="outer-login">
            <div class="login-form">
                <div class="login">
                    <div class="login-top">
                        <span>账户登录</span>
                    </div>
                    <div class="login-con">
                        <form action="#">
                            <div class="input-item">
                                <input type="text" name="username" placeholder="您的用户名">
                                <span class="username"></span>
                            </div>
                            <div class="input-item">
                                <i class="eye eye-no-see" id="eye"></i>
                                <input type="password" name="password" placeholder="您的用户密码">
                                <span class="password"></span>
                            </div>
                            <div class="input-item link-group">
                                <a href="#">忘记密码</a>
                                <a href="./register.html">免费注册</a>
                            </div>
                            <div class="input-item">
                                <div class="btn">
                                    <button name="btn" id="register">立即登录</button>
                                </div>
                            </div>
                            <div class="other-login">
                                <div class="othor-top">
                                    <span>or</span>
                                </div>
                                <div class="othor-bottom">
                                    <a href="#" class="iconfont icon-weixin"></a>
                                    <a href="#" class="iconfont icon-QQ-circle-fill"></a>
                                    <a href="#" class="iconfont icon-weibo"></a>
                                </div>
                            </div>
                            <div class="go-xuexi">
                                <img src="../img/go.png" alt="">
                                <span>学习强国用户请点击这里</span>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="footer-reg">
        Copyright © 2015-2021 新华互联电子商务有限责任公司 版权所有
    </div>`
    }
}

new Login()