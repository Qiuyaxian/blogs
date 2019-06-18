var express = require('express');
//创建app应用
var app = express();
//
var mongoose = require('mongoose');
//引入模版处理模块
var swig = require('swig');
//取消缓存
swig.setDefaults({ cache:false });
//引入cookies处理模块
var Cookies = require('cookies');
var cookieParser = require('cookie-parser');

//使用express-session管理session
var session = require('express-session')

//使用redis同步管理session
var RedisStore = require('connect-redis')(session);

//引入用户数据模型
var User = require('./models/User');
/* 设置中间件 start */
//引入body-parser，用来处理post提交过来的数据
var bodyParser = require('body-parser');
app.use( bodyParser.urlencoded({extended:true}) );
//设置静态文件托管
app.use('/public',express.static(__dirname+'/public'));

//引入ioredis操作
//var redis = require('./redis.js').reids;
//引入redis操作
var redis = require("redis");
//
//配置应用模版
//定义当前应用模块应用所使用的模版引擎
//第一个参数；模版的后缀名(模版格式)，第二个参数表示用来解析处理模版内容的方法
app.engine('html',swig.renderFile);
//设置模版文件存放的目录，第一个参数不能更改，必须是，第二个参数是模版存放的路径
app.set('views', __dirname + '/views');
//注册所使用的模版引擎，第一个参数必须是view engine,第二个参数和app.engie这个方法中的模版引擎的名称(第一个)必须保持一致
app.set('view engine', 'html');

//网站访问都会经过该中间件 

// app.use( function( req, res, next ){

//     req.cookies = new Cookies( req, res );
//     req.userInfo = {};
//     if(req.cookies.get('userInfo')){
//         try{
//             req.userInfo = JSON.parse( req.cookies.get('userInfo') );
//             //获取当前登录用户的类型，是否是管理员
//             User.findById(req.userInfo._id).then(function(userInfo) {
                 
//                 req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
//                 next();
//             })
//         }catch(e){
//             next(); 
//         }
//     }else{
//      next();
//     }

    
// } );
//设置网站favicon.icon，放在这里是为了不让这种请求记录在日志中
//app.use(express.favicon());

// 获取cookie中的sessionsecret字段与下方的一致secret对应
// 创建Redis客户端
var redisClient = redis.createClient(6379, '127.0.0.1', {auth_pass: '123456'});
app.use(cookieParser('sessionsecret'));
app.use(session({
    // genid: function(req) {
    //    console.log(req,"app.js") 
    //    return genuuid() // use UUIDs for session IDs 
    // },
    store: new RedisStore({
      client: redisClient,
      prefix: 'hgk',
      ttl: 90000,   //session有效期 单位 秒
    }),
    name: 'sessionId', // 对session id 相关的cookie 进行签名
    secret: 'sessionsecret', // 建议使用 128 个字符的随机字符串
    resave: false,
    saveUninitialized: true, // 是否保存未初始化的会话
    cookie: { maxAge: 30 * 60 * 1000, httpOnly: true,path: '/',secure: false }  // 设置 session 的有效时间，单位毫秒，现在设置为30分钟
}));

app.use(function( req, res, next ){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-with, X_Requested_With');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    res.header('X-Powered-By', '3.2.1');
    res.header('Content-Type', 'text/html; charset=utf-8'); 
    
    if(req.session && req.session.loginState && req.session.userInfo && req.session.userInfo._id){
       try{
            //获取当前登录用户的类型，是否是管理员
            
            User.findById(req.session.userInfo._id).then(function(userInfo) {
                 
                req.session.userInfo.isAdmin = Boolean(userInfo.isAdmin);
                next();
            });
       }catch(e){
            next(); 
       }
    }else{
       next();
    }

});
/* 设置中间件 end */
//路由
// app.get('/',function(res,res,next){
// 	//第一参数是模版文件的目录，第二个参数是传递给文件的数据
//     res.render('index')
// });
//

app.use('/admin',require('./routers/admin.js'));
app.use('/api',require('./routers/api'));
app.use('/',require('./routers/main')); 
//监听http请求
mongoose.connect('mongodb://localhost:27019/blog',function (err) {
  if (!err) {
    console.log('连接数据库成功!');
	app.listen(8082);
  } else {
  	console.log('连接数据库失败!');
    throw err;
  }
});
