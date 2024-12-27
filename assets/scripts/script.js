// Constants

const siteName = "Lyricly";

// Lyrics

document.addEventListener('DOMContentLoaded', () => {
  const lyricsContainer = document.getElementById('lyricsContainer');
  const lyricsElement = document.getElementById('lyrics');
  const audioPlayer = document.getElementById('audioPlayer');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const progressBar = document.getElementById('progressBar');
  const currentTimeEl = document.getElementById('currentTime');
  const durationEl = document.getElementById('duration');
  const previousBtn = document.getElementById('previousBtn');
  const nextBtn = document.getElementById('nextBtn');
  const headerOptionsBtn = document.getElementById('headerOptionsBtn');
  const headerOptionsDropdown = document.getElementById('headerOptionsDropdown');

  let activeLyricIndex = -1;

  document.title = `${songName} - ${authorName} | ${siteName}`;
  document.getElementById('siteNameHeader').textContent = siteName;
  document.getElementById('songNameFooter').textContent = songName;
  document.getElementById('authorNameFooter').textContent = authorName;

  document.documentElement.style.setProperty('--gradient-color-1', gradientColors[0]);
  document.documentElement.style.setProperty('--gradient-color-2', gradientColors[1]);
  document.documentElement.style.setProperty('--gradient-color-3', gradientColors[2]);

  function renderLyrics() {
    lyricsElement.innerHTML = '';
    songLyrics.forEach((line, index) => {
      const p = document.createElement('p');
      p.textContent = line.text;
      if (line.isSection) {
        p.className = 'text-sm font-semibold text-white/60 uppercase tracking-wider mt-6 mb-2';
      } else {
        p.className = 'text-lg py-1 transition-all duration-300 ease-in-out cursor-pointer text-white/70';
      }
      p.dataset.index = index;

      p.addEventListener('click', () => {
        if (!line.isSection) {
          audioPlayer.currentTime = line.time;
          audioPlayer.play();
          updatePlayPauseButton();
          updateActiveLyric();
        }
      });

      lyricsElement.appendChild(p);

      if (line.lineBreak) {
        lyricsElement.appendChild(document.createElement('br'));
      }
    });
  }

  function updateActiveLyric() {
    const currentTime = audioPlayer.currentTime;
    const newActiveIndex = songLyrics.findIndex((lyric, i) =>
      currentTime >= lyric.time && (i === songLyrics.length - 1 || currentTime < songLyrics[i + 1].time)
    );

    if (newActiveIndex !== activeLyricIndex) {
      const lyricElements = lyricsElement.querySelectorAll('p');
      lyricElements.forEach((el, i) => {
        if (i === newActiveIndex) {
          el.classList.add('active-lyric');
          el.classList.remove('text-white/70');
          scrollToActiveLyric(el);
        } else {
          el.classList.remove('active-lyric');
          el.classList.add('text-white/70');
        }
      })
      activeLyricIndex = newActiveIndex;
    }
  }

  function scrollToActiveLyric(element) {
    const containerHeight = lyricsContainer.clientHeight;
    const elementTop = element.offsetTop;
    const elementHeight = element.clientHeight;
    const scrollPosition = elementTop - (containerHeight / 2) + (elementHeight / 2);
    lyricsContainer.scrollTo({
      top: scrollPosition,
      behavior: 'smooth'
    });
  }

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  function updateProgressBar() {
    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.value = progress;
    currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
  }

  function updatePlayPauseButton() {
    playPauseBtn.innerHTML = audioPlayer.paused ?
      '<ion-icon name="play-circle"></ion-icon>' :
      '<ion-icon name="pause-circle"></ion-icon>';
  }

  audioPlayer.addEventListener('loadedmetadata', () => {
    durationEl.textContent = formatTime(audioPlayer.duration);
  });

  audioPlayer.addEventListener('timeupdate', () => {
    updateProgressBar();
    updateActiveLyric();
  });

  playPauseBtn.addEventListener('click', () => {
    if (audioPlayer.paused) {
      audioPlayer.play();
    } else {
      audioPlayer.pause();
    }
    updatePlayPauseButton();
  });

  progressBar.addEventListener('input', () => {
    const time = (progressBar.value / 100) * audioPlayer.duration;
    audioPlayer.currentTime = time;
  });

  previousBtn.addEventListener('click', () => {
    if (previousSong) {
      window.location.href = previousSong;
    }
  });

  nextBtn.addEventListener('click', () => {
    if (nextSong) {
      window.location.href = nextSong;
    }
  });

  if (!previousSong) {
    previousBtn.style.display = 'none';
  }
  if (!nextSong) {
    nextBtn.style.display = 'none';
  }

  audioPlayer.addEventListener('ended', () => {
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    updatePlayPauseButton();
  });

  function toggleDropdown(dropdown) {
    dropdown.classList.toggle('hidden');
  }

  function closeDropdowns() {
    headerOptionsDropdown.classList.add('hidden');
  }

  headerOptionsBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleDropdown(headerOptionsDropdown);
  });

  document.addEventListener('click', closeDropdowns);

  renderLyrics();
  updatePlayPauseButton();

  if (audioPlayer.readyState >= 2) {
    audioPlayer.dispatchEvent(new Event('loadedmetadata'));
  }

  function handleResponsiveDesign() {
    const width = window.innerWidth;
    const footer = document.querySelector('footer');
    const controls = footer.querySelector('.max-w-lg');

    if (width >= 768) {
      footer.classList.remove('py-4');
      footer.classList.add('py-2');
      controls.classList.remove('space-y-4');
      controls.classList.add('space-y-2');
    } else {
      footer.classList.remove('py-2');
      footer.classList.add('py-4');
      controls.classList.remove('space-y-2');
      controls.classList.add('space-y-4');
    }
  }

  window.addEventListener('resize', handleResponsiveDesign);
  handleResponsiveDesign();
});
