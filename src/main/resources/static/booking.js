
const params = new URLSearchParams(window.location.search);

const movie = params.get("movie") || "Movie not selected";
const theatre = params.get("theatre") || "Theatre not selected";
const date = params.get("date") || "Date not selected";
const time = params.get("time") || "Time not selected";

const showtimeId = params.get("showtimeId");
const screenId = params.get("screenId");

let selectedSeats = [];
let allSeats = [];

document.getElementById("movieName").textContent = movie;
document.getElementById("theatreName").textContent = theatre;
document.getElementById("showDate").textContent = "Date: " + date;
document.getElementById("showTime").textContent = "Showtime: " + time;

const categories = {
    Premium: {
        id: "premiumSeats",
        price: 300
    },
    Gold: {
        id: "goldSeats",
        price: 220
    },
    Silver: {
        id: "silverSeats",
        price: 150
    }
};

// Load real seats from MySQL
async function loadSeats() {
    try {
        if (!showtimeId || !screenId) {
            alert("Showtime information is missing. Please select your show again.");
            return;
        }

        const response = await fetch(
            `/api/seats/availability?screenId=${screenId}&showtimeId=${showtimeId}`
        );

        if (!response.ok) {
            throw new Error("Unable to load seats");
        }

        allSeats = await response.json();

        // Sort seats in natural order: A1, A2, A3 ... A11
        allSeats.sort((a, b) => {
            const rowA = a.seatNumber.charAt(0);
            const rowB = b.seatNumber.charAt(0);

            if (rowA !== rowB) {
                return rowA.localeCompare(rowB);
            }

            return Number(a.seatNumber.slice(1)) -
                   Number(b.seatNumber.slice(1));
        });

        displaySeats();

    } catch (error) {
        console.error(error);
        alert("Error loading seats. Please refresh the page.");
    }
}

// Display seats
function displaySeats() {
    Object.values(categories).forEach(category => {
        document.getElementById(category.id).innerHTML = "";
    });

    allSeats.forEach(seatData => {
        const category = categories[seatData.seatType];

        if (!category) return;

        const container = document.getElementById(category.id);

        const seatNumber = seatData.seatNumber;
        const seatRow = seatNumber.charAt(0);
        const seatColumn = Number(seatNumber.slice(1));

        // Add aisle after seat 4 and seat 8
        if (seatColumn === 5 || seatColumn === 9) {
            const aisle = document.createElement("span");
            aisle.className = "seat aisle";
            container.appendChild(aisle);
        }

        const seat = document.createElement("button");

        seat.type = "button";
        seat.className = "seat";
        seat.textContent = seatNumber;
        seat.dataset.seatId = seatData.seatId;
        seat.dataset.seat = seatNumber;
        seat.dataset.price = category.price;

        if (seatData.booked) {
            seat.classList.add("booked");
            seat.disabled = true;
        } else {
            seat.addEventListener("click", function() {
                toggleSeat(seat);
            });
        }

        container.appendChild(seat);
    });
}

// Select or unselect a seat
function toggleSeat(seat) {
    const seatId = Number(seat.dataset.seatId);
    const seatNumber = seat.dataset.seat;

    if (seat.classList.contains("selected")) {
        seat.classList.remove("selected");

        selectedSeats = selectedSeats.filter(item => {
            return item.id !== seatId;
        });

    } else {
        seat.classList.add("selected");

        selectedSeats.push({
            id: seatId,
            number: seatNumber,
            price: Number(seat.dataset.price)
        });
    }

    updateSummary();
}

// Update booking summary
function updateSummary() {
    const seatNames = selectedSeats.map(item => item.number);

    const total = selectedSeats.reduce((sum, item) => {
        return sum + item.price;
    }, 0);

    document.getElementById("selectedSeats").textContent =
        "Selected seats: " +
        (seatNames.length ? seatNames.join(", ") : "None");

    document.getElementById("seatCount").textContent =
        "Tickets: " + selectedSeats.length;

    document.getElementById("totalPrice").textContent =
        "Total: ₹" + total;
}

// Save booking in MySQL
document.getElementById("confirmBooking")
    .addEventListener("click", async function() {

        if (selectedSeats.length === 0) {
            alert("Please select at least one seat.");
            return;
        }

        const confirmButton = document.getElementById("confirmBooking");
        confirmButton.disabled = true;
        confirmButton.textContent = "Booking...";

        try {
            const bookingData = {
                userId: 1,
                showtimeId: Number(showtimeId),
                seatIds: selectedSeats.map(item => item.id)
            };

            const response = await fetch("/api/bookings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(bookingData)
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage || "Booking failed");
            }

            const result = await response.json();

            const seatNames = selectedSeats.map(item => item.number);
            const total = selectedSeats.reduce((sum, item) => {
                return sum + item.price;
            }, 0);

            alert(
                "CINEBOOK BOOKING CONFIRMED!\n\n" +
                "Booking ID: " + result.bookingId +
                "\nMovie: " + movie +
                "\nTheatre: " + theatre +
                "\nDate: " + date +
                "\nShowtime: " + time +
                "\nSeats: " + seatNames.join(", ") +
                "\nTotal Amount: ₹" + total
            );

            window.location.href = "my-bookings.html";

        } catch (error) {
            alert("Booking failed: " + error.message);
            confirmButton.disabled = false;
            confirmButton.textContent = "Confirm Booking";
        }
    });

// Start loading seats
loadSeats();
