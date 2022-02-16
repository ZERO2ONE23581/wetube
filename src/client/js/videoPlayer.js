const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const time = document.getElementById("time");
const volumeRange = document.getElementById("volume");
//DEFAULT
let volumeValue = 0.5; //초기 볼륨값 (글로벌 변수)
video.volume = volumeValue;

//VIDEO PLAY
//play and pause function
const handlePlayClick = (e) => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtn.innerText = video.paused ? "Play" : "Pause";
};

//VIDEO MUTE
const handleMute = (e) => {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  muteBtn.innerText = video.muted ? "Unmute" : "Mute";
  //뮤트해제시 마지막설정(last one) 볼륨값으로 회귀
  volumeRange.value = video.muted ? 0 : volumeValue;
};

//VIDEO VOLUME
const handleVolumeChange = (event) => {
  const {
    target: { value },
  } = event;
  console.log(event.target.value);
  //mute시 range조정하면 mute해제 및 text 바뀜
  if (video.muted) {
    video.muted = false;
    muteBtn.innerText = "Mute";
  }
  volumeValue = value; //뮤트해제시 마지막설정(last one) 볼륨값으로 회귀
  video.volume = value; //인풋과 비디오볼륨값을 연결 => 컨트롤
};

//EVENT LISTENER
playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeChange);
