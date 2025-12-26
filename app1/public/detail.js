"use strict";
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'));
    const container = document.getElementById('detail-container');

    if (!id) {
        container.innerHTML = '<p>楽曲IDが指定されていません。</p>';
        return;
    }

    fetch('/api/songs')
        .then(response => response.json())
        .then(data => {
            const song = data.find(s => s.id == id);
            
            if (song) {
                renderDetail(song, container);
            } else {
                container.innerHTML = '<p>該当する楽曲が見つかりませんでした。</p>';
            }
        })
        .catch(error => {
            console.error(error);
            container.innerHTML = '<p>データの読み込みに失敗しました。</p>';
        });
});

function renderDetail(song, container) {
    const videoId = getYouTubeId(song.url);
    let videoHtml = '';
    
    if (videoId) {
        videoHtml = `
            <div class="video-container">
                <iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
        `;
    } else {
        videoHtml = `<p><a href="${song.url}" target="_blank">動画リンク</a></p>`;
    }

    container.innerHTML = `
        <div class="detail-card">
            <h2>${song.title}</h2>
            ${videoHtml}
            <table class="detail-table">
                <tr>
                    <th>Vocal</th>
                    <td>${song.vocal || '-'}</td>
                </tr>
                <tr>
                    <th>Illustration</th>
                    <td>${song.illustration || '-'}</td>
                </tr>
                <tr>
                    <th>Movie</th>
                    <td>${song.movie || '-'}</td>
                </tr>
                <tr>
                    <th>MIX</th>
                    <td>${song.mix || '-'}</td>
                </tr>
                <tr>
                    <th>Mastering</th>
                    <td>${song.mastering || '-'}</td>
                </tr>
                <tr>
                    <th>公開年月日</th>
                    <td>${song.releaseDate || '-'}</td>
                </tr>
            </table>
            <div style="text-align: center; margin-top: 20px;">
                <a href="index.html" class="btn">一覧に戻る</a>
            </div>
        </div>
    `;
}

function getYouTubeId(url) {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}