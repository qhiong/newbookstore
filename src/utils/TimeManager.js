export default class TimeManager{
    static _instance;
    list=new Set();
    ids;
    static getInstance(){
        if(!TimeManager._instance){
            TimeManager._instance=new TimeManager();
        }
        return TimeManager._instance;
    }
    add(item){
        this.list.add(item);
        if(!this.ids && this.list.size>0){
            this.animation();
        }
    }

    remove(item){
        if(!this.list.has(item))return;
        this.list.delete(item);
        if(this.list.size===0 && this.ids){
            cancelAnimationFrame(this.ids);
            this.ids=undefined;
        }
    }
    update(){
        this.list.forEach(item=>{
            if(item.update) item.update();
        })
    }
    animation(){
        this.ids=requestAnimationFrame(()=>this.animation());
        this.update();
    }

}