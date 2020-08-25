const fs = require('fs');
const path = require('path');
module.exports = async (page, website) => {
  const { selectors } = website;
  await page.goto(website.url);
  await page.waitForSelector(selectors.emailInput);
  await page.waitForSelector(selectors.passwordInput);
  await page.waitForSelector(selectors.signInbutton);
  await page.type(selectors.emailInput, process.env.FACEBOOK_USERNAME);
  await page.type(selectors.passwordInput, process.env.FACEBOOK_PASSWORD);
  await page.click(selectors.signInbutton);
  await page.waitFor(3000);
  await page.goto(`${website.url}/marketplace`);
  await page.waitForSelector(selectors.products);
  const productList = await page.evaluate((productsTag) => {
    const products = document.querySelectorAll(productsTag);
    const regExp = new RegExp('[A-z]+');
    const productsList = [];
    for (const product of products) {
      const productText = product ? product.innerText : '';
      const textArray = productText.split('\n');
      const cleanText = textArray.filter((txt) => regExp.test(txt));
      let newProduct = {};
      newProduct.price = cleanText.length > 2 && cleanText[0];
      newProduct.name = cleanText.length > 2 ? cleanText[1] : cleanText[0];
      newProduct.location = cleanText.length > 2 ? cleanText[2] : cleanText[1];

      productsList.push(newProduct);
    }
    return productsList;
  }, selectors.products);

  fs.writeFileSync(
    path.join(__dirname, `${website.scriptName}.json`),
    JSON.stringify(productList),
    'utf8'
  );
};
