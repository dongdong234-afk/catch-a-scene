// 내 컴퓨터에서 실행하기: node server.js  →  http://localhost:3000
// (Node.js 18 이상, 추가 설치 없음) 키는 실행할 때 환경 변수로 넣어요:
//   macOS/Linux:  OPENAI_API_KEY=sk-... node server.js
//   Windows(PowerShell):  $env:OPENAI_API_KEY="sk-..."; node server.js
const http = require('http');
const fs = require('fs');
const path = require('path');
const ask = require('./api/ask');
const verify = require('./api/verify');
const PORT = process.env.PORT || 3000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon'
};

function wrapRes(res) {
  res.status = code => { res.statusCode = code; return res; };
  res.json = obj => { res.setHeader('Content-Type', 'application/json; charset=utf-8'); res.end(JSON.stringify(obj)); return res; };
  return res;
}

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  wrapRes(res);
  req.query = Object.fromEntries(url.searchParams);
  if (url.pathname === '/api/ask' || url.pathname === '/api/verify') {
    const handler = url.pathname === '/api/ask' ? ask : verify;
    let body = '';
    req.on('data', d => { body += d; if (body.length > 100000) req.destroy(); });
    req.on('end', () => {
      try { req.body = body ? JSON.parse(body) : {}; } catch (e) { req.body = {}; }
      handler(req, res);
    });
    return;
  }
  const requested = url.pathname === '/' ? 'index.html' : url.pathname.replace(/^\/+/, '');
  const file = path.resolve(__dirname, requested);
  if (!file.startsWith(path.resolve(__dirname) + path.sep)) {
    res.statusCode = 403;
    return res.end('Forbidden');
  }
  fs.readFile(file, (err, html) => {
    if (err && url.pathname !== '/') {
      res.statusCode = 404;
      return res.end('Not found');
    }
    if (err) { res.statusCode = 500; return res.end('index.html not found'); }
    res.setHeader('Content-Type', MIME[path.extname(file).toLowerCase()] || 'application/octet-stream');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.end(html);
  });
}).listen(PORT, () => console.log('Catch a Scene: http://localhost:' + PORT));
