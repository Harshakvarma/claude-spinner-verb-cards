const searchInput = document.getElementById('searchInput');
const cardsGrid = document.getElementById('cardsGrid');
const resultCount = document.getElementById('resultCount');
let verbs = [];

function renderCards(list) {
  cardsGrid.innerHTML = '';

  if (!list.length) {
    cardsGrid.innerHTML = '<div class="no-results">No verbs match your search. Try another keyword.</div>';
    resultCount.textContent = '0 results';
    return;
  }

  resultCount.textContent = `${list.length} result${list.length === 1 ? '' : 's'}`;

  const fragment = document.createDocumentFragment();

  list.forEach((item, index) => {
    const card = document.createElement('article');
    card.className = 'card terminal-card verb-card';
    card.style.animationDelay = `${index * 30}ms`;
    card.innerHTML = `
      <div class="terminal-card-header">
        <span class="terminal-dot dot-red"></span>
        <span class="terminal-dot dot-yellow"></span>
        <span class="terminal-dot dot-green"></span>
      </div>
      <div class="terminal-card-body">
        <h3 class="terminal-title">${item.verb}</h3>
        <div class="terminal-meta">
          <p class="card-meaning">${item.meaning}</p>
          <p class="card-example">${item.example}</p>
        </div>
      </div>
    `;
    fragment.appendChild(card);
  });

  cardsGrid.appendChild(fragment);
}

function normalizeText(text) {
  return text.toLowerCase();
}

function filterVerbs(query) {
  const normalized = normalizeText(query.trim());
  if (!normalized) {
    return verbs;
  }

  return verbs.filter((item) => {
    return (
      normalizeText(item.verb).includes(normalized) ||
      normalizeText(item.meaning).includes(normalized) ||
      normalizeText(item.example).includes(normalized)
    );
  });
}

function updateSearch(value) {
  searchInput.value = value;
  const filtered = filterVerbs(value);
  renderCards(filtered);
}

searchInput.addEventListener('input', (event) => {
  updateSearch(event.target.value);
});

function isAlphaKey(key) {
  return /^[a-z]$/i.test(key);
}

document.addEventListener('keydown', (event) => {
  if (event.ctrlKey || event.metaKey || event.altKey || event.repeat) return;

  const { key } = event;

  if (isAlphaKey(key)) {
    if (document.activeElement !== searchInput) {
      updateSearch(searchInput.value + key);
      searchInput.focus();
      event.preventDefault();
    }
  } else if (key === 'Backspace' && document.activeElement !== searchInput) {
    updateSearch(searchInput.value.slice(0, -1));
    searchInput.focus();
    event.preventDefault();
  } else if (key === 'Escape') {
    updateSearch('');
    searchInput.focus();
    event.preventDefault();
  }
});

async function loadVerbs() {
  try {
    const response = await fetch('./spinner-text.json');
    if (!response.ok) {
      throw new Error(`Failed to load spinner-text.json: ${response.status}`);
    }

    verbs = await response.json();
    renderCards(verbs);
  } catch (error) {
    console.error(error);
    cardsGrid.innerHTML = '<div class="no-results">Unable to load verb data.</div>';
    resultCount.textContent = '';
  }
}

loadVerbs();
