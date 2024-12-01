/**
 * 변수 선언
 */
const gameData = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
];

let playerId = 0; // 현재 입력하고 있는 플레이어의 ID값을 저장하기 위함 - button에 있는 dataset으로 변동
let activePlayer = 0; // 현재 차례인 플레이어를 구분하기 위함
let currentRound = 1;

// 플레이어들의 데이터를 저장할 배열
const players = [
    {
        name: "",
        symbol: "X",
    },
    {
        name: "",
        symbol: "O",
    },
];

const $form = document.querySelector("#form-area form");
const $formArea = document.querySelector("#form-area");
const $formCancle = document.querySelector("#form-area .btn-cancle");
const $formeSave = document.querySelector("#form-area .btn-save");

const $editPlayerName1 = document.querySelector("#edit-player-1-btn");
const $editPlayerName2 = document.querySelector("#edit-player-2-btn");

/**
 * 함수 선언
 */

// 입력창 열기
function formOpen(e) {
    // 버튼 클릭시 현재 닉네임 정하는 플레이어의 ID를 가져온다
    playerId = +e.target.dataset.playerid; // +를 통해 숫자변환

    $formArea.classList.add("show");
    $gameErrMsg.textContent = "";
}

// 입력창 닫기
function formClose() {
    $formArea.classList.remove("show");
    $form.querySelector(".error-msg").textContent = "";
    $form.querySelector("#playername").value = "";
}

// FORM 저장하기
function formSave(e) {
    e.preventDefault();
    // new FromData(event.target)
    // 브라우저 기본 함수
    // form태그 안에 name속성을 가지고 있는 것들을 객체로 리턴한다
    // get('name 문자열') 로 name에 있는 input에 접근이 가능하다

    const formData = new FormData(e.target);
    const playerName = formData.get("playername").trim();

    if (!playerName) {
        // 입력값이 없을 떄
        e.target.querySelector(".error-msg").textContent = "값을 입력해주세요!";
        return;
    }

    const currentPlayer = document.querySelector(`.player-${playerId}-data`);

    currentPlayer.querySelector("h3").textContent = playerName;
    players[playerId - 1].name = playerName;

    formClose();
}



/**
 * 함수 실행
 */

// FORM 열기
$editPlayerName1.addEventListener("click", formOpen);
$editPlayerName2.addEventListener("click", formOpen);

// FORM 닫기
$formCancle.addEventListener("click", formClose);
$formArea.addEventListener("click", function (e) {
    // 검은 배경을 클릭 시 닫히도록
    if (e.target === this) {
        formClose();
    }
});

// FORM 저장
$form.addEventListener("submit", formSave);

