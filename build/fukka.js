var readline = require('readline');
var moment = require('moment');
var redis = require("redis");
var config = require('./libs/config');
var redisPublishClient = redis.createClient(config.redis.port, config.redis.host);
var rl = readline.createInterface({
  input: process.stdin,
  output: false
});

function push_data(data) {
  try {
    if (data.msg == null) {
      return;
    }
    data.ts = moment().unix();
    return redisPublishClient.rpush(config.redis.msgList, JSON.stringify(data), function(err, res) {
      data.id = res;
      data.ts = moment.unix(data.ts).format('HH:mm:ss YYYY-MM-DD');
      return redisPublishClient.publish(config.redis.channel, JSON.stringify({
        channel: 'chat',
        data: data
      }));
    });
  } catch (_error) {
    err = _error;
    return console.trace();
  }
}

rl.on('line', function(line){
  push_data({
    msg: line
  };
})

