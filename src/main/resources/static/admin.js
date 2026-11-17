
async function loadDashboard() {
    try {
        const response = await fetch("/api/admin/dashboard");

        if (!response.ok) {
            throw new Error("Dashboard loading failed");
        }

        const data = await response.json();

        document.getElementById("dashboardStats").innerHTML = `
            <div class="movie-card">
                <h3>Total Movies</h3>
                <h2>${data.totalMovies}</h2>
            </div>

            <div class="movie-card">
                <h3>Total Theatres</h3>
                <h2>${data.totalTheatres}</h2>
            </div>

            <div class="movie-card">
                <h3>Total Showtimes</h3>
                <h2>${data.totalShowtimes}</h2>
            </div>

            <div class="movie-card">
                <h3>Total Bookings</h3>
                <h2>${data.totalBookings}</h2>
            </div>

            <div class="movie-card">
                <h3>Total Users</h3>
                <h2>${data.totalUsers}</h2>
            </div>
        `;

    } catch (error) {
        document.getElementById("dashboardStats").innerHTML =
            "<p>Unable to load dashboard.</p>";
    }
}

async function loadAdminBookings() {
    try {
        const response = await fetch("/api/bookings");

        if (!response.ok) {
            throw new Error("Unable to load bookings");
        }

        const bookings = await response.json();
        const container = document.getElementById("adminBookings");

        if (bookings.length === 0) {
            container.innerHTML = "<p>No bookings available yet.</p>";
            return;
        }

        container.innerHTML = bookings.map(booking => `
            <div class="movie-card">
                <h3>Booking #${booking.bookingId}</h3>
                <p>Customer: ${booking.user.name}</p>
                <p>Movie: ${booking.showtime.movie.title}</p>
                <p>Amount: ₹${booking.totalAmount}</p>
                <p>Status: ${booking.bookingStatus}</p>
            </div>
        `).join("");

    } catch (error) {
        document.getElementById("adminBookings").innerHTML =
            "<p>Unable to load bookings.</p>";
    }
}

loadDashboard();
loadAdminBookings();
