const gulp=require("gulp");
const {src,dest,series,watch}=require("gulp");
const {concat,uglify,rename,babel,minifyCss}=require("gulp-load-plugins")();
const sass=require("gulp-sass")(require("sass"));
var htmlts=require("gulp-minify-html")
const browser=require("browser-sync")

function changeCss(done){
    src(["./src/css/*.css"])
    .pipe(sass())
    .pipe(minifyCss())
    .pipe(dest("./dist/css"))
    .on("end",browser.reload);
    done();
}

function changeHTML(done){
    src(["./src/views/*.html"])
    .pipe(htmlts())
    .pipe(dest("./dist/html"))
    .on("end",browser.reload);
    done();
}

function init(done){
    browser.init({
        "port":"4020",
        "server":"./"
    });
    watch("./src/css/*.css",changeCss);
    watch("./src/views/*.html",changeHTML);
    done();
}
exports.default=series([changeCss,changeHTML],init);
