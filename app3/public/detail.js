"use strict";
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    fetch('/api/teams')
        .then(res => res.json())
        .then(data => {
            const team = data.find(t => t.id == id);
            if(team) renderDetail(team);
            else document.getElementById('detail-content').textContent = 'Not Found';
        });
});

function renderDetail(team) {
    const content = document.getElementById('detail-content');
    const imageSrc = team.image || 'https://placehold.jp/600x400.png?text=NoImage';

    let membersHtml = '';
    if (team.members && team.members.length > 0) {
        membersHtml = '<div class="member-grid">';
        team.members.forEach(m => {
            let roleClass = 'role-survivor';
            if (m.role === 'Hunter') roleClass = 'role-hunter';
            if (m.role === 'Coach') roleClass = 'role-coach';
            if (m.role === 'Creator') roleClass = 'role-creator';
            if (m.role === 'Manager') roleClass = 'role-manager';

            const mImg = m.image || 'https://placehold.jp/100x100.png?text=User';
            
            membersHtml += `
                <div class="member-card">
                    <img src="${mImg}" class="member-img">
                    <div><span class="role-badge ${roleClass}">${m.role}</span></div>
                    <div style="font-weight:bold;">${m.name}</div>
                </div>
            `;
        });
        membersHtml += '</div>';
    } else {
        membersHtml = '<p>メンバー情報がありません。</p>';
    }

    content.innerHTML = `
        <div class="detail-header">
            <img src="${imageSrc}" class="group-photo">
            <h1 style="font-size: 2.5rem; margin: 10px 0;">${team.name}</h1>
            <div class="sns-links">
                <a href="${team.twitter}" target="_blank" class="sns-btn btn-x">X (Twitter)</a>
                <a href="${team.youtube}" target="_blank" class="sns-btn btn-yt">YouTube</a>
            </div>
        </div>

        <h3>🏆 チーム実績</h3>
        <div class="achievements-box">${team.achievements || 'なし'}</div>

        <h3>👥 メンバー</h3>
        ${membersHtml}

        <div style="margin-top: 40px; border-top: 1px solid #444; padding-top: 20px;">
            <button onclick="location.href='form.html?id=${team.id}'" class="add-btn" style="background:#ffbd00;">編集する</button>
            <button onclick="deleteTeam(${team.id})" class="btn-delete">削除する</button>
        </div>
    `;
}

function deleteTeam(id) {
    if(!confirm('本当に削除しますか？')) return;
    fetch(`/api/teams/${id}`, { method: 'DELETE' })
        .then(() => {
            alert('削除しました');
            window.location.href = 'index.html';
        });
}