/**
 * Created by Administrator on 2018/11/6.
 */
let user = require('./user/index.js');
let game = require('./game/index.js');
let pay = require('./pay/index.js');
exports.app = (app)=>{
    app.use('/user',user.router);
    app.use('/game',game.router);
    app.use('/pay',pay.router)
};