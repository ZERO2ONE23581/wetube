const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

//Global variable
let stream;
let recorder;
let videoFile;

//녹화다운
const handleDownload = () => {
  //create a link
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
  startBtn.addEventListener("click", handleDownload);
  //녹화중단
  recorder.stop();
};
const handleStart = () => {
  startBtn.innerText = "Stop Recording";
  startBtn.removeEventListener("click", handleStart);
  startBtn.addEventListener("click", handleStop);
  //녹화
  recorder = new MediaRecorder(stream); //1. 녹음기 생성
  recorder.start(); //2. 녹화시작
  //3. 녹화파일 생성
  recorder.ondataavailable = (event) => {
    videoFile = URL.createObjectURL(event.data); //메모리url 생성
    video.src = videoFile; //video 삽입
    video.srcObject = null; //이전 preview 삭제
    video.loop = true; //반복
    video.play(); //재생
    //녹화된 비디오 catch -> blob 객체 (==event.data) -> 브라우저 메모리상 url 생성(?) (실제로는 없는 url)
    //실제로 url을 만드는것은 아니고, 브라우저 메모리에 파일을 저장해두고, 브라우저가 그 파일에 접근할수 있는 url을 주는것.
  };
};

//미리보기 preview
const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: true });
  video.srcObject = stream; //srcObject는 video에게 무언가주는걸 의미, url사용시 src와는 다르다.
  video.play();
};
init(); //함수실행

startBtn.addEventListener("click", handleStart);
