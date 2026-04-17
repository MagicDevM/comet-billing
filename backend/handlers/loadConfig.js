const fs = require('fs')
const chalk = require('chalk');
const toml = require('@iarna/toml');

function loadConfig(path = 'config.toml') {
  try {
    // Read the toml file
    const tomlRaw = fs.readFileSync(path, 'utf-8');
    
    // Parse the toml to get an usable copy
    const config = toml.parse(tomlRaw);
    
    // returns the config
    return config;
  } catch (error) {
    console.error(chalk.white.bold('[Config Loader] ') + chalk.red('There was error trying to parse the config'));
  };
};

module.exports = loadConfig;