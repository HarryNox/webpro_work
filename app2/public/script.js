document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('list-container');

    fetch('/api/formulas')
        .then(response => response.json())
        .then(data => {
            container.innerHTML = '';
            data.forEach(formula => {
                const card = document.createElement('div');
                card.className = 'formula-card';
                // カード全体をクリックしたら詳細へ飛ぶようにする
                card.onclick = () => {
                    window.location.href = `detail.html?id=${formula.id}`;
                };

                card.innerHTML = `
                    <h3>${formula.name}</h3>
                    <div class="formula-display">${formula.latex}</div>
                    <p>${formula.description}</p>
                    <small>クリックして詳細を見る</small>
                `;
                container.appendChild(card);
            });

            // MathJaxに「新しい数式が追加されたから変換して」と伝える
            if (window.MathJax) {
                MathJax.typesetPromise();
            }
        })
        .catch(error => {
            console.error(error);
            container.innerHTML = '<p>読み込みエラーが発生しました。</p>';
        });
});