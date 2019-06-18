var express = require('express');
var router = express.Router();

var Catepory = require('../models/catepory.js');
var Content = require('../models/Content.js');

var data;


router.use(function(req,res,next){
   data = {
      catepories:[]
   };
   if (req.session && req.session.userInfo) {
     data['userInfo']  = req.session.userInfo
   }
   Catepory.find().then(function(catepories){
       data.catepories = catepories;
       next();
   });
});
router.get('/',function (req,res,next) {
   
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
         return Content.where(where).find().sort({ _id:-1 }).limit(data.limit).skip(skip).populate(['catepory','user']).sort({
             addTime:-1
         });
  	}).then(function(contents){
    		data.contents = contents;
    		res.render('main/index',data);
  	
  	}); 
  	
});

router.get('/view',function(req,res){
    data.contentId = req.query.contentId || '';
    Content.findOne({
       _id:data.contentId
    }).then(function(content){
       data.content = content;
       content.views++;
       content.save();
       res.render('main/view',data);
    });
});

module.exports = router;