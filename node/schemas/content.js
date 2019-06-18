//引入mongoose模块
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//创建用户表结构
module.exports = new Schema({
   //关联字段，关联分类
   catepory:{
   	  type: Schema.Types.ObjectId,
   	  //引用 指向数据模型
   	  ref:'Catepory'
   },
   user:{
        type: Schema.Types.ObjectId,
        //引用 指向数据模型
        ref:'User'
   },
   addTime:{
      type:Date,
      default: new Date()
   },
   views:{
      type:Number,
      default:0
   },
   //密码
   title:String,
   //内容简介
   description: {
      type:String,
      default: ''
   },
   //内容
   content: {
      type:String,
      default: ''
   },
   //评论内容
   comments:{
      type:Array,
      default: []
   }
});