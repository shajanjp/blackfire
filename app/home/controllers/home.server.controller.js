exports.homeUI = function(req, res){
	res.render('home/views/home');
}

exports.homeAPI = function(req, res){
	res.json({ 'first_name' : 'Elon', 'last_name': 'Musk'});
}