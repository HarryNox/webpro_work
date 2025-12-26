"use strict";
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    const latexInput = document.getElementById('latex');
    const preview = document.getElementById('latex-preview');
    
    latexInput.addEventListener('input', () => {
        preview.innerHTML = `$$ ${latexInput.value} $$`;
        if(window.MathJax) MathJax.typesetPromise([preview]);
    });

    if (id) {
        document.getElementById('edit-id').value = id;
        fetch('/api/formulas')
            .then(res => res.json())
            .then(data => {
                const formula = data.find(f => f.id == id);
                if (formula) {
                    document.getElementById('name').value = formula.name;
                    document.getElementById('latex').value = formula.latex;
                    document.getElementById('description').value = formula.description;
                    
                    preview.innerHTML = `$$ ${formula.latex} $$`;
                    if(window.MathJax) MathJax.typesetPromise([preview]);

                    if (formula.variables) {
                        formula.variables.forEach(v => addVariableRow(v.symbol, v.meaning));
                    }
                }
            });
    } else {
        addVariableRow();
    }

    document.getElementById('add-variable-btn').addEventListener('click', () => {
        addVariableRow();
    });

    document.getElementById('formula-form').addEventListener('submit', (e) => {
        e.preventDefault();

        const variables = [];
        document.querySelectorAll('.variable-row').forEach(row => {
            const sym = row.querySelector('.var-symbol').value.trim();
            const mean = row.querySelector('.var-meaning').value.trim();
            if (sym && mean) {
                variables.push({ symbol: sym, meaning: mean });
            }
        });

        const formData = {
            name: document.getElementById('name').value,
            latex: document.getElementById('latex').value,
            description: document.getElementById('description').value,
            variables: variables
        };

        const editId = document.getElementById('edit-id').value;
        const method = editId ? 'PUT' : 'POST';
        const url = editId ? `/api/formulas/${editId}` : '/api/formulas';

        fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
        .then(res => {
            if (res.ok) {
                alert('保存しました！');
                window.location.href = editId ? `detail.html?id=${editId}` : 'index.html';
            } else {
                alert('エラーが発生しました');
            }
        });
    });
});

function addVariableRow(symbol = '', meaning = '') {
    const container = document.getElementById('variables-container');
    const div = document.createElement('div');
    div.className = 'variable-row';
    div.innerHTML = `
        <input type="text" class="var-symbol" placeholder="記号 (例: v)" value="${symbol}" style="width:30%;">
        <input type="text" class="var-meaning" placeholder="意味 (例: 速度)" value="${meaning}" style="width:60%;">
        <button type="button" class="btn btn-danger" style="padding:5px 10px;" onclick="this.parentElement.remove()">×</button>
    `;
    container.appendChild(div);
}