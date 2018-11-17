/**
 * Created by Administrator on 2018/11/7.
 */
let db = require('../../db/Model_1');
let log = require('../../utils/log');
let util = require('../../utils/util');
let dbs = new db();
exports.sign =async (req,res)=>{
    log.warn('访问签到接口');
    let consequence = {};
    let data = req.body;
    let matter = false;
    let name = data.name;
    data.date = util.getNowFormatDate();
    data.yesterday = util.getNowFormatyesterday();
    try {
        let result = await dbs.sign(data);
        if(result==null){
            consequence = {
                result:"0",
                msg:'已经签到或参数错误'
            };
            res.json(consequence)
        }else {
            consequence = {
                result:"1",
                msg:result
            };
            res.json(consequence)
        }
    }catch (err){
        log.error(err)
    }
};

