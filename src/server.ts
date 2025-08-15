import http from 'http';
import fs from 'fs';
import path from 'path';

const PORT = 3000;

// Enkel funktion för att gissa MIME-typen
function getContentType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.html': return 'text/html';
    case '.css': return 'text/css';
    case '.js': return 'application/javascript';
    case '.json': return 'application/json';
    case '.png': return 'image/png';
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.gif': return 'image/gif';
    case '.svg': return 'image/svg+xml';
    default: return 'application/octet-stream';
  }
}

// Funktion för att servera en fil
function serveFile(res: http.ServerResponse, filePath: string, statusCode = 200) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
      return;
    }

    const contentType = getContentType(filePath);
    res.writeHead(statusCode, { 'Content-Type': contentType });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  if (!req.url) {
    res.writeHead(400);
    res.end('Bad Request');
    return;
  }

  // Normalize och säkerställ att URL inte går utanför rotmappen
  let requestedPath = req.url === '/' ? '/index.html' : req.url;
  const safePath = path.normalize(requestedPath).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(process.cwd(), safePath);

  // Kontrollera om filen finns
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (!err) {
      serveFile(res, filePath);
    } else {
      // Visa 404-sidan om den finns
      const errorPagePath = path.join(process.cwd(), '404.html');
      fs.access(errorPagePath, fs.constants.F_OK, (err404) => {
        if (!err404) {
          serveFile(res, errorPagePath, 404);
        } else {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found');
        }
      });
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
