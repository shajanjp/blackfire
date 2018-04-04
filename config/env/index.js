const ENV_USING = process.env.NODE_ENV || 'default';
const configData = require(`./${ENV_USING}.json`);
if (typeof configData !== 'object') {
  console.log(`Couldnt find configuration file "${ENV_USING}.json" in env folder.`);
  console.log('Set NODE_ENV properly and restart.');
  process.exit();
}
console.log(`Using configuration from ${ENV_USING}.json`);

module.exports = configData;
