import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.argv[2] || 'editais';
const output = process.argv[3] || 'catalog.json';

async function exists(filePath) {
  try {
    await readFile(filePath);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const entries = await readdir(root, { withFileTypes: true });
  const editais = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const folder = path.join(root, entry.name);
    const manifestPath = path.join(folder, 'manifest.json');
    if (!(await exists(manifestPath))) continue;

    const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
    const publicFolder = path.posix.join(root.replaceAll('\\', '/'), entry.name);
    editais.push({
      id: manifest.id || entry.name,
      titulo: manifest.titulo,
      orgao: manifest.orgao,
      banca: manifest.banca,
      cargo: manifest.cargo,
      ano: manifest.ano,
      tags: manifest.tags || [],
      imagem: `${publicFolder}/${manifest.imagem || 'capa.png'}`,
      arquivo: `${publicFolder}/${manifest.arquivo || 'edital.json'}`,
    });
  }

  editais.sort((a, b) => a.titulo.localeCompare(b.titulo, 'pt-BR'));

  await writeFile(
    output,
    `${JSON.stringify({ atualizadoEm: new Date().toISOString(), editais }, null, 2)}\n`,
    'utf8',
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
