import http from "http"
import sql from "./sql.js"
import cityData from "./cityData.js"
export default class Main {
    sqls
    constructor() {
        this.sqls = new sql()
        http.createServer(async (req, res) => {
            res.writeHead(200, {
                "Content-Type": "text/html;charset=utf-8",
                "Access-Control-Allow-Origin": "*"
            })
            let type = req.url.split("?")[0]
            this.router(type, req, res)
        }).listen(4020)
    }

    getData(req) {
        return new Promise(function (resolve, reject) {
            let data = ""
            req.on("data", function (chunk) {
                data += chunk
            })
            req.on("end", function () {
                resolve(data)
            })
        })
    }
    router(type, req, res) {
        switch (type) {
            case "/insertUser":
                return this.insertUser(req, res)
            case "/login":
                return this.loginUser(req, res)
            case "/selectBookAll":
                return this.selectAll(req, res)
            case "/selectBookById":
                return this.selectById(req, res)
            case "/insertCart":
                return this.insertCart(req, res)
            case "/addStepNum":
                return this.addCartStep(req, res)
            case "/selectCartAll":
                return this.selectCartAlls(req, res)
            case "/selectCart":
                return this.selectIsCart(req, res)
            case "/updateSelect":
                return this.updateSelect(req, res)
            case "/deleteCart":
                return this.deleteCartGood(req, res)
            case "/changeNum":
                return this.changeNum(req, res)
            case "/province":
                return this.getProvince(req, res);
            case "/city":
                return this.getCity(req, res);
            case "/county":
                return this.getCounty(req, res);
        }
    }
    async insertUser(req, res) {
        let data = await this.getData(req)
        try {
            data = JSON.parse(data);
        } catch (e) {};
        if (!Array.isArray(data)) {
            return res.end(JSON.stringify({
                result: false
            }));
        }
        let result = await this.sqls.insertDB(data)
        res.end(JSON.stringify({
            result
        }))
    }
    async loginUser(req, res) {
        let data = await this.getData(req)
        try {
            data = JSON.parse(data);
        } catch (e) {};
        if (!Array.isArray(data)) {
            return res.end(JSON.stringify({
                result: false
            }));
        }
        let result = await this.sqls.loginVerity(data)
        res.end(JSON.stringify({
            result
        }))
    }
    async loginUser(req, res) {
        let data = await this.getData(req)
        try {
            data = JSON.parse(data);
        } catch (e) {};
        if (!Array.isArray(data)) {
            return res.end(JSON.stringify({
                result: false
            }));
        }
        let result = await this.sqls.loginVerity(data)
        res.end(JSON.stringify({
            result
        }))
    }
    async selectAll(req, res) {
        let result = await this.sqls.selectBooks()
        res.end(JSON.stringify({
            result
        }))
    }
    async selectById(req, res) {
        let id = req.url.split("?")[1].split("=")[1]
        let result = await this.sqls.selectBookById(id)
        res.end(JSON.stringify({
            result
        }))
    }
    async insertCart(req, res) {
        let data = await this.getData(req)
        try {
            data = JSON.parse(data);
        } catch (e) {};
        if (!Array.isArray(data)) {
            return res.end(JSON.stringify({
                result: false
            }));
        }
        let result = await this.sqls.insertCartDB(data)
        res.end(JSON.stringify({
            result
        }))
    }
    async selectIsCart(req, res) {
        let data = await this.getData(req)
        try {
            data = JSON.parse(data);
        } catch (e) {};
        let result = await this.sqls.selectCart(data[0], data[1])
        res.end(JSON.stringify({
            result
        }))
    }
    async addCartStep(req, res) {
        let data = await this.getData(req)
        try {
            data = JSON.parse(data);
        } catch (e) {};
        let result = await this.sqls.addCartNum(data[0], data[1], data[2])
        res.end(JSON.stringify({
            result
        }))
    }
    async selectCartAlls(req, res) {
        let uid = req.url.split("?")[1].split("=")[1]
        let result = await this.sqls.selectCartAll(uid)
        res.end(JSON.stringify({
            result
        }))
    }
    async updateSelect(req, res) {
        let data = await this.getData(req)
        try {
            data = JSON.parse(data);
        } catch (e) {};
        let result = await this.sqls.updateSelected(data[0], data[1])
        res.end(JSON.stringify({
            result
        }))
    }
    async deleteCartGood(req, res) {
        let id = req.url.split("?")[1].split("=")[1]
        let result = await this.sqls.deleteCart(Number(id))
        res.end(JSON.stringify({
            result
        }))
    }

    async changeNum(req, res) {
        let data = await this.getData(req)
        try {
            data = JSON.parse(data);
        } catch (e) {};
        let result = await this.sqls.changeNumber(data[0], data[1], data[2])
        res.end(JSON.stringify({
            result
        }))
    }

    async getProvince(req, res) {
        res.end(JSON.stringify(cityData["86"]));
    }

    async getCity(req, res) {
        var data = await this.getData(req);
        data = JSON.parse(data);
        res.end(JSON.stringify(cityData[data.provinceId]));
    }
    async getCounty(req, res) {
        var data = await this.getData(req);
        data = JSON.parse(data);
        res.end(JSON.stringify(cityData[data.cityId]));
    }
}
new Main()