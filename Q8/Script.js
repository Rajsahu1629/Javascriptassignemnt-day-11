const key = "bd193a1b";
let currentPage = 1;
let totalPages = 1;
let searchQuery = "";

async function fetchMovieData(query, page) {
    try {
        let res = await fetch(`http://www.omdbapi.com/?apikey=${key}&s=${encodeURIComponent(query)}&page=${page}`);
        let data = await res.json();
        if (data.Response === "True") {
            const movies = data.Search;
            totalPages = Math.ceil(data.totalResults / 10);
            const moviePromises = movies.map(movie => 
                fetch(`http://www.omdbapi.com/?apikey=${key}&i=${movie.imdbID}`).then(res => res.json())
            );
            const movieDetails = await Promise.all(moviePromises);
            displayMovies(movieDetails);
        } else {
            document.getElementById('movie-container').innerHTML = `<p>No movies found or an error occurred.</p>`;
        }
        updatePaginationControls();
    } catch (error) {
        console.error("Error fetching movie data:", error);
    }
}

function displayMovies(movies) {
    const movieContainer = document.getElementById('movie-container');
    movieContainer.innerHTML = "";

    movies.forEach(movie => {
        const { Title, Poster, Ratings, Rated, Released, Runtime, Genre, Director, Writer, Actors, Plot } = movie;
        const rating = Ratings.length > 0 ? Ratings[0].Value : "N/A";
        
        movieContainer.innerHTML += `
            <div class="movie-card">
                <div class="movie-card-inner">
                    <div class="movie-card-front">
                        <img src="${Poster}" alt="${Title} Poster">
                        <h3>${Title}</h3>
                        <p><strong>Rating:</strong> ${rating}</p>
                    </div>
                    <div class="movie-card-back">
                        <p><strong>Rated:</strong> ${Rated}</p>
                        <p><strong>Released:</strong> ${Released}</p>
                        <p><strong>Runtime:</strong> ${Runtime}</p>
                        <p><strong>Genre:</strong> ${Genre}</p>
                        <p><strong>Director:</strong> ${Director}</p>
                        <p><strong>Writer:</strong> ${Writer}</p>
                        <p><strong>Actors:</strong> ${Actors}</p>
                        <p><strong>Plot:</strong> ${Plot}</p>
                    </div>
                </div>
            </div>
        `;
    });
}
//if you are in first page then all button are dispklay non
function updatePaginationControls() {
    const pagination = document.getElementById('pagination');
    if (searchQuery) {
        pagination.style.display = 'block'; // Show pagination buttons if there's a search query
        document.getElementById('prev-btn').disabled = currentPage === 1;
        document.getElementById('next-btn').disabled = currentPage === totalPages;
    } else {
        pagination.style.display = 'none'; // Hide pagination if no search query
    }
}

function searchMovie() {
    searchQuery = document.getElementById('search-input').value;
    if (searchQuery) {
        currentPage = 1;
        fetchMovieData(searchQuery, currentPage);
    } else {
        alert('Please enter a movie title.');
    }
}

function changePage(direction) {
    const newPage = currentPage + direction;
    if (newPage > 0 && newPage <= totalPages) {
        currentPage = newPage;
        fetchMovieData(searchQuery, currentPage);
    }
}


// Initial page data — When you haven't searched for anything and when you open the website, random data will be shown.

async function fetchRandomMovie() {
    const randomQuery = "Avengers";
    await fetchMovieData(randomQuery, currentPage);
}

fetchRandomMovie();
