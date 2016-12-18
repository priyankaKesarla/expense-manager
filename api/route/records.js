var db = require('../config/database.js');

exports.create = function(req, res) {
	if (req.body.amount === undefined || isNaN(Number(req.body.amount)) || req.body.category === undefined || req.body.date === undefined) {
		return res.json(400, {message:"Bad Data"});
	}

	//TODO Check if user_id == account.user_id before adding the record.

	var record = new db.recordModel();
	record.user_id = req.user._id;
	record.amount = req.body.amount;
	record.category	= req.body.category;
	record.date	= req.body.date;
	record.description = req.body.description;	

	record.save(function(err) {
		if (err) {
			console.log(err);
			return res.send(400);
		}
        return res.json(200, record);

		/*if (record.is_expense) {
			db.accountModel.update({_id:accountId}, { $inc: { balance: -record.amount } }, function(err, nbRows, raw) {
				
			});
		}*/
	});
};

exports.delete = function(req, res) {
	if (req.params.recordId === undefined) {
		return res.json(400, {message:"Bad Data"});
	}

	var recordId = req.params.recordId;

	db.recordModel.findOne({_id: recordId,user_id: req.user._id}, function(err, record) {
		if (err) {
			console.log(err);
			return res.send(400);
		}
        else{
            record.remove();
				return res.json(200, record);
        }
});		
	};

exports.list = function(req, res) {
  	db.recordModel.find({user_id: req.user._id}, function(err, results) {
  		if (err) {
  			console.log(err);
  			return res.send(400);
  		}

  		return res.json(results);
  	});
};


