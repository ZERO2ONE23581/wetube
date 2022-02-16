const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

const handleStart = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: true });
  console.log(stream);
  video.srcObject = stream; //srcObject는 video에게 무언가주는걸 의미, url사용시 src와는 다르다.
  video.play();
};

startBtn.addEventListener("click", handleStart);
