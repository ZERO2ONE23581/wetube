import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const actionBtn = document.getElementById("actionBtn");
const video = document.getElementById("preview");

//Global variable
let stream;
let recorder;
let videoFile;

const files = {
  input: "recording.webm",
  output: "output.mp4",
  thumb: "thumbnail.jpg",
};

//과정) a태그생성 - a주소생성(브라우저url삽입) - 다운로드 파일이름 생성 - html에 a태그 삽입 - 클릭이벤트 넣어줌
const downloadFile = (fileUrl, fileName) => {
  const a = document.createElement("a");
  a.href = fileUrl; //mp4로 변환된 파일url 삽입 ffmpeg
  a.download = fileName;
  document.body.appendChild(a);
  a.click(); //유저가 클릭한것 처럼 작동함
};

//7. 파일변환 FFMPEG
const handleDownload = async () => {
  actionBtn.removeEventListener("click", handleDownload); //다운로드 이벤트 제거
  actionBtn.innerText = "Transcoding...";
  actionBtn.disabled = true;

  //--------------------------** webm -> mp4 파일변환 **------------------------------//
  //1. ffmpeg 소프트웨어 설치
  const ffmpeg = createFFmpeg({
    //!!!ffmpeg 최신버전(10.1)의 오류해결방법!!! 아래 corePath추가
    corePath: "https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js",
    log: true, //콘솔로 찍힘
  });
  await ffmpeg.load(); //실행

  //1. ffmpeg의 가상세계에 파일을 생성
  ffmpeg.FS("writeFile", files.input, await fetchFile(videoFile));

  //2. 만든파일을 input으로 받아서 실행함;
  await ffmpeg.run("-i", files.input, "-r", "60", files.output); // recording.webm -> output.mp4
  await ffmpeg.run("-i", files.input, "-ss", "00:00:01", "-frames:v", "1", files.thumb); // thumbnail.jpg

  //3-1. 만든 mp4파일가져옴 (readFile)
  const mp4File = ffmpeg.FS("readFile", files.output);
  const thumbFile = ffmpeg.FS("readFile", files.thumb);

  //3-2. 파일로부터 data를 받음(new Blob)
  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
  const thumbBlob = new Blob([thumbFile.buffer], { type: "image/jpg" });

  //3-3. Object URL (브라우저내 가상url)을 만듬
  const mp4Url = URL.createObjectURL(mp4Blob);
  const thumbUrl = URL.createObjectURL(thumbBlob);

  //--------------------------** webm -> mp4 파일변환 **------------------------------//

  //8. 다운로드
  downloadFile(mp4Url, "MyRecording.mp4");
  downloadFile(thumbUrl, "MyThumbnail.jpg");

  //** ffmpeg 속도향상작업 **
  //파일제거
  ffmpeg.FS("unlink", files.input);
  ffmpeg.FS("unlink", files.output);
  ffmpeg.FS("unlink", files.thumb);
  // url제거
  URL.revokeObjectURL(mp4Url);
  URL.revokeObjectURL(thumbUrl);
  URL.revokeObjectURL(videoFile);

  //8. 다운받은후 다시 복귀
  actionBtn.disabled = false;
  actionBtn.innerText = "Record Again";
  actionBtn.addEventListener("click", handleStart); //Record Again 클릭!
};

//녹화 recording
const handleStop = () => {
  actionBtn.innerText = "Download Recording";
  actionBtn.removeEventListener("click", handleStop);
  actionBtn.addEventListener("click", handleDownload); //6. Download Recording 클릭!
  recorder.stop(); //5. 녹화중단
};
const handleStart = () => {
  actionBtn.innerText = "Stop Recording";
  actionBtn.removeEventListener("click", handleStart);
  actionBtn.addEventListener("click", handleStop); //4. Stop Recording 클릭!

  //1. stream을 받아와서 그걸로 => 녹음기 생성
  recorder = new MediaRecorder(stream);

  //2. 녹음준비
  recorder.ondataavailable = (event) => {
    // 녹화가 중단되면 발생하는 event
    videoFile = URL.createObjectURL(event.data); //브라우저가 열려있는 상태에서만 존재
    video.src = videoFile;
    video.srcObject = null;
    video.loop = true;
    video.play();
  };
  recorder.start(); //3. 녹화시작
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

actionBtn.addEventListener("click", handleStart);
