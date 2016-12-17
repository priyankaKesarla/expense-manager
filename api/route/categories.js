var db = require('../config/database.js');

exports.list = function(req, res) {
  	db.categoryModel.find({user_id: req.user._id}, function(err, results) {
  		if (err) {
  			console.log(err);
  			return res.send(400);
  		}

  		return res.json(results);
  	});
}

exports.create = function(req, res) {
	if (req.body.name === undefined) {
		return res.json(400);
	}

	var category = new db.categoryModel();
	category.name = req.body.name;
	category.user_id = req.user._id;

	category.save(function(err) {
		if (err) {
			console.log(err);
			return res.send(400);
		}

		return res.json(category);
	});
}

exports.delete = function(req, res) {
	if (req.params.categoryId === undefined) {
		return res.json(400);
	}

	var categoryId = req.params.categoryId;

	db.categoryModel.findOne({user_id: req.user._id, _id: categoryId}, function(err, result) {
		if (err) {
			console.log(err);
			return res.send(400);
		}

		result.remove();
		return res.send(200);
	});
}