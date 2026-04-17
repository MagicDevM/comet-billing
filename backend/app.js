"use strict";

/**
 * @fileoverview Comet Billing - © Comet Labs 2026
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const nocache = require('nocache');

// Get in-app functions
const loadConfig = require('./handlers/loadConfig');
const loadModules = require('./handlers/moduleLoader');

const config = loadConfig();

// Initialize the express app
const app = express();

console.log((chalk.bold.yellow('[server]') + chalk.yellow(' Starting Server...')));

// Load package middlewares
app.use(nocache());

const PORT = config.general.port || 3030;
app.listen(PORT, "0.0.0.0", () => {
  // Load all modules
  loadModules(app);
  
  console.log(chalk.gray.bold(`Webserver is now online on PORT ${PORT}`))
}).on("error", error => {
  if (error.code === "EADDRINUSE") 
    return console.error(chalk.red(chalk.bold.yellow.bold('[server]') + 
    ` Port: ${config.general.port} is already in use`
    ));
  console.error(chalk.red(
    chalk.bold.yellow('[server]') + ` Could not start server\n\n${error}`)
  );
});