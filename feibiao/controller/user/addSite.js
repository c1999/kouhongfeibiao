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
* name          收件人
* phoneNumber   手机号码
* region        地区
* address       详细地址
* postcode      邮编
* openid        openid
* uid            用户id*/
exports.addSite =async (req,res)=>{
    log.warn('访问添加地址接口');
    let consequence = {};
    let msg = req.body;
    let matter = false;
    /*判断所需参数是否存在*/
    let msg2 = {
        name:'name',
        phoneNumber:'phoneNumber',
        region:'region',
        address:'address',
        postcode:'postcode',
        openId:'openId',
        uid:'uid'
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
            result = await query(`insert into site (openid,name,phoneNumber,region,address,postcode,uid) values('${msg.openId}','${msg.name}','${msg.phoneNumber}','${msg.region}','${msg.address}','${msg.postcode}','${msg.uid}')`);
            consequence = {
                result:'1',
                msg:'添加成功'
            };
            res.jsonp(consequence)
        }catch (err){
            consequence = {
                result:'0',
                msg:'添加失败'
            };
            res.jsonp(consequence)
        }
    }
};

