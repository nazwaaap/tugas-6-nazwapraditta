const axios = require("axios");
const fs = require("fs");

async function generateJsonDB() {
  const pokemonApiURL = "https://pokeapi.co/api/v2/pokemon/";
  const POKEMON_COUNT = 100; // Jumlah Pokemon yang ingin diambil
  let pokemonList = [];

  try {
    // Loop untuk fetch data dari API berdasarkan jumlah yang diinginkan
    for (let i = 1; i <= POKEMON_COUNT; i++) {
      const response = await axios.get(`${pokemonApiURL}${i}`);
      const speciesResponse = await axios.get(response.data.species.url); // Untuk evolution chain
      
      const pokemon = {
        id: response.data.id,
        name: response.data.name,
        height: response.data.height,
        weight: response.data.weight,
        types: response.data.types.map((type) => type.type.name),
        abilities: response.data.abilities.map((ability) => ability.ability.name),
        cries: {
          latest: `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${i}.ogg`,
          legacy: `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/legacy/${i}.ogg`
        },
        evolutionChains: speciesResponse.data.evolution_chain 
          ? await getEvolutionChain(speciesResponse.data.evolution_chain.url) 
          : []
      };
      pokemonList.push(pokemon);
    }

    // Menyimpan hasil dalam file db.json
    const data = { pokemon: pokemonList };
    fs.writeFileSync("db.json", JSON.stringify(data, null, 2));
    console.log("db.json berhasil dibuat dengan data 100 Pokemon!");

  } catch (error) {
    console.error("Terjadi kesalahan saat mengambil data:", error);
  }
}

// Fungsi untuk mendapatkan evolution chain
async function getEvolutionChain(url) {
  try {
    const evolutionResponse = await axios.get(url);
    const chain = [];
    let current = evolutionResponse.data.chain;

    // Loop untuk mengekstrak semua nama evolusi
    do {
      chain.push(current.species.name);
      current = current.evolves_to.length > 0 ? current.evolves_to[0] : null; // Periksa jika ada evolusi berikutnya
    } while (current);

    return chain;
  } catch (error) {
    console.error("Error fetching evolution chain:", error);
    return [];
  }
}

// Menjalankan fungsi generateJsonDB
generateJsonDB();