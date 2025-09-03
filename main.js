const apiURL = 'https://pokeapi.co/api/v2/pokemon/';
const pokemonList = document.querySelector("#pokemon-card");
const buttonsHeader = document.querySelectorAll(".btn-header"); // Cambiado a querySelectorAll
let allPokemons = []; // Nueva variable global para almacenar todos los Pokémon

async function getPokemons() {
    try {
      pokemonList.innerHTML = '';
      const ids = Array.from({ length:  300}, (_, i) => i + 1);
      const pokemonPromises = ids.map(id => fetch(`${apiURL}${id}`).then(r => r.json()));
      const pokemons = await Promise.all(pokemonPromises);
      pokemons.sort((a, b) => a.id - b.id);
      
      allPokemons = pokemons; // Almacenar todos los Pokémon globalmente
      pokemons.forEach(pokemon => showPokemon(pokemon));
    } catch (error) {
      console.error("Error cargando Pokémon:", error);
    }
}  

function showPokemon(data) {

    let types = data.types.map((type) => `<p class="${type.type.name} type">${type.type.name}</p>`)
    types = types.join('');

    let pokemonId = data.id.toString().padStart(3, '0')

    const div = document.createElement('div');
    div.classList.add('pokemon');
    div.innerHTML = `
        <p class="pokemon-id-background">#${pokemonId}</p>
            <div class="pokemon-image">
                <img src="${data.sprites.other["official-artwork"].front_default}" alt=${data.name}">
            </div>
            <div class="pokemon-info">
                <div class="name-container">
                    <p class="pokemon-id">#${pokemonId}</p>
                    <h2 class="pokemon-name">${data.name}</h2>
                </div>
                <div class="types-container">
                    ${types}
                </div>
                <div class="stats-container">
                    <p class="stat">${data.height}m</p>
                    <p class="stat">${data.weight}kg</p>
                </div>
            </div>
    `;
    pokemonList.appendChild(div);
}

buttonsHeader.forEach(button => button.addEventListener('click', (event) => {
    pokemonList.innerHTML = ''; // Limpiar la lista actual
    const buttonId = event.currentTarget.id;

    if (buttonId === "ver-todos") {
        allPokemons.forEach(pokemon => showPokemon(pokemon));
    } else {
        const pokemonsFiltered = allPokemons.filter(pokemon => pokemon.types.some(type => type.type.name === buttonId));
        pokemonsFiltered.forEach(pokemon => showPokemon(pokemon));
    }
}));

getPokemons();