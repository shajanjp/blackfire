const fs = require('fs');

const activeModules = JSON.parse(fs.readFileSync('config/modules.json', 'utf8'));
exports.activeModules = activeModules;
