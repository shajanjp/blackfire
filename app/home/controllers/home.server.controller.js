exports.home = function(req, res){
	res.status(200).json({ "version": "1.0", title: "BlackFire" });
}