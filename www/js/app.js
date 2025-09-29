// app.js - TP1: generate the Pokémon list and simple interactions.

// Mock data (same shape as data class in the Kotlin TP)
const pokemons = [
  {
    name: "Bulbizarre",
    category: "Pokémon Graine",
    image: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/sprites/1/regular.png",
    evolution: "Herbizarre"
  },
  {
    name: "Herbizarre",
    category: "Pokémon Graine",
    image: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/sprites/2/regular.png",
    evolution: "Florizarre"
  },
  {
    name: "Salamèche",
    category: "Pokémon Lézard",
    image: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/sprites/4/regular.png",
    evolution: "Reptincel"
  },
  {
    name: "Carapuce",
    category: "Pokémon Carapace",
    image: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/sprites/7/regular.png",
    evolution: "Carabaffe"
  }
];

// Cordova vs browser readiness
function onReady() {
  renderList();
}
if (window.cordova) {
  document.addEventListener('deviceready', onReady, false);
} else {
  document.addEventListener('DOMContentLoaded', onReady);
}

/* render list */
function renderList() {
  const container = document.getElementById('pokemon-list');
  container.innerHTML = '';

  pokemons.forEach((p, idx) => {
    container.appendChild(createCard(p, idx));
  });
}

function createCard(pokemon, idx) {
  const card = document.createElement('article');
  card.className = 'pokemon-card';
  card.dataset.index = idx;

  // image zone
  const imgWrap = document.createElement('div');
  imgWrap.className = 'image';
  const img = document.createElement('img');
  img.alt = pokemon.name;
  img.src = pokemon.image;
  img.loading = 'lazy';
  imgWrap.appendChild(img);

  // overlay title
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  overlay.textContent = pokemon.name;
  imgWrap.appendChild(overlay);

  // content
  const content = document.createElement('div');
  content.className = 'content';

  const category = document.createElement('div');
  category.className = 'category';
  category.textContent = pokemon.category;

  const evolution = document.createElement('div');
  evolution.className = 'evolution';
  evolution.textContent = `Évolution : ${pokemon.evolution}`;

  content.appendChild(category);
  content.appendChild(evolution);

  // actions
  const actions = document.createElement('div');
  actions.className = 'actions';

  const btnDetail = document.createElement('button');
  btnDetail.className = 'btn btn--primary';
  btnDetail.textContent = 'Détails';
  btnDetail.addEventListener('click', () => showDetails(pokemon));

  const btnFav = document.createElement('button');
  btnFav.className = 'btn btn--secondary';
  btnFav.textContent = isFav(pokemon) ? 'Favori ✓' : 'Favoris';
  btnFav.addEventListener('click', () => toggleFavorite(pokemon, btnFav));

  actions.appendChild(btnDetail);
  actions.appendChild(btnFav);

  content.appendChild(actions);
  card.appendChild(imgWrap);
  card.appendChild(content);
  return card;
}

/* handlers */
function showDetails(pokemon) {
  const msg = `${pokemon.name}\n\nCatégorie: ${pokemon.category}\nÉvolution: ${pokemon.evolution}`;
  alert(msg);
}

function favKey(pokemon) {
  return `fav_${pokemon.name}`;
}

function isFav(pokemon) {
  try {
    return localStorage.getItem(favKey(pokemon)) === '1';
  } catch (e) {
    return false;
  }
}

function toggleFavorite(pokemon, btn) {
  try {
    const key = favKey(pokemon);
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
      btn.textContent = 'Favoris';
      btn.classList.remove('btn--primary');
      btn.classList.add('btn--secondary');
    } else {
      localStorage.setItem(key, '1');
      btn.textContent = 'Favori ✓';
      btn.classList.remove('btn--secondary');
      btn.classList.add('btn--primary');
    }
  } catch (e) {
    console.warn('localStorage not available', e);
    alert('Impossible de sauvegarder les favoris sur cet appareil.');
  }
}
