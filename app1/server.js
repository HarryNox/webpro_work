"use strict"; // 要件: JSファイルの先頭に付ける

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// 設定
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// ■ データ保存用変数（DBを使わない要件のため）
// 例として id, name, description を持つデータとします
let dataList = [
    { id: 1, name: 'サンプル1', description: '詳細内容1' },
    { id: 2, name: 'サンプル2', description: '詳細内容2' }
];
let nextId = 3; // 次のID用

// ■■■ ルーティング（図の通りに実装） ■■■

// 1. 公式一覧 ( /formula ) -> 一覧表示
app.get('/formula', (req, res) => {
    res.render('index', { list: dataList });
});

// 2. 詳細表示 ( /formula/:number )
app.get('/formula/:number', (req, res) => {
    const id = parseInt(req.params.number);
    const item = dataList.find(d => d.id === id);
    if (item) {
        res.render('detail', { item: item });
    } else {
        res.send('データが見つかりません');
    }
});

// 3. 新規登録画面 ( /formula/create )
app.get('/formula/create', (req, res) => {
    res.render('create');
});

// 4. 新規登録処理 ( post /formula )
app.post('/formula', (req, res) => {
    const newItem = {
        id: nextId++,
        name: req.body.name,
        description: req.body.description
    };
    dataList.push(newItem); // 変数に記録
    res.redirect('/formula'); // 一覧に戻る
});

// 5. 編集画面 ( /formula/edit/:number )
app.get('/formula/edit/:number', (req, res) => {
    const id = parseInt(req.params.number);
    const item = dataList.find(d => d.id === id);
    if (item) {
        res.render('edit', { item: item });
    } else {
        res.redirect('/formula');
    }
});

// 6. 更新処理 ( /formula/update/:number ) ※図に合わせてURLを設定
app.post('/formula/update/:number', (req, res) => {
    const id = parseInt(req.params.number);
    const index = dataList.findIndex(d => d.id === id);
    if (index !== -1) {
        // データを更新
        dataList[index].name = req.body.name;
        dataList[index].description = req.body.description;
    }
    res.redirect('/formula'); // 一覧に戻る
});

// 7. 削除処理 ( /formula/delete/:number ) 
// ※図ではGETのように見えますが、処理なので便宜上GETで実装しredirectします
app.get('/formula/delete/:number', (req, res) => {
    const id = parseInt(req.params.number);
    dataList = dataList.filter(d => d.id !== id); // 変数から削除
    res.redirect('/formula'); // 一覧に戻る
});

// サーバー起動
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/formula`);
});