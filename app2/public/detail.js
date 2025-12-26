"use strict";
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) {
        document.getElementById('detail-content').innerHTML = '<p>IDが指定されていません。</p>';
        return;
    }

    fetch('/api/formulas')
        .then(res => res.json())
        .then(data => {
            const formula = data.find(f => f.id == id);
            if (formula) {
                renderDetail(formula);
            } else {
                document.getElementById('detail-content').innerHTML = '<p>公式が見つかりません。</p>';
            }
        })
        .catch(err => {
            console.error(err);
            document.getElementById('detail-content').innerHTML = '<p>読み込みエラー</p>';
        });
});

function renderDetail(formula) {
    const container = document.getElementById('detail-content');
    
    let variablesHtml = '';
    if (formula.variables && formula.variables.length > 0) {
        variablesHtml = `
            <div style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px;">
                <h3 style="font-size: 1.1rem; color: #555; margin-bottom: 10px;">記号の意味</h3>
                <ul style="list-style: none; padding: 0; line-height: 2;">
                    ${formula.variables.map(v => `
                        <li style="border-bottom: 1px dashed #eee; display: flex; align-items: baseline;">
                            <span style="width: 60px; text-align: right; margin-right: 15px; font-weight: bold;">$$ ${v.symbol} $$</span>
                            <span>: ${v.meaning}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
    }

    container.innerHTML = `
        <div class="formula-card" style="cursor: default; padding: 20px;">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 2px solid #ddd; padding-bottom: 10px; margin-bottom: 20px;">
                <h2 style="margin:0;">${formula.name}</h2>
                <div>
                    <a href="form.html?id=${formula.id}" class="btn btn-primary" style="padding: 5px 10px; font-size: 0.9rem;">編集</a>
                    <button onclick="deleteFormula(${formula.id})" class="btn btn-danger" style="padding: 5px 10px; font-size: 0.9rem;">削除</button>
                </div>
            </div>
            
            <div class="formula-display" style="font-size: 2rem; margin: 40px 0; text-align: center;">
                $$ ${formula.latex} $$
            </div>
            
            <p style="font-size: 1.1rem; color: #333; line-height: 1.6;">${formula.description}</p>
            
            ${variablesHtml}
        </div>
    `;

    if (window.MathJax) {
        MathJax.typesetPromise();
    }
}

function deleteFormula(id) {
    if (!confirm('本当に削除しますか？')) return;

    fetch(`/api/formulas/${id}`, { method: 'DELETE' })
        .then(res => {
            if (res.ok) {
                alert('削除しました');
                window.location.href = 'index.html';
            } else {
                alert('削除エラー');
            }
        });
}