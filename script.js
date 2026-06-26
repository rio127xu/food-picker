const categories = [
    "汉堡", "披萨", "川湘", "快餐",
    "淮扬菜", "南京菜", "面类", "粉类",
    "水饺", "烧烤/小吃", "轻食",
    "火锅麻辣烫", "饮品甜点"
];

const foods = [
    { name: "麦当劳", category: "汉堡" },
    { name: "肯德基", category: "汉堡" },
    { name: "汉堡王", category: "汉堡" },
    { name: "必胜客", category: "披萨" },
    { name: "达美乐", category: "披萨" },
    { name: "杨国福麻辣烫", category: "火锅麻辣烫" },
    { name: "星巴克", category: "饮品甜点" }
];

let step = 1;
let want = [];
let notWant = [];
let pool = [];
let current = [];

const optionsEl = document.getElementById("options");
const stepTitle = document.getElementById("stepTitle");

const battle = document.getElementById("battle");
const setup = document.getElementById("setup");
const result = document.getElementById("result");

function renderCategories() {
    optionsEl.innerHTML = "";
    categories.forEach(c => {
        const div = document.createElement("div");
        div.className = "option";
        div.innerText = c;
        div.onclick = () => {
            div.classList.toggle("selected");
        };
        optionsEl.appendChild(div);
    });
}

document.getElementById("nextBtn").onclick = () => {

    const selected = [...document.querySelectorAll(".option.selected")]
        .map(e => e.innerText);

    if (step === 1) {
        want = selected;
        step = 2;
        stepTitle.innerText = "选择不想吃的";
        renderCategories();
    }

    else if (step === 2) {
        notWant = selected;

        pool = foods.filter(f =>
            want.includes(f.category) &&
            !notWant.includes(f.category)
        );

        startBattle();
    }
};

function startBattle() {
    setup.classList.add("hidden");
    battle.classList.remove("hidden");

    nextRound();
}

function nextRound() {
    if (pool.length === 1) {
        showResult(pool[0]);
        return;
    }

    current = [pool.pop(), pool.pop()];

    renderBattle();
}

function renderBattle() {
    const a = document.getElementById("cardA");
    const b = document.getElementById("cardB");

    a.innerText = current[0].name;
    b.innerText = current[1].name;

    a.onclick = () => pick(0);
    b.onclick = () => pick(1);
}

function pick(index) {
    const win = current[index];
    const lose = current[1 - index];

    pool.unshift(win);

    const cards = document.querySelectorAll(".card");

    cards[index].classList.add("win");
    cards[1 - index].classList.add("lose");

    setTimeout(() => {
        nextRound();
    }, 400);
}

function showResult(food) {
    battle.classList.add("hidden");
    result.classList.remove("hidden");

    document.getElementById("winner").innerText = food.name;
}

renderCategories();
