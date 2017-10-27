var fs = require('fs');
var activeModules = JSON.parse(fs.readFileSync('config/modules_list.json', 'utf8'));
exports.activeModules = activeModules;