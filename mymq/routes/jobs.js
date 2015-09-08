var express = require('express');
var redis = require('redis');
var router = express.Router();


router.get('/:job', function(req, res, next) {
	console.log('JOB :', req.params.job);
	var jobid =  req.params.job;
	var reader = redis.createClient();
	
	reader.get(jobid, function (err, val) {
		if (!err) {
			console.log("Value", val);
			return res.send(val);
		}
	});
});

module.exports = router;
