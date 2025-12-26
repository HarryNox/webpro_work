"use strict";
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'public', 'teams.json');

let inMemoryData = [];
try {
    const rawData = fs.readFileSync(DATA_FILE, 'utf-8');
    inMemoryData = JSON.parse(rawData);
    console.log('App3: Data loaded.');
} catch (err) {
    inMemoryData = [];
    console.log('App3: Data started empty.');
}

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/api/teams') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(inMemoryData));
        return;
    }

    if (req.method === 'POST' && req.url === '/api/teams') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            try {
                const newItem = JSON.parse(body);
                const maxId = inMemoryData.length > 0 ? Math.max(...inMemoryData.map(i => i.id)) : 0;
                newItem.id = maxId + 1;
                inMemoryData.push(newItem);
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(newItem));
            } catch (e) {
                res.writeHead(400); res.end('Invalid JSON');
            }
        });
        return;
    }

    if (req.method === 'PUT' && req.url.startsWith('/api/teams/')) {
        const id = parseInt(req.url.split('/').pop());
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            try {
                const index = inMemoryData.findIndex(i => i.id === id);
                if (index !== -1) {
                    const updatedData = JSON.parse(body);
                    inMemoryData[index] = { ...inMemoryData[index], ...updatedData, id: id };
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(inMemoryData[index]));
                } else {
                    res.writeHead(404); res.end('Not Found');
                }
            } catch (e) {
                res.writeHead(400); res.end('Invalid JSON');
            }
        });
        return;
    }

    if (req.method === 'DELETE' && req.url.startsWith('/api/teams/')) {
        const id = parseInt(req.url.split('/').pop());
        const initialLen = inMemoryData.length;
        inMemoryData = inMemoryData.filter(i => i.id !== id);
        
        if (inMemoryData.length !== initialLen) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true }));
        } else {
            res.writeHead(404); res.end('Not Found');
        }
        return;
    }

    const safeUrl = req.url.split('?')[0];
    let filePath = path.join(__dirname, 'public', safeUrl === '/' ? 'index.html' : safeUrl);
    const extname = path.extname(filePath);
    let contentType = 'text/html';
    const mimeTypes = { '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpg' };
    contentType = mimeTypes[extname] || 'text/html';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404); res.end("<h1>404 Not Found</h1>");
            } else {
                res.writeHead(500); res.end(`Server Error`);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
});

server.listen(PORT, () => {
    console.log(`App3 Server running at http://localhost:${PORT}`);
});