"use strict";
let allSongs = [];

document.addEventListener('DOMContentLoaded', () => {
    fetchSongs();

    const form = document.getElementById('add-song-form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    const cancelBtn = document.getElementById('cancel-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', resetForm);
    }

    const closeBtn = document.getElementById('close-modal-btn');
    const overlay = document.getElementById('modal-overlay');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });
    }
});

async function fetchSongs() {
    const container = document.getElementById('song-container');
    if (!container) return; 

    try {
        const response = await fetch('/api/songs');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const songs = await response.json();

        songs.sort((a, b) => a.id - b.id);
        allSongs = songs;
        
        const searchInput = document.getElementById('search-input');
        if (searchInput && searchInput.value) {
            handleSearch({ target: searchInput });
        } else {
            renderSongs(allSongs, container);
        }

    } catch (error) {
        console.error(error);
        container.innerHTML = '<p style="color:red;">Error loading data.</p>';
    }
}

function handleSearch(event) {
    const term = event.target.value.toLowerCase();
    const container = document.getElementById('song-container');

    const filteredSongs = allSongs.filter(song => {
        if (!song.title) return false;
        return song.title.toLowerCase().includes(term) || 
               song.year.toString().includes(term);
    });

    renderSongs(filteredSongs, container);
}

function startEdit(id) {
    const song = allSongs.find(s => s.id === id);
    if (!song) return;

    document.getElementById('edit-id').value = song.id;
    document.getElementById('title').value = song.title;
    document.getElementById('year').value = song.year;
    document.getElementById('url').value = song.url;

    document.getElementById('form-title').textContent = '楽曲を編集する';
    document.getElementById('submit-btn').textContent = '更新する';
    document.getElementById('cancel-btn').style.display = 'inline-block';

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetForm() {
    const form = document.getElementById('add-song-form');
    form.reset();
    document.getElementById('edit-id').value = '';
    
    document.getElementById('form-title').textContent = '楽曲を追加する';
    document.getElementById('submit-btn').textContent = 'リストに追加';
    document.getElementById('cancel-btn').style.display = 'none';
}

async function handleFormSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const editId = formData.get('edit-id') ? Number(formData.get('edit-id')) : null;

    const songData = {
        title: formData.get('title'),
        year: Number(formData.get('year')),
        url: formData.get('url'),
        vocal: "可不",
        illustration: "",
        movie: "",
        mix: "",
        mastering: "",
        releaseDate: ""
    };

    try {
        let response;
        if (editId) {
            const currentSong = allSongs.find(s => s.id === editId);
            const mergedData = { ...currentSong, ...songData };
            
            response = await fetch(`/api/songs/${editId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(mergedData)
            });
        } else {
            response = await fetch('/api/songs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(songData)
            });
        }

        if (!response.ok) throw new Error('Operation failed');

        resetForm();
        fetchSongs();
        alert(editId ? '更新しました！' : '追加しました！');

    } catch (error) {
        console.error(error);
        alert('エラーが発生しました');
    }
}

async function deleteSong(id) {
    if (!confirm('本当に削除しますか？')) {
        return;
    }

    try {
        const response = await fetch(`/api/songs/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Delete failed');
        }

        alert('削除しました');
        fetchSongs();

    } catch (error) {
        console.error(error);
        alert('削除に失敗しました');
    }
}

function getYouTubeId(url) {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

function openModal(songId) {
    const song = allSongs.find(s => s.id === songId);
    if (!song) return;

    const videoId = getYouTubeId(song.url);
    if (!videoId) {
        window.open(song.url, '_blank');
        return;
    }

    const overlay = document.getElementById('modal-overlay');
    const wrapper = document.getElementById('video-wrapper');
    const info = document.getElementById('modal-info');

    wrapper.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    info.textContent = `${song.title} (${song.year})`;

    overlay.classList.remove('hidden');
}

function closeModal() {
    const overlay = document.getElementById('modal-overlay');
    const wrapper = document.getElementById('video-wrapper');
    
    overlay.classList.add('hidden');
    wrapper.innerHTML = ''; 
}

function renderSongs(songs, container) {
    container.innerHTML = '';
    
    const validSongs = songs.filter(s => s.title && s.title !== "");

    if (validSongs.length === 0) {
        container.innerHTML = '<p>楽曲が見つかりません。</p>';
        return;
    }

    validSongs.forEach(song => {
        const card = document.createElement('div');
        card.className = 'song-card';
        card.innerHTML = `
            <div class="card-content">
                <h2 class="song-title">${song.title}</h2>
                <div class="song-info">
                    <span>Year: ${song.year}</span>
                </div>
            </div>
            <div class="card-actions">
                <button class="play-btn" onclick="openModal(${song.id})">Play</button>
                <a href="detail.html?id=${song.id}" class="detail-btn">詳細</a>
                <button class="edit-btn" onclick="startEdit(${song.id})">Edit</button>
                <button class="delete-btn" onclick="deleteSong(${song.id})">Delete</button>
            </div>
        `;
        container.appendChild(card);
    });
}