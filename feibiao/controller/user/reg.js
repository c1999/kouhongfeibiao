/**
 * Created by Administrator on 2018/11/6.
 */
let db = require('../../db/Model_1');
let log = require('../../utils/log');
let dbs = new db();
exports.reg = async(req,res)=>{
    log.warn('访问注册接口');
    let consequence = {};
    let data = req.body;
    let matter = false;
    let name = data.name;
    let password = data.password;
    try{
        let startTransaction = await dbs.startTransaction();
        let arrTransaction =[ dbs.reg_find(startTransaction.connection,name), dbs.reg_insert(startTransaction.connection,data)];
        for (let i = 0;i<arrTransaction.length;i++){
            let result =await arrTransaction[i];
            if(result===null){
                matter=true
            }
        }
        if (matter){
            let result =await dbs.rollback(startTransaction.connection);
            log.error(result);
            consequence = {
                result:'0',
                msg:'注册失败'
            };
            res.jsonp(consequence)
        }else {
            let result =await dbs.commit(startTransaction.connection);
            log.info(result);
            consequence = {
                result:'1',
                msg:'注册成功'
            };
            res.jsonp(consequence)
        }
    }catch (err){
        log.info(`注册时报错${err}`)
    }

};