"use strict";
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) addMemberInput();

    if (id) {
        document.getElementById('page-title').textContent = 'Edit Team';
        fetch('/api/teams')
            .then(res => res.json())
            .then(data => {
                const team = data.find(t => t.id == id);
                if (team) {
                    document.getElementById('id').value = team.id;
                    document.getElementById('name').value = team.name;
                    document.getElementById('icon').value = team.icon;
                    document.getElementById('image').value = team.image;
                    document.getElementById('achievements').value = team.achievements;
                    document.getElementById('twitter').value = team.twitter;
                    document.getElementById('youtube').value = team.youtube;

                    if (team.members && team.members.length > 0) {
                        team.members.forEach(m => addMemberInput(m));
                    } else {
                        addMemberInput();
                    }
                }
            });
    }

    document.getElementById('add-member-btn').addEventListener('click', () => {
        addMemberInput();
    });

    document.getElementById('team-form').addEventListener('submit', (e) => {
        e.preventDefault();

        const members = [];
        document.querySelectorAll('.member-input-row').forEach(row => {
            const name = row.querySelector('.m-name').value;
            if (name) {
                members.push({
                    name: name,
                    role: row.querySelector('.m-role').value,
                    image: row.querySelector('.m-img').value
                });
            }
        });

        const formData = {
            name: document.getElementById('name').value,
            icon: document.getElementById('icon').value,
            image: document.getElementById('image').value,
            achievements: document.getElementById('achievements').value,
            twitter: document.getElementById('twitter').value,
            youtube: document.getElementById('youtube').value,
            members: members
        };

        const editId = document.getElementById('id').value;
        const method = editId ? 'PUT' : 'POST';
        const url = editId ? `/api/teams/${editId}` : '/api/teams';

        fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
        .then(() => {
            alert('Saved!');
            window.location.href = 'index.html';
        });
    });
});

function addMemberInput(data = null) {
    const container = document.getElementById('members-container');
    const div = document.createElement('div');
    div.className = 'member-input-row';

    const name = data ? data.name : '';
    const img = data ? data.image : '';
    const role = data ? data.role : 'Survivor';

    div.innerHTML = `
        <div class="form-group">
            <label>Name</label>
            <input type="text" class="m-name" value="${name}" required>
        </div>
        <div class="form-group">
            <label>Role</label>
            <select class="m-role" style="padding:8px; width:100%;">
                <option value="Survivor" ${role === 'Survivor' ? 'selected' : ''}>Survivor</option>
                <option value="Hunter" ${role === 'Hunter' ? 'selected' : ''}>Hunter</option>
                <option value="Coach" ${role === 'Coach' ? 'selected' : ''}>Coach</option>
                <option value="Creator" ${role === 'Creator' ? 'selected' : ''}>Creator</option>
                <option value="Manager" ${role === 'Manager' ? 'selected' : ''}>Manager</option>
            </select>
        </div>
        <div class="form-group">
            <label>Image URL</label>
            <input type="text" class="m-img" value="${img}" placeholder="images/...">
        </div>
        <button type="button" onclick="this.parentElement.remove()" style="background:#555; color:white; border:none; padding:5px;">Remove</button>
    `;
    container.appendChild(div);
}