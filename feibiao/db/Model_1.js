/**
 * Created by Administrator on 2018/9/17.
 * 包含事务
 */
var Connection = require('../db/newmysql');
var bluebird=require('bluebird');
class Order{
    constructor(){
        this.oid=0;
        this.onumber="";//订单编号
        this.oaccount=0.0;//订单金额
        this.recipient="";//收件人
    }
    async createConnection(){
        return await Connection();
    }   
    async startTransaction(){
        let connection=await this.createConnection();
        var beginTransaction=bluebird.promisify(connection.beginTransaction,{context:connection});
        let result;
        try{
            result=await beginTransaction();
        }catch(e){
            result=null;
        }
        return {connection:connection,result:result};
    }
    async query(connection,sql){
        var query=bluebird.promisify(connection.query,{context:connection});
        let return_query;
        try{
            return_query=await query(sql);
        }catch(e){
            return_query=null;
        }
        return return_query;
    }
    async commit(connection){
        var commit=bluebird.promisify(connection.commit,{context:connection});
        let result;
        try{
            result=await commit();
            result='成功,提交!';
            connection.release();
        }catch(e){
            result=null;

        }
        return result;
    }
    async rollback(connection){
        var rollback=bluebird.promisify(connection.rollback,{context:connection});
        let result;
        result=await rollback();
        connection.release();
        result="错误，回滚!";
        return result;
    }
    async test (){
        let connection=await this.createConnection();
        let query=bluebird.promisify(connection.query,{context:connection});
        let result;
        try{
            result=await query(`select * from user `);
            /*if(result.length===0){
                result=null;
            }*/
        }catch(e){
            result=null;
        }
        connection.release();
        return result;
    }
    /*-------------------用户注册-------------------------------*/
    async reg_find (connection,name){
        let result;
        try{
            result = await this.query(connection,`select name from users where name='${name}'`);
            if(result.length!==0){
                result=null
            }
        }catch(err){
            result=null
        }
        return result;
    }
    async reg_insert (connection,msg){
        let result;
        try{
            result = await this.query(connection,`insert into users (name,password) values('${msg.name}','${msg.password}')`);
        }catch(err){
            result=null
        }
        return result;
    }

    /*------------------用户登录------------------------------*/
    /*所需参数 name,password,gameName
    * login 先判断账户数据库
    * login2 每个游戏对应一个游戏用户表在每个游戏用户表中注册*/
    async login (msg){
        let connection = await this.createConnection();
        let query = bluebird.promisify(connection.query,{context:connection});
        let result;
        try{
            result = await query(`select password from users where name='${msg.name}'`);
        }catch(err){
            result=null
        }
        connection.release();
        return result;
    }
    async login2 (msg){
        let connection = await this.createConnection();
        let query = bluebird.promisify(connection.query,{context:connection});
        let result;
        try{
            let userResult = await this.query(connection,`select id from users where name='${msg.name}'`);
            result = await this.query(connection,`select 1 from ${msg.gameName} where userId='${userResult[0].id}'`);
            console.log(result);
            if(result.length==0){
                result = await this.query(connection,`insert into ${msg.gameName}(userId,accountSign,topScore,integral) values('${userResult[0].id}',0,0,0)` )
            }
        }catch(err){
            result=null
        }
        connection.release();
        return result;
    }
    /*-----------------用户签到------------------------------*/
    /*所需参数 name ganmaName*/
    async sign(msg){
        let connection = await this.createConnection();
        let query = bluebird.promisify(connection.query,{context:connection});
        let result;
        try {
            let userData = await query(`select id from users where name='${msg.name}'`);
                /*判断该用户今天是否签到*/
            result = await query(`select 1 from  sign where userId='${userData[0].id}'and date='${msg.date}' limit 1`);
            if(result.length==0){
                /*插入当天签到信息*/
                result = await query(`insert into sign (date,userId) values('${msg.date}','${userData[0].id}')`);
                /*判断前一天是否签到*/
                result = await query(`select 1 from sign where userId='${userData[0].id}'and date='${msg.yesterday}' limit 1`);
                if(result.length==1){
                    result = await query(`update ${msg.gameName} set accountSign =accountSign+1 where userId='${userData[0].id}'`);
                    result = await query(`select accountSign from ${msg.gameName} where userId = '${userData[0].id}'`);
                }else {
                    result = await query(`update ${msg.gameName} set accountSign =1 where userId='${userData[0].id}'`);
                    result = await query(`select accountSign from ${msg.gameName} where userId = '${userData[0].id}'`);
                }
            }else {
                 result = null
            }

        }catch (err){
            result=null
        }
        connection.release();
        return result;
    }
    /*-----------------最高分--------------------------------*/
    /*所需参数 name gamaName topScore*/
    async topScore (msg){
        let connection = await this.createConnection();
        let query = bluebird.promisify(connection.query,{context:connection});
        let result;
        try{
            let userData = await query(`select id from users where name='${msg.name}'`);
            result = await query(`select topScore from ${msg.gameName} where userId='${userData[0].id}'`);
            if (result[0].topScore<msg.topScore){
                result = await query(`UPDATE ${msg.gameName} SET topScore = '${msg.topScore}'where ${result[0].topScore}<${msg.topScore} and userId=${userData[0].id}`);
            }else {
                result=null
            }
        }catch(err){
            result=null
        }
        connection.release();
        return result;
    }

    /*-----------------排行榜--------------------------------*/
    async rank(msg){
        let connection = await this.createConnection();
        let query = bluebird.promisify(connection.query,{context:connection});
        let result;
        try{
            result = await query(`select ${msg.gameName}.topScore ,users.name from ${msg.gameName},users where ${msg.gameName}.userId=users.id`);
            /*排序*/
            result.sort((a,b)=>{
                return a.topScore-b.topScore
            });
        }catch(err){
            result=null
        }
        connection.release();
        return result;
    }

}

module.exports=Order;

//案例
/*
let product=new Product();
async function getUser(){
    let result=await product.findUserByName("wushichao");
    console.log(result);
}

getUser();*/
/*let product=new Product();
async function getUser(){
    let result=await product.findProducts();
    console.log(result);
    let p=[];
    for(let i=0;i<result.length;i++){
        let data=await product.findProductByPid(result[i].pid);
        result[i].counts=data.counts;
        result[i].sales=data.sales;
        result[i].tid=data.tid;
        result[i].t2id=data.t2id;
        p.push(result[i]);
    }
    console.log(p);

}

getUser();*/

