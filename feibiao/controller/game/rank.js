/**
 * Created by Administrator on 2018/11/7.
 */
let db = require('../../db/Model_1');
let log = require('../../utils/log');
let dbs = new db();
exports.rank = async (req,res)=>{
    log.warn('访问排行榜');
    let consequence = {};
    let data = req.body;
    let matter = false;
    try {
        let result = await dbs.rank(data);
        log.info(result);
        if(result==null){
            consequence = {
                result:'0',
                msg:'出错啦'
            };
            res.jsonp(consequence)
        }else {
            consequence = {
                result:'1',
                msg:result
            };
            res.jsonp(consequence)
        }
    }catch (err){

    }
};