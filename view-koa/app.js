'use strict';

const Koa = require("koa");
const router = require("koa-router")();
const bodyParser = require("koa-bodyparser");
const controller = require('./controller');
const app = new Koa();
const staticFiles = require('./static-files');
const templating = require('./templating');
const isProduction = process.env.NODE_ENV === 'production';

app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    var
        start = new Date().getTime(),
        execTime;
    await next();
    execTime = new Date().getTime() - start;
    ctx.response.set('X-Response-Time', `${execTime}ms`);
});
app.use(staticFiles('/static/', __dirname + '/static'));
app.use(bodyParser());
app.use(templating('views', {
    noCache: !isProduction,
    watch: !isProduction
}));
app.use(controller());
app.listen(3000);
console.log("app started at port 3000...");