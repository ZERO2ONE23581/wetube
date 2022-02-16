const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

let stream;

//녹화 recording
const handleStop = () => {
  startBtn.innerText = "Start Recording";
  startBtn.removeEventListener("click", handleStop); //4.
  startBtn.addEventListener("click", handleStart); //5.
};
const handleStart = () => {
  startBtn.innerText = "Stop Recording";
  startBtn.removeEventListener("click", handleStart); //2.
  startBtn.addEventListener("click", handleStop); //3.
  //녹화
  const recorder = new MediaRecorder(stream);
  recorder.ondataavailable = (e) => {
    //3. 녹화된 비디오는 ondataavailable로 잡고, blob이라는 객체로 받게됨
    console.log("recording done");
    console.log(e);
    console.log(e.data); //This is our VIDEO!
  };
  console.log("INACTIVE:", recorder);
  recorder.start(); //1. 녹화시작
  console.log("RECORDING:", recorder);
  //2. 10초뒤 녹화멈춤
  setTimeout(() => {
    recorder.stop();
  }, 10000);
};

//미리보기 preview
const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: true });
  video.srcObject = stream; //srcObject는 video에게 무언가주는걸 의미, url사용시 src와는 다르다.
  video.play();
};
init(); //this function automatically starts when visiting this page.

startBtn.addEventListener("click", handleStart); //1.
