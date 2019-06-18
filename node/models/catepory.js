//我们通常操作的是数据模型，而数据模型则依赖于数据结构，数据模型基于数据结构来处理数据
var mongoose = require('mongoose');
var cateporiesSchema = require('../schemas/catepories.js');

module.exports = mongoose.model('Catepory',cateporiesSchema);