/**
 * 변수 정의
 */
const $gameStart = document.querySelector(".game-start");
const $gameErrMsg = document.querySelector(".game-error-mgs");
const $currentPlayer = document.querySelector(".alert-msg .current-player");

const $gameSection = document.querySelector("#game-section");
const $gameArea = document.querySelector("#game-area");
const $gameItems = document.querySelectorAll("#game-area li");
const $gameEnd = document.querySelector(".game-end");

let isGameOver = false; // 게임 중인지 아닌지 체크

/**
 * 함수 선언
 */
// 현재 데이터 확인하기
// console.log용 함수
function observeData() {

    const currentData = gameData
    .map((row) => row.join())
    .join(',\n')
    .concat('\n===========');

    return currentData;
}



// 게임 초기화
function resetGame() {
    activePlayer = 0;
    currentRound = 1;
    isGameOver = false;
    $gameEnd.style.display = "none";
    $gameEnd.querySelector("h2").innerHTML = '<span class="winner-name">PLAYER NAME</span>님이 승리하였습니다.';

    let gameItemsIndex = 0;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            gameData[i][j] = 0;

            // li 배열 모두 탐색하기
            $gameItems[gameItemsIndex].textContent = "";
            $gameItems[gameItemsIndex].classList.remove("active");
            gameItemsIndex++;
        }
    }
}

// 게임 시작하기
function gameStart(e) {
    if (!players[0].name || !players[1].name) {
        $gameErrMsg.textContent = "닉네임을 모두 정해주세요!";

        return;
    }
    resetGame();

    console.log(observeData())
    

    $gameSection.style.display = "block";
    $currentPlayer.textContent = players[activePlayer].name;
}

// 플레이어의 순서를 변경함
function switchPlayer() {
    // 플레이이어가 2명이니 0,1로 순차 변경
    if (activePlayer === 0) {
        activePlayer = 1;
    } else {
        activePlayer = 0;
    }

    // 현재 플레이어 이름 변경
    $currentPlayer.textContent = players[activePlayer].name;
}

// 게임판 클릭 이벤트
function selectGameFiled(e) {
    if (isGameOver) {
        return;
    }

    const target = e.target;
    // html에 미리 설정해둔 dataset을 가져온다
    // 가져온 dataset으로 gameData의 데이터를 갱신시킬 예정
    const targetdRow = target.dataset.row - 1;
    const targetColumn = target.dataset.col - 1;

    if (gameData[targetdRow][targetColumn] > 0) {
        $gameErrMsg.textContent = "이미 클릭한 곳입니다. 다른 곳을 클릭해주세요";

        return;
    } else {
        $gameErrMsg.textContent = "";
    }

    target.textContent = players[activePlayer].symbol;
    target.classList.add("active");

    // 현재 플레이어중인 activePlayer가 0, 1 반복이지만
    // 플레이어의 ID가 1, 2 이기때문에  +1을 하여 마킹해준다
    gameData[targetdRow][targetColumn] = activePlayer + 1;
    console.log(observeData())
    
    // 매 클릭시 게임 체크
    // 0 = 겜중, 1or2 = 승부남, -1 = 무승부
    const winnerId = gameCheck();

    if (winnerId !== 0) {
        endGame(winnerId);
    }

    currentRound++;
    switchPlayer();
}

// 게임 체크 함수
// 승자 체크
function gameCheck() {
    // 승부가 나면 1 or 2 return (playerId)
    // 승부가 안나면 0 return
    // 무승부 -1 리턴

    // 가로줄이 빙고인지 체크
    for (let i = 0; i < 3; i++) {
        if (
            gameData[i][0] > 0 && // 가로(Row)첫 번째가 0보다 큰지(클릭이 되었는지) 체크하고 시작 - 가로 줄이 빙고라는 것은 모두 클릭 된 상태를 의미하기때문
            gameData[i][0] === gameData[i][1] &&
            gameData[i][1] === gameData[i][2]
        ) {
            return gameData[i][0]; // 빙고시 빙고가 된 숫자(playerId)를 반환
        }
    }

    // 세로줄이 빙고인지 체크
    for (let i = 0; i < 3; i++) {
        if (
            gameData[0][i] > 0 && // 세로(Column)첫 번째가 0보다 큰지(클릭이 되었는지) 체크하고 시작 - 세로 줄이 빙고라는 것은 모두 클릭 된 상태를 의미하기때문
            gameData[0][i] === gameData[1][i] &&
            gameData[1][i] === gameData[2][i]
        ) {
            return gameData[0][i]; // 빙고시 빙고가 된 숫자(playerId)를 반환
        }
    }

    // 대각선 빙고인지 체크 (조건이 2개이기때문에 반복문X)
    // 1. 좌상단 -> 우하단 대각 체크
    if (gameData[0][0] > 0 && gameData[0][0] === gameData[1][1] && gameData[1][1] === gameData[2][2]) {
        return gameData[0][0];
    }

    // 2. 우상단 -> 좌하단 대각
    if (gameData[0][2] > 0 && gameData[0][2] === gameData[1][1] && gameData[1][1] === gameData[2][0]) {
        return gameData[0][2];
    }

    // 무승부
    if (currentRound === 9) {
        return -1;
    }

    return 0;
}

function endGame(winnerId) {
    isGameOver = !isGameOver; // 게임 종료
    $gameEnd.style.display = "block";

    if (winnerId > 0) {
        $gameEnd.querySelector(".winner-name").textContent = `${players[winnerId - 1].name}`;
    } else {
        $gameEnd.querySelector("h2").textContent = "무승부";
    }
}

/**
 * 함수 호출
 */
// 게임 시작하기
$gameStart.addEventListener("click", gameStart);
for (const gameItem of $gameItems) {
    gameItem.addEventListener("click", selectGameFiled);
}
