const app = document.querySelector(".app"),
  image = app.querySelector(".image img"),
  musicName = app.querySelector(".music_info .name"),
  musicArtist = app.querySelector(".music_info .artist"),
  mainAudio = app.querySelector("audio"),
  playPause = app.querySelector(".play_pause i"),
  nextBtn = app.querySelector("#nextBtn"),
  prevBtn = app.querySelector("#previousBtn"),
  progressArea = app.querySelector(".progress_area"),
  progressBar = app.querySelector(".progress_bar"),
  musicTotalTime = app.querySelector(".time_bar .total"),
  musicSpendedTime = app.querySelector(".time_bar .spended"),
  musicLoopBtn = app.querySelector("#musicLoopBtn"),
  musicListBtn = app.querySelector("#musicListBtn"),
  musicList = app.querySelector(".music_list"),
  closeList = app.querySelector("#closeList"),
  ulTag = musicList.querySelector("ul");

let currentMusic = Math.floor(Math.random() * allMusic.length);

window.addEventListener("load", () => {
  loadMusic(currentMusic);
  playingSong();
});

playPause.addEventListener("click", () => {
  const isMusicPlay = playPause.classList.toString().includes("play");
  isMusicPlay ? playMusic() : pauseMusic();
});

nextBtn.addEventListener("click", () => {
  nextMusic();
  playingSong();
});
prevBtn.addEventListener("click", () => {
  prevMusic();
  playingSong();
});
// updating progress bar along audio time
mainAudio.addEventListener("timeupdate", (e) => {
  let { currentTime, duration } = e.target;
  let width = (currentTime / duration) * 100;
  let totalMin = Math.floor(currentTime / 60);
  let totalSec = Math.floor(currentTime % 60);
  progressBar.style.width = `${width}%`;
  totalSec < 10 ? (totalSec = `0${totalSec}`) : totalSec;
  musicSpendedTime.innerText = `${totalMin}:${totalSec}`;
  mainAudio.addEventListener("loadeddata", () => {
    let totalMin = Math.floor(mainAudio.duration / 60);
    let totalSec = Math.floor(mainAudio.duration % 60);
    totalSec < 10 ? (totalSec = `0${totalSec}`) : totalSec;
    musicTotalTime.innerText = `${totalMin}:${totalSec}`;
  });
});
// updating music time along progress bar
progressArea.addEventListener("click", (e) => {
  let progressWidth = progressArea.clientWidth;
  let clickedOffsetX = e.offsetX;
  let musicDuration = mainAudio.duration;
  mainAudio.currentTime = (clickedOffsetX / progressWidth) * musicDuration;
  playMusic();
});
// loop, shuffle and repeat music
musicLoopBtn.addEventListener("click", () => {
  let getClass = musicLoopBtn.classList.toString();
  switch (true) {
    case getClass.includes("repeat"):
      musicLoopBtn.classList.remove("fa-repeat");
      musicLoopBtn.classList.add("fa-1");
      break;
    case getClass.includes("fa-1"):
      musicLoopBtn.classList.remove("fa-1");
      musicLoopBtn.classList.add("fa-shuffle");
      break;
    case getClass.includes("shuffle"):
      musicLoopBtn.classList.remove("fa-shuffle");
      musicLoopBtn.classList.add("fa-repeat");
  }
});
// when music ended
mainAudio.addEventListener("ended", () => {
  let getClass = musicLoopBtn.classList.toString();
  switch (true) {
    case getClass.includes("repeat"):
      nextMusic();
      break;
    case getClass.includes("fa-1"):
      mainAudio.currentTime = 0;
      playMusic();
      playingSong();
      break;
    case getClass.includes("shuffle"):
      let randIndex;
      do {
        randIndex = Math.floor(Math.random() * allMusic.length);
      } while (currentMusic == randIndex);
      currentMusic = randIndex;
      loadMusic(currentMusic);
      playMusic();
      playingSong();
  }
});
// show music list on music list btn click
musicListBtn.addEventListener("click", () => {
  musicList.classList.toggle("show");
});
closeList.addEventListener("click", () => {
  musicListBtn.click();
});
// creating li tag according to music array
(function () {
  for (let i = 0; i < allMusic.length; i++) {
    let liTag = `<li id="${i}#li" li-index="${i}">
                    <div class="left">
                      <span class="name">${allMusic[i].name}</span>
                      <span class="artist">${allMusic[i].artist}</span>
                    </div>
                    <div class="right">
                      <span id="${allMusic[i].src}" class="total_time">3:30</span>
                      <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>
                    </div>
                </li>`;
    ulTag.insertAdjacentHTML("beforeend", liTag);
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);
    let liAudioDurationTag = ulTag.querySelector(`#${allMusic[i].src}`);
    liAudioTag.addEventListener("loadeddata", () => {
      let duration = liAudioTag.duration;
      let totalMin = Math.floor(duration / 60);
      let totalSec = Math.floor(duration % 60);
      totalSec < 10 ? (totalSec = `0${totalSec}`) : totalSec;
      liAudioDurationTag.innerText = `${totalMin}:${totalSec}`;
      liAudioDurationTag.setAttribute("total-duration",`${totalMin}:${totalSec}`);
    });
  }
})();

function playingSong(){
    const liTags = document.querySelectorAll('.music_list li');
    for (let j = 0; j < liTags.length; j++) {
        let liAudioDurationTag = liTags[j].querySelector('.total_time');
        if(liTags[j].classList.toString().includes("playing")){
            liTags[j].classList.remove("playing");
            let duration = liAudioDurationTag.getAttribute("total-duration");    
            liAudioDurationTag.innerText = duration;
        };
        if(liTags[j].id.includes(currentMusic.toString())){
            liTags[j].classList.add("playing");
            liAudioDurationTag.innerText = "playing"; 
        };
        liTags[j].setAttribute("onclick","clicked(this)");
    };
};

function loadMusic(musicIndex) {
  image.src = `images/${allMusic[musicIndex].img}.jpg`;
  musicName.innerText = allMusic[musicIndex].name;
  musicArtist.innerText = allMusic[musicIndex].artist;
  mainAudio.src = `songs/${allMusic[musicIndex].src}.mp3`;
}

function playMusic() {
  playPause.classList.remove("fa-play");
  playPause.classList.add("fa-pause");
  mainAudio.play();
}
function pauseMusic() {
  playPause.classList.remove("fa-pause");
  playPause.classList.add("fa-play");
  mainAudio.pause();
}
function nextMusic() {
  currentMusic++;
  currentMusic > allMusic.length - 1 ? (currentMusic = 0) : currentMusic;
  loadMusic(currentMusic);
  playMusic();
}
function prevMusic() {
  currentMusic--;
  currentMusic < 0 ? (currentMusic = allMusic.length) : currentMusic;
  loadMusic(currentMusic);
  playMusic();
}
function clicked(element){
    let index = element.getAttribute('li-index');
    currentMusic = parseInt(index);
    loadMusic(currentMusic);
    playMusic();
    playingSong();
}