const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const axios = require('axios');
const Offer = require('./models/offer');

const SELECTORS = {
  title: ['h1[data-cy="ad_title"]', 'h1[data-cy="adPageAdTitle"]'],
  url: 'a[data-cy="listing-ad-title"]',
  image: ['div.swiper-zoom-container img', 'link[rel="preload"]'],
  description: [
    'div[data-cy="ad_description"] div',
    'div[data-cy="adPageAdDescription"]',
  ],
  priceEl: [
    'div[data-testid="ad-price-container"] h3',
    'header strong[data-cy="adPageHeaderPrice"]',
  ],
  areaEl: ['ul.css-sfcl1s li:nth-child(4)', '.css-1ytkscc.ev4i3ak0'],
};

function getDataFromOlxAd(document, url) {
  const title = document.querySelector(SELECTORS.title[0]).textContent;
  const imageEl = document.querySelector(SELECTORS.image[0]);
  const image = imageEl ? imageEl.src : null;

  const description = document
    .querySelector(SELECTORS.description[0])
    .textContent.replace(/\r?\n|\r/g, ' ');

  const priceEl = document.querySelector(SELECTORS.priceEl[0]).textContent;
  const price = Number(priceEl.slice(0, -2).split(' ').join(''));
  const currency = priceEl.slice(-3).trim();

  const areaEl = document
    .querySelector(SELECTORS.areaEl[0])
    .textContent.slice(13)
    .trim();
  const area = Number(areaEl.slice(0, -2).split(' ').join(''));
  const unitArea = areaEl.slice(-2).trim();

  return {
    title,
    url,
    image,
    description,
    price,
    currency,
    area,
    unitArea,
  };
}

function getDataFromOtodomAd(document, url) {
  const title = document.querySelector(SELECTORS.title[1]).textContent;
  const imageEl = document.querySelector(SELECTORS.image[1]);

  const image = imageEl ? imageEl.getAttribute('href') : null;

  const description = document
    .querySelector(SELECTORS.description[1])
    .textContent.replace(/\r?\n|\r/g, ' ');

  const priceEl = document.querySelector(SELECTORS.priceEl[1]).textContent;
  const price = Number(priceEl.slice(0, -2).split(' ').join(''));
  const currency = priceEl.slice(-3).trim();

  const areaEl = document.querySelector(SELECTORS.areaEl[1]).textContent;
  const area = Number(areaEl.slice(0, -2).split(' ').join(''));
  const unitArea = areaEl.slice(-2).trim();

  return {
    title,
    url,
    image,
    description,
    price,
    currency,
    area,
    unitArea,
  };
}

function getDataFromSingleAd(data, url) {
  const dom = new JSDOM(data);
  const { document } = dom.window;

  if (url.indexOf('olx.pl') > -1) {
    return getDataFromOlxAd(document, url);
  }
  if (url.indexOf('otodom.pl') > -1) {
    return getDataFromOtodomAd(document, url);
  }
}

async function saveDataToDB(data) {
  try {
    const offerData = new Offer(data);
    await offerData.save();
  } catch (err) {
    console.error(err);
  }
}

async function handelScrapeData(page) {
  const dom = new JSDOM(page);
  const { document } = dom.window;
  const adUrls = Array.from(document.querySelectorAll(SELECTORS.url)).map(
    (adUrl) => adUrl.getAttribute('href')
  );
  const adUrlsUniq = [...new Set(adUrls)];

  adUrlsUniq.forEach(async (adUrl) => {
    try {
      const data = await getDataFromPage(adUrl);
      const dataForSave = getDataFromSingleAd(data, adUrl);
      const isOfferExist = await Offer.findOne({ url: adUrl });

      if (!isOfferExist) {
        saveDataToDB(dataForSave);
      }
    } catch (err) {
      console.error(err);
    }
  });
}

async function getDataFromPage(url) {
  try {
    const res = await axios.get(url);
    const page = res.data;
    return page;
  } catch (err) {
    console.error(err);
  }
}

async function getOffersFromUrl(mainUrl) {
  try {
    const data = await getDataFromPage(mainUrl);
    await handelScrapeData(data);
  } catch (error) {
    console.error(error);
  }
}

module.exports = getOffersFromUrl;
