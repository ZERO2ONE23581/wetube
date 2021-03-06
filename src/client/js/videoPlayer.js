const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const volumeRange = document.getElementById("volume");
const currenTime = document.getElementById("currenTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");

//GLOBAL
let controlsTimeout = null;
let controlsMovementTimeout = null;
let volumeValue = 0.5; //초기 볼륨값 (글로벌 변수)
video.volume = volumeValue;

//VIDEO PLAY
const handlePlayClick = (e) => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};

//VIDEO MUTE
const handleMute = (e) => {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  muteBtnIcon.classList = video.muted ? "fas fa-volume-mute" : "fas fa-volume-up";
  //뮤트해제시 마지막설정(last one) 볼륨값으로 회귀
  volumeRange.value = video.muted ? 0 : volumeValue;
};

//VIDEO VOLUME
const handleVolumeChange = (event) => {
  const {
    target: { value },
  } = event;
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
const formatTime = (seconds) => new Date(seconds * 1000).toISOString().substring(14, 19);
//비디오 총 시간
const handleLoadedMetadata = () => {
  totalTime.innerText = formatTime(Math.floor(video.duration));
  //타임라인 최대치(max) 설정
  timeline.max = Math.floor(video.duration);
};
//비디오 재생시간
const handleTimeUpdate = () => {
  currenTime.innerText = formatTime(Math.floor(video.currentTime));
  //타임라인에 따라 range 움직임
  timeline.value = Math.floor(video.currentTime);
};
//타임레인지
const handleTimelineChange = (event) => {
  const {
    target: { value },
  } = event;
  video.currentTime = value;
};

//FULL SCREEN
const handleFullscreen = (event) => {
  const fullscreen = document.fullscreenElement; //when it's NOT full screen, it returns NULL(==false)
  //이 함수는 click event에 반응한다는것을 기억해라
  if (fullscreen) {
    document.exitFullscreen();
    fullScreenIcon.classList = "fas fa-expand";
  } else {
    videoContainer.requestFullscreen();
    fullScreenIcon.classList = "fas fa-compress";
  }
};

//MOUSE MOVE
//넷플릭스처럼 마우스가 움직일시 클래스가 붙였다 지워졌다 하는 기능 구현
const hideControls = () => videoControls.classList.remove("showing");

const handleMouseMove = () => {
  //마우스가 비디오밖에 나가는 순간 hideControls가 (3초뒤) 발동되는데 그전후로 다시 들어오면 hideControls가 해제되는 if문
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  if (controlsMovementTimeout) {
    //timeout이 true일때 즉 마우스가 계속움직일때 timeout을 cancel하는 if문 (일종의 hover개념?) // 마우스가 정지하면 발동안함
    clearTimeout(controlsMovementTimeout);
    controlsMovementTimeout = null;
  }
  videoControls.classList.add("showing");
  controlsMovementTimeout = setTimeout(hideControls, 3000); //3초뒤에 컨트롤 숨김는 함수발동
};
const handleMouseLeave = () => {
  controlsTimeout = setTimeout(hideControls, 3000);
};

//FRONT <-> BACK
const handleEnded = () => {
  //1. pug(Back)에서 data 속성을 이용해 id를 남김
  const { id } = videoContainer.dataset;
  //2. fetch를 이용해 id를 -> POST request로 아래 URL로 보내게됨 -> registerView 컨트롤러 실행
  fetch(`/api/videos/${id}/view`, {
    method: "POST", //fetch는 원래 GET request를 보낸다 (디폴트)
  });
};

//EVENT LISTENER
playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadeddata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate); //timeupdate; 실시간 재생 watch
video.addEventListener("ended", handleEnded); //video의 영상이 끝나면, hadleEnded 함수실행
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
timeline.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullscreen);
