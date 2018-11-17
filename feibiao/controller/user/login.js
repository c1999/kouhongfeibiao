/**
 * Created by Administrator on 2018/11/7.
 */
let db = require('../../db/Model_1');
let log = require('../../utils/log');
let util = require('../../utils/util');
let request = require('request');
let bluebird=require('bluebird');
let dbs = new db();
exports.login =async (req,res)=>{
    log.warn('访问登录接口');
    let consequence = {};
    let msg = req.body;
    request.post(
        {url:'http://account.ykplay.com/ykVerify/Verify',
        form: {app:msg.app,
            loginType:msg.loginType,
            access_token:msg.access_token,
            openId:msg.openId}},
        async(err,httpResponse,body)=>{
            try{
                let result = JSON.parse(body);
                if(result.encode!==0){
                    log.info('登录验证通过');
                    if(msg.usertype=='first_login'){
                        log.info('第一次登录');
                        let connection = await dbs.createConnection();
                        let query=bluebird.promisify(connection.query,{context:connection});
                        let result;
                        result = await query(`insert into user (name,openid) values('${msg.name}','${msg.openId}')`);
                        result = await query(`insert into user (name,openid) values('${msg.name}','${msg.openId}')`);
                        console.log(result);
                        consequence = {
                            result:'1',
                            msg:result
                        };
                        res.jsonp(consequence)
                    }else {
                        let connection = await dbs.createConnection();
                        let query=bluebird.promisify(connection.query,{context:connection});
                        let result;
                        result = await query(`select * from user where openid='${msg.openId}';`);
                        consequence = {
                            result:'1',
                            msg:result,

                        };
                        let data = {
                            name:msg.name,
                            openid:msg.openid,
                            time:util.getNowFormatDate()
                        };
                        log.getLog(JSON.stringify(data),"login","当日登录记录");
                        res.jsonp(consequence)

                    }
                }else {
                    consequence = {
                        result:'0',
                        msg:'登录失败'
                    };
                    res.jsonp(consequence)
                }
            }catch (err){
                log.error(err)
            }
        });

};