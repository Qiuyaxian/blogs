var express = require('express');
var router = express.Router();
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
       if(!userInfo){
          //查询结果为空
          data.code = 2;
          data.message = '用户名或者密码错误';
          res.json(data);
          return;
       }
       data.message = '登陆成功';
       data.userInfo = {
           _id:userInfo._id,
           username:userInfo.username  
       };
       //设置cookie
       req.cookies.set('userInfo',JSON.stringify({
           _id:userInfo._id,
           username:userInfo.username  
       }));
       res.json(data);
    })
});

//判断用户是否登陆
router.post('/isLogin',function(req,res){
    //获取判断用户是否存在
    if(req.cookies.get('userInfo')){
       data.userInfo = JSON.parse(req.cookies.get('userInfo'));
       res.json(data);
    }else{
       res.json(data);
    }
    
});

//用户退出登陆
router.get('/logout', function(req, res) {

    req.cookies.set('userInfo', null);
    if(data.userInfo) data.userInfo = null;
    data.code = 1;
    data.message = '退出成功';
    res.json(data);
});

//查询分类
//用户退出登陆
// router.get('/logout', function(req, res) {
//     data.contentId = req.query.contentId || '';
//     Content.findOne({
//        _id:data.contentId
//     }).then(function(content){
//        data.content = content;
//        content.views++;
//        content.save();
//        res.render('main/view',data);
//     });
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