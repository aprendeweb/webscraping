const puppeteer = require('puppeteer');
const path = require('path');
const websites = require('./websites.json');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  for (const website of websites) {
    const scriptPath = path.join(__dirname, 'scripts', website.scriptName);
    await require(scriptPath)(page, website);
    console.log('Scraping done for', website.name);
  }
})();
