/**
 * Created by Administrator on 2018/11/16.
 */
/**
 * Created by Administrator on 2018/11/6.
 */
const express = require('express');
const app = express();
const  cors = require('cors');
const httpProxy = require("http-proxy");
const logicServer = require('./logic_server/app');
let log = require('./utils/log.js');
let proxy = httpProxy.createProxyServer();
let path = require('path');
app.use(express.static(path.join(process.cwd(),"api")));
let reqNum  = 0;
//跨域问题
app.use(cors());
/*async function test(){
 let user = await dbTest.test();
 console.log(user)
 }*/
/*------------------入口监听---------------------------------*/
proxy.on('proxyReq',()=>{
    reqNum++;
    log.info('接收到一个请求,当前的请求数量是'+reqNum)
});
proxy.on("proxyRes",()=>{
    reqNum--;
    log.info('完成一个请求,当前的剩余的请求数量是 '+reqNum)
});
proxy.on('error',  (err, req, res)=> {
    res.writeHead(500, {'Content-Type': 'text/plain'});
    res.end('PayServer Something went wrong. And we are reporting a custom error message.');
});

app.use( function (req,res) {
    proxy.web(req, res, {target: 'http://localhost:1414'});
});
app.listen(1996,(req,res)=>{
    log.info('代理服务器1999开启')
});


