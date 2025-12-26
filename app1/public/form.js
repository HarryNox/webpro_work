"use strict";

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    const releaseDateInput = document.getElementById('releaseDate');
    const yearInput = document.getElementById('year');
    releaseDateInput.addEventListener('change', (e) => {
        if (e.target.value) {
            yearInput.value = new Date(e.target.value).getFullYear();
        }
    });

    if (id) {
        document.getElementById('page-title').textContent = '楽曲情報の編集';
        fetch('/api/songs')
            .then(res => res.json())
            .then(data => {
                const song = data.find(s => s.id == id);
                if (song) {
                    document.getElementById('id').value = song.id;
                    document.getElementById('title').value = song.title || '';
                    document.getElementById('url').value = song.url || '';
                    document.getElementById('year').value = song.year || '';
                    document.getElementById('releaseDate').value = song.releaseDate || '';
                    document.getElementById('vocal').value = song.vocal || '';
                    document.getElementById('illustration').value = song.illustration || '';
                    document.getElementById('movie').value = song.movie || '';
                    document.getElementById('mix').value = song.mix || '';
                    document.getElementById('mastering').value = song.mastering || '';
                }
            });
    }

    document.getElementById('song-form').addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = {
            title: document.getElementById('title').value,
            url: document.getElementById('url').value,
            year: parseInt(document.getElementById('year').value) || new Date().getFullYear(),
            releaseDate: document.getElementById('releaseDate').value,
            vocal: document.getElementById('vocal').value,
            illustration: document.getElementById('illustration').value,
            movie: document.getElementById('movie').value,
            mix: document.getElementById('mix').value,
            mastering: document.getElementById('mastering').value
        };

        const editId = document.getElementById('id').value;
        
        const method = editId ? 'PUT' : 'POST';
        const url = editId ? `/api/songs/${editId}` : '/api/songs';

        fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (response.ok) {
                alert('保存しました！');
                window.location.href = 'index.html';
            } else {
                alert('エラーが発生しました');
            }
        })
        .catch(err => console.error(err));
    });
});