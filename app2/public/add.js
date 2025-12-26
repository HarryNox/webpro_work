"use strict";
document.getElementById('add-symbol-btn').addEventListener('click', () => {
    const container = document.getElementById('symbol-container');
    const currentRows = container.getElementsByClassName('symbol-row').length;

    if (currentRows >= 10) {
        alert('記号は最大10個までです。');
        return;
    }

    const newRow = document.createElement('div');
    newRow.className = 'symbol-row';
    newRow.innerHTML = `
        <input type="text" class="sym-char" placeholder="記号">
        <input type="text" class="sym-desc" placeholder="意味">
    `;
    
    container.appendChild(newRow);
});

document.getElementById('add-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const symbols = [];
    const charInputs = document.querySelectorAll('.sym-char');
    const descInputs = document.querySelectorAll('.sym-desc');

    charInputs.forEach((input, index) => {
        const char = input.value.trim();
        const desc = descInputs[index].value.trim();
        if (char && desc) {
            symbols.push({ char, desc });
        }
    });

    const newFormula = {
        name: document.getElementById('name').value,
        latex: document.getElementById('latex').value,
        description: document.getElementById('description').value,
        symbols: symbols,
        usage: document.getElementById('usage').value
    };

    fetch('/api/formulas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newFormula)
    })
    .then(response => {
        if (response.ok) {
            alert('登録しました！');
            window.location.href = 'index.html';
        } else {
            alert('エラーが発生しました');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('通信エラー');
    });
});