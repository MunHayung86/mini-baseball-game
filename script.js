// 미니 야구게임 로직

const OUTCOMES = {
  contact: [
    { type: 'homerun', weight: 8 },
    { type: 'hit', weight: 34 },
    { type: 'foul', weight: 18 },
    { type: 'miss', weight: 20 },
    { type: 'out', weight: 20 },
  ],
  power: [
    { type: 'homerun', weight: 20 },
    { type: 'hit', weight: 16 },
    { type: 'foul', weight: 14 },
    { type: 'miss', weight: 32 },
    { type: 'out', weight: 18 },
  ],
  safe: [
    { type: 'homerun', weight: 2 },
    { type: 'hit', weight: 20 },
    { type: 'foul', weight: 30 },
    { type: 'miss', weight: 8 },
    { type: 'out', weight: 40 },
  ],
};

const OUT_MESSAGES = ['땅볼 아웃! 🧤', '뜬공 아웃! 🧤', '직선타 아웃! 🧤'];

const state = {
  score: 0,
  strikes: 0,
  outs: 0,
  busy: false,
  gameOver: false,
};

const els = {
  score: document.getElementById('score'),
  strikes: document.getElementById('strikes'),
  outs: document.getElementById('outs'),
  message: document.getElementById('message'),
  ball: document.getElementById('ball'),
};

const swingButtons = document.querySelectorAll('.choices button');

function pick(table) {
  const total = table.reduce((sum, row) => sum + row.weight, 0);
  let roll = Math.random() * total;
  for (const row of table) {
    roll -= row.weight;
    if (roll <= 0) return row.type;
  }
  return table[table.length - 1].type;
}

function render() {
  els.score.textContent = state.score;
  els.strikes.textContent = state.strikes;
  els.outs.textContent = state.outs;
}

function setSwingDisabled(disabled) {
  swingButtons.forEach((button) => {
    button.disabled = disabled;
  });
}

function pitchAnimation() {
  els.ball.classList.remove('throw');
  // 리플로우를 강제해 애니메이션을 다시 재생시킨다
  void els.ball.offsetWidth;
  els.ball.classList.add('throw');
}

function addOut() {
  state.strikes = 0;
  state.outs += 1;
  if (state.outs >= 3) {
    state.gameOver = true;
  }
}

function resolve(type) {
  switch (type) {
    case 'homerun':
      state.score += 3;
      state.strikes = 0;
      return '홈런!! 🎉 +3점';
    case 'hit':
      state.score += 1;
      state.strikes = 0;
      return '안타! ⚾ +1점';
    case 'foul':
      if (state.strikes < 2) {
        state.strikes += 1;
        return '파울! 스트라이크 하나 추가';
      }
      return '파울! 투 스트라이크에서는 카운트되지 않습니다';
    case 'miss':
      state.strikes += 1;
      if (state.strikes >= 3) {
        addOut();
        return '삼진 아웃! ❌';
      }
      return `헛스윙! 스트라이크 ${state.strikes}`;
    default:
      addOut();
      return OUT_MESSAGES[Math.floor(Math.random() * OUT_MESSAGES.length)];
  }
}

function swing(kind) {
  if (state.busy || state.gameOver) return;
  if (!OUTCOMES[kind]) return;

  state.busy = true;
  setSwingDisabled(true);
  els.message.textContent = '투수가 공을 던집니다...';
  pitchAnimation();

  window.setTimeout(() => {
    const message = resolve(pick(OUTCOMES[kind]));
    render();

    if (state.gameOver) {
      els.message.textContent = `${message} — 경기 종료! 최종 점수 ${state.score}점`;
    } else {
      els.message.textContent = message;
      setSwingDisabled(false);
    }

    state.busy = false;
  }, 600);
}

function restart() {
  state.score = 0;
  state.strikes = 0;
  state.outs = 0;
  state.busy = false;
  state.gameOver = false;

  els.ball.classList.remove('throw');
  els.message.textContent = '타격 버튼을 눌러 시작하세요!';
  setSwingDisabled(false);
  render();
}

render();
