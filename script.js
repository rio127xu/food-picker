const STORAGE_KEY = "fanny-food-battle-v3";

const appState = {
  wanted: [],
  avoided: [],
  pool: [],
  currentChampion: null,
  challengerIndex: 1,
  battleLog: []
};

const views = {
  home: document.querySelector("#homeView"),
  want: document.querySelector("#wantView"),
  avoid: document.querySelector("#avoidView"),
  pool: document.querySelector("#poolView"),
  battle: document.querySelector("#battleView"),
  wheel: document.querySelector("#wheelView"),
  hall: document.querySelector("#hallView")
};

function getData() {
  const fallback = { champions: [], hall: {}, battleStats: {}, streak: { name: "", count: 0 } };
  try {
    return { ...fallback, ...JSON.parse(localStorage.getItem(STORAGE_KEY)) };
  } catch {
    return fallback;
  }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function showView(name) {
  Object.values(views).forEach((view) => view.classList.remove("active"));
  views[name].classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function categoryMeta(category) {
  return FOOD_CATEGORIES.find((item) => item.name === category) || { icon: "🍽️", name: category };
}

function stars(rating = 4) {
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}

function todayText() {
  const lines = [
    "今晚谁会成为冠军？",
    "昨天的冠军还能卫冕吗？",
    "新的冠军即将诞生！",
    "今晚只能留下一个！",
    "准备开始今晚的 Food Battle！"
  ];
  return lines[new Date().getDate() % lines.length];
}

function renderHome() {
  const data = getData();
  const lastChampion = data.champions[0]?.name || "还没有冠军";
  views.home.innerHTML = `
    <section class="home-card">
      <button class="icon-button settings" type="button">⚙️</button>
      <div class="hero-photo">
        <img src="fanny.jpg" alt="Fanny" />
        <div class="logo-stack">
          <span>Fanny</span>
          <strong>FOOD<br>BATTLE</strong>
          <em>Tonight's Dinner Champion</em>
        </div>
      </div>
      <div class="speech">${todayText()}</div>
      <div class="home-actions">
        <button class="primary-btn" data-action="start">🏆 Start Battle<br><small>开始今晚决赛</small></button>
        <button class="purple-btn" data-action="wheel">🎡 Lucky Wheel<br><small>交给命运</small></button>
        <button class="blue-btn" data-action="hall">👑 Hall of Fame<br><small>名人堂 / 排行榜</small></button>
      </div>
      <div class="mini-status">
        <span>上届冠军：${lastChampion}</span>
        <span>${data.streak?.count > 1 ? `🔥 ${data.streak.name} ${data.streak.count}连胜` : "等待新的连胜"}</span>
      </div>
    </section>
  `;
  views.home.querySelector('[data-action="start"]').addEventListener("click", renderWantStep);
  views.home.querySelector('[data-action="wheel"]').addEventListener("click", renderWheelSetup);
  views.home.querySelector('[data-action="hall"]').addEventListener("click", renderHall);
}

function categoryButton(category, selected = false, attr = "category") {
  const meta = categoryMeta(category);
  return `<button class="category-card ${selected ? "selected" : ""}" data-${attr}="${category}">
    <span>${meta.icon}</span>
    <strong>${category}</strong>
  </button>`;
}

function renderWantStep() {
  appState.wanted = [];
  appState.avoided = [];
  views.want.innerHTML = `
    <header class="step-head">
      <button class="back-btn" data-back>‹</button>
      <span>👑 Step 1</span>
    </header>
    <h1>今天想吃什么？</h1>
    <p class="hint">可以多选，至少选择一个分类。</p>
    <div class="category-grid">
      ${FOOD_CATEGORIES.map((item) => categoryButton(item.name, false, "want")).join("")}
    </div>
    <button class="bottom-cta" id="goAvoid">下一步</button>
  `;
  views.want.querySelector("[data-back]").addEventListener("click", () => showView("home"));
  views.want.querySelectorAll("[data-want]").forEach((button) => {
    button.addEventListener("click", () => togglePick(button, appState.wanted, "want"));
  });
  views.want.querySelector("#goAvoid").addEventListener("click", () => {
    if (!appState.wanted.length) {
      toast("至少选一个想吃的分类哦");
      return;
    }
    renderAvoidStep();
  });
  showView("want");
}

function renderAvoidStep() {
  views.avoid.innerHTML = `
    <header class="step-head">
      <button class="back-btn" data-back>‹</button>
      <span>👑 Step 2</span>
    </header>
    <h1>今天不想吃什么？</h1>
    <p class="hint">可以多选。已经选为想吃的分类，不能再排除。</p>
    <div class="category-grid muted-grid">
      ${FOOD_CATEGORIES.map((item) => categoryButton(item.name, false, "avoid")).join("")}
    </div>
    <button class="bottom-cta" id="buildPool">生成候选池</button>
  `;
  views.avoid.querySelector("[data-back]").addEventListener("click", renderWantStep);
  views.avoid.querySelectorAll("[data-avoid]").forEach((button) => {
    const value = button.dataset.avoid;
    if (appState.wanted.includes(value)) button.classList.add("disabled");
    button.addEventListener("click", () => {
      if (appState.wanted.includes(value)) {
        toast("这个分类已经说想吃啦");
        return;
      }
      togglePick(button, appState.avoided, "avoid");
    });
  });
  views.avoid.querySelector("#buildPool").addEventListener("click", buildPool);
  showView("avoid");
}

function togglePick(button, list, key) {
  const value = button.dataset[key];
  if (list.includes(value)) {
    list.splice(list.indexOf(value), 1);
    button.classList.remove("selected");
  } else {
    list.push(value);
    button.classList.add("selected");
  }
}

function buildPool() {
  appState.pool = FOOD_LIST.filter((food) => appState.wanted.includes(food.category) && !appState.avoided.includes(food.category));
  if (appState.pool.length < 2) {
    toast("候选太少啦，请多选几个分类");
    return;
  }
  renderPool();
}

function renderPool() {
  views.pool.innerHTML = `
    <header class="step-head">
      <button class="back-btn" data-back>‹</button>
      <span>候选池预览</span>
    </header>
    <h1>候选池已生成！</h1>
    <p class="hint">共 ${appState.pool.length} 家店铺。Battle 会按照清单顺序开始守擂。</p>
    <div class="pool-list">${appState.pool.map(foodMiniCard).join("")}</div>
    <button class="bottom-cta" id="startBattle">开始 Battle！💪</button>
  `;
  views.pool.querySelector("[data-back]").addEventListener("click", renderAvoidStep);
  views.pool.querySelector("#startBattle").addEventListener("click", startBattle);
  showView("pool");
}

function foodMiniCard(food) {
  return `<article class="pool-item"><span>${food.icon}</span><strong>${food.name}</strong><small>${food.category}</small></article>`;
}

function startBattle() {
  appState.currentChampion = appState.pool[0];
  appState.challengerIndex = 1;
  appState.battleLog = [];
  renderBattle();
}

function renderBattle(anim = "") {
  const challenger = appState.pool[appState.challengerIndex];
  if (!challenger) {
    finishBattle(appState.currentChampion);
    return;
  }
  const total = appState.pool.length;
  const left = total - appState.challengerIndex;
  const progress = Math.round((appState.challengerIndex / (total - 1)) * 100);

  views.battle.innerHTML = `
    <section class="battle-screen">
      <header class="battle-top">
        <button class="back-btn light" data-home>‹</button>
        <div>
          <strong>Battle 对战中</strong>
          <span>剩余 ${left}/${total}</span>
        </div>
        <span class="crown">👑</span>
      </header>
      <div class="battle-progress"><span style="width:${progress}%"></span></div>
      <div class="battle-stack ${anim}">
        ${battleCard(appState.currentChampion, "守擂者", "champion")}
        <div class="vs-flame">VS</div>
        ${battleCard(challenger, "挑战者", "challenger")}
      </div>
      <p class="battle-line">今晚只能留下一个！</p>
    </section>
  `;
  views.battle.querySelector("[data-home]").addEventListener("click", renderHome);
  views.battle.querySelectorAll("[data-pick]").forEach((card) => {
    card.addEventListener("click", () => handleBattlePick(card.dataset.pick));
  });
  showView("battle");
}

function battleCard(food, label, role) {
  return `<button class="battle-card ${role}" data-pick="${food.id}">
    <span class="food-icon">${food.icon}</span>
    <span class="food-label">${label}</span>
    <strong>${food.name}</strong>
    <span class="stars">${stars(food.rating)}</span>
    <small>人均 ${food.price}</small>
  </button>`;
}

function handleBattlePick(winnerId) {
  const challenger = appState.pool[appState.challengerIndex];
  const winner = [appState.currentChampion, challenger].find((food) => food.id === winnerId);
  const loser = winner.id === appState.currentChampion.id ? challenger : appState.currentChampion;
  appState.battleLog.push({ winner: winner.name, loser: loser.name, at: new Date().toISOString() });
  appState.currentChampion = winner;
  appState.challengerIndex += 1;
  views.battle.querySelectorAll(".battle-card").forEach((card) => {
    if (card.dataset.pick !== winnerId) card.classList.add("eliminated");
    else card.classList.add("winner");
  });
  setTimeout(() => renderBattle("slide-in"), 520);
}

function finishBattle(champion, source = "battle") {
  const data = getData();
  const previous = data.champions[0]?.name;
  const today = new Date().toLocaleDateString("zh-CN", { month: "2-digit", day: "2-digit" });

  data.champions.unshift({ name: champion.name, icon: champion.icon, category: champion.category, source, date: today });
  data.champions = data.champions.slice(0, 30);
  data.hall[champion.name] = (data.hall[champion.name] || 0) + 1;
  if (previous === champion.name) data.streak = { name: champion.name, count: (data.streak?.count || 1) + 1 };
  else data.streak = { name: champion.name, count: 1 };
  appState.battleLog.forEach((item) => {
    data.battleStats[item.winner] = data.battleStats[item.winner] || { wins: 0, losses: 0 };
    data.battleStats[item.loser] = data.battleStats[item.loser] || { wins: 0, losses: 0 };
    data.battleStats[item.winner].wins += 1;
    data.battleStats[item.loser].losses += 1;
  });
  saveData(data);

  views.battle.innerHTML = `
    <section class="champion-screen">
      <div class="confetti">✦ ✨ 🎉 ✦</div>
      <h1>Tonight's Champion!</h1>
      <article class="champion-card">
        <span>${champion.icon}</span>
        <strong>${champion.name}</strong>
        <em>${stars(champion.rating)}</em>
      </article>
      <p class="hint">已自动加入 Recent Champions 和 Hall of Fame。</p>
      ${data.streak.count > 1 ? `<div class="streak-box">🔥 ${champion.name} ${data.streak.count} 连胜中！</div>` : `<div class="streak-box">👑 新冠军诞生！</div>`}
      <div class="triple-actions">
        <button data-restart>再战一局</button>
        <button data-hall>看名人堂</button>
        <button data-home>回首页</button>
      </div>
    </section>
  `;
  views.battle.querySelector("[data-restart]").addEventListener("click", renderWantStep);
  views.battle.querySelector("[data-hall]").addEventListener("click", renderHall);
  views.battle.querySelector("[data-home]").addEventListener("click", renderHome);
  showView("battle");
}

function renderWheelSetup() {
  views.wheel.innerHTML = `
    <header class="step-head">
      <button class="back-btn" data-back>‹</button>
      <span>🎡 Lucky Wheel</span>
    </header>
    <h1>幸运大转盘</h1>
    <p class="hint">先选参与抽奖的分类。最后会直接抽出具体店铺。</p>
    <div class="category-grid">
      ${FOOD_CATEGORIES.map((item) => categoryButton(item.name, false, "wheel")).join("")}
    </div>
    <button class="bottom-cta" id="spinWheel">开始旋转</button>
    <div id="wheelResult"></div>
  `;
  const selected = [];
  views.wheel.querySelector("[data-back]").addEventListener("click", renderHome);
  views.wheel.querySelectorAll("[data-wheel]").forEach((button) => {
    button.addEventListener("click", () => togglePick(button, selected, "wheel"));
  });
  views.wheel.querySelector("#spinWheel").addEventListener("click", () => {
    const pool = FOOD_LIST.filter((food) => selected.includes(food.category));
    if (pool.length < 2) {
      toast("至少选一个有足够候选的分类");
      return;
    }
    const winner = pool[Math.floor(Math.random() * pool.length)];
    const result = views.wheel.querySelector("#wheelResult");
    result.innerHTML = `<div class="wheel"><div class="wheel-inner">GO</div></div><p class="spinning">命运转动中...</p>`;
    setTimeout(() => {
      result.innerHTML = `<article class="wheel-winner"><span>${winner.icon}</span><strong>${winner.name}</strong><small>幸运冠军</small></article>`;
      appState.battleLog = [];
      finishBattle(winner, "wheel");
    }, 1400);
  });
  showView("wheel");
}

function renderHall() {
  const data = getData();
  const ranking = Object.entries(data.hall).sort((a, b) => b[1] - a[1]).slice(0, 10);
  const recent = data.champions.slice(0, 7);
  views.hall.innerHTML = `
    <header class="step-head">
      <button class="back-btn" data-back>‹</button>
      <span>👑 Hall of Fame</span>
    </header>
    <h1>名人堂</h1>
    <section class="hall-section">
      <h2>冠军榜</h2>
      ${ranking.length ? ranking.map(([name, count], index) => `<div class="rank-row"><b>${["🥇","🥈","🥉"][index] || index + 1}</b><span>${name}</span><strong>${count} 冠</strong></div>`).join("") : `<p class="hint">还没有冠军，先开始一场 Battle 吧。</p>`}
    </section>
    <section class="hall-section">
      <h2>Recent Champions</h2>
      ${recent.length ? recent.map((item) => `<div class="rank-row"><b>${item.icon}</b><span>${item.date}</span><strong>${item.name}</strong></div>`).join("") : `<p class="hint">最近7天还没有记录。</p>`}
    </section>
    <section class="stats-grid">
      <article><strong>${data.champions.length}</strong><span>总冠军次数</span></article>
      <article><strong>${data.streak?.count || 0}</strong><span>当前连胜</span></article>
    </section>
  `;
  views.hall.querySelector("[data-back]").addEventListener("click", renderHome);
  showView("hall");
}

function toast(message) {
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();
  const item = document.createElement("div");
  item.className = "toast";
  item.textContent = message;
  document.body.appendChild(item);
  setTimeout(() => item.remove(), 1800);
}

renderHome();
