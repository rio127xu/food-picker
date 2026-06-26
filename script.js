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
  Object.values(views).forEach(v => v.classList.remove("active"));
  views[name].classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function goHome() {
  renderHome();
  showView("home");
}

function playBeep(freq = 520, duration = 0.08) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = freq;
    osc.type = "sine";
    gain.gain.value = 0.05;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    setTimeout(() => {
      osc.stop();
      ctx.close();
    }, duration * 1000);
  } catch {}
}

function categoryMeta(category) {
  return FOOD_CATEGORIES.find(i => i.name === category) || { icon: "🍽️", name: category };
}

function todayText() {
  const lines = [
    "今晚谁会成为冠军？",
    "昨天的冠军还能卫冕吗？",
    "新的冠军即将诞生！",
    "今晚只能留下一个！",
    "准备开始 Food Battle！"
  ];
  return lines[new Date().getDate() % lines.length];
}

function renderHome() {
  const data = getData();
  const lastChampion = data.champions[0]?.name || "还没有冠军";

  views.home.innerHTML = `
    <section class="home-card">
      <button class="icon-button" data-home>🏠</button>
      <img src="fanny.jpg" class="hero" />
      <h1>Fanny FOOD BATTLE</h1>
      <p>${todayText()}</p>
      <button data-action="start">Start Battle</button>
      <button data-action="wheel">Lucky Wheel</button>
      <button data-action="hall">Hall</button>
      <div>上届冠军：${lastChampion}</div>
    </section>
  `;

  views.home.querySelector('[data-action="start"]').onclick = renderWantStep;
  views.home.querySelector('[data-action="wheel"]').onclick = renderWheelSetup;
  views.home.querySelector('[data-action="hall"]').onclick = renderHall;
  views.home.querySelector('[data-home]').onclick = goHome;
}

function categoryButton(category, selected=false, attr="category") {
  const meta = categoryMeta(category);
  return `<button class="category-card ${selected?"selected":""}" data-${attr}="${category}">
    <span>${meta.icon}</span>${category}
  </button>`;
}

function renderWantStep() {
  appState.wanted = [];
  appState.avoided = [];

  views.want.innerHTML = `
    <header><button data-home>🏠</button>Step 1</header>
    <h2>想吃什么</h2>
    <div class="grid">
      ${FOOD_CATEGORIES.map(i => categoryButton(i.name,false,"want")).join("")}
    </div>
    <button id="next">下一步</button>
  `;

  views.want.querySelectorAll("[data-want]").forEach(b => {
    b.onclick = () => togglePick(b, appState.wanted, "want");
  });

  views.want.querySelector("#next").onclick = () => {
    if (!appState.wanted.length) return toast("至少选一个");
    renderAvoidStep();
  };

  views.want.querySelector("[data-home]").onclick = goHome;
  showView("want");
}

function renderAvoidStep() {
  views.avoid.innerHTML = `
    <header><button data-home>🏠</button>Step 2</header>
    <h2>不想吃什么</h2>
    <div class="grid">
      ${FOOD_CATEGORIES.map(i => categoryButton(i.name,false,"avoid")).join("")}
    </div>
    <button id="build">生成候选</button>
  `;

  views.avoid.querySelector("#build").onclick = buildPool;
  views.avoid.querySelector("[data-home]").onclick = goHome;
  showView("avoid");
}

function togglePick(btn,list,key){
  const v = btn.dataset[key];
  if(list.includes(v)) list.splice(list.indexOf(v),1);
  else list.push(v);
  btn.classList.toggle("selected");
}

function buildPool(){
  appState.pool = FOOD_LIST.filter(f=>appState.wanted.includes(f.category)&&!appState.avoided.includes(f.category));
  if(appState.pool.length<2) return toast("太少");
  renderPool();
}

// simplified pool screen (no listing, direct start)
function renderPool(){
  views.pool.innerHTML = `
    <header><button data-home>🏠</button>Ready</header>
    <h1>准备开始 Battle</h1>
    <p>候选数量：${appState.pool.length}</p>
    <button id="start">Start Battle</button>
  `;

  views.pool.querySelector("#start").onclick = startBattle;
  views.pool.querySelector("[data-home]").onclick = goHome;
  showView("pool");
}

function startBattle(){
  playBeep(660);
  appState.currentChampion = appState.pool[0];
  appState.challengerIndex = 1;
  renderBattle();
}

function renderBattle(){
  const challenger = appState.pool[appState.challengerIndex];
  if(!challenger) return finishBattle(appState.currentChampion);

  views.battle.innerHTML = `
    <header><button data-home>🏠</button>Battle</header>
    <div class="vs">
      <button data-pick="${appState.currentChampion.id}">${appState.currentChampion.name}</button>
      <span>VS</span>
      <button data-pick="${challenger.id}">${challenger.name}</button>
    </div>
  `;

  views.battle.querySelectorAll("[data-pick]").forEach(b=>{
    b.onclick = ()=>handleBattlePick(b.dataset.pick);
  });

  views.battle.querySelector("[data-home]").onclick = goHome;
  showView("battle");
}

function handleBattlePick(id){
  playBeep(820);
  const challenger = appState.pool[appState.challengerIndex];
  const winner = [appState.currentChampion, challenger].find(f=>f.id===id);
  appState.currentChampion = winner;
  appState.challengerIndex++;
  renderBattle();
}

function finishBattle(winner){
  const data = getData();
  data.champions.unshift({name:winner.name});
  saveData(data);
  goHome();
}

function renderHall(){
  const data = getData();
  views.hall.innerHTML = `
    <header><button data-home>🏠</button>Hall</header>
    ${data.champions.map((c,i)=>`
      <div>${c.name} <button data-del="${i}">删</button></div>
    `).join("")}
  `;

  views.hall.querySelectorAll("[data-del]").forEach(btn=>{
    btn.onclick = ()=>{
      const data = getData();
      data.champions.splice(btn.dataset.del,1);
      saveData(data);
      renderHall();
    };
  });

  views.hall.querySelector("[data-home]").onclick = goHome;
  showView("hall");
}

function toast(msg){
  const d=document.createElement("div");
  d.textContent=msg;
  document.body.appendChild(d);
  setTimeout(()=>d.remove(),1500);
}

renderHome();
