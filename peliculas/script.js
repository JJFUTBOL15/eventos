// Tu API Key de TMDB
const API_KEY = "936410eebae74f9895643e085cc4a740";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p/w500";

const container = document.getElementById("moviesContainer");
const searchInput = document.getElementById("searchInput");

// Cargar películas populares al iniciar
window.onload = () => fetchMovies();

// Buscar al escribir
searchInput.addEventListener("input", (e) => {
  fetchMovies(e.target.value);
});

async function fetchMovies(query = "") {
  try {
    let url;
    if (query.trim() === "") {
      // Películas populares en español
      url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=es-ES&page=1`;
    } else {
      // Búsqueda
      url = `${BASE_URL}/search/movie?api_key=${API_KEY}&language=es-ES&query=${encodeURIComponent(query)}&page=1`;
    }

    const res = await fetch(url);
    const data = await res.json();

    displayMovies(data.results || []);
  } catch (err) {
    console.error("Error:", err);
    container.innerHTML = `<p style="grid-column:1/-1; text-align:center; color:#ff6b6b;">⚠️ No se pudieron cargar las películas.</p>`;
  }
}

function displayMovies(movies) {
  container.innerHTML = "";
  if (movies.length === 0) {
    container.innerHTML = `<p style="grid-column:1/-1; text-align:center;">No se encontraron películas.</p>`;
    return;
  }

  movies.slice(0, 20).forEach(movie => {
    const card = document.createElement("div");
    card.className = "movie-card";

    const poster = movie.poster_path
      ? IMG_BASE + movie.poster_path
      : "https://via.placeholder.com/160x240/2d2d44/ffffff?text=Sin+imagen";

    const title = movie.title || movie.name || "Título desconocido";

    card.innerHTML = `
      <img class="movie-poster" src="${poster}" alt="${title}" loading="lazy" />
      <div class="movie-title">${title}</div>
    `;

    container.appendChild(card);
  });
}
