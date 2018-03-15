exports.home = function(req, res){
	return res.status(200).json({ 
		"title": "Cats" 
	});
}

exports.cat = function(req, res, next){
	next();
}

exports.homewithId = function(req, res){
	return res.status(200).json({ 
		"title": "Cats", 
		"cat": req.params.catId 
	});
}