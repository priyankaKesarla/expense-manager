var db = require('../config/database.js');

exports.list = function(req, res) {
	db.accountModel.find({user_id: req.user._id}, function(err, results) {
		if (err) {
			console.log(err);
			return res.send(400);
		}

		return res.json(results);
	});
};
//need only one account..................................................


exports.create = function(req, res) {
	if (req.body.name === undefined || req.body.currency === undefined) {
		return res.json(400, {message:"Bad Data"});
	}

	var account 		= new db.accountModel();
	account.name 		= req.body.name;
	account.currency 	= req.body.currency;
	account.balance 	= 0;
	account.user_id		= req.user._id

	account.save(function(err) {
		if (err) {
			console.log(err);
			return res.send(400);
		}
		return res.json(200, account);
	});
};

exports.delete = function(req, res) {
	if (req.params.id === undefined) {
		return res.json(400, {message:"Bad Data"});
	}

	var accountId = req.params.id;

	db.accountModel.findOne({user_id: req.user._id, _id: accountId}, function(err, result) {
		if (err) {
			console.log(err);
			return res.send(400);
		}

		db.recordModel.find({account_id: result._id}, function(err, records) {
			if (err) {
				console.log(err);
				return res.send(400);
			}
			records.forEach(function(record) {
				record.remove();
			})

			result.remove();
			return res.send(200);
		});
	});
};

exports.detail = function(req, res) {
	if (req.params.id === undefined) {
		return res.json(400, {message:"Bad Data"});
	}
	
	var accountId = req.params.id;

	db.accountModel.findOne({user_id: req.user._id, _id: accountId}).lean().exec(function(err, result) {
		if (err) {
			console.log(err);
			return res.send(400);
		}

		if (result === null) {
			return res.json(400);
		}

		db.recordModel.find({account_id: accountId, user_id: req.user._id}, function(err, records) {
			if (err) {
				console.log(err);
				return res.send(400);
			}

			result.records = records;

			return res.json(result);
		});

	});
};

