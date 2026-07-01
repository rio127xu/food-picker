const foodList=[
  { name:"黄焖鸡米饭", category:"饭", tags:["米饭","热食","常吃","不辣","快"], score:9 },
  { name:"番茄牛腩饭", category:"饭", tags:["米饭","热食","不辣","重口","常吃"], score:8 },
  { name:"鸡腿便当", category:"快餐", tags:["米饭","快餐","热食","快","便宜"], score:8 },
  { name:"兰州牛肉面", category:"面", tags:["面食","热食","清淡","快","常吃"], score:8 },
  { name:"重庆小面", category:"面", tags:["面食","辣","热食","重口","便宜"], score:7 },
  { name:"螺蛳粉", category:"粉", tags:["粉","辣","重口","热食","常吃"], score:7 },
  { name:"桂林米粉", category:"粉", tags:["粉","不辣","热食","快","便宜"], score:8 },
  { name:"手抓饼加蛋", category:"小吃", tags:["小吃","快","便宜","热食","常吃"], score:7 },
  { name:"煎饺+紫菜汤", category:"小吃", tags:["小吃","热食","不辣","便宜","快"], score:8 },
  { name:"汉堡套餐", category:"快餐", tags:["快餐","快","常吃","不辣","重口"], score:7 },
  { name:"粥+蒸饺", category:"清淡", tags:["清淡","热食","不辣","便宜","安全"], score:10 },
  { name:"鸡汤馄饨", category:"清淡", tags:["清淡","热食","不辣","常吃","安全"], score:9 }
];

const categories=[...new Set(foodList.map(f=>f.category))];
let state={step:0,dislikes:[],category:"",rejected:0,last:[]};
const $=id=>document.getElementById(id);

function show(id){document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));$(id).classList.add('active')}

function updateStepUI(){document.querySelectorAll('.step').forEach((s,i)=>s.classList.toggle('active',i<=state.step))}

function renderStep1(){state.step=0;updateStepUI();
questionArea.innerHTML=`<h2>今天不想吃什么？</h2>
<div class='button-grid'>${['辣','不辣','重口','清淡','快餐','米饭','面食','粉'].map(x=>`<button class='choice-button' data-x='${x}'>${x}</button>`).join('')}</div>
<div class='action-row' style='display:flex;justify-content:center;margin-top:20px'>
<button id='next1' style='font-size:18px;padding:14px 28px;border-radius:16px;background:#ff4f7b;color:#fff'>继续</button>
</div>`;

questionArea.querySelectorAll('button[data-x]').forEach(b=>b.onclick=()=>b.classList.toggle('selected'));
$('next1').onclick=renderStep2;
show('homeScreen');setTimeout(()=>show('setupScreen'),10)
}

function renderStep2(){state.step=1;updateStepUI();
const selected=[...questionArea.querySelectorAll('.selected')].map(x=>x.dataset.x);
state.dislikes=selected;
questionArea.innerHTML=`<h2>今天想吃哪类？</h2>
<div class='button-grid'>${categories.map(c=>`<button class='choice-button cat' data-c='${c}'>${c}</button>`).join('')}</div>
<div class='action-row' style='display:flex;justify-content:center;margin-top:20px'>
<button id='next2' style='font-size:18px;padding:14px 28px;border-radius:16px;background:#ff4f7b;color:#fff'>开始Battle</button>
</div>`;

questionArea.querySelectorAll('.cat').forEach(b=>b.onclick=()=>b.classList.toggle('selected'));
$('next2').onclick=renderBattle;
}

function renderBattle(){state.step=2;updateStepUI();
const cats=[...questionArea.querySelectorAll('.selected')].map(x=>x.dataset.c);
let pool=foodList.filter(f=>cats.includes(f.category)&&!state.dislikes.some(d=>f.tags.includes(d)));
state.pool=pool;state.i=1;
state.top=pool[0];state.bottom=pool[1];
show('battleScreen');draw();
}

function draw(){
$('championCard').innerHTML=state.top.name;
$('challengerCard').innerHTML=state.bottom.name;
$('roundLabel').innerText=`${state.i}/${state.pool.length-1}`;
$('progressBar').style.width=(state.i/state.pool.length*100)+'%';
}

function choose(side){
const win=side==='top'?state.top:state.bottom;
const lose=side==='top'?state.bottom:state.top;
const loseEl=side==='top'?'challengerCard':'championCard';
$(loseEl).classList.add('reject');
setTimeout(()=>{
state.top=win;
state.i++;
if(state.i>=state.pool.length){finish(win);return}
state.bottom=state.pool[state.i];draw();
},600)
}

function finish(w){$('championName').innerText=w.name;$('championIcon').innerText='🍽️';show('championScreen')}

$('startBattleBtn').onclick=()=>show('setupScreen');
$('setupNextBtn').onclick=renderStep1;
$('keepChampionBtn').onclick=()=>finish(state.top);
$('chooseChallengerBtn').onclick=()=>choose('bottom');
$('championCard').onclick=()=>choose('top');
$('challengerCard').onclick=()=>choose('bottom');