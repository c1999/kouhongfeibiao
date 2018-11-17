/**
 * Created by Administrator on 2018/11/16.
 */
/**
 * Created by Administrator on 2018/11/6.
 */
let express = require('express');
const routers = express.Router();
let recharge = require('../../controller/pay/recharge');
let order = require('../../controller/pay/order');
let rechargeVerify = require('../../controller/pay/rechargeVerify');


routers
/*注册接口*/
    .post('/recharge',recharge.recharge)
    .post('/order',order.order)
    .post('/rechargeVerify',rechargeVerify.rechargeVerify);
exports.router = routers;