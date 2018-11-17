/**
 * Created by Administrator on 2018/11/6.
 */
let express = require('express');
const routers = express.Router();
let reg = require('../../controller/user/reg');
let login = require('../../controller/user/login');
let sign = require('../../controller/user/sign');
let addSite = require('../../controller/user/addSite');
let updateSite = require('../../controller/user/updateSite');
let deleteSite = require('../../controller/user/deleteSite');

routers
        /*注册接口*/
        .post('/reg',reg.reg)
        /*登录接口*/
        .post('/login',login.login)
        /*登录接口*/
        .post('/sign',sign.sign)
        .post('/addSite',addSite.addSite)
        .post('/updateSite',updateSite.updateSite)
        .post('/deleteSite',deleteSite.deleteSite);

exports.router = routers;