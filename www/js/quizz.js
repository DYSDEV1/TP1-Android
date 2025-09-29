/* quiz.js
   Définit un module global `TPQuiz` qui gère :
   - questions (ici mock)
   - affichage d'une UI de quiz basique (modal)
   - navigation questions, scoring
   - callback onComplete(score)
*/

(function(window, document){
  // QUESTIONS: array d'objets {q, choices: [..], answerIndex}
  // Simple set de questions Pokémon (tu peux en ajouter)
  const QUESTIONS = [
    {
      q: "Quel Pokémon évolue en Herbizarre ?",
      choices: ["Bulbizarre", "Salamèche", "Carapuce", "Pikachu"],
      answerIndex: 0
    },
    {
      q: "Quel type est Salamèche (de base) ?",
      choices: ["Eau", "Plante", "Feu", "Electrik"],
      answerIndex: 2
    },
    {
      q: "Carapuce évolue en ... ?",
      choices: ["Tortank", "Carabaffe", "Reptincel", "Herbizarre"],
      answerIndex: 1
    },
    {
      q: "Quel Pokémon est de la catégorie 'Pokémon Graine' ?",
      choices: ["Bulbizarre", "Salamèche", "Pikachu", "Mewtwo"],
      answerIndex: 0
    },
    {
      q: "Quel Pokémon possède l'attaque 'Éclair' (thème) ?",
      choices: ["Pikachu", "Carapuce", "Bulbizarre", "Salamèche"],
      answerIndex: 0
    },
    {
      q: "Florizarre est l'évolution de ... ?",
      choices: ["Herbizarre", "Bulbizarre", "Carapuce", "Salamèche"],
      answerIndex: 0
    }
  ];

  // Crée une modal de quiz et l'insère dans le DOM si elle n'existe pas
  function ensureModal() {
    let modal = document.getElementById('tp-quiz-modal');
    if (modal) return modal;

    modal = document.createElement('div');
    modal.id = 'tp-quiz-modal';
    modal.style = `
      position: fixed; inset: 0; display:flex; align-items:center; justify-content:center;
      background: rgba(0,0,0,0.5); z-index:2000; padding:16px;
    `;

    modal.innerHTML = `
      <div class="tp-quiz-card" style="max-width:600px;width:100%;background:#fff;border-radius:12px;padding:18px;box-shadow:0 8px 36px rgba(0,0,0,0.25);">
        <div id="tp-quiz-close" style="text-align:right;"><button id="tp-quiz-close-btn" style="padding:6px 8px;border-radius:6px;border:none;background:#eee;cursor:pointer">✕</button></div>
        <h2 id="tp-quiz-title" style="margin:6px 0 12px 0">Quiz Pokémon</h2>
        <div id="tp-quiz-body"></div>
        <div id="tp-quiz-footer" style="margin-top:12px;text-align:right"></div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('#tp-quiz-close-btn').addEventListener('click', () => {
      hideModal();
    });

    return modal;
  }

  function showModal() {
    const m = ensureModal();
    m.style.display = 'flex';
  }
  function hideModal() {
    const m = ensureModal();
    m.style.display = 'none';
  }

  // Quiz state
  let state = null; // {questions, index, score, onComplete}

  function startQuiz(options = {}) {
    // shuffle questions if requested
    const qs = options.shuffle ? shuffle(Array.from(QUESTIONS)) : Array.from(QUESTIONS);
    state = {
      questions: qs,
      index: 0,
      correct: 0,
      onComplete: options.onComplete || function(score){ console.log('quiz done', score); },
      playerName: options.playerName || 'Joueur'
    };
    showModal();
    renderQuestion();
  }

  function renderQuestion() {
    const m = ensureModal();
    const body = m.querySelector('#tp-quiz-body');
    const qObj = state.questions[state.index];
    body.innerHTML = ''; // reset

    const idx = state.index;
    const total = state.questions.length;

    const info = document.createElement('div');
    info.innerHTML = `<div style="color:#666;margin-bottom:8px">Question ${idx+1} / ${total}</div>`;
    body.appendChild(info);

    const qEl = document.createElement('div');
    qEl.style = 'font-weight:600;margin-bottom:12px';
    qEl.textContent = qObj.q;
    body.appendChild(qEl);

    // choices
    const choicesWrap = document.createElement('div');
    choicesWrap.style = 'display:flex;flex-direction:column;gap:8px';
    qObj.choices.forEach((c, i) => {
      const btn = document.createElement('button');
      btn.textContent = c;
      btn.style = 'padding:10px;border-radius:8px;border:1px solid #ddd;background:#fafafa;cursor:pointer;text-align:left';
      btn.addEventListener('click', () => selectAnswer(i, btn));
      choicesWrap.appendChild(btn);
    });
    body.appendChild(choicesWrap);

    // footer: show score partial + next/quit
    const footer = m.querySelector('#tp-quiz-footer');
    footer.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div style="color:#333;font-weight:600">Score: ${state.correct}</div>
        <div>
          <button id="tp-quiz-quit" style="margin-right:8px;padding:8px 10px;border-radius:8px;border:none;background:#f4f4f6;cursor:pointer">Quitter</button>
        </div>
      </div>
    `;
    footer.querySelector('#tp-quiz-quit').addEventListener('click', () => {
      hideModal();
    });
  }

  function selectAnswer(choiceIndex, btn) {
    const q = state.questions[state.index];
    const correct = q.answerIndex === choiceIndex;
    // visual feedback
    if (correct) {
      state.correct++;
      btn.style.background = '#d4ffd9';
      btn.style.borderColor = '#62c062';
    } else {
      btn.style.background = '#ffdede';
      btn.style.borderColor = '#d24b4b';
      // highlight correct
      highlightCorrect(q.answerIndex);
    }
    // disable all buttons
    const m = ensureModal();
    const buttons = m.querySelectorAll('#tp-quiz-body button');
    buttons.forEach(b => b.disabled = true);

    // next question after short delay
    setTimeout(() => {
      state.index++;
      if (state.index >= state.questions.length) {
        endQuiz();
      } else {
        renderQuestion();
      }
    }, 700);
  }

  function highlightCorrect(correctIndex) {
    const m = ensureModal();
    const buttons = Array.from(m.querySelectorAll('#tp-quiz-body button'));
    if (buttons[correctIndex]) {
      buttons[correctIndex].style.background = '#d4ffd9';
      buttons[correctIndex].style.borderColor = '#62c062';
    }
  }

  function endQuiz() {
    const m = ensureModal();
    const body = m.querySelector('#tp-quiz-body');
    const footer = m.querySelector('#tp-quiz-footer');
    body.innerHTML = `
      <div style="text-align:center;padding:6px 0">
        <h3>Quiz terminé !</h3>
        <div style="font-size:18px;font-weight:700">${state.correct} / ${state.questions.length}</div>
      </div>
      <div style="margin-top:12px">
        <label for="tp-player-name" style="display:block;margin-bottom:6px">Ton pseudo (pour le classement):</label>
        <input id="tp-player-name" type="text" placeholder="Ton nom" style="width:100%;padding:8px;border-radius:8px;border:1px solid #ddd" />
      </div>
    `;
    footer.innerHTML = `
      <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:12px">
        <button id="tp-quiz-close-final" style="padding:8px 10px;border-radius:8px;border:none;background:#f4f4f6;cursor:pointer">Fermer</button>
        <button id="tp-quiz-save-score" style="padding:8px 10px;border-radius:8px;border:none;background:#ef5350;color:#fff;cursor:pointer">Enregistrer score</button>
      </div>
    `;

    footer.querySelector('#tp-quiz-close-final').addEventListener('click', () => {
      hideModal();
    });
    footer.querySelector('#tp-quiz-save-score').addEventListener('click', () => {
      const nameInput = document.getElementById('tp-player-name');
      const name = (nameInput && nameInput.value.trim()) ? nameInput.value.trim() : 'Anonyme';
      // save via storage
      if (window.TPStorage && window.TPStorage.saveHighScore) {
        TPStorage.saveHighScore({name, score: state.correct, date: new Date().toISOString()});
      }
      if (typeof state.onComplete === 'function') {
        state.onComplete({name, score: state.correct});
      }
      hideModal();
    });
  }

  // tiny shuffle utility
  function shuffle(arr) {
    for(let i = arr.length -1; i>0; i--){
      const j = Math.floor(Math.random() * (i+1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Expose start function
  window.TPQuiz = {
    startQuiz
  };

})(window, document);
