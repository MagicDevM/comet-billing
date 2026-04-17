const express = require('express');
const path = require('path');
const chalk = require('chalk');

const getFiles = require('./utils.js');

function loadModules(app) {
  // Loaded module Number
  let loadedModules = 0;
  
  const modulesDir = path.join(__dirname, "../modules");
  const modules = getFiles(modulesDir);
  
  // if no modules to load skip
  if (modules.length === 0)
    return console.log(chalk.blue.bold('[Module Manager] ' + chalk.gray('No modules found to be loaded.')));
  
  // initialize start time
  const startTime = Date.now();
  
  console.log(chalk.blue.bold('[Module Manager] ') + chalk.yellow('Loading modules...'))
  
  // Load modules
  modules.forEach(module => {
    try {
      const absolutePath = path.resolve(module);
      
      // Get a usable module object
      const moduleFile = require(absolutePath);
      
      // Check if manifest and load function exist
      if (!moduleFile.manifest) 
        throw new Error(`Failed to load ${path.baseFileName(module)} module, no manifest provided`);
      if (!moduleFile.load && typeof moduleFile !== "function")
        throw new Error(`Failed to load ${moduleFile.manifest.name}, no load function declared`);
        
        // Run the load function
        const router = express.Router();
        moduleFile.load(router);
        
        // Apply the declared routes
        if (!moduleFile.manifest.middleware)
          app.use('/api', router);
        else
          app.use(router);
        
        // increment loadedModules by one
        loadedModules++;
    } catch (error) {
      console.error(chalk.blue.bold('[Module Manager] ') + chalk.red(error))
    }
  });
  
  // Calculate total ms taken to load modules
  const loadMs = Date.now() - startTime;
  
  console.log(chalk.blue.bold('[Module Manager] ') + chalk.white(`Loaded ${loadedModules} modules in ${loadMs}ms`));
};

module.exports = loadModules;