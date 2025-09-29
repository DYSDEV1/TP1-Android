/* index.js
   Rendu de la liste de Pokémons + intégration du quiz (TPQuiz) + stockage favoris (TPStorage)
*/

(function(window, document){
  // données mock (peuvent être extraites dans un fichier data si tu veux)
  const pokemons = [
    { name: "Bulbizarre", category: "Pokémon Graine", image: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/sprites/1/regular.png", evolution: "Herbizarre" },
    { name: "Herbizarre", category: "Pokémon Graine", image: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/sprites/2/regular.png", evolution: "Florizarre" },
    { name: "Salamèche", category: "Pokémon Lézard", image: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/sprites/4/regular.png", evolution: "Reptincel" },
    { name: "Carapuce", category: "Pokémon Carapace", image: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/sprites/7/regular.png", evolution: "Carabaffe" }
  ];

  function onReady() {
    renderHeaderControls();
    renderList();
  }

  if (window.cordova) {
    document.addEventListener('deviceready', onReady, false);
  } else {
    document.addEventListener('DOMContentLoaded', onReady);
  }

  function renderHeaderControls() {
    // place un bouton "Start Quiz" dans le header si présent
    const header = document.querySelector('.app-header');
    if (!header) return;
    const controls = document.createElement('div');
    controls.style = 'margin-top:8px;display:flex;gap:8px;justify-content:center';

    const quizBtn = document.createElement('button');
    quizBtn.textContent = 'Démarrer le Quiz';
    quizBtn.className = 'btn btn--primary';
    quizBtn.style = 'padding:8px 12px;border-radius:10px;border:none;cursor:pointer';
    quizBtn.addEventListener('click', () => {
      // start quiz shuffle questions and set callback
      TPQuiz.startQuiz({ shuffle: true, onComplete: onQuizComplete });
    });

    const scoresBtn = document.createElement('button');
    scoresBtn.textContent = 'Classement';
    scoresBtn.className = 'btn btn--secondary';
    scoresBtn.style = 'padding:8px 12px;border-radius:10px;border:none;cursor:pointer';
    scoresBtn.addEventListener('click', showHighScores);

    controls.appendChild(quizBtn);
    controls.appendChild(scoresBtn);
    header.appendChild(controls);
  }

  function renderList() {
    const container = document.getElementById('pokemon-list');
    if (!container) return;
    container.innerHTML = '';

    pokemons.forEach((p, index) => {
      const card = createPokemonCard(p, index);
      container.appendChild(card);
    });
  }

  function createPokemonCard(pokemon, index) {
    const card = document.createElement('article');
    card.className = 'pokemon-card';
    card.style = 'transition: transform .12s ease';

    // image zone
    const imgWrap = document.createElement('div');
    imgWrap.className = 'image';
    const img = document.createElement('img');
    img.alt = pokemon.name;
    img.src = pokemon.image;
    img.loading = 'lazy';
    imgWrap.appendChild(img);

    // overlay
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
    btnFav.className = TPStorage.isFavorite(pokemon.name) ? 'btn btn--primary' : 'btn btn--secondary';
    btnFav.textContent = TPStorage.isFavorite(pokemon.name) ? 'Favori ✓' : 'Favoris';
    btnFav.addEventListener('click', () => {
      const isNow = TPStorage.toggleFavorite(pokemon.name);
      btnFav.textContent = isNow ? 'Favori ✓' : 'Favoris';
      btnFav.className = isNow ? 'btn btn--primary' : 'btn btn--secondary';
    });

    actions.appendChild(btnDetail);
    actions.appendChild(btnFav);

    content.appendChild(actions);

    card.appendChild(imgWrap);
    card.appendChild(content);

    return card;
  }

  // handlers
  function showDetails(pokemon) {
    // simple modal via alert for l'instant
    alert(`${pokemon.name}\n\nCatégorie: ${pokemon.category}\nÉvolution: ${pokemon.evolution}`);
  }

  function onQuizComplete(result) {
    // result: {name, score}
    // show a small notification
    setTimeout(() => {
      alert(`Merci ${result.name}! Ton score: ${result.score}`);
    }, 50);
  }

  function showHighScores() {
    const list = TPStorage.getHighScores();
    if (!list || list.length === 0) {
      alert('Aucun score enregistré pour l\'instant.');
      return;
    }
    const lines = list.map((s, i) => `${i+1}. ${s.name} — ${s.score} (${new Date(s.date).toLocaleString()})`);
    alert('Classement:\n\n' + lines.join('\n'));
  }

})(window, document);
