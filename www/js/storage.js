/* storage.js
   Helpers pour stocker/récupérer depuis localStorage :
   - generic get/set
   - favoris (toggle/is)
   - high scores (save/get)
*/

(function(window){
  const LS = window.localStorage;

  function safeParse(v, fallback) {
    try { return JSON.parse(v); } catch(e) { return fallback; }
  }

  function setItem(key, value) {
    try { LS.setItem(key, JSON.stringify(value)); } catch(e) { console.warn('storage set failed', e); }
  }

  function getItem(key, fallback = null) {
    try {
      const v = LS.getItem(key);
      if (v === null) return fallback;
      return safeParse(v, fallback);
    } catch(e) {
      console.warn('storage get failed', e);
      return fallback;
    }
  }

  // Favoris (simple toggle)
  function favKey(name) {
    return `fav_${name}`;
  }
  function toggleFavorite(name) {
    const key = favKey(name);
    if (getItem(key, false)) {
      LS.removeItem(key);
      return false;
    } else {
      setItem(key, true);
      return true;
    }
  }
  function isFavorite(name) {
    return !!getItem(favKey(name), false);
  }

  // High-scores (liste triée)
  const HIGHSCORES_KEY = 'tp1_highscores';
  function saveHighScore(entry) {
    // entry = {name, score, date}
    const list = getItem(HIGHSCORES_KEY, []);
    list.push(entry);
    // sort desc
    list.sort((a,b) => b.score - a.score || new Date(b.date) - new Date(a.date));
    // keep top 20
    const trimmed = list.slice(0,20);
    setItem(HIGHSCORES_KEY, trimmed);
  }
  function getHighScores() {
    return getItem(HIGHSCORES_KEY, []);
  }

  // Expose API
  window.TPStorage = {
    setItem,
    getItem,
    toggleFavorite,
    isFavorite,
    saveHighScore,
    getHighScores
  };
})(window);
