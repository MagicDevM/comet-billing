const fs = require('fs');
const chalk = require('chalk');
const path = require('path');

function getFiles(dir, options = {}) {
  // Get options
  const {
    recursive = true,
    extensions = ['js'],
    excludePaths = [],
  } = options;
  
  const files = [];
  
  try {
    // Get all the files from the directory
    const filesOfDir = fs.readdirSync(dir, { withFileTypes: true });
    
    // Iterate over files
    filesOfDir.forEach(file => {
      const fullPath = path.join(dir, file.name);
      // Check if its included in the exludePaths list
      if (excludePaths && excludePaths.some(path => fullPath.includes(path))) return;
      
      // Also get the files inside directories
      if (file.isDirectory() && recursive)
        files.push(...getFiles(fullPath, options));
      
      else if (file.isFile()) {
        // Validate extensions
        const ext = path.extname(file.name).slice(1);
        
        if (!extensions.includes(ext)) return;
        
        // Push it
        files.push(fullPath);
      }
    })
  } catch (error) {
    if (error !== "EACCES")
      console.error(chalk.yellow.bold('[server] ') + chalk.red(error));
  }
  
  // Return the files
  return files;
}

module.exports = getFiles;