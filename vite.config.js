import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.png') return 'image/png';
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.svg') return 'image/svg+xml';
  if (ext === '.webp') return 'image/webp';
  return 'application/octet-stream';
}

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'serve-and-copy-logos',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const urlPath = req.url.split('?')[0];
          if (urlPath.startsWith('/logos/')) {
            const relativePath = urlPath.slice(7); // Remove '/logos/'
            const filePath = path.join(process.cwd(), 'logos', relativePath);
            if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
              res.setHeader('Content-Type', getMimeType(filePath));
              res.end(fs.readFileSync(filePath));
              return;
            }
          }
          next();
        });
      },
      closeBundle() {
        const src = path.join(process.cwd(), 'logos');
        const dest = path.join(process.cwd(), 'dist/logos');
        if (fs.existsSync(src)) {
          copyDir(src, dest);
        }
      }
    }
  ],
  base: './',
});
