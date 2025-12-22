import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: false });
const page = await browser.newPage();

// Check possible URLs
const urls = [
  'https://805-insurance.pages.dev',
  'https://805insurance.com'
];

for (const url of urls) {
  try {
    console.log(`\nTrying: ${url}`);
    const response = await page.goto(url, { timeout: 15000 });
    console.log('Status:', response?.status());
    
    if (response?.status() === 200) {
      await page.screenshot({ path: 'live-screenshot.png', fullPage: true });
      console.log('Screenshot saved!');
      
      // Check content
      const title = await page.title();
      console.log('Title:', title);
      break;
    }
  } catch (error) {
    console.log('Error:', error.message);
  }
}

await browser.close();
