"use strict";

/**
 * @fileoverview Comet Billing - © Comet Labs 2026
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

// Get in-app functions
const loadModules = require('./handlers/moduleLoader');

// Initialize the express app
const app = express();

console.log(chalk.white(chalk.bold.yellow('[server]') + ' Starting Server...'));

// setup frontend connection
const distPath = path.join(__dirname, "../frontend/dist");
// setup absolute path for frontend elements
app.use('/', express.static(distPath, {
  fallthrough: true,
  index: false
}));

app.listen(3030, "0.0.0.0", () => {
  // Load all modules
  loadModules(app);
  
  console.log(chalk.gray.bold(`Webserver is now online on PORT ${3030}`))
}).on("error", error => {
  if (error.code === "EADDRINUSE") 
    return console.error(chalk.red(chalk.bold.yellow.bold('[server]') + 
    ` Port: ${config.general.port} is already in use`
    ));
  console.error(chalk.red(
    chalk.bold.yellow('[server]') + ` Could not start server\n\n${error}`)
  );
});