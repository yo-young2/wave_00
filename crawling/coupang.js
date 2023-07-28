// const puppeteer = require('puppeteer');
// // import puppeteer from 'puppeteer';

// macro();
// async function macro()
// {
//     console.info('start...');
//     console.info('puppeteer',puppeteer);
//     // const browser = await puppeteer.launch({
//     //     headless: false,
//     //     // args:['--window-size=1920,1080'],
//     //     slowMo : 30
//     // });

//     // const page = await browser.newPage();
//     // await Promise.all([
//     //         page.goto('http://www.naver.com'),
//     //         page.waitForNavigation()
//     // ])


//     // // await page.waitForTimeout(3000);
//     // await browser.close();
// }

const puppeteer = require( 'puppeteer' );

(async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navigate the page to a URL
  await page.goto('https://developer.chrome.com/');

  // Set screen size
  await page.setViewport({width: 1080, height: 1024});

  // Type into search box
  await page.type('.search-box__input', 'automate beyond recorder');

  // Wait and click on first result
  const searchResultSelector = '.search-box__link';
  await page.waitForSelector(searchResultSelector);
  await page.click(searchResultSelector);

  // Locate the full title with a unique string
  const textSelector = await page.waitForSelector(
    'text/Customize and automate'
  );
  const fullTitle = await textSelector?.evaluate(el => el.textContent);

  // Print the full title
  console.log('The title of this blog post is "%s".', fullTitle);

  await browser.close();
})();