'use strict';

var express = require('express');
var redis = require('redis');
var cluster = require('cluster');

var app = express();
var subscriber = redis.createClient();


if (cluster.isMaster) {
	for (var i = 0; i < 3; i++) {
		cluster.fork();
	}
} else {
	var writer = redis.createClient();
	subscriber.on("ready", function () {
		subscriber.subscribe('jobq');
	});
	subscriber.on("subscribe", function (channel, count) {
    	console.log("subscriber subscribed to channel ", channel);
	});
	subscriber.on("message", function (channel, data) {
		console.log('data', data);
		data = JSON.parse(data);
		var sum = Number(data.val1) + Number(data.val2);
    	writer.set(data.jobid, sum);
	});
}