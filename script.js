const foodList = [
  { name: "黄焖鸡米饭", category: "饭", tags: ["米饭", "热食", "常吃", "不辣", "快"], score: 9 },
  { name: "番茄牛腩饭", category: "饭", tags: ["米饭", "热食", "不辣", "重口", "常吃"], score: 8 },
  { name: "鸡腿便当", category: "快餐", tags: ["米饭", "快餐", "热食", "快", "便宜"], score: 8 },
  { name: "兰州牛肉面", category: "面", tags: ["面食", "热食", "清淡", "快", "常吃"], score: 8 },
  { name: "重庆小面", category: "面", tags: ["面食", "辣", "热食", "重口", "便宜"], score: 7 },
  { name: "螺蛳粉", category: "粉", tags: ["粉", "辣", "重口", "热食", "常吃"], score: 7 },
  { name: "桂林米粉", category: "粉", tags: ["粉", "不辣", "热食", "快", "便宜"], score: 8 },
  { name: "手抓饼加蛋", category: "小吃", tags: ["小吃", "快", "便宜", "热食", "常吃"], score: 7 },
  { name: "煎饺 + 紫菜汤", category: "小吃", tags: ["小吃", "热食", "不辣", "便宜", "快"], score: 8 },
  { name: "汉堡套餐", category: "快餐", tags: ["快餐", "快", "常吃", "不辣", "重口"], score: 7 },
  { name: "粥 + 蒸饺", category: "清淡", tags: ["清淡", "热食", "不辣", "便宜", "安全"], score: 10 },
  { name: "鸡汤馄饨", category: "清淡", tags: ["清淡", "热食", "不辣", "常吃", "安全"], score: 9 }
];

const dislikeOptions = ["辣", "不辣", "米饭", "面食", "粉", "小吃", "快餐", "重口", "清淡", "都可以"];
const categoryOptions = ["饭", "面", "粉", "小吃", "快餐", "清淡"];
const safeMenu = foodList.find((food) => food.tags.includes("安全"));

const state = {
  step: 0,
  dislikes: [],
  category: "",
  rejectedCount: 0,
  lastRecommendations: []
};

// 🚨 V3.5 crash guard
window.onerror = function () {
  document.body.innerHTML = `
    <div style="padding:20px;font-family:sans-serif">
      <h2>系统已自动恢复</h2>
      <button onclick="location.reload()">重新加载</button>
    </div>
  `;
};

const questionArea = document.querySelector("#questionArea");
const resultArea = document.querySelector("#resultArea");

function updateProgress() {
  document.querySelectorAll("[data-step-dot]").forEach((dot, index) => {
    dot.classList.toggle("active", index <= state.step);
  });
}

// 🔧 FIX: missing wheel entry causing crash
function renderWheelSetup() {
  restart();
}

function renderDislikeStep() {
  state.step = 0;
  updateProgress();
  resultArea.classList.add("hidden");
  questionArea.innerHTML = `
    <h2 class="question-title">今天不想吃什么？</h2>
    <p class="helper">可以多选。比如不想吃辣，就点“辣”。如果没有特别讨厌的，点“都可以”。</p>
    <div class="button-grid">
      ${dislikeOptions.map((option) => `<button class="choice-button" data-dislike="${option}">${option}</button>`).join("")}
    </div>
    <div class="action-row">
      <button class="action-button secondary" id="clearDislikes">清空</button>
      <button class="action-button primary" id="nextStep">下一步</button>
    </div>
  `;

  document.querySelectorAll("[data-dislike]").forEach((button) => {
    button.addEventListener("click", () => toggleDislike(button));
  });

  document.querySelector("#clearDislikes").addEventListener("click", () => {
    state.dislikes = [];
    renderDislikeStep();
  });

  document.querySelector("#nextStep").addEventListener("click", renderCategoryStep);
}

function toggleDislike(button) {
  const value = button.dataset.dislike;
  if (value === "都可以") {
    state.dislikes = [];
    document.querySelectorAll("[data-dislike]").forEach((item) => item.classList.remove("selected"));
    button.classList.add("selected");
    return;
  }

  document.querySelector('[data-dislike="都可以"]').classList.remove("selected");

  if (state.dislikes.includes(value)) {
    state.dislikes = state.dislikes.filter((item) => item !== value);
    button.classList.remove("selected");
  } else {
    state.dislikes.push(value);
    button.classList.add("selected");
  }
}

function renderCategoryStep() {
  state.step = 1;
  updateProgress();

  questionArea.innerHTML = `
    <h2 class="question-title">今天想吃哪一类？</h2>
    <p class="helper">选一个最像今天心情的按钮：饭、面、粉、小吃、快餐，或者清淡一点。</p>
    <div class="button-grid">
      ${categoryOptions.map((option) => `<button class="choice-button" data-category="${option}">${option}</button>`).join("")}
    </div>
    <div class="action-row">
      <button class="action-button secondary" id="backStep">上一步</button>
      <button class="action-button primary" id="randomSafe">直接安全菜单</button>
    </div>
  `;

  document.querySelectorAll("[data-category]").forEach((button) => {
    button.addEventListener("click", () => {
      state.category = button.dataset.category;
      recommendFoods();
    });
  });

  document.querySelector("#backStep").addEventListener("click", renderDislikeStep);
  document.querySelector("#randomSafe").addEventListener("click", () => showSafeMenu("先来一个不会出错的安全菜单。"));
}

function recommendFoods() {
  state.step = 2;
  updateProgress();

  const filtered = foodList
    .filter((food) => food.category === state.category || food.tags.includes(state.category))
    .filter((food) => !state.dislikes.some((item) => food.tags.includes(item) || food.category === item))
    .sort((a, b) => b.score - a.score);

  const fallback = foodList
    .filter((food) => !state.dislikes.some((item) => food.tags.includes(item) || food.category === item))
    .sort((a, b) => b.score - a.score);

  const recommendations = uniqueFoods([...filtered, ...fallback, safeMenu]).slice(0, 3);
  state.lastRecommendations = recommendations;
  renderResults(recommendations, "这是按你刚才的选择挑出来的 3 个选项。");
}

function uniqueFoods(foods) {
  const names = new Set();
  return foods.filter((food) => {
    if (!food || names.has(food.name)) return false;
    names.add(food.name);
    return true;
  });
}

function renderResults(foods, message) {
  questionArea.innerHTML = "";
  resultArea.classList.remove("hidden");

  const roles = ["首选", "备选", "安全选项"];

  resultArea.innerHTML = `
    <h2 class="question-title">今晚可以吃：</h2>
    <p class="helper">${message}</p>
    <div class="cards">
      ${foods.map((food, index) => foodCard(food, roles[index] || "推荐", index === 0)).join("")}
    </div>
    <div class="action-row">
      <button class="action-button secondary" id="rejectBtn">不想吃，换一批</button>
      <button class="action-button primary" id="restartBtn">重新选择</button>
    </div>
    ${state.rejectedCount > 0 ? `<p class="notice">已连续否定 ${state.rejectedCount} 次；连续 3 次会自动推荐安全菜单。</p>` : ""}
  `;

  document.querySelector("#rejectBtn").addEventListener("click", handleReject);
  document.querySelector("#restartBtn").addEventListener("click", restart);
}

function foodCard(food, role, isBest) {
  return `
    <article class="food-card ${isBest ? "best" : ""}">
      <span class="food-role">${role}</span>
      <h3>${food.name}</h3>
      <div class="tags">${food.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
    </article>
  `;
}

function handleReject() {
  state.rejectedCount += 1;

  if (state.rejectedCount >= 3) {
    showSafeMenu("你已经连续否定 3 次啦，先推荐一个稳妥、不刺激的安全菜单。");
    return;
  }

  const rejectedNames = new Set(state.lastRecommendations.map((food) => food.name));

  const nextFoods = foodList
    .filter((food) => !rejectedNames.has(food.name))
    .filter((food) => !state.dislikes.some((item) => food.tags.includes(item) || food.category === item))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  renderResults(uniqueFoods([...nextFoods, safeMenu]).slice(0, 3), "没关系，换一批更稳的。也可以重新选择。");
}

function showSafeMenu(message) {
  state.step = 2;
  updateProgress();
  state.lastRecommendations = [safeMenu];
  renderResults(uniqueFoods([safeMenu, foodList[0], foodList[11]]), message);
}

function restart() {
  state.dislikes = [];
  state.category = "";
  state.rejectedCount = 0;
  state.lastRecommendations = [];
  renderDislikeStep();
}

renderDislikeStep();
