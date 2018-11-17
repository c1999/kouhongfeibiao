/**
 * Created by Administrator on 2018/11/6.
 */
const express = require('express');
const app = express();
const log = require('../utils/log');
const  cors = require('cors');
const bodyParser = require('body-parser');
let db = require('../db/Model_1.js');
let router = require('../router/index.js');
//跨域问题
app.use(cors());
/*接收json数据中间件*/
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//创建db实例
let dbTest = new db();

router.app(app);
app.listen(1414,'127.0.0.1',(req,res)=>{
    log.info('逻辑服务器开启')

});