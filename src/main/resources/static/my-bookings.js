const bookingList = document.getElementById("bookingList");

// Demo customer ID
const userId = 1;

async function loadBookings() {
    try {
        const response = await fetch(`/api/my-bookings/${userId}`);

        if (!response.ok) {
            throw new Error("Unable to load bookings");
        }

        const bookings = await response.json();

        // Display only confirmed bookings
        const activeBookings = bookings.filter(
            booking => booking.bookingStatus === "CONFIRMED"
        );

        if (activeBookings.length === 0) {
            bookingList.innerHTML = "<p>You have no active bookings.</p>";
            return;
        }

        bookingList.innerHTML = activeBookings.map(booking => `
            <div class="movie-card">
                <h2>Booking #${booking.bookingId}</h2>
                <p>Movie: ${booking.showtime.movie.title}</p>
                <p>Theatre: ${booking.showtime.screen.theatre.theatreName}</p>
                <p>Date: ${booking.showtime.showDate}</p>
                <p>Time: ${booking.showtime.showTime}</p>
                <p>Total: ₹${booking.totalAmount}</p>
                <p>Status: ${booking.bookingStatus}</p>

                <button onclick="cancelBooking(${booking.bookingId})">
                    Cancel Booking
                </button>
            </div>
        `).join("");

    } catch (error) {
        bookingList.innerHTML =
            "<p>Could not load bookings. Please try again.</p>";
        console.error(error);
    }
}

async function cancelBooking(bookingId) {
    if (!confirm("Are you sure you want to cancel this booking?")) {
        return;
    }

    try {
        const response = await fetch(
            `/api/bookings/${bookingId}/cancel?userId=${userId}`,
            { method: "PUT" }
        );

        if (!response.ok) {
            throw new Error("Cancellation failed");
        }

        alert("Booking cancelled successfully!");

        // Reload the page data
        await loadBookings();

    } catch (error) {
        alert(error.message);
    }
}

loadBookings();