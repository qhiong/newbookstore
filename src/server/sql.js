import mysql from "mysql"

export default class Sql {
    db
    constructor() {
        this.db = mysql.createConnection({
            url: "localhost",
            port: 3306,
            user: "root",
            password: "root",
            database: "bookstore"
        })
        this.testConnect()

    }
    async testConnect(){
        let bool=await this.isConnect()
        if(!bool){
            console.log("数据库连接失败，服务关闭");
            return;
        }else{
            console.log("数据库连接成功!");
        }
    }
    isConnect() {
        return new Promise((resolve, reject)=> {

            this.db.connect(function (err,res) {
                if(err) resolve(false);
                else resolve(true); 
            })
        })
    }
    insertDB(arr) {
        return new Promise((resolve, reject)=> {
            let strSql = "INSERT INTO `user`(`user`, `password`, `tel`, `address`) VALUES (?,?,?,?)"
            this.db.query(strSql, arr, function (err, res) {
                if (err) {
                    resolve(false)
                } else {
                    resolve(true)
                }
            })
        })
    }
    loginVerity(arr) {
        return new Promise( (resolve, reject)=> {
            let strSql = "SELECT * FROM `user` WHERE `user`='" + arr[0] + "' and `password`='" + arr[1] + "'"
            this.db.query(strSql, function (err, res) {
                if (Array.from(res).length === 0) {
                    resolve(false)
                } else {
                    resolve(res)
                }
            })
        })
    }
    selectBooks() {
        return new Promise( (resolve, reject)=>{
            let strSql = "SELECT * FROM `book`,`author`,`bookImage` WHERE `book`.`pid`=`bookimage`.`pid` and `book`.`authorId`=`author`.`authorId`"
            this.db.query(strSql, function (err, res) {
                if (err) {
                    resolve(false)
                } else {
                    resolve(res)
                }
            })
        })
    }
    selectBookById(id) {
        return new Promise( (resolve, reject)=>{
            let strSql = "SELECT * FROM `book`,`bookimage`,`author` WHERE `bookimage`.`pid`=`book`.`pid` and `book`.`authorId`=`author`.`authorId` and `book`.`bid` = " + Number(id)
            this.db.query(strSql, function (err, res) {
                if (err) {
                    resolve(false)
                } else {
                    resolve(res)
                }
            })
        })
    }
    insertCartDB(arr) {
        return new Promise((resolve, reject)=>{
            let strSql = "INSERT INTO `cart`(`bid`, `uid`, `number`, `total`, `selected`) VALUES (?,?,?,?,?)"
            this.db.query(strSql, arr, function (err, res) {
                if (err) {
                    resolve(false)
                } else {
                    resolve(true)
                }
            })
        })
    }
    addCartNum(cid, num, total) {
        return new Promise((resolve, reject)=>{
            let strSql = "UPDATE `cart` SET `number`=" + num + ",`total`=" + total + " WHERE `cid`=" + cid
            this.db.query(strSql, function (err, res) {
                if (err) {
                    resolve(false)
                } else {
                    resolve(true)
                }
            })
        })
    }
    selectCart(bid, uid) {
        return new Promise((resolve, reject)=> {
            let strSql = "SELECT * FROM `cart` WHERE `bid`=" + bid + " AND `uid`=" + uid
            this.db.query(strSql, function (err, res) {
                if (err) {
                    resolve(false)
                } else {
                    resolve(res)
                }
            })
        })
    }
    selectCartAll(uid) {
        return new Promise( (resolve, reject)=> {
            let strSql = "SELECT `cart`.`cid`,`cart`.`selected`,`bookimage`.`image`,`book`.`bookName`,`book`.`lowPrice`,`cart`.`number`,`cart`.`total` FROM `cart`,`user`,`bookimage`,`book` WHERE `user`.`id`=`cart`.`uid` and `cart`.`bid`=`book`.`bid` and `book`.`pid`=`bookimage`.`pid` and `uid` = "+Number(uid)
            this.db.query(strSql, function (err, res) {
                if (err) {
                    resolve(false)
                } else {
                    resolve(res)
                }
            })
        })
    }
    updateSelected(selected, cid) {
        return new Promise( (resolve, reject)=>{
            let strSql = "UPDATE `cart` SET `selected`=" + String(selected) + " WHERE `cid`=" + cid
            this.db.query(strSql, function (err, res) {
                if (err) {
                    resolve(false)
                } else {
                    resolve(res)
                }
            })
        })
    }

    deleteCart(cid) {
        return new Promise( (resolve, reject) =>{
            let strSql = "DELETE FROM `cart` WHERE `cid`=" + cid
            this.db.query(strSql, function (err, res) {
                if (err) {
                    resolve(false)
                } else {
                    resolve(res)
                }
            })
        })
    }
    changeNumber(cid, num, total) {
        return new Promise( (resolve, reject)=> {
            let strSql = "UPDATE `cart` SET `number`=" + num + ",`total`=" + total + " WHERE `cid`=" + cid
            this.db.query(strSql, function (err, res) {
                if (err) {
                    resolve(false)
                } else {
                    resolve(res)
                }
            })
        })
    }
}