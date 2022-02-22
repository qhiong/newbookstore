//创建分页器的构造函数
function Pagination(ele,obj,cb){
    //把传入的参数设置为实例属性
    if(typeof ele === 'string') ele = document.querySelector(ele)
    this.ele=ele
    this.obj=obj || {}
    this.cb=cb || function(){}
    //创建默认参数
    this.default={
        pageInfo:{
            pagenum:1, //当前页
            pagesize:10, //每页显示10条
            totalsize:90, //总条数
            totalpage:9 //总页数
        },
        textInfo:{
            // first:'first',
            prev:'prev',
            list:'',
            next:'next',
            // last:'last'
        }
    }
    this.list='' //存放页码的位置
    //调用入口函数
    this.init()
}

//创建入口函数
Pagination.prototype.init=function(){
    //调用替换参数的函数
    this.tihuan()
    //显示内容
    this.show()
    //让所有按钮动起来
    this.dongqilai()
}
//给所有按钮绑定点击事件
Pagination.prototype.dongqilai=function(){
    //使用事件委托给大盒子对象绑定点击事件
    this.ele.onclick=(e)=>{
        //获取页码信息
        var pagenum=this.default.pageInfo.pagenum
        var totalpage=this.default.pageInfo.totalpage
        //事件对象兼容
        var e = e || window.event
        //目标对象兼容
        var target=e.target || e.srcElement
        //下一页
        if(target.className=="next" && pagenum!=totalpage){
            //把修改好的页码赋值给默认参数
            this.default.pageInfo.pagenum=pagenum+1
            //重新显示所有信息
            this.show()
        }
        //上一页
        if(target.className=='prev' && pagenum!=1){
            this.default.pageInfo.pagenum=pagenum-1
            this.show()
        }
        //尾页
        // if(target.className=="last" && pagenum!=totalpage){
        //     this.default.pageInfo.pagenum=totalpage
        //     this.show()
        // }
        //首页
        // if(target.className=='first' && pagenum!=1){
        //     this.default.pageInfo.pagenum=1
        //     this.show()
        // }
        //页码
        if(target.nodeName=="P" && pagenum!=target.innerHTML){
            this.default.pageInfo.pagenum=parseInt(target.innerHTML)
            this.show()
        }
        //GO按钮
        if(target.innerHTML=="GO" && target.previousElementSibling.value!=pagenum){
            //获取输入框中的值
            var m=target.previousElementSibling.value
            if(m > this.default.pageInfo.totalpage) return
            this.default.pageInfo.pagenum=parseInt(m)
            this.show()
        }
    }
}
//创建函数，用实参去替换默认参数
Pagination.prototype.tihuan=function(){
    //判断实参中是否有pageInfo信息
    if(this.obj.pageInfo){
        //遍历实参中的pageInfo信息
        for(let key in this.obj.pageInfo){
            //使用实参去替换默认参数
            this.default.pageInfo[key]=this.obj.pageInfo[key]
        }
    }
    if(this.obj.textInfo){
        for(let key in this.obj.textInfo){
            this.default.textInfo[key]=this.obj.textInfo[key]
        }
    }
}
//创建显示信息的函数
Pagination.prototype.show=function(){
    //清空当前盒子中所有内容
    this.ele.innerHTML=''
    //给大盒子对象设置样式
    setStyle(this.ele,{
        display: "flex",
        justifyContent: "right",
        alignItems:"center",
        margin:'10px 20px 10px 0'
    })
    //创建显示文本的函数
    this.showText()
    //创建显示页码的函数
    this.showP()
    //禁用按钮
    this.jinyong()
    //显示搜索框
    this.sousuo()
    //调用回调函数
    this.cb(this.default.pageInfo.pagenum)
}
Pagination.prototype.sousuo=function(){
    //获取当前页码信息
    var pagenum=this.default.pageInfo.pagenum
    //创建输入框
    var inp=document.createElement('input')
    //给输入框添加value属性值
    inp.value=pagenum
    //给当前输入框设置样式
    setStyle(inp,{
        width:"16px",
        marginLeft:"5px",
        marginRight:'5px',
        padding:'2px 5px'
    })
    //创建搜索按钮
    var btn=document.createElement('button')
    btn.innerHTML="GO"
    setStyle(btn,{
        padding:'2px 5px',
        borderColor:'transparent',
        color:'#fff',
        width: '60px',
        backgroundColor:'#D10000'
    })
    //把当前两个元素追加到大盒子中
    this.ele.appendChild(inp)
    this.ele.appendChild(btn)
}
Pagination.prototype.jinyong=function(){
    //获取当前大盒子中所有div对象
    var divs=this.ele.querySelectorAll('div')
    //获取页码信息
    var pagenum=this.default.pageInfo.pagenum
    var totalpage=this.default.pageInfo.totalpage
    //判断当前页码是否等于1
    divs.forEach(item=>{
      item.style.cursor = 'pointer'
    })
    if(pagenum==1){
        divs[0].style.backgroundColor="#DCDCDC"
        divs[0].style.cursor = 'not-allowed'
        // divs[1].style.backgroundColor="#666"
    }
    if(pagenum==totalpage){
        divs[2].style.cursor = 'not-allowed'
        divs[2].style.backgroundColor="#F5F5F5"
        // divs[4].style.backgroundColor="#666"
    }
}
//创建显示页码的函数
Pagination.prototype.showP=function(){
    //获取总页数和当前页码信息
    var pagenum=this.default.pageInfo.pagenum
    var totalpage=this.default.pageInfo.totalpage
    //判断总页数是否小于10
    if(totalpage<5){
        //让所有的页码全部显示
        for(var i=1;i<=totalpage;i++){
            var p1=createP(i,pagenum)
            //把p1对象追加到div中
            this.list.appendChild(p1)
        }
    }else{
        //判断当前页码是否小于5
        if(pagenum<5){
            for(var i=1;i<=5;i++){
                var p1=createP(i,pagenum)
                //把p1对象追加到div中
                this.list.appendChild(p1)
            }
            //创建一个span标签
            var span=document.createElement("span")
            span.innerHTML="..."
            //把当前span标签追加到div中
            this.list.appendChild(span)
            //最后显示2个
            for(var i=totalpage-1;i<=totalpage;i++){
                var p1=createP(i,pagenum)
                //把p1对象追加到div中
                this.list.appendChild(p1)
            }
        }else if(pagenum==5){
            for(var i=1;i<=7;i++){
                var p1=createP(i,pagenum)
                //把p1对象追加到div中
                this.list.appendChild(p1)
            }
            //创建一个span标签
            var span=document.createElement("span")
            span.innerHTML="..."
            //把当前span标签追加到div中
            this.list.appendChild(span)
            //最后显示2个
            for(var i=totalpage-1;i<=totalpage;i++){
                var p1=createP(i,pagenum)
                //把p1对象追加到div中
                this.list.appendChild(p1)
            }
        }else if(pagenum>5 && pagenum<totalpage-4){
            for(var i=1;i<=2;i++){
                var p1=createP(i,pagenum)
                //把p1对象追加到div中
                this.list.appendChild(p1)
            }
            //创建一个span标签
            var span=document.createElement("span")
            span.innerHTML="..."
            //把当前span标签追加到div中
            this.list.appendChild(span)
            //中间5页
            for(var i=pagenum-2;i<=pagenum+2;i++){
                var p1=createP(i,pagenum)
                //把p1对象追加到div中
                this.list.appendChild(p1)
            }
            //创建一个span标签
            var span=document.createElement("span")
            span.innerHTML="..."
            //把当前span标签追加到div中
            this.list.appendChild(span)
            //最后显示2个
            for(var i=totalpage-1;i<=totalpage;i++){
                var p1=createP(i,pagenum)
                //把p1对象追加到div中
                this.list.appendChild(p1)
            }
        }else if(pagenum==totalpage-4){
            for(var i=1;i<=2;i++){
                var p1=createP(i,pagenum)
                //把p1对象追加到div中
                this.list.appendChild(p1)
            }
            //创建一个span标签
            var span=document.createElement("span")
            span.innerHTML="..."
            //把当前span标签追加到div中
            this.list.appendChild(span)
            //最后显示7个
            for(var i=totalpage-6;i<=totalpage;i++){
                var p1=createP(i,pagenum)
                //把p1对象追加到div中
                this.list.appendChild(p1)
            }
        }else if(pagenum>totalpage-4){
            for(var i=1;i<=2;i++){
                var p1=createP(i,pagenum)
                //把p1对象追加到div中
                this.list.appendChild(p1)
            }
            //创建一个span标签
            var span=document.createElement("span")
            span.innerHTML="..."
            //把当前span标签追加到div中
            this.list.appendChild(span)
            //最后显示5个
            for(var i=totalpage-4;i<=totalpage;i++){
                var p1=createP(i,pagenum)
                //把p1对象追加到div中
                this.list.appendChild(p1)
            }
        }
    }
}

//创建显示文本的函数
Pagination.prototype.showText=function(){
    //获取默认参数中的文本信息
    var textInfo=this.default.textInfo
    //遍历当前文本信息
    for(let key in textInfo){
        //创建div对象
        var div=document.createElement('div')
        //给div对象添加class属性值
        div.className=key
        //判断当前key是否等于list
        if(key=="list"){
            this.list=div
            //给div对象设置为弹性盒子
            setStyle(div,{
                display: "flex",
                justifyContent: "center",
                alignItems:"center"
            })
        }else{
            //给当前div对象设置样式
            setStyle(div,{
                border:'1px solid #666',
                margin:"5px",
                padding:"2px 5px"
            })
            //给div对象添加文本内容
            div.innerHTML=textInfo[key]
        }
        //把创建好的div对象追加到盒子中
        this.ele.appendChild(div)
    }
}
//创建页码信息
function createP(m,num){
    //创建p标签
    var p1=document.createElement('p')
    //给p标签添加内容
    p1.innerHTML=m
    //给p标签设置样式
    setStyle(p1,{
        border:"1px solid #666",
        margin:"5px",
        padding:"2px 5px"
    })
    //判断m是否等于num
    if(m==num){
        setStyle(p1,{
            backgroundColor:"#ccc"
        })
    }
    //把当前p标签返回
    return p1
}
//设置样式
function setStyle(ele,o1){
    //遍历对象
    for(let key in o1){
        ele.style[key]=o1[key]
    }
}
export {Pagination}