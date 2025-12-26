let allFormulas = [];

document.addEventListener('DOMContentLoaded', () => {
    fetchFormulas();

    const searchInput = document.getElementById('search');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
});

function fetchFormulas() {
    const container = document.getElementById('list-container');
    if (!container) return;

    fetch('/api/formulas')
        .then(response => response.json())
        .then(data => {
            data.sort((a, b) => a.id - b.id);
            allFormulas = data;
            
            const searchInput = document.getElementById('search');
            if (searchInput && searchInput.value) {
                handleSearch({ target: searchInput });
            } else {
                renderFormulas(allFormulas);
            }
        })
        .catch(error => {
            console.error(error);
            container.innerHTML = '<p>Error loading data.</p>';
        });
}

function handleSearch(event) {
    const term = event.target.value.toLowerCase();
    
    const filtered = allFormulas.filter(f => {
        return f.name.toLowerCase().includes(term) || 
               (f.description && f.description.toLowerCase().includes(term));
    });

    renderFormulas(filtered);
}

function renderFormulas(formulas) {
    const container = document.getElementById('list-container');
    container.innerHTML = '';

    formulas.forEach(formula => {
        const card = document.createElement('div');
        card.className = 'formula-card';
        
        card.onclick = (e) => {
            window.location.href = `detail.html?id=${formula.id}`;
        };

        card.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <h3>${formula.name}</h3>
                <button onclick="event.stopPropagation(); deleteFormula(${formula.id})" style="background:#cc0000; color:white; border:none; border-radius:3px; cursor:pointer; padding:5px;">×</button>
            </div>
            <div class="formula-display" style="text-align:center; margin:10px 0;">
                $$ ${formula.latex} $$
            </div>
            <p>${formula.description}</p>
        `;
        container.appendChild(card);
    });

    if (window.MathJax) {
        MathJax.typesetPromise();
    }
}

function deleteFormula(id) {
    if (!confirm('本当に削除しますか？')) return;

    fetch(`/api/formulas/${id}`, {
        method: 'DELETE'
    })
    .then(res => {
        if (res.ok) {
            alert('削除しました');
            fetchFormulas();
        } else {
            alert('削除エラー');
        }
    })
    .catch(err => {
        console.error(err);
        alert('通信エラー');
    });
}