const pokemonData = [];

// Function untuk mendapatkan warna berdasarkan tipe pokemon
function getTypeColor(type) {
  switch (type) {
    case 'grass':
      return '#48D0B0';
    case 'poison':
      return '#A040A0';
    case 'fire':
      return '#F08030';
    case 'water':
      return '#6890F0';
    case 'electric':
      return '#F8D030';
    case 'psychic':
      return '#F85888';
    case 'ice':
      return '#98D8D8';
    case 'dragon':
      return '#7038F8';
    default:
      return '#A8A878'; 
  }
}

// Mengambil data pokemon dari mock server
async function fetchPokemon() {
  try {
    const response = await fetch("http://localhost:3000/pokemon");
    if (!response.ok) {
      throw new Error("Failed to fetch Pokémon data");
    }
    const data = await response.json();
    pokemonData.push(...data); 
    renderApp(); 
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Komponen untuk menampilkan judul dan deskripsi
function Header() {
  return (
    <header className="text-center group mb-10">
      <h1 className="text-5xl font-bold mb-5 group-hover:text-purple-400 transition duration-300">
        Pokedex
      </h1>
      <p className="text-sm text-gray-300 group-hover:text-purple-300 transition duration-300">
        Welcome to the Pokémon portal and start your adventure!
      </p>
    </header>
  );
}

// Komponen untuk menampilkan kartu pokemon
function PokemonCard({ name, types, height, weight, abilities, evolutionChains, image }) {
  return (
    <div className="bg-[#070F2B] p-2 m-2 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 max-w-sm hover:bg-[#112f5f] border border-[#021526]">
      <img className="w-full h-20 object-contain mb-4" src={image} alt={name} />
      <h2 className="text-lg font-semibold text-center text-purple-400 capitalize mb-2">{name}</h2>
      <div className="flex justify-center space-x-1 mb-4">
        {types.map(type => (
          <span key={type} className="px-2 py-1 rounded-full text-white capitalize text-xs" style={{ backgroundColor: getTypeColor(type) }}>
            {type}
          </span>
        ))}
      </div>
      <div className="text-center mb-2">
        <p className="text-xs"><strong>Height:</strong> {height} dm</p>
        <p className="text-xs"><strong>Weight:</strong> {weight} hg</p>
      </div>
      <div className="text-center mb-2">
        <p className="text-xs"><strong>Abilities:</strong> {abilities.join(', ')}</p>
      </div>
      <div className="text-center mb-2">
        <p className="text-xs"><strong>Evolution:</strong> {evolutionChains.join(' → ')}</p>
      </div>
    </div>
  );
}

// Komponen untuk menampilkan daftar pokemon
function PokemonList() {
  return (
    <div id="pokemon-list">
      {pokemonData.length === 0 ? (
        <p className="text-center text-xl">Loading Pokémon data...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
          {pokemonData.map((pokemon) => (
            <PokemonCard
              key={pokemon.id}
              name={pokemon.name}
              types={pokemon.types}
              height={pokemon.height}
              weight={pokemon.weight}
              abilities={pokemon.abilities}
              evolutionChains={pokemon.evolutionChains}
              image={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Komponen utama aplikasi
function App() {
  return (
    <div className="flex flex-col min-h-screen bg-[#102c4f] text-white">
      <nav className="bg-[#021526] p-3 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <a href="#" className="text-2xl font-bold">Pokedex</a>
          <div>
            <a href="#pokemon-list" className="text-white mx-4 hover:text-gray-300">Pokemons</a>
          </div>
        </div>
      </nav>

      <main className="flex-grow container mx-auto p-6">
        <Header />
        <PokemonList />
      </main>

      <footer className="text-center text-sm text-white bg-[#021526] p-4">
        <p>&copy; Pokedex 2024</p>
      </footer>
    </div>
  );
}

// Fungsi untuk merender aplikasi ke elemen root
function renderApp() {
  ReactDOM.render(<App />, document.getElementById('root'));
}

// Render awal
renderApp();

// Mengambil dan menampilkan data pokemon
fetchPokemon();
