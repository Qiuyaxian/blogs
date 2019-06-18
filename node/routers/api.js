var express = require('express');
var router = express.Router();

//引入用户数据结构
var User = require('../models/User');
var Content = require('../models/Content.js');
//定义统一返回格式
var responseData;
router.use(function(req,res,next){
   responseData = {
       code:0,
       message:''
   } 
   next();
});

/*
   用户注册
      注册逻辑
      1.首先判断用户名不能为为空
      2.密码不能为空
      3.两次输入密码必须一致
      4.数据库查询，用户是否已经注册了

 */

router.post('/user/register',function (req,res,next) {
  // var username = req.body.username;
  // var password = req.body.password;
  var username = req.body.username;
  var password = req.body.password; 
  var repassword = req.body.repassword;
  //用户名不能为空
  if( username == '' ){
     responseData.code = 1;
     responseData.message = '用户名不能为空';
     res.json(responseData);
     return;
  }
    //密码不能为空
    if(password == ''){
       responseData.code = 2;
       responseData.message = '密码不能为空';
       res.json(responseData);
       return;
    }
    //两次输入的密码必须一致
    if(password != repassword){
       responseData.code = 3;
       responseData.message = '两次输入的密码不一致';
       res.json(responseData);
       return;
    }

    //查找数据库匹配
    User.findOne({
      username:username
    }).then(function( userInfo ){
         
       if(userInfo){
         responseData.code = 4;
         responseData.message = '该用户名已经被注册';
         res.json(responseData);
         return;
     }
     var user = new User({
         username:username,
         password:password
     });
     return user.save();
    }).then(function(newUserInfo){
       responseData.message = '注册成功';
       res.json(responseData);
    });
});


//登陆
router.post('/user/login',function(req,res){
  var username = req.body.username;
  var password = req.body.password;
  if(username == '' || password == ''){
    responseData.code = 1;
    responseData.message = '用户名和密码不能为空';
    res.json(responseData);
    return;
  }
  User.findOne({
    username:username,
    password:password
  }).then(function(userInfo){
        
       if(!userInfo){
          responseData.code = 2;
          responseData.message = '用户名或者密码错误';
          res.json(responseData);
          return;
       }

       //设置cookie
       // req.cookies.set('userInfo', JSON.stringify({
       //      _id: userInfo._id,
       //      username: userInfo.username
       // }));
       // 设置session 
       req.session.regenerate(function(err) {
            
            if(err){
                responseData.code = 0;
                responseData.message = '登陆失败';
                res.json(responseData);               
            }else{
              responseData.message = '登陆成功';
              responseData.userInfo = {
                  _id:userInfo._id,
                  username:userInfo.username
              }
               
              req.session.userInfo = {
                  _id: userInfo._id,
                  username: userInfo.username
              };
              req.session.loginState = true;
               
              res.json(responseData);
            }                         
       });
       return;
  })
});

/*
* 退出
* */
router.get('/user/logout', function(req, res) {
    //删除cookie
    //req.cookies.set('userInfo', null);
    //删除session
    // req.session.destroy()      # 清空所有session
    // req.session.key.destroy()    # 销毁名称为key的session的值
    
    
    req.session.destroy(function(err) {
        if(err){
            responseData.code = 0;
            responseData.message = '退出失败';
            res.json(responseData);
            return;
        }else{
            responseData.code = 4;
            responseData.message = '退出成功';
            res.json(responseData);
            return;
        }
        
    });
    //res.json(responseData);
});


/*
* 获取指定文章的所有评论
* */
router.get('/comment', function(req, res) {
    var contentId = req.query.contentid || '';
    Content.findOne({
        _id: contentId
    }).then(function(content) {
        if(content.comments) responseData.data = content.comments;
        else responseData.data = [];
        res.json(responseData);
    })
});

//保存评论
router.post('/comment/post',function(req, res){
    let contentId = req.body.contentid || '';
    // let postData = {
    //     username:req.userInfo.username,
    //     postTime:new Date(),
    //     content:req.body.content || ''
    // };
    let postData = {
      username: req.session.userInfo.username,
      postTime:new Date(),
      content:req.body.content || ''
    };
    
    Content.findOne({
      _id : contentId
    }).then(function(content){
       content.comments.push(postData);
       return content.save();
    }).then(function(newContent){
       responseData.message = '评论成功';
       responseData.data = newContent;
       //console.log(newContent,"newContent");
       res.json(responseData);
    });
}); 

module.exports = router;