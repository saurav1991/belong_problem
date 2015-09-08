var express = require('express');
var crypto = require('crypto');
var redis = require('redis');
var router = express.Router();
var uuid = require('node-uuid');

/* GET home page. */
router.post('/', function(req, res, next) {
	var publisher = redis.createClient();
	var subscriber = redis.createClient();
	var body = req.body;
	var redisKey = uuid.v4();
	console.log('redisKey', redisKey);
	var data = {
		jobid : redisKey,
		val1: body.x,
		val2: body.y
	};

	/*subscriber.on("ready", function () {
		subscriber.subscribe('jobq');
	});
	subscriber.on("subscribe", function (channel, count) {
		console.log("subscriber channel" + channel);
	});*/
	publisher.publish('jobq', JSON.stringify(data));
	return res.json({
		'jobid' : redisKey
	});

});

module.exports = router;
