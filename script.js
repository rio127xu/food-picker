const STORAGE_KEY = "fanny-food-battle-v25";

const categories = [
  { id: "rice", label: "饭类", icon: "🍚", hint: "盖饭、便当、咖喱" },
  { id: "noodle", label: "面类", icon: "🍜", hint: "拉面、小面、意面" },
  { id: "riceNoodle", label: "粉类", icon: "🍲", hint: "米粉、螺蛳粉" },
  { id: "burger", label: "汉堡", icon: "🍔", hint: "麦当劳、肯德基" },
  { id: "pizza", label: "披萨", icon: "🍕", hint: "必胜客、达美乐" },
  { id: "snack", label: "小吃", icon: "🥟", hint: "饺子、馄饨、手抓饼" },
  { id: "light", label: "轻食", icon: "🥗", hint: "沙拉、粥、汤" },
  { id: "hotpot", label: "火锅", icon: "🍲", hint: "麻辣烫、冒菜" },
  { id: "dessert", label: "饮品甜点", icon: "🧋", hint: "奶茶、甜品" },
  { id: "random", label: "随机挑战", icon: "🎲", hint: "交给命运" }
];

const moods = [
  { id: "happy", label: "开心", icon: "😄", boost: ["常吃", "喜欢"] },
  { id: "tired", label: "累了", icon: "😴", boost: ["快", "省心"] },
  { id: "hungry", label: "很饿", icon: "🤤", boost: ["管饱", "重口"] },
  { id: "chill", label: "随便", icon: "😎", boost: ["安全", "常吃"] },
  { id: "save", label: "想省钱", icon: "💰", boost: ["便宜", "实惠"] },
  { id: "fast", label: "想快点", icon: "⏱️", boost: ["快", "省心"] }
];

const foods = [
  { id: "mcd", name: "麦当劳", category: "burger", brand: "汉堡", img: "🍔", tags: ["快", "常吃", "喜欢", "管饱"], score: 94 },
  { id: "kfc", name: "肯德基", category: "burger", brand: "炸鸡汉堡", img: "🍗", tags: ["快", "常吃", "管饱", "重口"], score: 91 },
  { id: "bk", name: "汉堡王", category: "burger", brand: "汉堡", img: "🍔", tags: ["管饱", "重口", "喜欢"], score: 86 },
  { id: "shake", name: "Shake Shack", category: "burger", brand: "汉堡", img: "🍔", tags: ["喜欢", "贵一点"], score: 78 },
  { id: "pizza-hut", name: "必胜客", category: "pizza", brand: "披萨", img: "🍕", tags: ["常吃", "管饱", "喜欢"], score: 88 },
  { id: "dominos", name: "达美乐", category: "pizza", brand: "披萨", img: "🍕", tags: ["快", "管饱"], score: 84 },
  { id: "rice-chicken", name: "黄焖鸡米饭", category: "rice", brand: "米饭", img: "🍛", tags: ["管饱", "热食", "常吃", "实惠"], score: 87 },
  { id: "beef-rice", name: "番茄牛腩饭", category: "rice", brand: "米饭", img: "🍚", tags: ["热食", "重口", "管饱"], score: 82 },
  { id: "curry", name: "咖喱饭", category: "rice", brand: "米饭", img: "🍛", tags: ["管饱", "安全"], score: 81 },
  { id: "bento", name: "鸡腿便当", category: "rice", brand: "便当", img: "🍱", tags: ["快", "管饱", "实惠"], score: 83 },
  { id: "beef-noodle", name: "兰州牛肉面", category: "noodle", brand: "面", img: "🍜", tags: ["快", "热食", "实惠", "安全"], score: 86 },
  { id: "xiaomian", name: "重庆小面", category: "noodle", brand: "面", img: "🍜", tags: ["辣", "重口", "热食"], score: 76 },
  { id: "pasta", name: "意面", category: "noodle", brand: "面", img: "🍝", tags: ["喜欢", "不辣"], score: 75 },
  { id: "luosifen", name: "螺蛳粉", category: "riceNoodle", brand: "粉", img: "🍲", tags: ["辣", "重口", "热食"], score: 80 },
  { id: "guilin", name: "桂林米粉", category: "riceNoodle", brand: "粉", img: "🍜", tags: ["快", "实惠", "热食"], score: 82 },
  { id: "yuanji", name: "袁记云饺", category: "snack", brand: "饺子", img: "🥟", tags: ["快", "不辣", "安全", "实惠"], score: 85 },
  { id: "wonton", name: "鸡汤馄饨", category: "snack", brand: "馄饨", img: "🥣", tags: ["安全", "热食", "不辣"], score: 84 },
  { id: "pancake", name: "手抓饼加蛋", category: "snack", brand: "小吃", img: "🌯", tags: ["快", "实惠"], score: 72 },
  { id: "salad", name: "轻食沙拉", category: "light", brand: "轻食", img: "🥗", tags: ["清淡", "不辣"], score: 70 },
  { id: "porridge", name: "粥 + 蒸饺", category: "light", brand: "清淡", img: "🥣", tags: ["安全", "热食", "不辣", "清淡"], score: 88 },
  { id: "malatang", name: "杨国福麻辣烫", category: "hotpot", brand: "麻辣烫", img: "🍲", tags: ["辣", "重口", "热食", "喜欢"], score: 84 },
  { id: "maocai", name: "冒菜", category: "hotpot", brand: "冒菜", img: "🍲", tags: ["辣", "重口", "管饱"], score: 78 },
  { id: "tea", name: "喜茶", category: "dessert", brand: "饮品", img: "🧋", tags: ["喜欢", "甜"], score: 78 },
  { id: "nayuki", name: "奈雪的茶", category: "dessert", brand: "饮品", img: "🧋", tags: ["喜欢", "甜"], score: 75 }
];

const app = document.querySelector("#appPanel");
const tabs = document.querySelectorAll(".tab");
const state = {
  step: "home",
  category: null,
  mood: null,
  contenders: [],
  currentIndex: 1,
  champion: null
};

let store = loadStore();

function loadStore() {
  const fallback = { history: [], favorites: [], blacklist: [], stats: {} };
  try {
    return { ...fallback, ...JSON.parse(localStorage.getItem(STORAGE_KEY)) };
  } catch {
    return fallback;
  }
}

function saveStore() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function today() {
  return new Date().toLocaleDateString("zh-CN", { month: "numeric", day: "numeric" });
}

function setPanel(name) {
  tabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.panel === name));
  if (name === "home") return renderHome();
  if (name === "history") return renderHistory();
  if (name === "favorites") return renderFavorites();
  if (name === "blacklist") return renderBlacklist();
  if (name === "achievements") return renderAchievements();
}

tabs.forEach((tab) => tab.addEventListener("click", () => setPanel(tab.dataset.panel)));
document.querySelector("#startBattleBtn").addEventListener("click", renderCategoryStep);
document.querySelector("#parentPickBtn").addEventListener("click", parentPick);

function renderHome() {
  app.innerHTML = `
    <div class="section-head">
      <div>
        <h2>今天谁会获得冠军？</h2>
        <p class="helper">先选一个赛道，再选今天心情，最后进入品牌冠军赛。</p>
      </div>
      <button class="mini-btn" onclick="renderWheel()">幸运转盘</button>
    </div>
    <div class="grid">
      ${categories.map(categoryCard).join("")}
    </div>
    <p class="notice">小贴士：最近 7 天吃过的会自动降权；收藏夹会加分；黑名单会直接过滤。</p>
  `;
}

function categoryCard(cat) {
  return `
    <button class="card-btn" onclick="chooseCategory('${cat.id}')">
      <span class="icon">${cat.icon}</span>
      <span class="card-title">${cat.label}</span>
      <span class="card-sub">${cat.hint}</span>
    </button>
  `;
}

function renderCategoryStep() {
  tabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.panel === "home"));
  renderHome();
}

function chooseCategory(categoryId) {
  state.category = categoryId;
  app.innerHTML = `
    ${stepper(2)}
    <div class="section-head">
      <div>
        <h2>今天心情如何？</h2>
        <p class="helper">心情会影响推荐权重，比如“很饿”会提升管饱选项。</p>
      </div>
      <button class="mini-btn" onclick="chooseMood('chill')">跳过</button>
    </div>
    <div class="grid">
      ${moods.map((m) => `
        <button class="card-btn" onclick="chooseMood('${m.id}')">
          <span class="icon">${m.icon}</span>
          <span class="card-title">${m.label}</span>
          <span class="card-sub">${m.boost.join(" / ")}</span>
        </button>
      `).join("")}
    </div>
  `;
}

function chooseMood(moodId) {
  state.mood = moodId;
  const pool = getRankedFoods(state.category, state.mood).slice(0, 8);
  state.contenders = shuffle(pool).slice(0, Math.min(6, pool.length));
  if (state.contenders.length < 2) state.contenders = getRankedFoods("random", moodId).slice(0, 6);
  state.champion = state.contenders[0];
  state.currentIndex = 1;
  renderBattle();
}

function stepper(active) {
  return `<div class="stepper"><span class="step-dot ${active >= 1 ? "active" : ""}"></span><span class="step-dot ${active >= 2 ? "active" : ""}"></span><span class="step-dot ${active >= 3 ? "active" : ""}"></span></div>`;
}

function getRankedFoods(categoryId, moodId) {
  const mood = moods.find((m) => m.id === moodId) || moods[3];
  const recentNames = new Map(store.history.map((item, index) => [item.name, index]));
  return foods
    .filter((food) => categoryId === "random" || food.category === categoryId)
    .filter((food) => !isBlocked(food))
    .map((food) => {
      let score = food.score;
      if (store.favorites.includes(food.id)) score += 18;
      mood.boost.forEach((tag) => { if (food.tags.includes(tag)) score += 8; });
      if (recentNames.has(food.name)) score -= 24 - Math.min(recentNames.get(food.name), 6) * 3;
      return { ...food, battleScore: score };
    })
    .sort((a, b) => b.battleScore - a.battleScore);
}

function isBlocked(food) {
  const words = [food.name, food.brand, food.category, ...food.tags].join(" ");
  return store.blacklist.some((item) => words.includes(item));
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function renderBattle() {
  const challenger = state.contenders[state.currentIndex];
  if (!challenger) return renderChampion(state.champion);
  app.innerHTML = `
    ${stepper(3)}
    <div class="section-head">
      <div>
        <h2>冠军对决</h2>
        <p class="helper">Round ${state.currentIndex}/${state.contenders.length - 1}：选一个更想吃的。</p>
      </div>
      <button class="mini-btn" onclick="renderWheel()">跳过对决</button>
    </div>
    <div class="battle-wrap">
      ${battleCard(state.champion, "left")}
      <div class="vs">VS</div>
      ${battleCard(challenger, "right")}
    </div>
    <p class="round-note">点击左边或右边，胜者进入下一轮。</p>
  `;
}

function battleCard(food, side) {
  return `
    <button class="battle-card" onclick="chooseWinner('${side}')">
      <div class="food-img">${food.img}</div>
      <h3>${food.name}</h3>
      <p class="brand">${food.brand}</p>
      <div class="tags">${food.tags.slice(0, 4).map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
    </button>
  `;
}

function chooseWinner(side) {
  if (side === "right") state.champion = state.contenders[state.currentIndex];
  state.currentIndex += 1;
  renderBattle();
}

function renderChampion(food) {
  incrementStat("battles");
  incrementStat(food.category);
  app.innerHTML = `
    ${stepper(3)}
    <div class="champion">
      <div class="champion-card">
        <div class="food-img">${food.img}</div>
        <p class="eyebrow">今日冠军</p>
        <h2>${food.name}</h2>
        <p class="helper">太棒啦，今天就吃这个吧。</p>
        <div class="tags">${food.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
      </div>
      <div class="info-card" style="padding:24px">
        <h3>下一步</h3>
        <p class="helper">可以加入最近记录，也可以收藏起来，下次更容易出现。</p>
        <div class="action-row">
          <button class="primary-btn" onclick="saveDinner('${food.id}')">记录今天吃它</button>
          <button class="mini-btn" onclick="toggleFavorite('${food.id}')">加入收藏</button>
          <button class="mini-btn" onclick="renderCategoryStep()">再来一局</button>
        </div>
      </div>
    </div>
  `;
}

function saveDinner(foodId) {
  const food = foods.find((item) => item.id === foodId);
  store.history = [{ date: today(), name: food.name, id: food.id, img: food.img, category: food.category }, ...store.history].slice(0, 7);
  saveStore();
  renderHistory();
}

function toggleFavorite(foodId) {
  if (store.favorites.includes(foodId)) {
    store.favorites = store.favorites.filter((id) => id !== foodId);
  } else {
    store.favorites.push(foodId);
  }
  saveStore();
  renderFavorites();
}

function parentPick() {
  const pick = getRankedFoods("random", "chill")[0] || foods[0];
  renderChampion(pick);
}

function renderWheel() {
  const pool = getRankedFoods(state.category || "random", state.mood || "chill").slice(0, 8);
  const pick = pool[Math.floor(Math.random() * pool.length)] || foods[0];
  app.innerHTML = `
    <div class="wheel-box">
      <h2>幸运转盘</h2>
      <p class="helper">实在选不出来，就交给命运。</p>
      <div class="wheel" id="wheel">${pick.img}</div>
      <button class="primary-btn" onclick="spinWheel('${pick.id}')">GO</button>
    </div>
  `;
}

function spinWheel(foodId) {
  const wheel = document.querySelector("#wheel");
  wheel.style.transform = `rotate(${1080 + Math.floor(Math.random() * 360)}deg)`;
  setTimeout(() => renderChampion(foods.find((food) => food.id === foodId)), 1650);
}

function renderHistory() {
  tabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.panel === "history"));
  app.innerHTML = `
    <div class="section-head"><div><h2>最近 7 天记录</h2><p class="helper">记录后，最近吃过的会自动降权，避免天天重复。</p></div><button class="danger-btn" onclick="clearHistory()">清空</button></div>
    <div class="list">
      ${store.history.length ? store.history.map((item) => row(item.img, item.name, item.date, `<button class="mini-btn" onclick="removeHistory('${item.name}')">删除</button>`)).join("") : `<p class="notice">还没有记录。下一次冠军页点“记录今天吃它”。</p>`}
    </div>
  `;
}

function renderFavorites() {
  tabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.panel === "favorites"));
  const favs = store.favorites.map((id) => foods.find((food) => food.id === id)).filter(Boolean);
  app.innerHTML = `
    <div class="section-head"><div><h2>我的收藏</h2><p class="helper">收藏会在推荐时加分。</p></div></div>
    <div class="grid">
      ${favs.length ? favs.map((food) => `<button class="card-btn" onclick="toggleFavorite('${food.id}')"><span class="icon">${food.img}</span><span class="card-title">${food.name}</span><span class="card-sub">点击移除收藏</span></button>`).join("") : `<p class="notice">还没有收藏。冠军页可以加入收藏。</p>`}
    </div>
  `;
}

function renderBlacklist() {
  tabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.panel === "blacklist"));
  app.innerHTML = `
    <div class="section-head"><div><h2>不推荐黑名单</h2><p class="helper">输入“香菜、洋葱、辣、某家店”等关键词，匹配到就不推荐。</p></div></div>
    <div class="input-row"><input id="blackInput" placeholder="例如：香菜、洋葱、鱼、辣" /><button class="mini-btn" onclick="addBlacklist()">添加</button></div>
    <div class="list">
      ${store.blacklist.length ? store.blacklist.map((item) => row("🚫", item, "不推荐", `<button class="mini-btn" onclick="removeBlacklist('${item}')">移除</button>`)).join("") : `<p class="notice">当前没有黑名单。</p>`}
    </div>
  `;
}

function renderAchievements() {
  tabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.panel === "achievements"));
  const badges = [
    ["汉堡达人", "汉堡赛道累计 5 次", (store.stats.burger || 0) >= 5],
    ["面食专家", "面类赛道累计 5 次", (store.stats.noodle || 0) >= 5],
    ["决策大师", "完成 10 场冠军赛", (store.stats.battles || 0) >= 10],
    ["收藏达人", "收藏 5 个选项", store.favorites.length >= 5],
    ["不挑食宝宝", "最近记录 7 天不重样", new Set(store.history.map((i) => i.name)).size >= 7]
  ];
  app.innerHTML = `
    <div class="section-head"><div><h2>我的成就</h2><p class="helper">完成挑战会慢慢解锁。</p></div></div>
    <div class="badge-grid">
      ${badges.map(([name, desc, ok]) => `<div class="badge ${ok ? "" : "locked"}"><strong>${ok ? "🏅" : "🔒"} ${name}</strong><span class="muted">${desc}</span></div>`).join("")}
    </div>
  `;
}

function row(img, title, sub, action) {
  return `<div class="row-card"><div class="row-main"><span class="small-img">${img}</span><div>${title}<div class="muted">${sub}</div></div></div>${action || ""}</div>`;
}

function incrementStat(key) {
  store.stats[key] = (store.stats[key] || 0) + 1;
  saveStore();
}

function removeHistory(name) {
  store.history = store.history.filter((item) => item.name !== name);
  saveStore();
  renderHistory();
}
function clearHistory() { store.history = []; saveStore(); renderHistory(); }
function addBlacklist() {
  const input = document.querySelector("#blackInput");
  const value = input.value.trim();
  if (value && !store.blacklist.includes(value)) store.blacklist.push(value);
  saveStore();
  renderBlacklist();
}
function removeBlacklist(item) { store.blacklist = store.blacklist.filter((x) => x !== item); saveStore(); renderBlacklist(); }

window.chooseCategory = chooseCategory;
window.chooseMood = chooseMood;
window.chooseWinner = chooseWinner;
window.renderCategoryStep = renderCategoryStep;
window.renderWheel = renderWheel;
window.spinWheel = spinWheel;
window.saveDinner = saveDinner;
window.toggleFavorite = toggleFavorite;
window.parentPick = parentPick;
window.renderHistory = renderHistory;
window.renderFavorites = renderFavorites;
window.renderBlacklist = renderBlacklist;
window.renderAchievements = renderAchievements;
window.addBlacklist = addBlacklist;
window.removeBlacklist = removeBlacklist;
window.removeHistory = removeHistory;
window.clearHistory = clearHistory;

renderHome();
