
const searchInput = document.getElementById("searchInput");
const movieContainer = document.getElementById("movieContainer");
const noResults = document.getElementById("noResults");

// Search movies
searchInput.addEventListener("input", function () {
    const searchText = searchInput.value.toLowerCase();
    const movies = document.querySelectorAll(".movie-card");

    let found = 0;

    movies.forEach(function (movie) {
        const movieName = movie.querySelector("h3").textContent.toLowerCase();

        if (movieName.includes(searchText)) {
            movie.style.display = "block";
            found++;
        } else {
            movie.style.display = "none";
        }
    });

    noResults.hidden = found !== 0;
});

// Movie booking button
function bookMovie(movieName) {
    window.location.href =
        "theatres.html?movie=" + encodeURIComponent(movieName);
}