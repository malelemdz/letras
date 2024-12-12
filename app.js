const BASE_URL = "http://localhost:3000/songs";

const searchInput = document.getElementById("searchInput");
const indexContainer = document.getElementById("indexContainer");
const songContainer = document.getElementById("songContainer");
const songContent = document.getElementById("songContent");
const transposeSelect = document.getElementById("transposeSelect");

let allSongs = [];

// Fetch songs from JSON Server
async function fetchSongs() {
    try {
        const response = await fetch(BASE_URL);
        allSongs = await response.json();
        displaySongs(allSongs);
    } catch (error) {
        console.error("Error fetching songs:", error);
    }
}

// Display search results
function displaySongs(songs) {
    indexContainer.innerHTML = songs.map(song => `
        <div class="song-item" onclick="displaySong('${song.id}')">
            <h3>${song.title}</h3>
            <p>${song.artist}</p>
        </div>
    `).join("");
}

// Display a specific song
async function displaySong(id) {
    try {
        const response = await fetch(`${BASE_URL}/${id}`);
        const song = await response.json();

        indexContainer.style.display = "none";
        songContainer.style.display = "block";
        songContent.innerHTML = `
            <h2>${song.title}</h2>
            <h3>${song.artist}</h3>
            <pre>${song.lyrics}</pre>
        `;

        populateTransposeOptions();
        transposeSelect.value = "0";
        transposeSelect.onchange = () => {
            const transposeValue = parseInt(transposeSelect.value, 10);
            const transposedLyrics = transposeChords(song.lyrics, transposeValue);
            songContent.querySelector("pre").textContent = transposedLyrics;
        };
    } catch (error) {
        console.error("Error fetching song:", error);
    }
}

// Populate transpose options
function populateTransposeOptions() {
    const options = [];
    for (let i = -6; i <= 6; i++) {
        const label = i === 0 ? "Tono Original" : (i > 0 ? `+${i}` : `${i}`);
        options.push(`<option value="${i}">${label}</option>`);
    }
    transposeSelect.innerHTML = options.join("");
}

// Transpose chords
function transposeChords(lyrics, steps) {
    const chords = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    return lyrics.replace(/\[([A-G]#?|[A-G]m?)\]/g, (match, chord) => {
        const isMinor = chord.endsWith("m");
        const baseChord = isMinor ? chord.slice(0, -1) : chord;
        const index = chords.indexOf(baseChord);
        if (index === -1) return match;
        const newIndex = (index + steps + chords.length) % chords.length;
        return `[${chords[newIndex]}${isMinor ? "m" : ""}]`;
    });
}

// Show the song list view
function showIndex() {
    indexContainer.style.display = "block";
    songContainer.style.display = "none";
}

// Real-time search functionality
searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const filteredSongs = allSongs.filter(song =>
        song.title.toLowerCase().includes(query) || song.artist.toLowerCase().includes(query)
    );
    displaySongs(filteredSongs);
});

// Event listener for the back button
document.querySelector(".back-button").addEventListener("click", showIndex);

// Fetch songs on page load
fetchSongs();
