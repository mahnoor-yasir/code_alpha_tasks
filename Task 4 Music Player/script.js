const artists = [
  "Luna Ray", "Ava Stone", "Noah Miles", "Zara Beats", "Echo Lane", "Mira Nova",
  "Skyler Vox", "Leo Drift", "Aria Bloom", "Ryan Pulse", "Nora Wave", "Eden Soul",
  "Kai Rhythm", "Sia Vale", "Omar Keys", "Maya Tune", "Ivy Rose", "Dani Star",
  "Rex Audio", "Elena Hope", "Sam River", "Tara Light", "Max Cloud", "Nia Glow",
  "Adam Loop", "Bella Sound", "Hira Notes", "Ray Moon", "Sana Vibe", "Neo Spark"
];

const coverImages = [
  "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80"
];

/*
  Audio source note:
  These are public sample MP3 files used for demo/testing.
  They allow the browser audio player to work without copyrighted music.
*/
const songs = [
  { id: 1, title: "SoundHelix Dream 1", artist: "Luna Ray", genre: "Pop", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", cover: coverImages[0] },
  { id: 2, title: "SoundHelix Drive 2", artist: "Ava Stone", genre: "Electronic", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", cover: coverImages[1] },
  { id: 3, title: "SoundHelix Mood 3", artist: "Noah Miles", genre: "Chill", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", cover: coverImages[2] },
  { id: 4, title: "SoundHelix Beats 4", artist: "Zara Beats", genre: "Dance", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", cover: coverImages[3] },
  { id: 5, title: "SoundHelix Flow 5", artist: "Echo Lane", genre: "Instrumental", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3", cover: coverImages[4] },
  { id: 6, title: "SoundHelix Night 6", artist: "Mira Nova", genre: "Lo-Fi", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3", cover: coverImages[5] },
  { id: 7, title: "SoundHelix Rise 7", artist: "Skyler Vox", genre: "Pop", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3", cover: coverImages[0] },
  { id: 8, title: "SoundHelix Energy 8", artist: "Leo Drift", genre: "EDM", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3", cover: coverImages[1] },
  { id: 9, title: "SoundHelix Aura 9", artist: "Aria Bloom", genre: "Ambient", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3", cover: coverImages[2] },
  { id: 10, title: "SoundHelix Pulse 10", artist: "Ryan Pulse", genre: "Synth", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3", cover: coverImages[3] },
  { id: 11, title: "SoundHelix Wave 11", artist: "Nora Wave", genre: "Acoustic", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3", cover: coverImages[4] },
  { id: 12, title: "SoundHelix Soul 12", artist: "Eden Soul", genre: "Jazz", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3", cover: coverImages[5] },
  { id: 13, title: "SoundHelix Rhythm 13", artist: "Kai Rhythm", genre: "Groove", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3", cover: coverImages[0] },
  { id: 14, title: "SoundHelix Vale 14", artist: "Sia Vale", genre: "Soft Pop", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3", cover: coverImages[1] },
  { id: 15, title: "SoundHelix Keys 15", artist: "Omar Keys", genre: "Piano", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3", cover: coverImages[2] },
];

const audio = document.getElementById("audio");
const artistGrid = document.getElementById("artistGrid");
const songGrid = document.getElementById("songGrid");
const favoritesGrid = document.getElementById("favoritesGrid");
const playlistGrid = document.getElementById("playlistGrid");
const recentGrid = document.getElementById("recentGrid");

const cover = document.getElementById("cover");
const trackTitle = document.getElementById("trackTitle");
const trackArtist = document.getElementById("trackArtist");
const playBtn = document.getElementById("playBtn");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const favoriteBtn = document.getElementById("favoriteBtn");
const progressBar = document.getElementById("progressBar");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const volumeSlider = document.getElementById("volumeSlider");
const muteBtn = document.getElementById("muteBtn");
const searchInput = document.getElementById("searchInput");
const themeBtn = document.getElementById("themeBtn");
const toast = document.getElementById("toast");

let currentIndex = Number(localStorage.getItem("lastSongIndex")) || 0;
let isPlaying = false;
let shuffle = false;
let repeat = false;
let selectedArtist = "All";
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let playlist = JSON.parse(localStorage.getItem("playlist")) || [];
let recent = JSON.parse(localStorage.getItem("recent")) || [];

audio.volume = 0.75;

function init() {
  if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light");
    themeBtn.textContent = "🌙 Dark";
  }

  renderArtists();
  renderSongs();
  renderSavedLists();
  loadSong(currentIndex, false);
  updateStats();
}

function renderArtists() {
  artistGrid.innerHTML = `
    <div class="artist-card active" onclick="selectArtist('All', this)">
      <img src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=400&q=80" alt="All artists">
      <h3>All Artists</h3>
      <p>Show every song</p>
    </div>
  `;

  artists.forEach((artist, index) => {
    const img = coverImages[index % coverImages.length];
    artistGrid.innerHTML += `
      <div class="artist-card" onclick="selectArtist('${artist}', this)">
        <img src="${img}" alt="${artist}">
        <h3>${artist}</h3>
        <p>${songs.filter(s => s.artist === artist).length || "Sample"} tracks</p>
      </div>
    `;
  });
}

function selectArtist(artist, element) {
  selectedArtist = artist;
  document.querySelectorAll(".artist-card").forEach(card => card.classList.remove("active"));
  element.classList.add("active");
  renderSongs();
}

function getFilteredSongs() {
  const search = searchInput.value.toLowerCase().trim();

  return songs.filter(song => {
    const artistMatch = selectedArtist === "All" || song.artist === selectedArtist;
    const searchMatch = song.title.toLowerCase().includes(search) || song.artist.toLowerCase().includes(search);
    return artistMatch && searchMatch;
  });
}

function renderSongs() {
  const filtered = getFilteredSongs();

  if (filtered.length === 0) {
    songGrid.innerHTML = `<p class="empty">No songs found.</p>`;
    return;
  }

  songGrid.innerHTML = filtered.map(song => songCard(song)).join("");
}

function songCard(song, removable = false) {
  const originalIndex = songs.findIndex(s => s.id === song.id);
  const liked = favorites.includes(song.id);

  return `
    <div class="card">
      <img src="${song.cover}" alt="${song.title}">
      <div class="card-body">
        <h3>${song.title}</h3>
        <p>${song.artist} • ${song.genre}</p>
        <div class="song-actions">
          <button onclick="playSong(${originalIndex})">▶ Play</button>
          <button onclick="toggleFavorite(${song.id})">${liked ? "💚" : "♡"}</button>
          <button onclick="addToPlaylist(${song.id})">＋</button>
          ${removable ? `<button onclick="removeFromPlaylist(${song.id})">Remove</button>` : ""}
        </div>
      </div>
    </div>
  `;
}

function loadSong(index, autoPlay = true) {
  currentIndex = index;
  const song = songs[currentIndex];

  if (!song) return;

  audio.src = song.src;
  cover.src = song.cover;
  trackTitle.textContent = song.title;
  trackArtist.textContent = `${song.artist} • ${song.genre}`;
  favoriteBtn.textContent = favorites.includes(song.id) ? "💚" : "♡";
  document.getElementById("heroTitle").textContent = `${song.title} by ${song.artist}`;

  localStorage.setItem("lastSongIndex", currentIndex);

  if (autoPlay) {
    audio.play()
      .then(() => {
        isPlaying = true;
        playBtn.textContent = "⏸";
        addRecent(song.id);
      })
      .catch(() => showToast("Click play to start audio"));
  }
}

function playSong(index) {
  loadSong(index, true);
}

function togglePlay() {
  if (!audio.src) loadSong(currentIndex, false);

  if (isPlaying) {
    audio.pause();
    isPlaying = false;
    playBtn.textContent = "▶";
  } else {
    audio.play()
      .then(() => {
        isPlaying = true;
        playBtn.textContent = "⏸";
        addRecent(songs[currentIndex].id);
      })
      .catch(() => showToast("Audio could not start"));
  }
}

function nextSong() {
  if (shuffle) {
    currentIndex = Math.floor(Math.random() * songs.length);
  } else {
    currentIndex = (currentIndex + 1) % songs.length;
  }
  loadSong(currentIndex, true);
}

function prevSong() {
  currentIndex = (currentIndex - 1 + songs.length) % songs.length;
  loadSong(currentIndex, true);
}

function toggleFavorite(id = songs[currentIndex].id) {
  if (favorites.includes(id)) {
    favorites = favorites.filter(songId => songId !== id);
    showToast("Removed from Favorites");
  } else {
    favorites.push(id);
    showToast("Added to Favorites");
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
  favoriteBtn.textContent = favorites.includes(songs[currentIndex].id) ? "💚" : "♡";
  renderSongs();
  renderSavedLists();
  updateStats();
}

function addToPlaylist(id) {
  if (!playlist.includes(id)) {
    playlist.push(id);
    localStorage.setItem("playlist", JSON.stringify(playlist));
    showToast("Added to Playlist");
    renderSavedLists();
  } else {
    showToast("Already in Playlist");
  }
}

function removeFromPlaylist(id) {
  playlist = playlist.filter(songId => songId !== id);
  localStorage.setItem("playlist", JSON.stringify(playlist));
  renderSavedLists();
  showToast("Removed from Playlist");
}

function addRecent(id) {
  recent = [id, ...recent.filter(songId => songId !== id)].slice(0, 10);
  localStorage.setItem("recent", JSON.stringify(recent));
  renderSavedLists();
  updateStats();
}

function renderSavedLists() {
  const favSongs = songs.filter(song => favorites.includes(song.id));
  const playlistSongs = songs.filter(song => playlist.includes(song.id));
  const recentSongs = recent.map(id => songs.find(song => song.id === id)).filter(Boolean);

  favoritesGrid.innerHTML = favSongs.length ? favSongs.map(song => songCard(song)).join("") : `<p class="empty">No favorite songs yet.</p>`;
  playlistGrid.innerHTML = playlistSongs.length ? playlistSongs.map(song => songCard(song, true)).join("") : `<p class="empty">Your playlist is empty.</p>`;
  recentGrid.innerHTML = recentSongs.length ? recentSongs.map(song => songCard(song)).join("") : `<p class="empty">No recently played songs yet.</p>`;
}

function updateStats() {
  document.getElementById("likedCount").textContent = favorites.length;
  document.getElementById("playedCount").textContent = recent.length;
}

function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${min}:${sec}`;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1800);
}

playBtn.addEventListener("click", togglePlay);
nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);
favoriteBtn.addEventListener("click", () => toggleFavorite());
document.getElementById("heroPlay").addEventListener("click", () => playSong(0));

document.getElementById("shuffleBtn").addEventListener("click", () => {
  shuffle = !shuffle;
  showToast(shuffle ? "Shuffle On" : "Shuffle Off");
});

document.getElementById("repeatBtn").addEventListener("click", () => {
  repeat = !repeat;
  showToast(repeat ? "Repeat On" : "Repeat Off");
});

audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;
  progressBar.value = (audio.currentTime / audio.duration) * 100;
  currentTimeEl.textContent = formatTime(audio.currentTime);
  durationEl.textContent = formatTime(audio.duration);
});

progressBar.addEventListener("input", () => {
  if (!audio.duration) return;
  audio.currentTime = (progressBar.value / 100) * audio.duration;
});

volumeSlider.addEventListener("input", () => {
  audio.volume = volumeSlider.value;
  muteBtn.textContent = audio.volume == 0 ? "🔇" : "🔊";
});

muteBtn.addEventListener("click", () => {
  audio.muted = !audio.muted;
  muteBtn.textContent = audio.muted ? "🔇" : "🔊";
});

audio.addEventListener("ended", () => {
  if (repeat) {
    audio.currentTime = 0;
    audio.play();
  } else {
    nextSong();
  }
});

audio.addEventListener("waiting", () => showToast("Loading audio..."));
audio.addEventListener("error", () => showToast("Audio failed to load"));

searchInput.addEventListener("input", renderSongs);

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");
  const isLight = document.body.classList.contains("light");
  themeBtn.textContent = isLight ? "🌙 Dark" : "☀️ Light";
  localStorage.setItem("theme", isLight ? "light" : "dark");
});

document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    document.querySelectorAll(".view").forEach(view => view.classList.remove("active-view"));
    document.getElementById(`${btn.dataset.view}View`).classList.add("active-view");
  });
});

document.addEventListener("keydown", event => {
  if (event.target.tagName === "INPUT") return;

  if (event.code === "Space") {
    event.preventDefault();
    togglePlay();
  }

  if (event.key === "ArrowRight") nextSong();
  if (event.key === "ArrowLeft") prevSong();

  if (event.key === "ArrowUp") {
    event.preventDefault();
    audio.volume = Math.min(1, audio.volume + 0.05);
    volumeSlider.value = audio.volume;
  }

  if (event.key === "ArrowDown") {
    event.preventDefault();
    audio.volume = Math.max(0, audio.volume - 0.05);
    volumeSlider.value = audio.volume;
  }
});

init();
