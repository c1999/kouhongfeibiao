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

 * id            地址id*/
exports.deleteSite =async (req,res)=>{
    log.warn('访问添加地址接口');
    let consequence = {};
    let msg = req.body;
    let matter = false;
    /*判断所需参数是否存在*/
    let msg2 = {
        id:'id'
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
            result = await query(`delete from site where id = '${msg.id}'`);
            consequence = {
                result:'1',
                msg:'删除成功'
            };
            res.jsonp(consequence)
        }catch (err){
            consequence = {
                result:'0',
                msg:'删除失败'
            };
            res.jsonp(consequence)
        }
    }
};

