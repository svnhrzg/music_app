'use strict';

import playlist from './playlist.json' with {type: 'json'};

const playBtn = document.getElementById('play-btn');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('previous-btn');
const shuffleBtn = document.getElementById('shuffle-btn');
const repeatBtn = document.getElementById('repeat-btn');
const playlistBtn = document.getElementById('playlist-btn');
const closeBtn = document.getElementById('close-btn');
const volumeInput = document.getElementById('volume');
const volumeIcon = document.getElementById('volume-icon');

const artist = document.getElementById('current-artist');
const title = document.getElementById('current-title');
const album = document.getElementById('current-album');
const albumCover = document.querySelector('.current-image');
const durationEl = document.getElementById('duration');
const elapsedTime = document.getElementById('elapsed-time');
const progressInput = document.getElementById('progress-input');

const audioPlayer = document.getElementById('music-player');
const playlistWrapper = document.querySelector('.playlist-wrapper');
const playlistEl = document.querySelector('.playlist');

// EVENT LISTENERS
playBtn.addEventListener('click', togglePlaySong);
nextBtn.addEventListener('click', next);
prevBtn.addEventListener('click', prev);
shuffleBtn.addEventListener('click', shuffle);
repeatBtn.addEventListener('click', repeat);
audioPlayer.addEventListener('ended', () => {
  let getText = repeatBtn.innerText;
  switch (getText) {
    case 'repeat':
      next();
      break;
    case 'repeat_on':
      loopPlaylist();
      break;
    case 'repeat_one_on':
      audioPlayer.currentTime = 0;
      audioPlayer.play();
      break;
  }
});

playlistBtn.addEventListener('click', () => {
  playlistEl.classList.remove('hidden');
});
closeBtn.addEventListener('click', () => {
  playlistEl.classList.add('hidden');
});

audioPlayer.addEventListener('timeupdate', e => {
  const currentTime = e.target.currentTime;
  const duration = e.target.duration;
  let progressValue = (currentTime / duration) * 100;
  progressInput.value = progressValue;

  const progressTime = progress.bind(progressInput);
  progressTime();

  audioPlayer.addEventListener('loadeddata', () => {
    let songDuration = audioPlayer.duration;
    convertTime(songDuration);
    durationEl.innerText = convertedTime;
  });

  let songCurrentTime = audioPlayer.currentTime;
  convertTime(songCurrentTime);
  elapsedTime.innerText = convertedTime;
});

progressInput.addEventListener('input', () => {
  audioPlayer.currentTime = (progressInput.value / 100) * audioPlayer.duration;
});
progressInput.addEventListener('input', progress);
volumeInput.addEventListener('input', adjustVolume);

// FUNCTIONS
let currentSong;
let nextSong;
let convertedTime;

function convertTime(time) {
  let min = Math.floor((time / 60) % 60);
  let sec = Math.floor(time % 60);

  if (sec < 10) sec = '0' + sec;
  convertedTime = `${min}:${sec}`;
}

function initPlayer() {
  currentSong = 0;
  nextSong = currentSong + 1;
  updatePlayer();
  playBtn.classList.add('play-icon');
  displayPlaylist();
}

initPlayer();
adjustVolume();

function updatePlayer() {
  let song = playlist[currentSong];
  artist.innerText = `${song.artist} · ${song.album}`;
  title.innerText = song.title;
  albumCover.style = `background-image: url(${song.image})`;
  audioPlayer.src = song.src;
  // better way?
  audioPlayer.addEventListener('loadeddata', () => {
    let songDuration = audioPlayer.duration;
    convertTime(songDuration);
    durationEl.innerText = convertedTime;
  });
  progressInput.value = 0;
  const progressTime = progress.bind(progressInput);
  progressTime();
}

function togglePlaySong() {
  if (audioPlayer.paused) {
    audioPlayer.play();
    playBtn.innerText = 'pause';
  } else {
    audioPlayer.pause();
    playBtn.innerText = 'play_arrow';
  }
}

function next() {
  if (currentSong >= playlist.length - 1) {
    currentSong = 0;
    audioPlayer.currentTime = 0;
    audioPlayer.pause();
    playBtn.innerText = 'play_arrow';
    updatePlayer();
  } else {
    currentSong++;
    updatePlayer();
    togglePlaySong();
  }
}

function prev() {
  if (currentSong <= 0) {
    // currentSong = playlist.length - 1;
    currentSong = 0;
    audioPlayer.currentTime = 0;
    audioPlayer.pause();
    playBtn.innerText = 'play_arrow';
  } else {
    currentSong--;
    updatePlayer();
    togglePlaySong();
  }
}

function loopPlaylist() {
  audioPlayer.pause();
  if (currentSong >= playlist.length - 1) {
    currentSong = 0;
  } else {
    currentSong++;
  }
  updatePlayer();
  togglePlaySong();
}

function shuffle() {
  // Fisher-Yates algorithm
  const shuffleArray = array => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    
  };
  shuffleArray(playlist);
  updatePlayer();
  togglePlaySong();
  displayPlaylist();
}

function repeat() {
  let getText = repeatBtn.innerText;
  switch (getText) {
    case 'repeat':
      repeatBtn.innerText = 'repeat_on';
      repeatBtn.setAttribute('title', 'Loop Playlist');
      audioPlayer.play();
      playBtn.innerText = 'pause';
      break;
    case 'repeat_on':
      repeatBtn.innerText = 'repeat_one_on';
      repeatBtn.setAttribute('title', 'Loop Song');
      break;
    case 'repeat_one_on':
      repeatBtn.innerText = 'repeat';
      repeatBtn.setAttribute('title', 'Normal Mode');
      break;
  }
}

function adjustVolume() {
  audioPlayer.volume = volumeInput.value / 100;
  let volume = volumeInput.value;
  switch (true) {
    case volume == 0:
      volumeIcon.innerText = 'volume_mute';
      break;
    case volume >= 1 && volume < 67:
      volumeIcon.innerText = 'volume_down';
      break;
    case volume >= 67:
      volumeIcon.innerText = 'volume_up';
      break;
  }

  volumeInput.addEventListener('input', progress);
}

function progress() {
  const min = this.min;
  const max = this.max;
  const currentVal = this.value;

  this.style.backgroundSize =
    ((currentVal - min) / (max - min)) * 100 + '% 100%';
}

function displayPlaylist() {
  playlistWrapper.innerHTML = '';

  playlist.forEach((item, i) => {
    const plSong = document.createElement('li');

    const plIndex = document.createElement('span');
    const plImage = document.createElement('div');
    const plInfo = document.createElement('div');
    const plTitle = document.createElement('span');
    const plArtist = document.createElement('span');
    // const plDuration = document.createElement('span');

    plSong.classList.add('playlist-song');

    plIndex.classList.add('playlist-index');
    plImage.classList.add('playlist-image');
    plInfo.classList.add('playlist-info');
    plTitle.classList.add('playlist-title');
    plArtist.classList.add('playlist-artist');
    // plDuration.classList.add('playlist-duration');

    plIndex.innerText = i + 1;
    plImage.innerHTML = `<img src="${item.image}" />`;
    plTitle.innerText = item.title;
    plArtist.innerText = `${item.artist} · ${item.album}`;
    // plDuration.innerText = '0:00';

    plInfo.appendChild(plTitle);
    plInfo.appendChild(plArtist);
    plSong.appendChild(plIndex);
    plSong.appendChild(plImage);
    plSong.appendChild(plInfo);
    // plSong.appendChild(plDuration);

    playlistWrapper.appendChild(plSong);
  });

playlistEl.querySelectorAll('li').forEach(function (song) {
  song.addEventListener('click', function (e) {
    e.preventDefault();
    const clicked = e.target.closest('.playlist-song');
    if (!clicked) return;
    const index = clicked.querySelector('.playlist-index').innerText - 1;
    currentSong = index;
    updatePlayer();
    togglePlaySong();
  });
});
}