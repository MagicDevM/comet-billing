const path = require('path');
const fs = require('fs');
const chalk = require('chalk')

const manifest = {
  name: 'Frontend Module',
  middleware: true
};

function load(router) {
  router.use(async (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    
    try {
      // setup frontend connection
      const distPath = path.join(__dirname, "../../frontend/dist");
      
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
        const devHtmlPath = path.join(__dirname, "../../frontend/index.html");
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
}

module.exports = { manifest, load }