
/***********************************
 * INIT
 * **********************************/
let player1 = document.getElementById("player1");
let player2 = document.getElementById("player2");
let spriteImg1 = document.getElementById("spriteImg1");
let spriteImg2 = document.getElementById("spriteImg2");
let surface = document.getElementById("surface");

let startButton = document.getElementById("startboard");
// let debug_output = document.getElementById('debug_output');

let items = ["ball", "ball", "ball"];

//Sounds
let crowd = new Audio("./sound/crowd.mp3");
crowd.volume = 0.6;
let kick = new Audio("./sound/kick1.mp3");
kick.volume = 0.8;
let goal = new Audio("./sound/goal.mp3");
goal.volume = 1;
let sui = new Audio("./sound/sui.mp3");
sui.volume = 1;

// Scale the surface to 95% of the screen width
let surface_scale = 0.55 * (window.innerWidth / surface.clientWidth);
surface.style.transform = `scale(${surface_scale})`;

let LiveScoreP1 = 0;
let LiveScoreP2 = 0;
let gameScoreP1 = 0;
let gameScoreP2 = 0;

let leaderboardP1count = 0
let leaderboardP2count = 0

let winner = "";

let gameCounter = 0;

/***********************************
 * GAME CONFIG
 * **********************************/
let spriteImgNumber1 = 0; // current animation part of sprite image
let spriteImgNumber2 = 0;
let gameSpeed = 20; // game loop refresh rate (pictures per second)

let slowSpeed = 5;
let normalSpeed = 11;
let fastSpeed = 20;

let player1_name = sessionStorage.getItem("player1Name")
let player2_name = sessionStorage.getItem("player2Name")
updateGameScore()



let characterSpeed = sessionStorage.getItem("selectedGameMode");

if (characterSpeed == "slow") {
  characterSpeed = slowSpeed;
} else if (characterSpeed == "normal") {
  characterSpeed = normalSpeed;
} else if (characterSpeed == "fast") {
  characterSpeed = fastSpeed;
}

/***********************************
 * EVENT LISTENER
 * **********************************/
document.onkeydown = keydown_detected;
document.onkeyup = keyup_detected;

let leftArrow = false;
let rightArrow = false;
let upArrow = false;
let downArrow = false;

let keyA = false;
let keyD = false;
let keyW = false;
let keyS = false;

function keydown_detected(e) {
  // console.log(e);
  // console.log(e.keyCode);

  // Player 1 - WASD
  if (!e) {
    e = window.event; // Internet Explorer
  }
  if (e.keyCode == 65) {
    // keyA
    keyA = true;
  }
  if (e.keyCode == 87) {
    // keyW
    keyW = true;
  }
  if (e.keyCode == 68) {
    // keyD
    keyD = true;
  }
  if (e.keyCode == 83) {
    // keyS
    keyS = true;
  }

  // Player 2 - Arrows
  if (!e) {
    e = window.event; // Internet Explorer
  }
  if (e.keyCode == 37) {
    // leftArrow
    leftArrow = true;
  }
  if (e.keyCode == 38) {
    // upArrow
    upArrow = true;
  }
  if (e.keyCode == 39) {
    // rightArrow
    rightArrow = true;
  }
  if (e.keyCode == 40) {
    // downArrow
    downArrow = true;
  }
}

function keyup_detected(e) {
  // console.log(e);
  // console.log(e.keyCode);
  if (!e) {
    e = window.event; // Internet Explorer
  }
  if (e.keyCode == 65) {
    // keyA
    keyA = false;
  }
  if (e.keyCode == 87) {
    // keyW
    keyW = false;
  }
  if (e.keyCode == 68) {
    // keyD
    keyD = false;
  }
  if (e.keyCode == 83) {
    // keyS
    keyS = false;
  }

  if (e.keyCode == 37) {
    // leftArrow
    leftArrow = false;
  }
  if (e.keyCode == 38) {
    // upArrow
    upArrow = false;
  }
  if (e.keyCode == 39) {
    // rightArrow
    rightArrow = false;
  }
  if (e.keyCode == 40) {
    // downArrow
    downArrow = false;
  }
}

/***********************************
 * GAME LOOP
 * **********************************/
function startGame() {
  crowd.play();
  updateGameScore()

  gameCounter++;
  //Player 1
  player1.style.left = "100px"; // starting position
  player1.style.top = "180px"; // starting position
  player1.style.opacity = "1"; // show player
  spriteImg1.style.right = "0px"; // starting animation

  //Player 2
  player2.style.left = "500px"; // starting position
  player2.style.top = "180px"; // starting position
  player2.style.opacity = "1"; // show player
  spriteImg2.style.right = "0px"; // starting animation

  startButton.innerHTML = `<h3>STARTED</h3>`;
  startButton.removeAttribute("onclick");

  LiveScoreP1 = 0;
  LiveScoreP2 = 0;
  gameScoreP1 = 0;
  gameScoreP2 = 0;
  updateGameScore();

  document.getElementById("ball").style.display = "inline";

  winner = "";

  if (gameCounter == 1) {
    gameLoop1();
    gameLoop2();
  }

  //generate item every random intervall
  generateItem();
}

//GAME LOOP

//PLAYER 2
function gameLoop1() {
  if (keyA) {
    movePlayer1(-1 * characterSpeed, 0, -1);
    animatePlayer1();
  }
  if (keyD) {
    movePlayer1(characterSpeed, 0, 1);
    animatePlayer1();
  }
  if (keyW) {
    movePlayer1(0, -1 * characterSpeed, 0);
    animatePlayer1();
  }
  if (keyS) {
    movePlayer1(0, characterSpeed, 0);
    animatePlayer1();
  }

  if (isColliding(characterSpeed, ball, 1)) {
    deleteItem();
  }

  for (let i = 0; i < items.length; i++) {
    if (isColliding(player1, ball, -6)) {
      deleteItem("ball"); // pass the correct item ID
      LiveScoreP1++;
      generateItem();
      kick.play();
    }
  }

  spaceCheck(player1);
  showLiveScore();
  setTimeout(gameLoop1, 1000 / gameSpeed); // async recursion
}

//PLAYER 1
function gameLoop2() {
  if (leftArrow) {
    movePlayer2(-1 * characterSpeed, 0, -1);
    animatePlayer2();
  }
  if (rightArrow) {
    movePlayer2(characterSpeed, 0, 1);
    animatePlayer2();
  }
  if (upArrow) {
    movePlayer2(0, -1 * characterSpeed, 1);
    animatePlayer2();
  }
  if (downArrow) {
    movePlayer2(0, characterSpeed, 0);
    animatePlayer2();
  }

  for (let i = 0; i < items.length; i++) {
    if (isColliding(player2, ball, -6)) {
      deleteItem("ball"); // pass the correct item ID
      LiveScoreP2++;
      generateItem();
      kick.play();
    }
  }

  spaceCheck(player2);
  showLiveScore();
  setTimeout(gameLoop2, 1000 / gameSpeed); // async recursion
}

/***********************************
 * MOVE
 * **********************************/
/**
 * @param {number} dx - player x move offset in pixel
 * @param {number} dy - player y move offset in pixel
 * @param {number} dr - player heading direction (-1: move left || 1: move right || 0: no change)
 */
function movePlayer1(dx, dy, dr) {
  //Player1
  // current position
  let x1 = parseFloat(player1.style.left);
  let y1 = parseFloat(player1.style.top);

  // calc new position
  x1 += dx;
  y1 += dy;

  // assign new position
  player1.style.left = x1 + "px";
  player1.style.top = y1 + "px";

  // handle direction
  if (dr != 0) {
    player1.style.transform = `scaleX(${dr})`;
  }

  // output in debugger box
  debug_output.innerHTML = `x: ${x1} | y: ${y1} | direction: ${dr} | animation: ${spriteImgNumber1}`;
}
//player2
function movePlayer2(dx, dy, dr) {
  //Player2
  let x2 = parseFloat(player2.style.left);
  let y2 = parseFloat(player2.style.top);

  // calc new position
  x2 += dx;
  y2 += dy;

  // assign new position
  player2.style.left = x2 + "px";
  player2.style.top = y2 + "px";

  // handle direction
  if (dr != 0) {
    player2.style.transform = `scaleX(${dr})`;
  }

  // output in debugger box
  // debug_output.innerHTML = `x: ${x2} | y: ${y2} | direction: ${dr} | animation: ${spriteImgNumber}`;
}

/**
 * animate player

 */
function animatePlayer1() {
  if (spriteImgNumber1 < 5) {
    // switch to next sprite position
    spriteImgNumber1++;
    let x = parseFloat(spriteImg1.style.right);
    x += 35.2; // ANPASSEN!
    spriteImg1.style.right = x + "px";
  } else {
    // animation loop finished: back to start animation
    spriteImg1.style.right = "0px";
    spriteImgNumber1 = 0;
    cutOff0animation(1);
  }
}
function animatePlayer2() {
  if (spriteImgNumber2 < 5) {
    // switch to next sprite position
    spriteImgNumber2++;
    let x = parseFloat(spriteImg2.style.right);
    x += 35.2; // ANPASSEN!
    spriteImg2.style.right = x + "px";
  } else {
    // animation loop finished: back to start animation
    spriteImg2.style.right = "0px";
    spriteImgNumber2 = 0;
    cutOff0animation(2);
  }
}

function cutOff0animation(number) {
  if ((number = 1)) {
    player1.style.width = 34.5 + "px";
    spriteImg1.style.height = 186 + "px";
    spriteImg1.style.bottom = 73 + "px";
  } else {
    player2.style.width = 34.5 + "px";
    spriteImg2.style.height = 186 + "px";
    spriteImg2.style.bottom = 73 + "px";
  }
}

/**
 * check if player is on game board and if not -> tp to other side
 * @param {string} playerID - Player 1 or 2
 */

function spaceCheck(playerID) {
  let clientWidth = surface.clientWidth;
  let clientHeight = surface.clientHeight;

  let px = playerID.offsetLeft;
  let py = playerID.offsetTop;

  if (px >= clientWidth - 69) {
    px = clientWidth - clientWidth + 36;
  } else if (px <= 30) {
    px = clientWidth - 70;
  }

  if (py >= clientHeight - 79) {
    py = clientHeight - clientHeight + 35;
  } else if (py <= 30) {
    py = clientHeight - 80;
  }
  playerID.style.left = px + "px";
  playerID.style.top = py + "px";
}

/**

 * Checks intersection between two html elements

 * @param {HTMLElement} div1 - Reference to first html element
 * @param {HTMLElement} div2 - Reference to second html element
 * @param {number} tolerance - Integer to change accuracy of collission (0: default, negative number: detect later, positive number: detect earlier)
 * @returns {boolean} - true or false depending on collision

 */

function isColliding(div1, div2, tolerance = 0) {
  let d1OffsetTop = div1.offsetTop;
  let d1OffsetLeft = div1.offsetLeft;
  let d1Height = div1.clientHeight;
  let d1Width = div1.clientWidth;
  let d1Top = d1OffsetTop + d1Height;
  let d1Left = d1OffsetLeft + d1Width;

  let d2OffsetTop = div2.offsetTop;
  let d2OffsetLeft = div2.offsetLeft;
  let d2Height = div2.clientHeight;
  let d2Width = div2.clientWidth;
  let d2Top = d2OffsetTop + d2Height;
  let d2Left = d2OffsetLeft + d2Width;

  let distanceTop = d2OffsetTop - d1Top;
  let distanceBottom = d1OffsetTop - d2Top;
  let distanceLeft = d2OffsetLeft - d1Left;
  let distanceRight = d1OffsetLeft - d2Left;

  return !(
    tolerance < distanceTop ||
    tolerance < distanceBottom ||
    tolerance < distanceLeft ||
    tolerance < distanceRight
  );
}

/**

 * generate Item with timeout and random item

 */

function generateItem() {
  let randItem = randomNumber(0);
  let itemID = items[randItem];

  console.log(itemID);

  placeItem(itemID);
}

/**

 * place the special item on the field

 * @param {String} item - witch item
 */

function placeItem(item) {
  document.getElementById(
    item
  ).innerHTML = `<img id="ballImg" src="./Img/items/${item}.png" alt="img">`;
  console.log(item);
  let placeX = randomNumber(surface.clientWidth);
  let placeY = randomNumber(surface.clientHeight);

  console.log("Before X: " + placeX);
  console.log("Before Y: " + placeY);

  if (placeX <= 70) {
    placeX += 60;
  } else if (placeX >= surface.clientWidth - 70) {
    placeX -= 60;
  }

  if (placeY <= 70) {
    placeY += 60;
  } else if (placeY >= surface.clientHeight - 70) {
    placeY -= 60;
  }

  console.log("After X: " + placeX);
  console.log("After Y: " + placeY);

  let htmlE = document.getElementById(item);

  htmlE.style.opacity = 1;
  htmlE.style.left = placeX + "px";
  htmlE.style.top = placeY + "px";
}

/**
 * Generate a random Number. It is individual fot x,y; witch item; TimeIntervall 

 * @param {number} MultiplyNumber - For what purpose 

 */
function randomNumber(MultiplyNumber) {
  let random = Math.random();
  random = random * MultiplyNumber;
  random = Math.ceil(random);

  return random;
}

/**

 * remove Item from field

 * @param {string} itemID - The unique identifier (ID) of the HTML element to be hidden. 

 */

function deleteItem(itemID) {
  let item = document.getElementById(itemID);
  if (item) {
    item.innerHTML = "";
  }
}

/*
 * Generate score and show on field
 */
function showLiveScore() {
  let scoreboard = document.getElementById("scoreboard");

  scoreboard.innerHTML = `<h1>${LiveScoreP1} : ${LiveScoreP2}</h1>`;
  score4winnerFound();
}

/*
 * Check if there is a winner
 */
function score4winnerFound() {
  if (LiveScoreP1 >= 10 || LiveScoreP2 >= 10) {
    goal.play();
    newGame();
  }
}
/*
 * End Game
 */
function newGame() {
  if (LiveScoreP1 >= 10) {
    gameScoreP1++;
  } else {
    gameScoreP2++;
  }

  updateGameScore();

  LiveScoreP1 = 0;
  LiveScoreP2 = 0;

  allWinnerFound();
}
/*
 * End Game
 */
function allWinnerFound() {
  if (gameScoreP1 == 3) {
    winner = "Player 1";
    gameScoreP1 = 0;
    gameScoreP2 = 0;

    endGame();
  } else if (gameScoreP2 == 3) {
    winner = "Player 2";
    gameScoreP1 = 0;
    gameScoreP2 = 0;
    endGame();
  }
}
//
// Update all Score
//
function updateGameScore() {
  document.getElementById(
    "player1Score"
  ).innerHTML = `<h2>${player1_name}: ${gameScoreP1}</h2>`;
  document.getElementById(
    "player2Score"
  ).innerHTML = `<h2>${player2_name}: ${gameScoreP2}</h2>`;
}

// End Game
function endGame() {
  goal.pause();
  sui.play();
  if (winner == "Player 1") {
    document.getElementById("winner-id").innerHTML = `<h1>Player 1 won!</h1>`;
    leaderboardP1count++;
  } else if (winner == "Player 2") {
    document.getElementById("winner-id").innerHTML = `<h1>Player 2 won!</h1>`;
    leaderboardP2count++;
  }

  updateLeaderboard()

  document.getElementById("ball").style.display = "none";
  document.getElementById("endGame-board").style.display = "inline";
}

//play again
function playAgain() {
  document.getElementById("endGame-board").style.display = "none";
  crowd.pause();
  crowd.currentTime = 0;
  crowd.play();
  startGame();
}

//back to start
function backtoStart() {
  crowd.pause();
  window.location.href = "./index.html";
}

// Leaderboard
function updateLeaderboard() {
  document.getElementById('leaderboard_firsRow').innerHTML = `<p><span class="leaderBoard_name">${player1_name}:</span> ${leaderboardP1count}</p>`
  document.getElementById('leaderboard_SecondRow').innerHTML = `<p><span class="leaderBoard_name">${player2_name}:</span> ${leaderboardP2count}</p>`
}

// change game mode
function changeGameMode() {
  document.getElementById('changeGameMode').style.display= "inline"
  // document.getElementById("endGame-board").innerHTML = `
  // <div id="changeGameMode">
	// 	<h4 id="changeGameMode-headl">Change Game Mode</h4>
		
	// 	<div id="changeGameMode-buttons">
	// 		<button id="choise1" onclick="setGameMode('slow')">
	// 			<h3>Slow Game</h3>
	// 		</button>
	// 		<button id="choise2" onclick="setGameMode('normal')">
	// 			<h3>Normal Game</h3>
	// 		</button>
	// 		<button id="choise3" onclick="setGameMode('fast')">
	// 			<h3>Fast Game</h3>
	// 		</button>
	// 	</div>
	// </div>
  // `
}

function changedSpeed(mode){
  if (mode == "slow") {
    characterSpeed = slowSpeed;
    console.log('slow')
  } else if (mode == "normal") {
    characterSpeed = normalSpeed;
    console.log('normal')
  } else if (mode == "fast") {
    characterSpeed = fastSpeed;
    console.log('fast')
  }

  document.getElementById('changeGameMode').style.display= "none"


  
}