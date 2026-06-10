const COLORS = ['red', 'green', 'yellow', 'blue'];
const COLOR_HEX = { red: '#ed1c24', green: '#22b14c', yellow: '#f0c000', blue: '#00a2ed' };
const SPECIAL = { skip: '⊘', reverse: '⇌', draw2: '+2', wild: '★', wild4: '+4' };

let G = {};
let playerCount = 2;

function buildDeck() {
  const deck = [];

  COLORS.forEach(color => {
    [0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9].forEach(n => {
      deck.push({ color, val: String(n), type: 'num' });
    });
    ['skip', 'skip', 'reverse', 'reverse', 'draw2', 'draw2'].forEach(type => {
      deck.push({ color, val: SPECIAL[type], type });
    });
  });

  for (let i = 0; i < 4; i++) {
    deck.push({ color: 'wild', val: SPECIAL.wild,  type: 'wild'  });
    deck.push({ color: 'wild', val: SPECIAL.wild4, type: 'wild4' });
  }

  return shuffle(deck);
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function showSetup() {
  renderPlayerInputs();
  showScreen('setup-screen');
}

function changeCount(delta) {
  playerCount = Math.min(6, Math.max(2, playerCount + delta));
  document.getElementById('player-count-disp').textContent = playerCount;
  renderPlayerInputs();
}

function renderPlayerInputs() {
  const container = document.getElementById('player-inputs');
  container.innerHTML = '';
  const defaults = ['You', 'Alice', 'Bob', 'Carol', 'Dave', 'Eve'];

  for (let i = 0; i < playerCount; i++) {
    const row = document.createElement('div');
    row.className = 'player-row';

    const input = document.createElement('input');
    input.type = 'text';
    input.value = defaults[i];
    input.id = 'pname-' + i;
    input.placeholder = 'Player ' + (i + 1);
    if (i === 0) input.className = 'human';

    row.appendChild(input);
    container.appendChild(row);
  }
}

function startGame() {
  const names = [];
  for (let i = 0; i < playerCount; i++) {
    const v = document.getElementById('pname-' + i).value.trim();
    names.push(v || 'Player ' + (i + 1));
  }

  const deck = buildDeck();
  const players = names.map((name, i) => ({
    name,
    hand: deck.splice(0, 7),
    isHuman: i === 0
  }));

  let top;
  do { top = deck.shift(); } while (top.type !== 'num');

  G = {
    deck,
    discard: [top],
    players,
    current: 0,
    direction: 1,
    currentColor: top.color,
    skip: false,
    pendingDraw: 0,
    waitingColor: false
  };

  showScreen('game-screen');
  renderGame();
  setMsg(G.players[0].isHuman ? "Your turn! Play a card or draw." : `${G.players[0].name}'s turn.`);

  if (!G.players[G.current].isHuman) setTimeout(aiTurn, 900);
}

function cardBg(card) {
  if (card.color === 'wild') {
    return 'conic-gradient(#ed1c24 0% 25%, #00a2ed 25% 50%, #22b14c 50% 75%, #f0c000 75% 100%)';
  }
  return COLOR_HEX[card.color] || '#888';
}

function isPlayable(card) {
  if (card.type === 'wild' || card.type === 'wild4') return true;
  const top = G.discard[G.discard.length - 1];
  return card.color === G.currentColor || card.val === top.val;
}


function renderGame() {
  const p = G.players[G.current];

  document.getElementById('turn-name').textContent = p.name;
  document.getElementById('direction-arrow').textContent = G.direction === 1 ? '➡' : '⬅';
  document.getElementById('color-indicator').style.background = COLOR_HEX[G.currentColor] || '#888';

  const oppArea = document.getElementById('opponents-area');
  oppArea.innerHTML = '';
  G.players.forEach((pl, i) => {
    const div = document.createElement('div');
    div.className = 'opp-info' + (i === G.current ? ' current-player' : '');
    div.innerHTML =
      `<div class="opp-name">${pl.name}${pl.hand.length === 1 ? '<span class="uno-badge">UNO!</span>' : ''}</div>` +
      `<div class="opp-cards">🃏 ${pl.hand.length} card${pl.hand.length !== 1 ? 's' : ''}</div>`;
    oppArea.appendChild(div);
  });

  const dd = document.getElementById('discard-display');
  dd.innerHTML = '';
  const top = G.discard[G.discard.length - 1];
  dd.appendChild(makeDisplayCard(top, COLOR_HEX[G.currentColor]));

  const deckBtn = document.getElementById('deck-btn');
  const myTurn = G.current === 0 && !G.waitingColor;
  deckBtn.className = 'deck-card' + (myTurn ? '' : ' inactive');

  const handCards = document.getElementById('hand-cards');
  handCards.innerHTML = '';
  document.getElementById('hand-label').textContent =
    G.players[0].isHuman ? G.players[0].name + "'s Hand" : 'Watching...';

  if (G.players[0].isHuman) {
    const isMyTurn = G.current === 0;
    G.players[0].hand.forEach((card, i) => {
      const playable = isMyTurn && isPlayable(card) && !G.waitingColor;
      handCards.appendChild(makeHandCard(card, i, playable));
    });
  }
}

function makeDisplayCard(card, overrideBg) {
  const el = document.createElement('div');
  el.className = 'game-card drawn-anim';
  el.style.background = overrideBg || cardBg(card);

  const corner = document.createElement('span');
  corner.className = 'corner-val';
  corner.textContent = card.val;

  const label = document.createElement('span');
  label.textContent = card.val;

  el.appendChild(corner);
  el.appendChild(label);
  return el;
}

function makeHandCard(card, idx, playable) {
  const el = document.createElement('div');
  el.className = 'hand-card ' + (playable ? 'playable' : 'not-playable');
  el.style.background = cardBg(card);

  const corner = document.createElement('span');
  corner.className = 'hc';
  corner.textContent = card.val;

  const label = document.createElement('span');
  label.textContent = card.val;

  el.appendChild(corner);
  el.appendChild(label);

  if (playable) el.onclick = () => playCard(idx);
  return el;
}

function setMsg(text) {
  document.getElementById('msg-box').textContent = text;
}

function drawCard() {
  if (G.current !== 0 || G.waitingColor) return;

  if (!G.deck.length) reshuffleDeck();
  const card = G.deck.shift();
  if (!card) { setMsg("The deck is empty!"); return; }

  G.players[0].hand.push(card);

  if (isPlayable(card)) {
    setMsg(`You drew ${card.val} — it's playable! Click it to play, or skip your turn.`);
  } else {
    setMsg(`You drew ${card.val}. It's not playable — turn passes.`);
    setTimeout(() => { advance(); renderGame(); aiMaybe(); }, 800);
  }

  renderGame();
}

function playCard(idx) {
  if (G.current !== 0 || G.waitingColor) return;
  const card = G.players[0].hand[idx];
  if (!isPlayable(card)) return;

  G.players[0].hand.splice(idx, 1);
  G.discard.push(card);

  if (card.type === 'wild' || card.type === 'wild4') {
    G.waitingColor = true;
    if (card.type === 'wild4') G.pendingDraw = 4;
    showColorPicker();
    renderGame();
    return;
  }

  applyEffect(card);
  if (checkWin(G.players[0])) return;
  advance();
  renderGame();
  setMsg(G.current === 0 ? "Your turn! Play a card or draw." : `${G.players[G.current].name}'s turn...`);
  aiMaybe();
}


function applyEffect(card) {
  switch (card.type) {
    case 'num':
      G.currentColor = card.color;
      break;
    case 'skip':
      G.currentColor = card.color;
      G.skip = true;
      break;
    case 'reverse':
      G.currentColor = card.color;
      G.direction *= -1;
      if (G.players.length === 2) G.skip = true;
      break;
    case 'draw2':
      G.currentColor = card.color;
      G.pendingDraw = 2;
      break;
  }
}

function advance() {
  const n = G.players.length;
  let next = (G.current + G.direction + n) % n;

  if (G.skip) {
    next = (next + G.direction + n) % n;
    G.skip = false;
  }

  if (G.pendingDraw > 0) {
    for (let i = 0; i < G.pendingDraw; i++) {
      if (!G.deck.length) reshuffleDeck();
      G.players[next].hand.push(G.deck.shift());
    }
    G.pendingDraw = 0;
    next = (next + G.direction + n) % n;
  }

  G.current = next;
}

function reshuffleDeck() {
  const top = G.discard.pop();
  G.deck = shuffle(G.discard);
  G.discard = [top];
}

function checkWin(player) {
  if (player.hand.length === 0) {
    document.getElementById('win-name').textContent = player.name;
    showScreen('win-screen');
    return true;
  }
  return false;
}


function aiMaybe() {
  if (G.current !== 0) setTimeout(aiTurn, 900);
}

function aiTurn() {
  if (G.current === 0) return;
  const pl = G.players[G.current];
  const playable = pl.hand.filter(c => isPlayable(c));

  if (playable.length > 0) {
    const card = pickAiCard(playable);
    const idx = pl.hand.indexOf(card);
    pl.hand.splice(idx, 1);
    G.discard.push(card);

    if (card.type === 'wild' || card.type === 'wild4') {
      const counts = {};
      COLORS.forEach(c => (counts[c] = 0));
      pl.hand.forEach(c => { if (COLORS.includes(c.color)) counts[c.color]++; });
      G.currentColor = COLORS.reduce((a, b) => (counts[a] >= counts[b] ? a : b));
      if (card.type === 'wild4') G.pendingDraw = 4;
    } else {
      applyEffect(card);
    }

    setMsg(`${pl.name} played ${card.val}.`);
    if (checkWin(pl)) return;
  } else {
    if (!G.deck.length) reshuffleDeck();
    pl.hand.push(G.deck.shift());
    setMsg(`${pl.name} drew a card.`);
  }

  advance();
  renderGame();

  if (G.current !== 0) {
    setTimeout(aiTurn, 900);
  } else {
    setMsg("Your turn! Play a card or draw.");
  }
}

function pickAiCard(playable) {
  const actions = playable.filter(c => c.type !== 'num' && c.type !== 'wild' && c.type !== 'wild4');
  if (actions.length) return actions[Math.floor(Math.random() * actions.length)];

  const nonWild = playable.filter(c => c.type !== 'wild' && c.type !== 'wild4');
  if (nonWild.length) return nonWild[Math.floor(Math.random() * nonWild.length)];

  return playable[0];
}


function showColorPicker() {
  document.getElementById('overlay').classList.add('show');
  document.getElementById('color-picker').classList.add('show');
}

function pickColor(color) {
  document.getElementById('overlay').classList.remove('show');
  document.getElementById('color-picker').classList.remove('show');

  G.currentColor = color;
  G.waitingColor = false;

  if (checkWin(G.players[0])) return;
  advance();
  renderGame();
  setMsg(G.current === 0 ? "Your turn! Play a card or draw." : `${G.players[G.current].name}'s turn...`);
  aiMaybe();
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

renderPlayerInputs();