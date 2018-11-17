
let express = require('express');
const routers = express.Router();
let topScore = require('../../controller/game/topScore');
let rank = require('../../controller/game/rank');
let selectGame = require('../../controller/game/selectGame');
let startGame = require('../../controller/game/startGame');


routers
/*注册接口*/
    .post('/topScore',topScore.topScore)
    .post('/rank',rank.rank)
    .post('/selectGame',selectGame.selectGame)
    .post('/startGame',startGame.startGame);

exports.router = routers;