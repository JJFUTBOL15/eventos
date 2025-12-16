const API_KEY = "936410eebae74f9895643e085cc4a740";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p/w500";
const container = document.getElementById("genresContainer");

// IDs de géneros que queremos mostrar (según TMDB)
const GENRE_IDS = {
  28: "Acción",
  35: "Comedia",
  27: "Terror",
  18: "Drama",
  878: "Ciencia Ficción",
  10749: "Romance",
  16: "Animación",
  53: "Thriller"
};

// Cargar géneros y películas
async function loadGenresAndMovies() {
  for (const [id, name] of Object.entries(GENRE_IDS)) {
    const section = document.createElement("section");
    section.className = "genre-section";

    section.innerHTML = `
      <h2 class="genre-title">${name}</h2>
      <div class="movies-grid" id="grid-${id}"></div>
    `;
    container.appendChild(section);

    // Cargar películas del género
    await fetchMoviesByGenre(id, `grid-${id}`);
  }
}

async function fetchMoviesByGenre(genreId, gridId) {
  try {
    const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&language=es-ES&sort_by=popularity.desc&page=1`;
    const res = await fetch(url);
    const data = await res.json();

    const grid = document.getElementById(gridId);
    if (grid && data.results) {
      data.results.slice(0, 10).forEach(movie => {
        const card = document.createElement("div");
        card.className = "movie-card";
        card.onclick = () => window.location.href = `movie.html?id=${movie.id}`;

        const poster = movie.poster_path
          ? IMG_BASE + movie.poster_path
          : "https://via.placeholder.com/150x220/222/aaa?text=Sin+poster";

        card.innerHTML = `
          <img class="movie-poster" src="${poster}" alt="${movie.title}" loading="lazy" />
          <div class="movie-title">${movie.title}</div>
        `;
        grid.appendChild(card);
      });
    }
  } catch (err) {
    console.error("Error al cargar películas del género", genreId, err);
  }
}

// Iniciar
loadGenresAndMovies();
