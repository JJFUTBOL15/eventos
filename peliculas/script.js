const API_BASE = "https://api.noctiflix.lat/p";
const container = document.getElementById("moviesContainer");
const searchInput = document.getElementById("searchInput");

// Función para cargar películas (ajusta el endpoint según lo que realmente ofrezca la API)
async function fetchMovies(query = "") {
  try {
    // Ejemplo de endpoint hipotético. Cámbialo si conoces el real:
    const url = query
      ? `${API_BASE}/search?q=${encodeURIComponent(query)}`
      : `${API_BASE}/trending`;

    const response = await fetch(url);
    const data = await response.json();

    // Asumimos que el formato incluye { id, title, poster_path }
    displayMovies(data.results || data);
  } catch (error) {
    console.error("Error al cargar películas:", error);
    container.innerHTML = "<p>No se pudieron cargar las películas.</p>";
  }
}

function displayMovies(movies) {
  container.innerHTML = "";
  movies.slice(0, 20).forEach(movie => {
    const card = document.createElement("div");
    card.className = "movie-card";

    // Si la API usa TMDB, los posters suelen estar en: https://image.tmdb.org/t/p/w500/
    const posterPath = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "https://via.placeholder.com/160x240?text=Sin+poster";

    card.innerHTML = `
      <img class="movie-poster" src="${posterPath}" alt="${movie.title || movie.name}" />
      <div class="movie-title">${movie.title || movie.name}</div>
    `;
    container.appendChild(card);
  });
}

// Evento de búsqueda
searchInput.addEventListener("input", (e) => {
  fetchMovies(e.target.value);
});

// Cargar al inicio
fetchMovies();
