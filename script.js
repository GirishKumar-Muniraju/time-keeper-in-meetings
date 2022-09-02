console.log('Hello!');

const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 10;
const ALERT_THRESHOLD = 4;

const COLOR_CODES = {
  info: {
    color: 'green',
  },
  warning: {
    color: 'orange',
    threshold: WARNING_THRESHOLD,
  },
  alert: {
    color: 'red',
    threshold: ALERT_THRESHOLD,
  },
};

const DEFAULT_START_TIME = 13;
let AUTO_LOOP_STATUS = false;
let TIME_LIMIT = DEFAULT_START_TIME;
let timePassed = 0;
let timeLeft = TIME_LIMIT;
let timerInterval = null;
let remainingPathColor = COLOR_CODES.info.color;

document.getElementById('app').innerHTML = `
<div class="base-timer">
<svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <g class="base-timer__circle">
    <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
    <path
      id="base-timer-path-remaining"
      stroke-dasharray="283"
      class="base-timer__path-remaining ${remainingPathColor}"
      d="
        M 50, 50
        m -45, 0
        a 45,45 0 1,0 90,0
        a 45,45 0 1,0 -90,0
      "
    ></path>
  </g>
</svg>
<span id="base-timer-label" class="base-timer__label">${formatTime(
  timeLeft
)}</span>
</div>
<div class="action-btn">
<button id="reset-bt" type="button" class="btn btn-primary" onclick="onAutoLoopEnable()">Auto</button>
<button id="start-bt" type="button" class="btn btn-primary" onclick="startTimer()">Start</button>
<button id="reset-bt" type="button" class="btn btn-primary" onclick="onResetTimer()">Reset</button>
<button id="reset-bt" type="button" class="btn btn-primary" onclick="onPauseTimer()">Pause</button>
<button id="play-audio-bt" type="button" class="btn btn-primary" onclick="onPlayAudio()">Bell</button> 
<button id="stop-audio-bt" type="button" class="btn btn-primary" onclick="onStopAudio()">Stop Bell</button>
<div>
<!-- <div id="audioTag"></div> -->
<audio controls hidden id="customAudio">
<!--<source src="https://drive.google.com/uc?usp=slides_web&id=1LyZW9gPDnRPiOW_8PFSMrqZF3rpVtBnd&playback"> -->
<source src="http://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3" type="audio/mpeg"> 
Your browser does not support the audio element
</audio> 
`;

function enableButton(elementId) {
  document.getElementById(elementId).disabled = false;
}

function diableButton(elementId) {
  document.getElementById(elementId).disabled = true;
}

function resetConstant() {
  setColorCirleClass();

  TIME_LIMIT = DEFAULT_START_TIME;
  timePassed = 0;
  timeLeft = TIME_LIMIT;
  timerInterval = null;
  remainingPathColor = COLOR_CODES.info.color;
}

function setColorCirleClass() {
  document
    .getElementById('base-timer-path-remaining')
    .classList.remove(COLOR_CODES.warning.color);
  document
    .getElementById('base-timer-path-remaining')
    .classList.remove(COLOR_CODES.alert.color);

  document
    .getElementById('base-timer-path-remaining')
    .classList.add(COLOR_CODES.info.color);
}

function onAutoLoopEnable() {
  let AUTO_LOOP_STATUS = true;
}

function onAutoLoopCancel() {
  let AUTO_LOOP_STATUS = false;
}

function onTimesUp() {
  clearInterval(timerInterval);
  onPlayAudio();
}

function onPauseTimer() {
  clearInterval(timerInterval);
  enableButton('start-bt');
}

function onResetTimer() {
  clearInterval(timerInterval);
  resetConstant();
  startTimer();
}

function startTimer() {
  diableButton('start-bt');
  timerInterval = setInterval(() => {
    timePassed = timePassed += 1;
    timeLeft = TIME_LIMIT - timePassed;
    document.getElementById('base-timer-label').innerHTML =
      formatTime(timeLeft);
    setCircleDasharray();
    setRemainingPathColor(timeLeft);

    if (timeLeft === 0) {
      onTimesUp();
    }
  }, 1000);
}

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  return `${minutes}:${seconds}`;
}

function setRemainingPathColor(timeLeft) {
  const { alert, warning, info } = COLOR_CODES;
  if (timeLeft <= alert.threshold) {
    document
      .getElementById('base-timer-path-remaining')
      .classList.remove(warning.color);
    document
      .getElementById('base-timer-path-remaining')
      .classList.add(alert.color);
  } else if (timeLeft <= warning.threshold) {
    document
      .getElementById('base-timer-path-remaining')
      .classList.remove(info.color);
    document
      .getElementById('base-timer-path-remaining')
      .classList.add(warning.color);
  }
}

function calculateTimeFraction() {
  const rawTimeFraction = timeLeft / TIME_LIMIT;
  return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}

function setCircleDasharray() {
  const circleDasharray = `${(
    calculateTimeFraction() * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  document
    .getElementById('base-timer-path-remaining')
    .setAttribute('stroke-dasharray', circleDasharray);
}

function onPlayAudio() {
  document.getElementById('customAudio').play();
}

function onStopAudio() {
  var player = document.getElementById('customAudio');
  player.pause();
  player.currentTime = 0;
}

// Add audio tag dynamically - Start
function playAudio() {
  // <button type="button" class="btn btn-primary" onclick="stopAudio()">Stop Audio</button>
  document.getElementById('audioTag').innerHTML = `
  <audio controls autoplay hidden="hidden">
  <!--<source src="https://drive.google.com/uc?usp=slides_web&id=1LyZW9gPDnRPiOW_8PFSMrqZF3rpVtBnd&playback"> -->
    <source src="http://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3" type="audio/mpeg"> 
    Your browser does not support the audio element
  </audio>
`;
}

function stopAudio() {
  var element = document.getElementById('audioTag');
  if (element != null) {
    element.parentNode.removeChild(element);
  }
}
// Add audio tag dynamically - End
