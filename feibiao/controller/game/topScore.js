/**
 * Created by Administrator on 2018/11/7.
 */
let db = require('../../db/Model_1');
let log = require('../../utils/log');
let dbs = new db();
exports.topScore = async (req,res)=>{
    log.warn('访问分数上传接口');
    let consequence = {};
    let data = req.body;
    let matter = false;
    try {
        let result = await dbs.topScore(data);
        if(result==null){
            consequence = {
                result:'0',
                msg:'继续努力'
            };
            res.jsonp(consequence)
        }else {
            consequence = {
                result:'1',
                msg:'新纪录'
            };
            res.jsonp(consequence)
        }
    }catch (err){
        log.error(err)
    }
};