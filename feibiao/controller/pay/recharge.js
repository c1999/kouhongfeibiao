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
exports.recharge =async (req,res)=>{
    log.warn('访问充值接口');
    let consequence = {};
    let msg = req.body;
    let matter = false;
        try{
            let connection = await dbs.createConnection();
            let query=bluebird.promisify(connection.query,{context:connection});
            let result;
            result = await query(`select * from goods where type=0`);
            consequence = {
                result:'1',
                msg:result
            };
            res.jsonp(consequence)
        }catch (err){
            consequence = {
                result:'0',
                msg:'查询失败'
            };
            res.jsonp(consequence)
        }

};

