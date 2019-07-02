var redis = require("redis");
var redisClient = redis.createClient(6379, 
  '127.0.0.1', 
  {
	auth_pass: '123456'
  }
);
// 设置 token 过期时间 
var TOKEN_EXPIRATION = 60;
var TOKEN_EXPIRATION_SEC = TOKEN_EXPIRATION * 60;

redisClient.on('error', function (err) {
    console.log('Error ' + err);
});

redisClient.on('connect', function () {
    console.log('Redis is ready');
});

// 管理 token
function getToken (headers) {
  return headers["token"] ? headers["token"] : null;
}
// 在 redis 存储 token , 并设置过期时间
function expireToken (headers) {
  var token = getToken(headers);
  if (token) {
    redisClient.set(token, { is_expired: true });
    redisClient.expire(token, TOKEN_EXPIRATION_SEC);
  }
}
// 检查 redis 中是否存在 token
function checkToken (token, callback) {
  redisClient.get(token, callback);
}
exports.redis = redis;
exports.checkToken = checkToken;
exports.expireToken = expireToken;
exports.redisClient = redisClient;