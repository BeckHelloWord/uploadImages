"use strict";

var fs = require('fs');
var formidable = require('formidable');
var path = require('path');
var fileSaveDir = "./upload/";

const fn_index = async (ctx, next) => {
    ctx.render('index.html', {
        title: 'H5图片上传',
        header: '图片上传'
    });
}

const cup_load = async (ctx, next) => {
    if (!fs.existsSync(fileSaveDir)) {
        fs.mkdirSync(fileSaveDir)
    }
   
    var form = new formidable.IncomingForm({
            uploadDir: fileSaveDir,
            encoding: 'utf-8',
            type: true,
            keepExtensions: true
        }),
        responseData = [];

    ctx.body = await form.parse(ctx.req, async (err, fields, files) => {
        if (err) {
            return err;
        }

        Object.keys(files).forEach(function (key) {
            var file = files[key];
            var filename = path.basename(file.path);
            console.log(file);
            //每张图片给予一分钟保存时间
            setTimeout(function() {
                if (!fs.existsSync(file.path)){
                    return false;
                }

                console.log("\x1B[33m删除文件" + filename + "\x1B[0m");
                fs.unlinkSync(file.path);
            }, 60 * 1000);

            // 塞入响应数据中
            responseData.push({
                type: file.type,
                name: file.name,
                path: './upload/' + filename + "." + file.type.split("/")[1],
                size: file.size / 1024 > 1024 ? (~~(10 * file.size / 1024 / 1024)) / 10 + "MB" : ~~(file.size / 1024) + "KB"
            });

            fs.rename(file.path, responseData[0].path, async (err) => {
                if(err){
                    throw err;
                }
            });
        });

        return JSON.stringify(responseData);
    })
};

module.exports = {
    'GET /': fn_index,
    'POST /cupLoad': cup_load
};