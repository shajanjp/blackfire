var fs = require('fs');
var activeModules = JSON.parse(fs.readFileSync('config/modules.json', 'utf8'));
exports.activeModules = activeModules;