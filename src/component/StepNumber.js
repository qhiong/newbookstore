import Component from "../component/Component.js";

export default class StepNumber extends Component{
    input;
    step=1;
    ids;
    static STEP_CHANGE_EVENT="step_change_event";
    constructor(){
        super();
        this.elem.className="step";
        this.render();
        this.setCss();
        this.input=this.elem.querySelector("input");
        this.input.addEventListener("input",e=>this.inputHandler(e));
        this.elem.addEventListener("click",e=>this.clickHandler(e));
    }
    render(){
        this.elem.innerHTML=`
            <div class='left' disabled>-</div>
            <input type='text' value='1'>
            <div class='right'>+</div>
        `
    }
    inputHandler(e){
        if(this.ids) return;
        this.ids=setTimeout(()=>{
            clearTimeout(this.ids);
            this.ids=undefined;
            this.setStep(this.input.value);
            this.dispatch()
        },500)
    }
    clickHandler(e){
        if(e.target.nodeName==="INPUT" || e.target===e.currentTarget) return;
        if(e.target.className==="left"){
            this.setStep(this.step-1);
        }else{
            this.setStep(this.step+1);  
        }
        this.dispatch()
    }
    dispatch(){
        var evt=new Event(StepNumber.STEP_CHANGE_EVENT,{target:this});
        evt.step=this.step;
        evt.self=this;
        this.dispatchEvent(evt);
    }

    setStep(_step){
        _step=~~_step;
        this.elem.querySelectorAll("[disabled]").forEach(item=>{
            item.removeAttribute("disabled");
        })
        if(_step<=1){
            _step=1;
            this.elem.firstElementChild.setAttribute("disabled","");
        }
        if(_step>=99){
            this.elem.lastElementChild.setAttribute("disabled","");
            _step=99;
        }
        this.step=_step;
        this.input.value=this.step;
    }
    setCss(){
        StepNumber.setCss(`
            .step{
                width:80px;
                height:20px;
            }
            .step>div{
                float:left;
                width:15px;
                height:20px;
                border:1px solid #000;
                text-align:center;
                line-height:18px;
                user-select:none;
                font-size:14px;
            }
            .step>div[disabled]{
                border-color:#ccc;
                color:#ccc;
            }
            .step>input{
                width:42px;
                height:20px;
                float:left;
                padding:0 2px;
                border-width:1px;
                border-left-style:none;
                border-right-style:none;
                outline:none;
                text-align:center;
            }
        `);
    }
   
}