import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

//Global variable
let stream;
let recorder;
let videoFile;

//다운로드
const handleDownload = async () => {
  //--------------------------** webm -> mp4 파일변환 **------------------------------//
  //0. ffmpeg 소프트웨어 application
  const ffmpeg = createFFmpeg({
    //!!!ffmpeg 최신버전(10.1)의 오류해결방법!!! 아래 corePath추가
    corePath: "https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js",
    log: true, //콘솔로 찍힘
  });
  await ffmpeg.load(); //무거운 소프트웨어이기때문에 await을 사용; 유저의 컴퓨터를 사용하기에 서버를 쓸 필요없음 (서버비용절감)

  //1. ffmpeg의 가상세계에 파일을 생성함; videoFile(브라우저url)을 넣어서 실제 파일을 생성.
  ffmpeg.FS("writeFile", "recording.webm", await fetchFile(videoFile));

  //2. 만든파일을 input으로 받아서 실행함; recording.webm을 input으로 받아서 -> mp4형태로 변환한것; 초당 60프레임으로 인코딩함

  await ffmpeg.run("-i", "recording.webm", "-r", "60", "output.mp4");

  //4. 썸네일 만들기
  await ffmpeg.run(
    "-i",
    "recording.webm",
    "-ss",
    "00:00:01",
    "-frames:v",
    "1",
    "thumbnail.jpg"
  );
  //5. 썸네일 불러오기
  const thumbFile = ffmpeg.FS("readFile", "thumbnail.jpg");
  const thumbBlob = new Blob([thumbFile.buffer], { type: "image/jpg" });
  const thumbUrl = URL.createObjectURL(thumbBlob);

  //3. 파일불러오기;
  /// 과정) mp4파일가져옴 - 파일로부터 data를 받음(blob) - Object URL을 만듬 -> a.href에 넣어줌
  const mp4File = ffmpeg.FS("readFile", "output.mp4");
  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
  const mp4Url = URL.createObjectURL(mp4Blob);

  //--------------------------** webm -> mp4 파일변환 **------------------------------//

  //4. a태그생성 - a주소생성(브라우저url삽입) - 다운로드생성 - html에 a태그 삽입 - 클릭이벤트 넣어줌
  const a = document.createElement("a");
  a.href = mp4Url; //mp4로 변환된 파일url 삽입 ffmpeg
  a.download = "MyRecording.mp4";
  document.body.appendChild(a);
  a.click(); //유저가 클릭한것 처럼 작동함

  // 썸네일 생성
  const thumbA = document.createElement("a");
  thumbA.href = thumbUrl; //썸네일 url 삽입 ffmpeg
  thumbA.download = "MyThumbnail.jpg";
  document.body.appendChild(thumbA);
  thumbA.click(); //유저가 클릭한것 처럼 작동함

  //** ffmpeg 속도향상작업 **
  //파일제거
  ffmpeg.FS("unlink", "recording.webm");
  ffmpeg.FS("unlink", "output.mp4");
  ffmpeg.FS("unlink", "thumbnail.jpg");
  // url제거
  URL.revokeObjectURL(mp4Url);
  URL.revokeObjectURL(thumbUrl);
  URL.revokeObjectURL(videoFile);
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
