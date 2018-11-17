/**
 * Created by Administrator on 2018/11/16.
 */
/**
 * Created by Administrator on 2018/11/7.
 */
let db = require('../../db/Model_1');
let log = require('../../utils/log');
let util = require('../../utils/util');
let request = require('request');
let bluebird=require('bluebird');
let dbs = new db();
exports.rechargeVerify =async (req,res)=>{
    log.warn('访问支付验证接口');
    let consequence = {};
    let msg = req.body;
    let msg2 = {
        orderNumber:'orderNumber',
        openid:'openid'
    };
    let result =util.hasOwnProperty(msg,msg2);
    if(result!=null){
        result = {
            result:'0',
            msg:`缺少参数${result}`
        };
        res.jsonp(result)
    }else {
        request('https://pay.ykplay.com/miniWx/miniVerify?orderNumber='+msg.orderNumber+'&openid='+msg.openid,async (error,response,body)=>{
            body = JSON.parse(body);
            if(body.result=='1'){
                log.info(body+"支付成功");
                try{
                    let connection = await dbs.createConnection();
                    let query=bluebird.promisify(connection.query,{context:connection});
                    let result;
                    let goodsData = await query(`update orders set state=1 where orderNumber=${msg.orderNumber}`);
                    goodsData = await query(`select price from orders where orderNumber=${msg.orderNumber}`);
                    let userData = await query(`update user set wallet=wallet+${goodsData[0].price} where openid=${msg.openid}`);
                    consequence = {
                        result:'0',
                        msg:'验证成功'
                    };
                    res.jsonp(consequence)
                }catch (err){
                    consequence = {
                        result:'0',
                        msg:'验证失败'
                    };
                    res.jsonp(consequence)
                }
            }else {
                consequence = {
                    result:'0',
                    msg:'验证失败'
                };
                res.jsonp(consequence)
            }
        });

    }
};