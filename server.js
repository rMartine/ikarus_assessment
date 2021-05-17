const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const fetch = require('node-fetch');

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

const get_poke_list = async () => {
  const url = 'https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json';
  const res = await fetch(url);
  let pokeList = '[{"empty_list": "true"}]';

  if (res.ok && res.status == 200) {
    pokeList = res.json();
  };
  return pokeList;
}

// create a GET route
app.get('/pokemon_api', async (req, res) => {
  let poke_list = await get_poke_list()
  res.send({ poke_list: poke_list });
});
