var express = require('express');
var router = express.Router();


router.use(function(req,res,next){
   // if(!req.userInfo.isAdmin){
   //     res.send('对不起，只有管理员才可以进入后台管理');
   //     return;
   // }
   if(req.session.userInfo && req.session.userInfo.isAdmin){
     next();  
   } else {
     res.send('对不起，只有管理员才可以进入后台管理');
     return;
   }
   
});

//欢迎页面
router.get('/',function(req,res,next){
   // res.render('admin/index',{
   // 	  userInfo:req.userInfo
   // });
   res.render('admin/index',{
      userInfo:req.session.userInfo
   });
});
//用户页面
var User = require('../models/User');
router.get('/user',function(req,res,next){
   var limit = 1,
       //当前页数
       page = Number(req.query.page || 0),
       //数据库查询忽略条数，
       skip = 0,
       //总页数
       pages = 0;
   User.count().then(function(count){
   	   //计算页面数
   	   pages = Math.ceil(count / limit);
       //取值不能大于数据记录总数
       page = Math.min(page,pages);
       //取值不能小于1
       page = Math.max(page,1);

       skip = (page - 1) * limit;

       User.find().limit(limit).skip(skip).then(function(users){
  	     //  res.render('admin/user_index',{
  	     //  	 userInfo:req.userInfo,
  		    //    users:users,

  		    //    count:count,
  		    //    limit:limit,
  		    //    pages:pages,
  		    //    page:page
    		  // });
          res.render('admin/user_index',{
             userInfo: req.session.userInfo,
             users:users,

             count:count,
             limit:limit,
             pages:pages,
             page:page
          });
          
	   });
   });
   
   
});


//接受提交过来的分类
var Catepory = require('../models/catepory.js');
//分类
router.get('/catepory',function(req,res,next){

  var limit = 5,
       //当前页数
       page = Number(req.query.page || 0),
       //数据库查询忽略条数，
       skip = 0,
       //总页数
       pages = 0;
   Catepory.count().then(function(count){
       //计算页面数
       pages = Math.ceil(count / limit);
       //取值不能大于数据记录总数
       page = Math.min(page,pages);
       //取值不能小于1
       page = Math.max(page,1);

       skip = (page - 1) * limit;
       /*
          sort方法排序
          1:正序排序 -> 由小到大
          -1:倒序排序 -> 由大到小
        */
       Catepory.find().sort({ _id:-1 }).limit(limit).skip(skip).then(function(catepories){
          // res.render('admin/catepory_index',{
          //    userInfo:req.userInfo,
          //    catepories:catepories,

          //    count:count,
          //    limit:limit,
          //    pages:pages,
          //    page:page
          // });

          res.render('admin/catepory_index',{
             userInfo:req.session.userInfo,
             catepories:catepories,
             count:count,
             limit:limit,
             pages:pages,
             page:page
          });
     });
   });

  
});

//添加分类
router.get('/catepory/add',function(req,res,next){
  // res.render('admin/catepory_add',{
  //      userInfo:req.userInfo
  // });
  res.render('admin/catepory_add',{
       userInfo: req.session.userInfo
  });
});
router.post('/catepory/add',function(req,res,next){
   
   var name = req.body.name || '';
   if(name == ''){

      // res.render('admin/error',{
      //     userInfo:req.userInfo,
      //     message:'分类名不能为空'
      // });
      res.render('admin/error',{
          userInfo:req.session.userInfo,
          message:'分类名不能为空'
      });
      return;
   }
   Catepory.findOne({
      name:name
   }).then(function(result){
       if(result){
          // res.render('admin/error',{
          //     userInfo:req.userInfo,
          //     message:'分类已经存在'
          // });
          res.render('admin/error',{
              userInfo:req.session.userInfo,
              message:'分类已经存在'
          });
          return Promise.reject();
       }else{
          return new Catepory({
              name:name
          }).save();
       }
   }).then(function(newCategory){
      // res.render('admin/success', {
      //     userInfo: req.userInfo,
      //     message: '分类保存成功',
      //     url: '/admin/catepory'
      // });
      res.render('admin/success', {
          userInfo: req.session.userInfo,
          message: '分类保存成功',
          url: '/admin/catepory'
      });
   });
});

//修改分类
router.get('/catepory/edit',function(req,res,next){
  
  var id = req.query.id || '';
  Catepory.findOne({
      _id:id
   }).then(function(category){
        
       if(!category){
          // res.render('admin/error',{
          //     userInfo:req.userInfo,
          //     message:'分类不存在'
          // });
          res.render('admin/error',{
              userInfo: req.session.userInfo,
              message:'分类不存在'
          });
          return Promise.reject();
       }else{
          // res.render('admin/catepory_edit',{
          //      userInfo:req.userInfo,
          //      category:category
          // });
          res.render('admin/catepory_edit',{
             userInfo: req.session.userInfo,
             category:category
          });
       }
   });
});

router.get('/catepory/delete',function(req,res,next){
  
  var id = req.query.id || '';
  Catepory.remove({
      _id:id
   }).then(function(category){
       if(category){
          // res.render('admin/success', {
          //     userInfo: req.userInfo,
          //     message: '分类删除成功',
          //     url: '/admin/catepory'
          // });
          res.render('admin/success', {
              userInfo: req.session.userInfo,
              message: '分类删除成功',
              url: '/admin/catepory'
          });
       }
   });

  
});

//内容管理
var Content = require('../models/Content.js');
router.get('/content',function(req,res,next){
    
    var limit = 5,
       //当前页数
       page = Number(req.query.page || 0),
       //数据库查询忽略条数，
       skip = 0,
       //总页数
       pages = 0;
   Content.count().then(function(count){
       //计算页面数
       pages = Math.ceil(count / limit);
       //取值不能大于数据记录总数
       page = Math.min(page,pages);
       //取值不能小于1
       page = Math.max(page,1);

       skip = (page - 1) * limit;
       /*
          sort方法排序
          1:正序排序 -> 由小到大
          -1:倒序排序 -> 由大到小
        */
       Content.find().sort({ _id:-1 }).limit(limit).skip(skip).populate(['catepory','user']).then(function(contents){
         
          // res.render('admin/content_index',{
          //    userInfo:req.userInfo,
          //    contents:contents,
          //    count:count,
          //    limit:limit,
          //    pages:pages,
          //    page:page
          // });
          res.render('admin/content_index',{
             userInfo:req.session.userInfo,
             contents:contents,
             count:count,
             limit:limit,
             pages:pages,
             page:page
          });
     });
   });

   
});

router.get('/content/add',function(req,res,next){
 
  Catepory.find().sort({_id:-1}).then(function(catepories){
      // res.render('admin/content_add',{
      //    userInfo:req.userInfo,
      //    catepories:catepories
      // });
      res.render('admin/content_add',{
         userInfo:req.session.userInfo,
         catepories:catepories
      });
  });

});

router.post('/content/add',function(req,res,next){
 
   if(req.body.category == ''){
      // res.render('admin/error', {
      //     userInfo: req.userInfo,
      //     message: '内容分类不能为空',
      // });
      res.render('admin/content_add',{
         userInfo:req.session.userInfo,
         catepories:catepories
      });
      return;
   }
   if(req.body.title == ''){
      // res.render('admin/error', {
      //     userInfo: req.userInfo,
      //     message: '内容标题不能为空',
      // });
      res.render('admin/error', {
          userInfo: req.session.userInfo,
          message: '内容标题不能为空',
      });

      
      return;
   }

   new Content({
      catepory:req.body.catepory,
      title:req.body.title,
      user:req.userInfo,
      description:req.body.description,
      content:req.body.content
   }).save().then(function(newContent){
      // res.render('admin/success', {
      //     userInfo: req.userInfo,
      //     message: '内容添加成功',
      //     url:'/admin/content'
      // });

      res.render('admin/success', {
          userInfo: req.session.userInfo,
          message: '内容添加成功',
          url:'/admin/content'
      });
      
      return;
   });

});

//修改内容
router.get('/content/edit',function(req,res,next){
  
  var id = req.query.id || '';
  var catepories;
  Catepory.find().sort({_id:1}).then(function(res){
      catepories = res;
      return Content.findOne({
          _id:id
      }).populate('catepory');
  }).then(function(content){
            
       if(!content){
          // res.render('admin/error',{
          //     userInfo:req.userInfo,
          //     message:'内容不存在'
          // });
          res.render('admin/error',{
              userInfo: req.session.userInfo,
              message:'内容不存在'
          });
          return Promise.reject();
       }else{
       

          // res.render('admin/content_edit',{
          //      userInfo:req.userInfo,
          //      catepories:catepories,
          //      content:content
          // });
          res.render('admin/content_edit',{
               userInfo: req.session.userInfo,
               catepories:catepories,
               content:content
          });
       }
   });
  
});


router.post('/content/edit',function(req,res,next){
   var id = req.query.id || ''; 
   if(req.body.category == ''){
      // res.render('admin/error', {
      //     userInfo: req.userInfo,
      //     message: '内容分类不能为空',
      // });

      res.render('admin/content_edit',{
           userInfo: req.session.userInfo,
           catepories:catepories,
           content:content
      });
      return;
   }
   if(req.body.title == ''){
      // res.render('admin/error', {
      //     userInfo: req.userInfo,
      //     message: '内容标题不能为空',
      // });
      res.render('admin/error', {
          userInfo: req.session.userInfo,
          message: '内容标题不能为空',
      });
      
      return;
   }

   Content.update({
      _id:id
   },{
      catepory:req.body.catepory,
      title:req.body.title,
      description:req.body.description,
      content:req.body.content
   }).then(function(newContent){
      // res.render('admin/success', {
      //     userInfo: req.userInfo,
      //     message: '内容保存成功',
      //     url:'/admin/content'
      // });
      res.render('admin/success', {
          userInfo: req.session.userInfo,
          message: '内容保存成功',
          url:'/admin/content'
      });
      
      return;
   });

});



router.get('/content/delete',function(req,res,next){
  
  var id = req.query.id || '';
  Content.remove({
      _id:id
  }).then(function(content){
       if(content){
          // res.render('admin/success', {
          //     userInfo: req.userInfo,
          //     message: '删除成功',
          //     url: '/admin/content'
          // });
          res.render('admin/success', {
              userInfo: req.session.userInfo,
              message: '删除成功',
              url: '/admin/content'
          });
       }
   });

  
});



module.exports = router;