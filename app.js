
const CARD_CODE = {
  1:'A',
  2:'2',
  3:'3',
  4:'4',
  5:'5',
  6:'6',
  7:'7',
  8:'8',
  9:'9',
  10:'T',
  11:'J',
  12:'Q',
  13:'K',
}
const CARD_NUM = {
  'A': 1,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  '10': 10,
  'J': 11,
  'Q': 12,
  'K': 13
};

const CARDS = [1,2,3,4,5,6,7,8,9,10,11,12,13];

function toggleButton(button) {
  // 如果当前按钮已经是激活状态，则取消激活
  if (button.classList.contains('active')) {
    button.classList.remove('active');
  } else {
    // 否则，检查当前已激活的按钮数量
    var activeButtons = document.querySelectorAll('#deck button.active');
    // 如果已激活的按钮数量超过了 2 个，则不再激活新的按钮
   	activeButtons.forEach(btn=>btn.classList.remove('active'))
    // 激活当前按钮
    button.classList.add('active');
  }
}

function toggleButton2(button) {
  // 如果当前按钮已经是激活状态，则取消激活
  if (button.classList.contains('active')) {
    button.classList.remove('active');
  } else {
    // 否则，检查当前已激活的按钮数量
    var activeButtons = document.querySelectorAll('#door button.active');
    // 如果已激活的按钮数量超过了 2 个，则不再激活新的按钮
    if (activeButtons.length >= 2) {
      return;
    }
    // 激活当前按钮
    button.classList.add('active');
  }
}

function toggleButton3(button) {
  // 如果当前按钮已经是激活状态，则取消激活
  if (button.classList.contains('active')) {
    button.classList.remove('active');
  } else {
    // 否则，检查当前已激活的按钮数量
    var activeButtons = document.querySelectorAll('#ball button.active');
    // 如果已激活的按钮数量超过了 2 个，则不再激活新的按钮
   	activeButtons.forEach(btn=>btn.classList.remove('active'))
    // 激活当前按钮
    button.classList.add('active');
  }
}


let toggleGroup = document.getElementById('door');
let ballGroup = document.getElementById('ball');

CARDS.forEach((n)=>toggleGroup.innerHTML+=`<button onclick="toggleButton2(this)">${CARD_CODE[n]}</button>`);
CARDS.forEach((n)=>ballGroup.innerHTML+=`<button onclick="toggleButton3(this)">${CARD_CODE[n]}</button>`);

let game = {};

function create(){
  let deck = parseInt(document.querySelectorAll('#deck button.active')[0].innerText);
  console.log(deck)
  game = {}
  game.history = [];
  game.cardIndex = 0;
  game.cards = [];
  game.cardSizes = {};
  CARDS.forEach((n)=>{
 		game.cardSizes[n] = deck*4
    for(let i =0;i<deck;i++){
     for(let j=0;j<4;j++){
     	game.cards.push(n);
     }
    }
    game.cards = shuffleArray(game.cards);
    game.lastCards = game.cards.length;
  })
  console.log(game)
  updateAllCards();
  updateCalResult();
  updateHistory();
  save();
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function calculate(){
	let door = document.querySelectorAll('#door button.active');
  if(door.length!=2 && door.length!=1){
  	return
  }
  let doorNums = {left:0,right:0};
  if(door.length==1){
  	doorNums.left = CARD_NUM[door[0].innerText]
  	doorNums.right = CARD_NUM[door[0].innerText]
    if(game.cardSizes[doorNums.left]<2){
      alert('no this card in the deck')
      return;
    }
  }else {
  	doorNums.left = CARD_NUM[door[0].innerText]
  	doorNums.right = CARD_NUM[door[1].innerText]
    if(game.cardSizes[doorNums.left]<1||game.cardSizes[doorNums.right]<1){
      alert('no this card in the deck')
      return;
    }
  }
  game.currentDoorNums = doorNums;
  console.log(doorNums);
  game.cardSizes[doorNums.left]--;
  game.cardSizes[doorNums.right]--;
  game.lastCards-=2;
  let data = {
  	lastCards: game.lastCards,
    inDoorCount : 0,
    hitDoorCount : 0,
    outDoorCount : 0,
    big: 0,
    small: 0
  }
  for(let key in game.cardSizes){
  	let count = game.cardSizes[key];
  	if(key>doorNums.left&&key<doorNums.right){
    		data.inDoorCount += count;
    }else if(key==doorNums.left||key==doorNums.right){
    		data.hitDoorCount += count;
    }else{
    		data.outDoorCount += count;
    }
    if(key>doorNums.right){
    	data.big+=count
    } else if(key<doorNums.left){
    	data.small+=count
    }
  }
  data.inDoorRate = (data.inDoorCount/data.lastCards*100).toFixed(2);
  data.hitDoorRate = (data.hitDoorCount/data.lastCards*100).toFixed(2);
  data.outDoorRate = (data.outDoorCount/data.lastCards*100).toFixed(2);
  data.bigRate = (data.big/data.lastCards*100).toFixed(2);
  data.smallRate = (data.small/data.lastCards*100).toFixed(2);
  data.inDoorEV = (data.inDoorRate*100-(100-data.inDoorRate)*100)/100;
  data.hitDoorEV = (data.hitDoorRate*100-(100-data.hitDoorRate)*200)/100;
  game.currentData = data;
  console.log(data)
  updateAllCards();
  updateCalResult();
}

function nextRound(){
	let ball = document.querySelectorAll('#ball button.active');
  if(ball.length!=0 && ball.length!=1){
  	return
  }
  let ballNum = 0;
	if(ball.length==1){
  	ballNum = CARD_NUM[ball[0].innerText];
  }
  if(game.cardSizes[ballNum]<1){
    alert('no this card in the deck')
    return;
  }
  if(ballNum>0){
  	game.currentDoorNums.goal = ballNum;
    game.cardSizes[ballNum]--;
    game.lastCards--;
  	game.history.push([game.currentDoorNums.left,game.currentDoorNums.goal,game.currentDoorNums.right]);
  }else{
  	game.history.push([game.currentDoorNums.left,game.currentDoorNums.right]);
  }
  game.currentData = null;
  game.currentDoorNums = null;
  console.log(ballNum);
  document.querySelectorAll('#door button.active').forEach(btn=>btn.classList.remove('active'));
  document.querySelectorAll('#ball button.active').forEach(btn=>btn.classList.remove('active'));
  updateAllCards();
  updateCalResult();
  updateHistory();
  save();
}

function save(){
	localStorage.setItem('dragoonBall', JSON.stringify(game));
}

function load(){
	let data = localStorage.getItem('dragoonBall');
  if(data){
  	game = JSON.parse(data);
  }
  updateAllCards();
  updateCalResult();
  updateHistory();
}


function updateAllCards(){
	let allCards = document.getElementById('allCards');
  allCards.innerHTML = '';
  Object.entries(game.cardSizes).map(([key,value])=>{
  	allCards.innerHTML += `<li>${CARD_CODE[key]} : ${value}張</li>`;
  })
}

function updateCalResult(){
	let data = game.currentData;
	let calResult = document.getElementById('calResult');
  calResult.innerHTML = '';
  if(data==null){
  	return;
  }
  let result = `
  	<div>
    	<label>剩餘牌數</label>
      <span>${data.lastCards}</span>
    </div>
  	<div>
    	<label>進球</label>
      <span>${data.inDoorCount}/${data.lastCards} = ${data.inDoorRate}%</span>
    </div>
  	<div>
    	<label>撞柱</label>
      <span>${data.hitDoorCount}/${data.lastCards} = ${data.hitDoorRate}%</span>
    </div>
  	<div>
    	<label>沒進</label>
      <span>${data.outDoorCount}/${data.lastCards} = ${data.outDoorRate}%</span>
    </div>
  	<div>
    	<label>比大</label>
      <span>${data.big}/${data.lastCards} = ${data.bigRate}%</span>
    </div>
  	<div>
    	<label>比小</label>
      <span>${data.small}/${data.lastCards} = ${data.smallRate}%</span>
    </div>
  	<div>
    	<label>EV池底100/底注100</label>
      <div>進球:${data.inDoorEV}</div>
      <div>撞柱:${data.hitDoorEV}</div>
    </div>
  `;
  calResult.innerHTML=result;
}

function updateHistory(){
	let history = document.getElementById('history');
  game.history.slice().reverse().forEach((h)=>{
  	history.innerHTML += `<li>${JSON.stringify(h)}</li>`;
  })
}

load()