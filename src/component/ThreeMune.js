import Component from "../component/Component.js";
import ajax from "../server/Ajax.js"
export default class ThreeMune extends Component {
    constructor() {
        super()
        document.querySelector(".choice-address").appendChild(this.elem)
        this.render()
        this.getCityData();
    }
    clickHandler(e) {
        if (e.target.nodeName !== "A") return;
        $(e.target).parents("ul").prevAll(".show-txt").text($(e.target).text());
        var menuType = $(e.target).parents(".btn-group").attr("id")
        var id = $(e.target).attr("id");
        this.getCityData(menuType, id);
    }
    setMenu(type, data) {
        var str = "";
        $.each(data, function (key, value) {
            str += `<li><a id="${key}" href="javascript:void(0)">${value}</a></li>`
        });
        $("#" + type + ">ul").html(str).on("click", e => this.clickHandler(e));
        var evt = new Event("click", {
            bubbles: true
        });
        $("#" + type + ">ul>li:first-child>a")[0].dispatchEvent(evt);
    }
    async getCityData(menuType, id) {
        var data;
        var router;
        switch (menuType) {
            case "province":
                data = await ajax("http://localhost:4020/city", {
                    method: "post",
                    body: JSON.stringify({
                        provinceId: id
                    })
                });
                router = "city";
                break;
            case "city":
                data = await ajax("http://localhost:4020/county", {
                    method: "post",
                    body: JSON.stringify({
                        cityId: id
                    })
                });
                router = "county";
                break;
            case "county":
                return;
            default:
                data = await ajax("http://localhost:4020/province");
                router = "province"
                break;
        }
        data = data.body
        this.setMenu(router, data);
    }
    render() {
        this.elem.innerHTML = `
        <div class="row col-xs-12" >
        <div class="btn-group dropdown col-xs-4" style="padding:0;margin:0" id="province">
          <button class="show-txt" style="padding:0;margin:0"></button>
          <button class="dropdown-toggle" style="padding:0;margin:0" type="button" data-toggle="dropdown"><span class="caret" style="padding:0;margin:0"></span></button>
          <ul class="dropdown-menu" style="padding:0;margin:0">
          </ul>
        </div>
        <div class="btn-group dropdown style="padding:0;margin:0"  col-xs-4" id="city">
          <button class="show-txt"  style="padding:0;margin:0"></button>
          <button class="dropdown-toggle"  style="padding:0;margin:0" type="button" data-toggle="dropdown"><span class="caret"  style="padding:0;margin:0"></span></button>
          <ul class="dropdown-menu" style="padding:0;margin:0">
          </ul>
        </div>
        <div class="btn-group dropdown style="padding:0;margin:0"  col-xs-4" id="county">
          <button class="show-txt"  style="padding:0;margin:0"></button>
          <button class="dropdown-toggle" type="button" data-toggle="dropdown"  style="padding:0;margin:0"><span class="caret"  style="padding:0;margin:0"></span></button>
          <ul class="dropdown-menu"  style="padding:0;margin:0">
          </ul>
        </div>
      </div>
        `
    }
}