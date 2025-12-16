const API_KEY = "936410eebae74f9895643e085cc4a740";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p/w1280";

window.onload = async () => {
  await loadTrendingCarousel();
  await loadMoviesSection();
  await loadSeriesSection();
};

async function loadTrendingCarousel() {
  try {
    const url = `${BASE_URL}/trending/movie/day?api_key=${API_KEY}&language=es-ES`;
    const res = await fetch(url);
    const data = await res.json();

    const carousel = document.getElementById("trendingCarousel");
    carousel.innerHTML = "";

    (data.results || []).slice(0, 3).forEach(movie => {
      const slide = document.createElement("div");
      slide.className = "hero-slide";
      slide.style.backgroundImage = `url(${IMG_BASE}${movie.backdrop_path})`;

      slide.innerHTML = `
        <div class="hero-content">
          <h1 class="hero-title">${movie.title}</h1>
          <p class="hero-desc">${movie.overview.substring(0, 150)}...</p>
          <div class="hero-btns">
            <button class="hero-btn btn-play" onclick="goToWatch(${movie.id})">▶ Ver ahora</button>
            <button class="hero-btn btn-info" onclick="showInfo(${movie.id})">+ Info</button>
          </div>
        </div>
      `;
      carousel.appendChild(slide);
    });
  } catch (err) {
    console.error("Error en carrusel", err);
  }
}

async function loadMoviesSection() {
  try {
    const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=es-ES&sort_by=popularity.desc&page=1`;
    const res = await fetch(url);
    const data = await res.json();

    const slider = document.getElementById("movieSlider");
    slider.innerHTML = "";

    (data.results || []).slice(0, 15).forEach(movie => {
      const card = document.createElement("div");
      card.className = "movie-card";
      card.onclick = () => goToWatch(movie.id);

      const poster = movie.poster_path
        ? IMG_BASE + movie.poster_path
        : "https://via.placeholder.com/200x280/222/aaa?text=—";

      card.innerHTML = `
        <img class="poster" src="${poster}" alt="${movie.title}" loading="lazy" />
        <div class="card-title">${movie.title}</div>
      `;
      slider.appendChild(card);
    });
  } catch (err) {
    console.error("Error en películas", err);
  }
}

async function loadSeriesSection() {
  try {
    const url = `${BASE_URL}/discover/tv?api_key=${API_KEY}&language=es-ES&sort_by=popularity.desc&page=1`;
    const res = await fetch(url);
    const data = await res.json();

    const slider = document.getElementById("seriesSlider");
    slider.innerHTML = "";

    (data.results || []).slice(0, 15).forEach(show => {
      const card = document.createElement("div");
      card.className = "show-card";
      card.onclick = () => goToWatch(show.id);

      const poster = show.poster_path
        ? IMG_BASE + show.poster_path
        : "https://via.placeholder.com/200x280/222/aaa?text=—";

      card.innerHTML = `
        <img class="poster" src="${poster}" alt="${show.name}" loading="lazy" />
        <div class="card-title">${show.name}</div>
      `;
      slider.appendChild(card);
    });
  } catch (err) {
    console.error("Error en series", err);
  }
}

function goToWatch(id) {
  window.location.href = `watch.html?id=${id}`;
}

function showInfo(id) {
  alert(`ID: ${id}`);
}
