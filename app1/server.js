const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'public', 'songs.json');

const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/api/songs') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            try {
                const newSong = JSON.parse(body);
                fs.readFile(DATA_FILE, (err, data) => {
                    if (err) {
                        res.writeHead(500);
                        res.end('Error reading data');
                        return;
                    }
                    const songs = JSON.parse(data);
                    const maxId = songs.length > 0 ? Math.max(...songs.map(s => s.id)) : 0;
                    newSong.id = maxId + 1;
                    songs.push(newSong);
                    fs.writeFile(DATA_FILE, JSON.stringify(songs, null, 2), (err) => {
                        if (err) {
                            res.writeHead(500);
                            res.end('Error saving data');
                            return;
                        }
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(newSong));
                    });
                });
            } catch (e) {
                res.writeHead(400);
                res.end('Invalid JSON');
            }
        });
        return;
    }

    if (req.method === 'PUT' && req.url.startsWith('/api/songs/')) {
        const id = parseInt(req.url.split('/').pop());
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            try {
                const updatedData = JSON.parse(body);
                fs.readFile(DATA_FILE, (err, data) => {
                    if (err) {
                        res.writeHead(500);
                        res.end('Error reading data');
                        return;
                    }
                    let songs = JSON.parse(data);
                    const index = songs.findIndex(s => s.id === id);
                    
                    if (index === -1) {
                        res.writeHead(404);
                        res.end('Song not found');
                        return;
                    }

                    songs[index] = { ...songs[index], ...updatedData, id: id };

                    fs.writeFile(DATA_FILE, JSON.stringify(songs, null, 2), (err) => {
                        if (err) {
                            res.writeHead(500);
                            res.end('Error saving data');
                            return;
                        }
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(songs[index]));
                    });
                });
            } catch (e) {
                res.writeHead(400);
                res.end('Invalid JSON');
            }
        });
        return;
    }

    if (req.method === 'DELETE' && req.url.startsWith('/api/songs/')) {
        const id = parseInt(req.url.split('/').pop());
        fs.readFile(DATA_FILE, (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Error reading data');
                return;
            }
            let songs = JSON.parse(data);
            const initialLength = songs.length;
            songs = songs.filter(song => song.id !== id);
            
            if (songs.length === initialLength) {
                res.writeHead(404);
                res.end('Song not found');
                return;
            }

            fs.writeFile(DATA_FILE, JSON.stringify(songs, null, 2), (err) => {
                if (err) {
                    res.writeHead(500);
                    res.end('Error saving data');
                    return;
                }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
            });
        });
        return;
    }

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