
const params = new URLSearchParams(window.location.search);

const movie = params.get("movie");
const theatre = params.get("theatre");

const dateInput = document.getElementById("showDate");
const timeOptions = document.getElementById("timeOptions");
const continueButton = document.getElementById("continueButton");

let allShowtimes = [];
let selectedShowtime = null;

function formatTime(time) {
    const [hour, minute] = time.split(":");
    const h = Number(hour);
    const suffix = h >= 12 ? "PM" : "AM";
    const displayHour = h % 12 || 12;

    return displayHour + ":" + minute + " " + suffix;
}

async function loadShowtimes() {
    try {
        const response = await fetch("/api/showtimes");

        if (!response.ok) {
            throw new Error("Could not load showtimes");
        }

        allShowtimes = await response.json();

        const matchingShowtimes = allShowtimes.filter(show => {
            return show.movie.title === movie &&
                   show.screen.theatre.theatreName === theatre;
        });

        if (matchingShowtimes.length === 0) {
            timeOptions.textContent = "No showtimes available for this movie and theatre.";
            return;
        }

        const dates = [...new Set(
            matchingShowtimes.map(show => show.showDate)
        )].sort();

        dateInput.min = new Date().toLocaleDateString("en-CA");
        dateInput.value = dates[0];

        displayShowtimes();
    } catch (error) {
        timeOptions.textContent = "Error loading showtimes. Please try again.";
        console.error(error);
    }
}

function displayShowtimes() {
    selectedShowtime = null;
    continueButton.disabled = true;
    timeOptions.innerHTML = "";

    const selectedDate = dateInput.value;

    const filtered = allShowtimes.filter(show => {
        return show.movie.title === movie &&
               show.screen.theatre.theatreName === theatre &&
               show.showDate === selectedDate;
    });

    if (filtered.length === 0) {
        timeOptions.textContent = "No shows available on this date.";
        return;
    }

    filtered.forEach(show => {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = formatTime(show.showTime);

        button.addEventListener("click", function() {
            document.querySelectorAll("#timeOptions button")
                .forEach(btn => btn.classList.remove("active"));

            button.classList.add("active");
            selectedShowtime = show;
            continueButton.disabled = false;
        });

        timeOptions.appendChild(button);
    });
}

dateInput.addEventListener("change", displayShowtimes);

continueButton.disabled = true;

continueButton.addEventListener("click", function() {
    if (!selectedShowtime) {
        alert("Please select a showtime.");
        return;
    }

    const url = new URL("booking.html", window.location.href);

    url.searchParams.set("movie", movie);
    url.searchParams.set("theatre", theatre);
    url.searchParams.set("date", selectedShowtime.showDate);
    url.searchParams.set("time", formatTime(selectedShowtime.showTime));
    url.searchParams.set("showtimeId", selectedShowtime.showtimeId);
    url.searchParams.set("screenId", selectedShowtime.screen.screenId);

    window.location.href = url.toString();
});

loadShowtimes();
