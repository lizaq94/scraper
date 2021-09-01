//Kazdy element listy w JSONie musi zawierac zdjecie z oferty(link do zdjęcia), tytul, url do oferty na olx oraz opis

const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const axios = require('axios');

const url = `https://www.olx.pl/nieruchomosci/dzialki/sprzedaz/sejny/?search%5Bdist%5D=10`;

async function getAllOferts(url) {
  try {
    const response = await axios.get(url);
    const data = response.data;
    return data;
  } catch (error) {
    console.log('Error:', error);
  }
}

async function getDataFromOffert(data) {
  const dom = new JSDOM(data);
  const { document } = dom.window;
  const offerData = [];

  const offers = Array.from(document.querySelectorAll('div.offer-wrapper')).map(
    (offer) => offer
  );

  offers.forEach((offer) => {
    const title = offer.querySelector('a.link strong').textContent;
    const image = offer.querySelector('img.fleft')
      ? offer.querySelector('img.fleft').src
      : 'brak zdjęcia';
    const url = offer.querySelector('h3 a.link').getAttribute('href');
    const price = Number(
      offer
        .querySelector('p.price strong')
        .textContent.slice(0, -2)
        .split(' ')
        .join('')
    );
    offerData.push({
      title,
      image,
      url,
      price,
    });
  });

  console.log(offerData);
}

getAllOferts(url).then((response) => getDataFromOffert(response));
