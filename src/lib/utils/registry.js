import puppeteer from "puppeteer";

// mostly stuff to get it to work with twitter and not get rejected
// scrapes a twitter profiles tweets for n length of scroll*1000px
async function scrapeTitle(url, scroll = 6) {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
  );
  await page.goto(url, { waitUntil: "networkidle0" });

  // Function to scroll
  async function autoScroll(page, scrollHeight) {
    await page.evaluate(async (scrollHeight) => {
      await new Promise((resolve) => {
        var totalHeight = 0;
        var distance = 100;
        var timer = setInterval(() => {
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    }, scrollHeight);
  }

  await page.waitForSelector('[data-testid="tweetText"]');
  // finding tweettext tags
  let allContents = [];
  for (let i = 0; i < scroll; i++) {
    let textContents = await page.$$eval('[data-testid="tweetText"]', (elements) =>
      elements.map((el) => el.textContent)
    );
    allContents.push(textContents);
    await autoScroll(page, 1000); // length will need some tweaking once registry is live
  }
  console.log(allContents);
  await browser.close();
}

// hardcoded url will just be the registry twitter acount once made
let url = "https://twitter.com/t3dotgg";
scrapeTitle(url);
