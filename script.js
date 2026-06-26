const data = [
  { name: "麦当劳", category: "汉堡" },
  { name: "肯德基", category: "汉堡" },
  { name: "汉堡王", category: "汉堡" },
  { name: "必胜客", category: "披萨" },
  { name: "达美乐", category: "披萨" },
  { name: "老乡鸡", category: "快餐" },
  { name: "南京大排档", category: "南京菜" },
  { name: "海底捞", category: "火锅麻辣烫" }
];

let selectedCats = [];
let excludedCats = [];
let pool = [];
let currentPair = [];

const categories = [...new Set(data.map(d => d.category))];

// Step1 render
const catEl = document.getElementById("categoryList");
categories.forEach(c => {
  const el = document.createElement("div");
  el.className = "tag";
  el.innerText = c;
  el.onclick = () => {
    el.classList.toggle("selected");
    toggle(selectedCats, c);
  };
  catEl.appendChild(el);
});

// Step2 render
const exEl = document.getElementById("excludeList");
categories.forEach(c => {
  const el = document.createElement("div");
  el.className = "tag";
  el.innerText = c;
  el.onclick = () => {
    el.classList.toggle("selected");
    toggle(excludedCats, c);
  };
  exEl.appendChild(el);
});

function toggle(arr, v) {
  if (arr.includes(v)) {
    arr.splice(arr.indexOf(v), 1);
  } else {
    arr.push(v);
  }
}

function toStep2() {
  document.getElementById("step1").classList.add("hidden");
  document.getElementById("step2").classList.remove("hidden");
}

function startBattle() {

  pool = data.filter(d =>
    selectedCats.includes(d.category) &&
    !excludedCats.includes(d.category)
  );

  nextPair();

  document.getElementById("step2").classList.add("hidden");
  document.getElementById("battle").classList.remove("hidden");
}

function nextPair() {
  if (pool.length <= 1) {
    showResult();
    return;
  }

  currentPair = [pool.pop(), pool.pop()];

  document.getElementById("cardA").innerText = currentPair[0]?.name || "";
  document.getElementById("cardB").innerText = currentPair[1]?.name || "";
}

function pick(choice) {
  const winner = choice === "A" ? currentPair[0] : currentPair[1];

  pool.unshift(winner);
  nextPair();
}

function showResult() {
  document.getElementById("battle").classList.add("hidden");
  document.getElementById("result").classList.remove("hidden");

  const winner = pool[0];

  document.getElementById("winner").innerText = winner.name;

  const li = document.createElement("li");
  li.innerText = winner.name;

  document.getElementById("favorites").appendChild(li);
}