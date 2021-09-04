//Kazdy element listy w JSONie musi zawierac zdjecie z oferty(link do zdjęcia), tytul, url do oferty na olx oraz opis

const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const axios = require('axios');
const fs = require('fs');

const mainUrl = `https://www.olx.pl/nieruchomosci/dzialki/sprzedaz/sejny/?search%5Bdist%5D=10`;

function getDataFromOlxAd(document, url) {
  const title = document.querySelector('h1[data-cy="ad_title"]').textContent;

  const image = document.querySelector('div.swiper-zoom-container img')
    ? document.querySelector('div.swiper-zoom-container img').src
    : 'Brak zdjęcia';

  const description = document
    .querySelector('div[data-cy="ad_description"] div')
    .textContent.replace(/\r?\n|\r/g, ' ');

  const priceEl = document.querySelector(
    'div[data-testid="ad-price-container"] h3'
  ).textContent;
  const price = Number(priceEl.slice(0, -2).split(' ').join(''));
  const currency = priceEl.slice(-3).trim();

  const areaEl = document
    .querySelector('ul.css-sfcl1s li:nth-child(4)')
    .textContent.slice(13)
    .trim();
  const area = Number(areaEl.slice(0, -2).split(' ').join(''));
  const unitArea = areaEl.slice(-2).trim();

  const adAllDetail = {
    title,
    url,
    image,
    description,
    price,
    currency,
    area,
    unitArea,
  };
  return adAllDetail;
}

function getDataFromOtodomAd(document, url) {
  const title = document.querySelector(
    'h1[data-cy="adPageAdTitle"]'
  ).textContent;
  const imageEl = document.querySelector('link[rel="preload"]');

  const image = imageEl ? imageEl.getAttribute('href') : 'Brak zdjęcia';

  const description = document
    .querySelector('div[data-cy="adPageAdDescription"] ')
    .textContent.replace(/\r?\n|\r/g, ' ');

  const priceEl = document.querySelector(
    'header strong[data-cy="adPageHeaderPrice"]'
  ).textContent;
  const price = Number(priceEl.slice(0, -2).split(' ').join(''));
  const currency = priceEl.slice(-3).trim();

  const areaEl = document.querySelector('.css-1ytkscc.ev4i3ak0').textContent;
  const area = Number(areaEl.slice(0, -2).split(' ').join(''));
  const unitArea = areaEl.slice(-2).trim();
  const adAllDetail = {
    title,
    url,
    image,
    description,
    price,
    currency,
    area,
    unitArea,
  };
  return adAllDetail;
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

function saveDataToJson(data) {
  const json = JSON.stringify(data);

  fs.appendFile('data.json', json, (err) => {
    if (err) console.log('Nie udało się zapisać', err);
  });
}

async function handelScrapeData(page) {
  const dom = new JSDOM(page);
  const { document } = dom.window;
  const adUrls = Array.from(
    document.querySelectorAll(`a[data-cy="listing-ad-title"]`)
  ).map((adUrl) => adUrl.getAttribute('href'));

  const arr = await Promise.all(
    adUrls.map(async (adUrl) => {
      const data = await getDataFromPage(adUrl);
      const dataForSave = await getDataFromSingleAd(data, adUrl);
      // const json = JSON.stringify(dataForSave);
      // fs.readFile('data.json', 'utf-8', (err, data) => {
      //   if (err) console.log(err);
      //   if (data.indexOf(json) > -1) {
      //     console.log('Coś takiego już istnieje');
      //   } else console.log(data, json);
      // });
      return dataForSave;
    })
  );

  saveDataToJson(arr);
}

async function getDataFromPage(url) {
  try {
    const res = await axios.get(url);
    const page = res.data;
    return page;
  } catch (error) {
    console.error(error);
  }
}

async function startScrape() {
  try {
    const data = await getDataFromPage(mainUrl);
    await handelScrapeData(data);
  } catch (error) {
    console.error(error);
  }
}

startScrape();
