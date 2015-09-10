'use strict';

var express = require('express');
var redis = require('redis');
var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

var app = express();
var subscriber = redis.createClient();

if (cluster.isMaster) {
	for (var i = 0; i < numCPUs; i++) {
		cluster.fork();
	}
	subscriber.on("ready", function () {
		subscriber.subscribe('jobq');
	});
	subscriber.on("subscribe", function (channel, count) {
    	console.log("subscriber subscribed to channel ", channel);
	});
	subscriber.on("message", function (channel, data) {
		var lastAssignedId;
		console.log('data', data);
		for (var id in cluster.workers) {
			if (id !== lastAssignedId) {
				lastAssignedId = id;
				return cluster.workers[id].send(data);
			}
		}
		/*cluster.workers.forEach(function (worker) {
			if (worker.id !== lastAssignedId) {
				lastAssignedId = worker.id;
				return worker.send(data);
			}
		});*/
	});
} else {
	var writer = redis.createClient();
	process.on("message", function (data) {
		console.log('worker data', data);
		data = JSON.parse(data);
		var sum = Number(data.val1) + Number(data.val2);
    	writer.set(data.jobid, sum);
	});
}