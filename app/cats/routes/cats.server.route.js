const express = require('express');
const router = express.Router();
const catController = require('../controllers/cats.server.controller.js');

router.route('/')
.get(catController.home);

module.exports = router;