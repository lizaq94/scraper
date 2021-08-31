//Kazdy element listy w JSONie musi zawierac zdjecie z oferty(link do zdjęcia), tytul, url do oferty na olx oraz opis

const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const axios = require('axios');

const url = `https://www.olx.pl/nieruchomosci/dzialki/sprzedaz/sejny/?search%5Bdist%5D=10`;

async function creatOffer(data) {
  const dom = new JSDOM(data);

  const document = dom.window.document;
  const offer = Array.from(document.querySelectorAll('div.offer-wrapper')).map(
    (compact) => ({
      title: compact.querySelector('a.link strong').textContent,
      url: compact.querySelector('a.link').getAttribute('href'),
    })
  );

  console.log(offer);
}

async function getOffer() {
  try {
    const response = await axios.get(url);
    const data = response.data;
    await creatOffer(data);
  } catch (error) {
    console.log('Erorr is ', error);
  }
}

getOffer();
