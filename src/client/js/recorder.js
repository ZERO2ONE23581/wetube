const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

//Global variable
let stream;
let recorder;
let videoFile;

//다운로드
const handleDownload = () => {
  //4. a태그생성 - a주소생성(브라우저url삽입) - 다운로드생성 - html에 a태그 삽입 - 클릭이벤트 넣어줌
  const a = document.createElement("a");
  a.href = videoFile;
  a.download = "MyRecording.webm"; //MyRecording이라는 이름으로 저장할수 있게 해줌, webm은 확장자명 (extension)
  document.body.appendChild(a);
  a.click(); //유저가 클릭한것 처럼 작동함
};

//녹화 recording
const handleStop = () => {
  startBtn.innerText = "Downlad Recording";
  startBtn.removeEventListener("click", handleStop);
  startBtn.addEventListener("click", handleDownload); //4.
  recorder.stop(); //3. 녹화중단
};
const handleStart = () => {
  startBtn.innerText = "Stop Recording";
  startBtn.removeEventListener("click", handleStart);
  startBtn.addEventListener("click", handleStop);
  //
  recorder = new MediaRecorder(stream); //1. stream을 받아와서 그걸로 => 녹음기 생성
  //
  //3. ondataavailable 녹화가 중단되면 발생하는 event
  recorder.ondataavailable = (event) => {
    videoFile = URL.createObjectURL(event.data); //브라우저가 열려있는 상태에서만 존재
    video.src = videoFile;
    video.srcObject = null;
    video.loop = true;
    video.play();
  };
  recorder.start(); //2. 녹화시작
};

//미리보기 preview
const init = async () => {
  //mediaDevices는 말그대로 카메라, 마이크등 접근가능하게함. stream은 0과1로된 데이터.
  stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: true });
  //카메라가 stream을 담아와서 video tag에 넣어준것 => 재생순
  video.srcObject = stream;
  video.play(); //실시간 스트림
};
init(); //함수실행

startBtn.addEventListener("click", handleStart);
