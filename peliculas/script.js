const API_KEY = "936410eebae74f9895643e085cc4a740";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p/w1280";

// Inicializar Mi Lista desde localStorage
let myList = JSON.parse(localStorage.getItem("myList")) || [];

window.onload = async () => {
  await loadTrendingCarousel();
  await loadSections();
  setupSearch();
  updateMyListCount();
};

// Cargar carrusel de películas de 2025 (aleatorias)
async function loadTrendingCarousel() {
  try {
    // Obtenemos películas de 2025, ordenadas por popularidad
    const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=es-ES&primary_release_year=2025&sort_by=popularity.desc&page=1`;
    const res = await fetch(url);
    const data = await res.json();

    // Mezclamos aleatoriamente y tomamos 40
    const shuffled = [...data.results].sort(() => 0.5 - Math.random()).slice(0, 40);

    const carousel = document.getElementById("trendingCarousel");
    carousel.innerHTML = "";

    shuffled.forEach(movie => {
      const slide = document.createElement("div");
      slide.className = "hero-slide";
      slide.style.backgroundImage = `url(${IMG_BASE}${movie.backdrop_path})`;

      slide.innerHTML = `
        <div class="hero-content">
          <h1 class="hero-title">${movie.title}</h1>
          <p class="hero-desc">${movie.overview.substring(0, 150)}...</p>
          <div class="hero-btns">
            <button class="hero-btn btn-play" onclick="goToDetails(${movie.id}, 'movie')">▶ Ver ahora</button>
            <button class="hero-btn btn-info" onclick="goToDetails(${movie.id}, 'movie')">+ Info</button>
          </div>
        </div>
      `;
      carousel.appendChild(slide);
    });
  } catch (err) {
    console.error("Error en carrusel", err);
  }
}

// Cargar secciones por género + Recién Añadidas
async function loadSections() {
  const genres = [
    { id: 28, name: "Acción" },
    { id: 27, name: "Terror" },
    { id: 35, name: "Comedia" },
    { id: 18, name: "Drama" },
    { id: 878, name: "Ciencia Ficción" },
    { id: 10749, name: "Romance" },
    { id: 16, name: "Animación" },
    { id: 53, name: "Thriller" },
    { id: 10751, name: "Familia" },
    { id: 10759, name: "Acción & Aventura" },
    { id: "recent", name: "Recién Añadidas" } // Nueva sección
  ];

  const container = document.getElementById("sectionsContainer");

  for (const genre of genres) {
    const section = document.createElement("section");
    section.className = "section";
    
    if (genre.id === "recent") {
      section.innerHTML = `
        <h2>${genre.name}</h2>
        <div class="category-slider" id="slider-recent"></div>
      `;
    } else {
      section.innerHTML = `
        <h2>${genre.name}</h2>
        <div class="category-slider" id="slider-${genre.id}"></div>
      `;
    }
    container.appendChild(section);

    if (genre.id === "recent") {
      await loadRecentMovies(`slider-recent`);
    } else {
      await loadMoviesByGenre(genre.id, `slider-${genre.id}`);
    }
  }
}

// Cargar películas por género (hasta 40)
async function loadMoviesByGenre(genreId, sliderId) {
  try {
    const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&language=es-ES&sort_by=popularity.desc&page=1`;
    const res = await fetch(url);
    const data = await res.json();

    const slider = document.getElementById(sliderId);
    slider.innerHTML = "";

    // Mostrar hasta 40 películas
    (data.results || []).slice(0, 40).forEach(movie => {
      const card = document.createElement("div");
      card.className = "movie-card";
      card.onclick = () => goToDetails(movie.id, 'movie');

      const poster = movie.poster_path ? IMG_BASE + movie.poster_path : "https://via.placeholder.com/200x280/222/aaa?text=—";
      const isFavorite = myList.some(item => item.id === movie.id && item.type === 'movie');

      card.innerHTML = `
        <img class="poster" src="${poster}" alt="${movie.title}" loading="lazy" />
        <div class="card-title">${movie.title}</div>
        <button class="favorite-btn" onclick="toggleFavorite(event, ${movie.id}, 'movie')">
          ${isFavorite ? "❤️" : "♡"}
        </button>
      `;
      slider.appendChild(card);
    });
  } catch (err) {
    console.error("Error al cargar género", genreId, err);
  }
}

// Cargar películas recientemente añadidas (más recientes)
async function loadRecentMovies(sliderId) {
  try {
    // Películas más recientes (por fecha de lanzamiento)
    const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=es-ES&sort_by=release_date.desc&page=1`;
    const res = await fetch(url);
    const data = await res.json();

    const slider = document.getElementById(sliderId);
    slider.innerHTML = "";

    // Mostrar hasta 40 películas más recientes
    (data.results || []).slice(0, 40).forEach(movie => {
      const card = document.createElement("div");
      card.className = "movie-card";
      card.onclick = () => goToDetails(movie.id, 'movie');

      const poster = movie.poster_path ? IMG_BASE + movie.poster_path : "https://via.placeholder.com/200x280/222/aaa?text=—";
      const isFavorite = myList.some(item => item.id === movie.id && item.type === 'movie');

      card.innerHTML = `
        <img class="poster" src="${poster}" alt="${movie.title}" loading="lazy" />
        <div class="card-title">${movie.title}</div>
        <button class="favorite-btn" onclick="toggleFavorite(event, ${movie.id}, 'movie')">
          ${isFavorite ? "❤️" : "♡"}
        </button>
      `;
      slider.appendChild(card);
    });
  } catch (err) {
    console.error("Error al cargar películas recientes", err);
  }
}

// Búsqueda
function setupSearch() {
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");

  searchBtn.onclick = () => {
    const query = searchInput.value.trim();
    if (query) {
      window.location.href = `search.html?q=${encodeURIComponent(query)}`;
    }
  };

  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      searchBtn.click();
    }
  });
}

// Ir a detalles
function goToDetails(id, type) {
  window.location.href = `details.html?id=${id}&type=${type}`;
}

// Añadir/quitar de Mi Lista
function toggleFavorite(e, id, type) {
  e.stopPropagation();

  const index = myList.findIndex(item => item.id === id && item.type === type);

  if (index === -1) {
    myList.push({ id, type });
  } else {
    myList.splice(index, 1);
  }

  localStorage.setItem("myList", JSON.stringify(myList));
  updateMyListCount();
  // Actualizar botón
  const btn = e.target;
  btn.textContent = myList.some(item => item.id === id && item.type === type) ? "❤️" : "♡";
}

function updateMyListCount() {
  const myListLink = document.getElementById("myListLink");
  myListLink.textContent = `Mi Lista (${myList.length})`;
}

// Evento para Mi Lista
document.getElementById("myListLink").onclick = (e) => {
  e.preventDefault();
  if (myList.length === 0) {
    alert("Tu lista está vacía.");
    return;
  }
  window.location.href = `mylist.html`;
};
