# Scraper

Scraper is the app to get offer real estate listings from page. In this case from olx.pl page.

## Getting startred

- Clone the repository to your computer or [download the zip file](https://github.com/lizaq94/scraper/archive/refs/heads/main.zip).

```bash
$ git clone https://github.com/lizaq94/scraper.git
```

- `cd` into the created directory, and run `npm install` to download all packages

- Run `npm start` to run server on http://localhost:3000

- Methods you can use:

  - `POST /pull` - get offert from url and save in database

  - `GET /offers` - show all offers

  - `GET /offers/:id` - show one offer with given id

  - `DELETE /offers/:id` - delete on offer with given id

  - `DELETE /deleteAll` - delet all offers from database
