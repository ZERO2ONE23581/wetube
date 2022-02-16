const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const volumeRange = document.getElementById("volume");
const currenTime = document.getElementById("currenTime");
const totalTime = document.getElementById("totalTime");

//DEFAULT
let volumeValue = 0.5; //초기 볼륨값 (글로벌 변수)
video.volume = volumeValue;

//VIDEO PLAY
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

//VIDEO TIME
//시간형태 바꾸기 (JS Trick)
const formatTime = (seconds) => new Date(seconds * 1000).toISOString().substring(11, 19);
//비디오 총 시간
const handleLoadedMetadata = () => {
  totalTime.innerText = formatTime(Math.floor(video.duration));
};
//비디오 재생시간
const handleTimeUpdate = () => {
  currenTime.innerText = formatTime(Math.floor(video.currentTime));
};

//EVENT LISTENER
playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
