# CineVerse Frontend

The web frontend for **CineVerse**, a movie discovery application. Users can filter movies by genre, browse results with infinite scrolling, and view detailed movie information.

## Features

* **Dynamic Genre Filtering:** Fetches available genres from the backend and lets users select one or multiple genres to search for movies.
* **Infinite Scroll Pagination:** Loads paginated movie results from the backend and automatically fetches more titles as the user scrolls down.
* **Movie Details Modal:** Displays release date, runtime, tagline, user ratings, and plot overview when a user clicks on any movie poster.

## Screenshots

### 1. Genre Selection
<img width="1485" height="684" alt="CineVerse genre selection screen" src="https://github.com/user-attachments/assets/a6007c57-ac7b-431e-b8bc-f663a80c7c8f" />

### 2. Movie Discovery Grid
<img width="1787" height="857" alt="CineVerse movie poster grid" src="https://github.com/user-attachments/assets/2d0d3afa-0df2-448f-947a-b52cc363839b" />

### 3. Movie Details View
<img width="1847" height="825" alt="CineVerse movie details modal showing The Batman" src="https://github.com/user-attachments/assets/5be556ba-3b3c-4cf0-89c3-f4b34d30521b" />

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/nirmalrv8/cineverse-frontend.git
   cd cineverse-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the root directory and add your backend API URL:
   ```env
   VITE_API_BASE_URL="http://localhost:3000/api"
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
