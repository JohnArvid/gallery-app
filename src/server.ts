import http from 'http';
import fs from 'fs';
import path from 'path';

const PORT = 3000;

// Funktion för att servera en HTML-fil
function serveHtmlFile(res: http.ServerResponse, filePath: string, statusCode = 200) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
      return;
    }
    res.writeHead(statusCode, { 'Content-Type': 'text/html' });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  if (!req.url) {
    res.writeHead(400);
    res.end('Bad Request');
    return;
  }

  let requestedPath = req.url === '/' ? '/index.html' : req.url;
  const filePath = path.join(process.cwd(), requestedPath);

  // Kontrollera att filen finns och är en HTML-fil
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (!err && filePath.endsWith('.html')) {
      serveHtmlFile(res, filePath);
    } else {
      // Om filen inte finns, visa 404-sidan
      const errorPagePath = path.join(process.cwd(), '404.html');
      serveHtmlFile(res, errorPagePath, 404);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
