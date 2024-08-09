let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["banod"];

const button1 = document.querySelector('#button1');
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");

const weapons = [
  { name: 'banod', power: 5 },
  { name: 'sunta', power: 30 },
  { name: 'nife', power: 50 },
  { name: 'machete platanero', power: 100 }
];

const monsters = [
  { name: "godo", level: 2, health: 15 },
  { name: "turista", level: 8, health: 60 },
  { name: "nómada digital", level: 20, health: 300 }
];

const locations = [
  {
    name: "tagoror",
    "button text": ["Ir a co-working space", "Comprar en el mercado", "Enfrentar a godo"],
    "button functions": [goCoworkingSpace, goMarket, fightGodo],
    text: "Estás en el Tagoror. Es el centro de tu comunidad. ¿A dónde quieres ir?"
  },
  {
    name: "market",
    "button text": ["Comprar 10 salud (10 oro)", "Comprar arma (30 oro)", "Ir a Tagoror"],
    "button functions": [buyHealth, buyWeapon, goTagoror],
    text: "Has llegado al mercado."
  },
  {
    name: "co-working space",
    "button text": ["Enfrentar a godo", "Enfrentar a turista", "Ir a Tagoror"],
    "button functions": [fightGodo, fightTurista, goTagoror],
    text: "Has entrado al co-working space. Hay algunos adversarios por aquí."
  },
  {
    name: "fight",
    "button text": ["Atacar", "Esquivar", "Huir"],
    "button functions": [attack, dodge, goTagoror],
    text: "Estás en combate con un oponente."
  },
  {
    name: "defeat",
    "button text": ["Ir a Tagoror", "Ir a Tagoror", "Ir a Tagoror"],
    "button functions": [goTagoror, goTagoror, goTagoror],
    text: 'El oponente grita "¡Arg!" al morir. Ganaste puntos de experiencia y encontraste oro.'
  },
  {
    name: "lose",
    "button text": ["REINICIAR", "REINICIAR", "REINICIAR"],
    "button functions": [restart, restart, restart],
    text: "Has perdido. &#x2620;"
  },
  {
    name: "win",
    "button text": ["REINICIAR", "REINICIAR", "REINICIAR"],
    "button functions": [restart, restart, restart],
    text: "¡Has derrotado al nómada digital! ¡HAS GANADO EL JUEGO! &#x1F389;"
  },
  {
    name: "easter egg",
    "button text": ["2", "8", "Ir a Tagoror"],
    "button functions": [pickTwo, pickEight, goTagoror],
    "text": "Encontraste un juego secreto. Escoge un número. Diez números serán elegidos al azar entre 0 y 10. ¡Si el número que escoges está entre los números aleatorios, ganas!"
  }
];

// inicializa los botones
button1.onclick = goTagoror;
button2.onclick = goCoworkingSpace;
button3.onclick = fightGodo;

function update(location) {
  monsterStats.style.display = "none";
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerHTML = location.text;
}

function goTagoror() {
  update(locations[0]);
}

function goMarket() {
  update(locations[1]);
}

function goCoworkingSpace() {
  update(locations[2]);
}

function buyHealth() {
  if (gold >= 10) {
    gold -= 10;
    health += 10;
    goldText.innerText = gold;
    healthText.innerText = health;
  } else {
    text.innerText = "No tienes suficiente oro para comprar salud.";
  }
}

function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentWeapon++;
      goldText.innerText = gold;
      let newWeapon = weapons[currentWeapon].name;
      text.innerText = "Ahora tienes un " + newWeapon + ".";
      inventory.push(newWeapon);
      text.innerText += " En tu inventario tienes: " + inventory.join(", ");
    } else {
      text.innerText = "No tienes suficiente oro para comprar un arma.";
    }
  } else {
    text.innerText = "¡Ya tienes el arma más poderosa!";
    button2.innerText = "Vender arma por 15 oro";
    button2.onclick = sellWeapon;
  }
}

function sellWeapon() {
  if (inventory.length > 1) {
    gold += 15;
    goldText.innerText = gold;
    let currentWeapon = inventory.shift();
    text.innerText = "Vendiste un " + currentWeapon + ".";
    text.innerText += " En tu inventario tienes: " + inventory.join(", ");
  } else {
    text.innerText = "¡No vendas tu única arma!";
  }
}

function fightGodo() {
  fighting = 0;
  goFight();
}

function fightTurista() {
  fighting = 1;
  goFight();
}

function fightNomadaDigital() {
  fighting = 2;
  goFight();
}

function goFight() {
  update(locations[3]);
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = "block";
  monsterName.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsterHealth;
}

function attack() {
  text.innerText = "El " + monsters[fighting].name + " ataca.";
  text.innerText += " Atacas con tu " + weapons[currentWeapon].name + ".";
  health -= getMonsterAttackValue(monsters[fighting].level);
  if (isMonsterHit()) {
    monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
  } else {
    text.innerText += " Fallas el ataque.";
  }
  healthText.innerText = health;
  monsterHealthText.innerText = monsterHealth;
  if (health <= 0) {
    lose();
  } else if (monsterHealth <= 0) {
    if (fighting === 2) {
      winGame();
    } else {
      defeatOpponent();
    }
  }
  if (Math.random() <= .1 && inventory.length !== 1) {
    text.innerText += " Tu " + inventory.pop() + " se rompe.";
    currentWeapon--;
  }
}

function getMonsterAttackValue(level) {
  const hit = (level * 5) - (Math.floor(Math.random() * xp));
  return hit > 0 ? hit : 0;
}

function isMonsterHit() {
  return Math.random() > .2 || health < 20;
}

function dodge() {
  text.innerText = "Esquivaste el ataque del " + monsters[fighting].name;
}

function defeatOpponent() {
  gold += Math.floor(monsters[fighting].level * 6.7);
  xp += monsters[fighting].level;
  goldText.innerText = gold;
  xpText.innerText = xp;
  update(locations[4]);
}

function lose() {
  update(locations[5]);
}

function winGame() {
  update(locations[6]);
}

function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  currentWeapon = 0;
  inventory = ["banod"];
  goldText.innerText = gold;
  healthText.innerText = health;
  xpText.innerText = xp;
  goTagoror();
}

function easterEgg() {
  update(locations[7]);
}

function pickTwo() {
  pick(2);
}

function pickEight() {
  pick(8);
}

function pick(guess) {
  const numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }
  text.innerText = "Elegiste " + guess + ". Aquí están los números aleatorios:\n";
  for (let i = 0; i < 10; i++) {
    text.innerText += numbers[i] + "\n";
  }
  if (numbers.includes(guess)) {
    text.innerText += "¡Correcto! Ganaste 20 oro.";
    gold += 20;
    goldText.innerText = gold;
  } else {
    text.innerText += "Incorrecto. Perdiste 10 salud.";
    health -= 10;
    healthText.innerText = health;
    if (health <= 0) {
      lose();
    }
  }
}
