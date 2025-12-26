"use strict";
let allTeams = [];

document.addEventListener('DOMContentLoaded', () => {
    fetchTeams();

    const searchInput = document.getElementById('search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            renderTeams(e.target.value);
        });
    }
});

function fetchTeams() {
    fetch('/api/teams')
        .then(res => res.json())
        .then(data => {
            allTeams = data;
            renderTeams();
        })
        .catch(err => console.error(err));
}

function renderTeams(filterText = '') {
    const container = document.getElementById('team-list');
    container.innerHTML = '';

    const filtered = allTeams.filter(team => 
        team.name.toLowerCase().includes(filterText.toLowerCase())
    );

    if (filtered.length === 0) {
        container.innerHTML = '<p>No teams found.</p>';
        return;
    }

    filtered.forEach(team => {
        const div = document.createElement('div');
        div.className = 'team-card';
        
        div.onclick = () => location.href = `detail.html?id=${team.id}`;
        
        const iconSrc = team.icon || 'https://placehold.jp/150x150.png?text=NoIcon';
        const memberCount = team.members ? team.members.length : 0;

        div.innerHTML = `
            <div style="display:flex; align-items:center; flex-grow:1;">
                <img src="${iconSrc}" class="team-icon" alt="icon">
                <div class="team-info">
                    <h2>${team.name}</h2>
                    <small>Members: ${memberCount}</small>
                </div>
            </div>
            <button onclick="event.stopPropagation(); deleteTeam(${team.id})" style="background:#950740; color:white; border:none; padding:8px 12px; border-radius:4px; cursor:pointer; margin-left:10px; font-weight:bold;">Delete</button>
        `;
        container.appendChild(div);
    });
}

function deleteTeam(id) {
    if(!confirm('Delete this team?')) return;
    
    fetch(`/api/teams/${id}`, { method: 'DELETE' })
        .then(res => {
            if(res.ok) {
                alert('Deleted');
                fetchTeams();
            } else {
                alert('Error deleting');
            }
        });
}