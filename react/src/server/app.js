var express = require('express');
//创建app应用
var app = express();
//引入链接数据库底层
var mongoose = require('mongoose');
//引入cookies处理模块
var Cookies = require('cookies');
//引入用户数据模型
var User = require('../data/models/User');
/* 设置中间件 start */
//引入body-parser，用来处理post提交过来的数据
var bodyParser = require('body-parser');
app.use( bodyParser.urlencoded({extended:true}) );

//网站访问都会经过该中间件
app.use( function( req, res, next ){
    //设置头部
    res.header("Access-Control-Allow-Origin", "http://localhost:3000"); //允许跨域
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials",true);
    res.header("X-Powered-By",' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
     
    //权限校验
    req.cookies = new Cookies( req, res );
    req.userInfo = {};
    if(req.cookies.get('userInfo')){
        try{
            req.userInfo = JSON.parse( req.cookies.get('userInfo') );
            //获取当前登录用户的类型，是否是管理员
            User.findById(req.userInfo._id).then(function(userInfo) {
                req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
                next();
            })
        }catch(e){
            next(); 
        }
    }else{
    	next();
    }
    
    
} );
/* 设置中间件 end */
//

//路由
// app.get('/',function(res,res,next){
// 	//第一参数是模版文件的目录，第二个参数是传递给文件的数据
//     res.render('index')
// });
//使用接口路由
app.use('/api',require('../routers/api'));
//监听http请求
mongoose.connect('mongodb://localhost:27020/blog',function (err) {
  if (!err) {
    console.log('连接数据库成功!');
	app.listen(8081);
  } else {
  	console.log('连接数据库失败!');
    throw err;
  }
});
