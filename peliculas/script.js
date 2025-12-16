const API_KEY = "936410eebae74f9895643e085cc4a740";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p/w500";

// Géneros para películas y series
const MOVIE_GENRES = { 28: "Acción", 35: "Comedia", 27: "Terror", 18: "Drama", 878: "Ciencia Ficción" };
const TV_GENRES = { 10759: "Acción y Aventura", 35: "Comedia", 80: "Crimen", 18: "Drama", 10765: "Sci-Fi y Fantasía" };

// Cargar todo
window.onload = async () => {
  await loadHighlightCarousel();
  await loadSection(MOVIE_GENRES, "moviesGenres", "movie");
  await loadSection(TV_GENRES, "showsGenres", "tv");
};

// Carrusel: películas de 2025
async function loadHighlightCarousel() {
  try {
    const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=es-ES&primary_release_year=2025&sort_by=popularity.desc&page=1`;
    const res = await fetch(url);
    const data = await res.json();
    const carousel = document.getElementById("highlightCarousel");
    carousel.innerHTML = "";

    (data.results || []).slice(0, 12).forEach(movie => {
      const card = document.createElement("div");
      card.className = "highlight-card";
      card.onclick = () => window.location.href = `movie.html?id=${movie.id}`;
      card.innerHTML = `
        <img class="highlight-poster" src="${IMG_BASE}${movie.poster_path}" alt="${movie.title}" loading="lazy" />
        <div class="highlight-title">${movie.title}</div>
      `;
      carousel.appendChild(card);
    });
  } catch (err) {
    console.error("Error en carrusel", err);
  }
}

// Cargar secciones genéricas (películas o series)
async function loadSection(genres, containerId, mediaType) {
  const container = document.getElementById(containerId);
  for (const [id, name] of Object.entries(genres)) {
    const section = document.createElement("section");
    section.className = "genre-section";
    const gridId = `grid-${mediaType}-${id}`;

    section.innerHTML = `
      <h2 class="genre-title">${name}</h2>
      <div class="${mediaType === 'movie' ? 'movies-grid' : 'shows-grid'}" id="${gridId}"></div>
    `;
    container.appendChild(section);

    await fetchByGenre(id, gridId, mediaType);
  }
}

async function fetchByGenre(genreId, gridId, mediaType) {
  try {
    const isMovie = mediaType === "movie";
    const url = `${BASE_URL}/discover/${isMovie ? 'movie' : 'tv'}?api_key=${API_KEY}&with_genres=${genreId}&language=es-ES&sort_by=popularity.desc&page=1`;
    const res = await fetch(url);
    const data = await res.json();

    const grid = document.getElementById(gridId);
    if (!grid) return;

    (data.results || []).slice(0, 20).forEach(item => {
      const card = document.createElement("div");
      card.className = isMovie ? "movie-card" : "show-card";
      card.onclick = () => window.location.href = `${isMovie ? 'movie' : 'show'}.html?id=${item.id}`;

      const poster = item.poster_path ? IMG_BASE + item.poster_path : "https://via.placeholder.com/140x200/222/aaa?text=—";
      const title = item.title || item.name || "—";

      card.innerHTML = `
        <img class="${isMovie ? 'movie-poster' : 'show-poster'}" src="${poster}" alt="${title}" loading="lazy" />
        <div class="${isMovie ? 'movie-title' : 'show-title'}">${title}</div>
      `;
      grid.appendChild(card);
    });
  } catch (err) {
    console.error("Error al cargar género", genreId, err);
  }
}
