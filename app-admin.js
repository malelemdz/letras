// URL de la base de datos
const baseUrl = 'http://localhost:3000/songs';

// Selección de elementos del DOM
const form = document.getElementById('song-form');
const titleInput = document.getElementById('title');
const artistInput = document.getElementById('artist');
const keyInput = document.getElementById('key');
const bpmInput = document.getElementById('bpm');
const youtubeInput = document.getElementById('youtube');
const notesInput = document.getElementById('notes');
const lyricsInput = document.getElementById('lyrics');
const searchResultsContainer = document.getElementById('search-results-container');
const searchInput = document.getElementById('search-input');

// Ajustar textarea automáticamente
document.querySelectorAll('textarea').forEach(textarea => {
    textarea.style.overflow = 'hidden';
    textarea.style.resize = 'none';
    textarea.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
    });
});

// Función para buscar canciones
function searchSongs() {
    const query = searchInput.value.trim().toLowerCase();

    // Limpiar resultados si no hay búsqueda
    if (!query) {
        searchResultsContainer.innerHTML = ''; // Limpiar la vista
        return;
    }

    // Buscar canciones desde la base de datos
    fetch(baseUrl)
        .then(response => response.json())
        .then(songs => {
            const filteredSongs = songs.filter(song =>
                song.title.toLowerCase().includes(query) ||
                song.artist.toLowerCase().includes(query) ||
                song.key.toLowerCase().includes(query)
            );

            if (filteredSongs.length === 0) {
                searchResultsContainer.innerHTML = '<p>No se encontraron canciones.</p>';
            } else {
                renderSongs(filteredSongs);
            }
        })
        .catch(error => console.error('Error al buscar canciones:', error));
}

// Función para mostrar canciones en la interfaz
function renderSongs(songs) {
    searchResultsContainer.innerHTML = ''; // Limpiar los resultados anteriores

    songs.forEach(song => {
        const songElement = document.createElement('div');
        songElement.classList.add('song-item');
        songElement.innerHTML = `
            <h3>${song.title} - ${song.artist}</h3>
            <div class="actions">
                <button class="edit-button" onclick="editSong('${song.id}')">
                    <i class="fas fa-pencil-alt"></i>
                </button>
                <button class="delete-button" onclick="deleteSong('${song.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        searchResultsContainer.appendChild(songElement);
    });
}

// Función para agregar una canción
function addSong(song) {
    fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(song)
    })
    .then(() => {
        searchSongs(); // Volver a ejecutar la búsqueda para mostrar la nueva canción
        clearForm();
    })
    .catch(error => console.error('Error al agregar canción:', error));
}

// Función para cargar datos de una canción en el formulario
function editSong(id) {
    fetch(`${baseUrl}/${id}`)
        .then(response => response.json())
        .then(song => {
            titleInput.value = song.title;
            artistInput.value = song.artist;
            keyInput.value = song.key;
            bpmInput.value = song.bpm;
            youtubeInput.value = song.youtube;
            notesInput.value = song.notes;
            lyricsInput.value = song.lyrics;
            form.setAttribute('data-id', song.id);
        })
        .catch(error => console.error('Error al cargar datos de la canción:', error));
}

// Función para actualizar canción
function updateSong(id, song) {
    fetch(`${baseUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(song)
    })
    .then(() => {
        searchSongs(); // Volver a ejecutar la búsqueda después de la actualización
        clearForm();
    })
    .catch(error => console.error('Error al actualizar canción:', error));
}

// Función para eliminar canción
function deleteSong(id) {
    if (confirm('¿Estás seguro de que deseas eliminar esta canción?')) {
        fetch(`${baseUrl}/${id}`, { method: 'DELETE' })
            .then(() => searchSongs()) // Volver a ejecutar la búsqueda después de eliminar
            .catch(error => console.error('Error al eliminar canción:', error));
    }
}

// Función para limpiar el formulario
function clearForm() {
    form.reset();
    form.removeAttribute('data-id');
}

// Manejo del formulario (agregar o actualizar canción)
form.addEventListener('submit', (event) => {
    event.preventDefault();

    const song = {
        title: titleInput.value.trim(),
        artist: artistInput.value.trim(),
        key: keyInput.value.trim(),
        bpm: bpmInput.value.trim(),
        youtube: youtubeInput.value.trim(),
        notes: notesInput.value.trim(),
        lyrics: lyricsInput.value.trim()
    };

    const songId = form.getAttribute('data-id');
    songId ? updateSong(songId, song) : addSong(song);
});

// Evento para limpiar el formulario
const clearButton = document.getElementById('clear-fields');
if (clearButton) clearButton.addEventListener('click', clearForm);

// Evento de búsqueda
searchInput.addEventListener('input', searchSongs);
