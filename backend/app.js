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

app.use(async (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  
  try {
    // Get main html
    const htmlPath = path.join(distPath, "index.html");
    
    if (!htmlPath) throw new Error('No displayable pages found.');
    
    // Get html content (string)
    let html = await fs.readFileSync(htmlPath, 'utf8');
    
    if (!html) throw new Error('No displayable pages found');
  
    // Apply dynamic values
    html = html.replace(/{{SITE_NAME}}/g, "Comet Billing");
    
    // Send html to the browser(client)
    res.send(html);
  } catch (error) {
    // if file doesnt exists try development files
    try {
      const devHtmlPath = path.join(__dirname, "../frontend/index.html");
      // Get html content (string)
      let html = await fs.readFileSync(devHtmlPath, 'utf8');
      
      if (!html) throw new Error('No displayable pages found');
    
      // Apply dynamic values
      html = html.replace(/{{SITE_NAME}}/g, "Comet Billing");
      
      // Send html to the browser(client)
      res.send(html);
    } catch (error) {
      console.error(chalk.yellow.bold('[server] ') + chalk.red(error))
      // if nothing works just send error
      return res.status(500).send(error);
    }
  }
});

app.listen(3030, "0.0.0.0", () => {
  // Load all modules
  loadModules(express, app);
  
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