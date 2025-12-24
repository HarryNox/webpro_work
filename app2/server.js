const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'public', 'formulas.json');

const server = http.createServer((req, res) => {
    // API: 公式データの取得 (GET)
    if (req.method === 'GET' && req.url === '/api/formulas') {
        fs.readFile(DATA_FILE, (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Error reading data');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data);
        });
        return;
    }

    // API: 公式データの追加 (POST)
    if (req.method === 'POST' && req.url === '/api/formulas') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            try {
                const newFormula = JSON.parse(body);
                
                fs.readFile(DATA_FILE, (err, data) => {
                    if (err) {
                        // ファイルがない場合は空配列からスタート
                        data = '[]';
                    }
                    
                    let formulas = [];
                    try {
                        formulas = JSON.parse(data);
                    } catch (e) {
                        formulas = [];
                    }

                    // IDの自動採番
                    const maxId = formulas.length > 0 ? Math.max(...formulas.map(f => f.id)) : 0;
                    newFormula.id = maxId + 1;

                    formulas.push(newFormula);

                    fs.writeFile(DATA_FILE, JSON.stringify(formulas, null, 2), (err) => {
                        if (err) {
                            res.writeHead(500);
                            res.end('Error saving data');
                            return;
                        }
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(newFormula));
                    });
                });
            } catch (e) {
                res.writeHead(400);
                res.end('Invalid JSON');
            }
        });
        return;
    }

    // 静的ファイルの配信処理
    const safeUrl = req.url.split('?')[0];
    let filePath = path.join(__dirname, 'public', safeUrl === '/' ? 'index.html' : safeUrl);
    
    const extname = path.extname(filePath);
    let contentType = 'text/html';
    switch (extname) {
        case '.js': contentType = 'text/javascript'; break;
        case '.css': contentType = 'text/css'; break;
        case '.json': contentType = 'application/json'; break;
        case '.png': contentType = 'image/png'; break;
        case '.jpg': contentType = 'image/jpg'; break;
    }

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404);
                res.end("<h1>404 Not Found</h1>", 'utf-8');
            } else {
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});