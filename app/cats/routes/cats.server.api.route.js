var catController = require('../controllers/cats.server.controller.js');

var express = require('express');
var router = express.Router();

router.route('/')
.get(catController.home)
.post(catController.home)

router.route('/:catId')
.get(catController.homewithId)
.put(catController.homewithId)
.delete(catController.homewithId)

router.param('catId', catController.cat)

module.exports = router;