/**
 * Created by Administrator on 2018/11/16.
 */
/**
 * Created by Administrator on 2018/11/16.
 */
/**
 * Created by Administrator on 2018/11/16.
 */
/**
 * Created by Administrator on 2018/11/7.
 */
let db = require('../../db/Model_1');
let log = require('../../utils/log');
let util = require('../../utils/util');
let dbs = new db();
let bluebird=require('bluebird');
/*所需参数
 uid                用户id
 * goodsId            商品id*/
exports.startGame =async (req,res)=>{
    log.warn('访问开始游戏接口');
    let consequence = {};
    let msg = req.body;
    let matter = false;
    /*判断所需参数是否存在*/
    let msg2 = {
        uid:'uid',
        goodsId:'goodsId'
    };
    let result =util.hasOwnProperty(msg,msg2);
    if(result!=null){
        result = {
            result:'0',
            msg:`缺少参数${result}`
        };
        res.jsonp(result)
    }else {
        try{
            let connection = await dbs.createConnection();
            let query=bluebird.promisify(connection.query,{context:connection});
            let result;
            let goodsData = await query(`select * from goods where id = '${msg.goodsId}'`);
            let userData = await query(`select wallet from user where id=${msg.uid}`);
            if(userData[0].wallet>goodsData[0].price){
                 let order = {
                 uid:msg.uid,
                 commodity_id:msg.goodsId,
                 orderNumber:new Date().getTime().toString(),
                 state:1,
                 time:getNowFormatDate(),
                 name:goodsData[0].name,
                 goodsType:goodsData[0].type,
                 price:goodsData[0].price
                 };
                result = await query(`insert into orders (uid,commodity_id,orderNumber,state,name,goodsType,price,time) values('${order.uid}','${order.commodity_id}','${order.orderNumber}','${order.state}','${order.name}','${order.goodsType}','${order.price}','${order.time}')`);
                result = await query(`update user set wallet=wallet-${goodsData[0].price} where id=${msg.uid}`);
                consequence = {
                 result:'1',
                 msg:'可进入游戏'
                 };
                 res.jsonp(consequence)
            }else {
                consequence = {
                    result:'0',
                    msg:'需要充值'
                };
                res.jsonp(consequence)
            }
        }catch (err){
            consequence = {
                result:'0',
                msg:'出错啦'
            };
            res.jsonp(consequence)
        }
    }
};

function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();

    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }

    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + date.getHours() + seperator2 + date.getMinutes()
        + seperator2 + date.getSeconds();
    return currentdate;
}