document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'));
    const container = document.getElementById('detail-container');

    if (!id) {
        container.innerHTML = '<p>IDが指定されていません。</p>';
        return;
    }

    fetch('/api/formulas')
        .then(res => res.json())
        .then(data => {
            const formula = data.find(f => f.id === id);
            if (!formula) {
                container.innerHTML = '<p>公式が見つかりませんでした。</p>';
                return;
            }
            renderDetail(formula, container);
        })
        .catch(err => {
            console.error(err);
            container.innerHTML = '<p>エラーが発生しました。</p>';
        });
});

function renderDetail(formula, container) {
    // 記号リストのHTMLを作成
    let symbolsHtml = '';
    formula.symbols.forEach(s => {
        // 記号自体も数式として綺麗に見せるために \( \) で囲む
        symbolsHtml += `
            <tr>
                <th>\\( ${s.char} \\)</th>
                <td>${s.desc}</td>
            </tr>
        `;
    });

    container.innerHTML = `
        <h2>${formula.name}</h2>
        <div class="formula-display">${formula.latex}</div>
        <p>${formula.description}</p>

        <h3>記号の意味</h3>
        <table class="symbol-table">
            ${symbolsHtml}
        </table>

        <h3>どんな時に使う？</h3>
        <div class="usage-box">
            ${formula.usage}
        </div>
    `;

    // MathJaxで数式をレンダリング
    if (window.MathJax) {
        MathJax.typesetPromise();
    }
}