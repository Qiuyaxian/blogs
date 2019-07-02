var express = require('express');
var router = express.Router();
// 通过 redis 管理 token 过期
var expireToken = require('./redis.js').expireToken;
var checkToken = require('./redis.js').checkToken;
//引入用户数据结构
var User = require('../data/models/User');
var Content = require('../data/models/Content.js');
var Catepory = require('../data/models/catepory.js');

//定义统一返回格式
var data;
router.use(function(req,res,next){
   data = {
 	   code:0,
 	   message:''
   } 
   next();
});

//使用jsonwebtoken实现token校验
var jwt = require("jsonwebtoken");
//token验证函数
function ensureAuthorized(req, res, next) {
  var token = req.headers["token"];
  if (typeof token !== 'undefined') {
    checkToken(token, function (err, reply) {
      if (err) {
         return res.json({ 
            code: '500', 
            message: err 
         });  
      }
      if (reply) {
        return res.json({ 
          code: '401', 
          message: 'token不存在' 
        });
      } else {
        // req.body.token = token;
        jwt.verify(token, 'sessionsecret', function(err, info) {
          if (err) {
            return res.json({ 
              code: '401', 
              message: 'token已经过期' 
            });
          } else {
            // if everything is good, save to request for use in other routes
            req.body.info = info;
            next();
          }
        });
      }
      
    })
    
  } else {
    // 未登陆
    return res.json({ 
      code: '401', 
      message: 'token已经过期' 
    });
  }
}

//获取分类
router.get('/classfily',function (req,res,next) {

   data = {
      userInfo:req.userInfo,
      catepories:[]
   };
   Catepory.find().then(function(catepories){
      
       data.catepories = catepories;
       res.json(data);
   });
});

//获取首页数据
router.get('/index',function (req,res,next) {
   
    data.limit  = 1;
    data.page  = Number(req.query.page || 0);
    data.skip  = 0;
    data.pages  = 0;
    data.contents = [];
    data.catepory = req.query.catepory || '';

    var where = {};
    if(data.catepory){
       where.catepory = data.catepory;
    }

    Content.where(where).count().then(function(count){
          //计算页面数
         data.pages = Math.ceil(count / data.limit);
         //取值不能大于数据记录总数
         data.page = Math.min(data.page,data.pages);
         //取值不能小于1
         data.page = Math.max(data.page,1);

         var skip = (data.page - 1) * data.limit;
         return Content.where(where).find().sort({ _id:-1 }).limit(data.limit).skip(skip).populate(['catepory']).sort({
             addTime:-1
         });
    }).then(function(contents){
        data.contents = contents;
        //if(req.cookies.get('userInfo')) data.userInfo = req.cookies.get('userInfo');
        res.json(data);
    }); 
    
});

//用户登陆
router.post('/login',function(req,res){
    //获取提交过来的数据
    var username = req.body.username,
        password = req.body.password;
    if(username == ''){
       data.code = 1;
       data.message = '用户名不能为空';
       res.json(data);
       return;
    }
    if(password == ''){
       data.code = 1;
       data.message = '密码不能为空';
       res.json(data);
       return;
    }
    //查找数据库
    User.findOne({
       username:username,
       password:password 
    }).then(function(userInfo){
       // if(!userInfo){
       //    //查询结果为空
       //    data.code = 2;
       //    data.message = '用户名或者密码错误';
       //    res.json(data);
       //    return;
       // }
       // data.message = '登陆成功';
       // data.userInfo = {
       //     _id:userInfo._id,
       //     username:userInfo.username  
       // };
       // //设置cookie
       // req.cookies.set('userInfo',JSON.stringify({
       //     _id:userInfo._id,
       //     username:userInfo.username  
       // }));
       // res.json(data);
       if (!userInfo) {
          data.code = 2;
          data.message = '用户名或者密码错误';
          res.json(data);
       } else {
          var userInfo = {
            _id: userInfo._id,
            username: userInfo.username
          };

          var user = new User({
             username:username,
             password:password
          });
          //更新数据库中的token
          var _token = jwt.sign(userInfo, "sessionsecret",{
            expiresIn: 1440 // expires in 1440 seconds
          });
          user.save(function(err ,newUserInfo){
            if (err) {
               console.log(err,"login")
            } else {
               data.userInfo = newUserInfo;
               data.message = '登陆成功';
               data.loginState = true;
               data.token = _token;
               res.json(data);
            }
          });
       }
    })
});
// 用户注册

router.post('/register',function (req, res, next) {
  // var username = req.body.username;
  // var password = req.body.password;
  var username = req.body.username;
  var password = req.body.password; 
  var repassword = req.body.repassword;
  //用户名不能为空
  if( username == '' ){
     data.code = 500;
     data.message = '用户名不能为空';
     res.json(data);
     return;
  }
  //密码不能为空
  if(password == ''){
     data.code = 500;
     data.message = '密码不能为空';
     res.json(data);
     return;
  }
  //两次输入的密码必须一致
  if(password != repassword){
     data.code = 500;
     data.message = '两次输入的密码不一致';
     res.json(data);
     return;
  }

  //查找数据库匹配
  User.findOne({
    username:username
  }).then(function( userInfo ){
       
    if (userInfo) {
      data.code = 500;
      data.message = '该用户名已经被注册';
      res.json(data);
      return;
    }
    var user = new User({
       username:username,
       password:password
    });
    return user.save();
  }).then(function(newUserInfo){
     var userInfo = {
       _id: newUserInfo._id,
       username: newUserInfo.username
     };
    // 更新数据库中的token
     var _token = jwt.sign(userInfo, "sessionsecret",{
       expiresIn: 1440 // expires in 1440 seconds
     });
     data.message = '注册成功';
     data.userInfo = userInfo;
     data.loginState = true;
     data.token = _token;
     res.json(data);
  });
});
//判断用户是否登陆
router.post('/isLogin', ensureAuthorized, function(req,res){
  //获取判断用户是否存在
  // if(req.cookies.get('userInfo')){
  //    data.userInfo = JSON.parse(req.cookies.get('userInfo'));
  //    res.json(data);
  // }else{
  //    res.json(data);
  // }
  // 验证token
  if (req.body && req.body.info) {
    data.userInfo = typeof req.body.info !== 'string' ? req.body.info : JSON.parse(req.body.info);
    res.json(data);
  } else {
    res.json({ 
      code: '401', 
      message: 'token已经过期' 
    })
  }
});

//用户退出登陆
router.get('/logout', ensureAuthorized, function(req, res) {
  if (req.headers["token"]) {
    expireToken(req.headers);
    res.json({
      code: '200', 
      message: '退出登陆成功' 
    });
  } else {
    res.json({ 
      code: '401', 
      message: 'token已经过期' 
    })
  }
  // req.cookies.set('userInfo', null);
  // if(data.userInfo) data.userInfo = null;
  // data.code = 1;
  // data.message = '退出成功';
  // res.json(data);
});

//查询分类
//用户退出登陆
// router.get('/logout', function(req, res) {
//   data.contentId = req.query.contentId || '';
//   Content.findOne({
//      _id:data.contentId
//   }).then(function(content){
//      data.content = content;
//      content.views++;
//      content.save();
//      res.render('main/view',data);
//   });
// });

//获取详情
router.get('/view',function(req,res){
    data.contentId = req.query.contentId || '';
    Content.findOne({
       _id:data.contentId
    }).then(function(content){
       data.content = content;
       content.views++;
       content.save();
       res.json(data);
    });
});

//评论翻页
router.get('/comment', function(req, res) {

    data.limit  = 1;
    data.page  = Number(req.query.page || 0);
    data.skip  = 0;
    data.pages  = 0;
    data.contents = [];
    data.catepory = req.query.catepory || '';

    var where = {};
    if(data.catepory){
       where.catepory = data.catepory;
    }
    

   /* Content.where(where).count().then(function(count){
        //计算页面数
       data.pages = Math.ceil(count / data.limit);
       //取值不能大于数据记录总数
       data.page = Math.min(data.page,data.pages);
       //取值不能小于1
       data.page = Math.max(data.page,1);

       var skip = (data.page - 1) * data.limit;
       return Content.where(where).find().sort({ _id:-1 }).limit(data.limit).skip(skip).populate(['catepory']).sort({
           addTime:-1
       });
    }).then(function(content){
         console.log(content,"content")
         data.comments = content.comments;
         res.json(data);
    }).catch(function(err){
         console.log(err,"sdf")
    }); */
     

    Content.findOne({
        _id: data.catepory
    }).then(function(content) {
        data.comments = content.comments;
        res.json(data);
    })
});

router.get('/page',function(req,res,next){
     
    data.limit  = 1;
    data.page  = Number(req.query.page || 0);
    data.skip  = 0;
    data.pages  = 0;
    data.contents = [];
    data.catepory = req.query.catepory || '';

    var where = {};
    if(data.catepory){
       where.catepory = data.catepory;
    }
    Content.where(where).count().then(function(count){
        //计算页面数
       data.pages = Math.ceil(count / data.limit);
       //取值不能大于数据记录总数
       data.page = Math.min(data.page,data.pages);
       //取值不能小于1
       data.page = Math.max(data.page,1);

       var skip = (data.page - 1) * data.limit;
       return Content.where(where).find().sort({ _id:-1 }).limit(data.limit).skip(skip).populate(['catepory']).sort({
           addTime:-1
       });
    }).then(function(contents){
       data.contents = contents;
       res.json(data);
    });
});


module.exports = router;