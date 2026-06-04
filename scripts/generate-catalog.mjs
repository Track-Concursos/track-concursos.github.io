import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
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

function detectMaterials(data) {
  const materials = new Set();
  
  function scan(obj) {
    if (!obj) return;
    if (typeof obj === 'string') {
      const lower = obj.toLowerCase();
      if (lower.includes('youtube.com') || lower.includes('youtu.be')) {
        materials.add('youtube');
      }
      if (lower.includes('estrategiaconcursos.com.br') || lower.includes('estrategia.com.br')) {
        materials.add('estrategia');
      }
      if (lower.includes('qconcursos.com')) {
        materials.add('qconcursos');
      }
      if (lower.includes('tecconcursos.com.br')) {
        materials.add('tecconcursos');
      }
    } else if (Array.isArray(obj)) {
      for (const item of obj) {
        scan(item);
      }
    } else if (typeof obj === 'object') {
      for (const key in obj) {
        scan(obj[key]);
      }
    }
  }
  
  if (data && data.materias) {
    scan(data.materias);
  }
  return Array.from(materials);
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
    
    // Auto-detect materials from JSON file
    const editalPath = path.join(folder, manifest.arquivo || 'edital.json');
    let autoMaterials = [];
    try {
      if (await exists(editalPath)) {
        const editalContent = JSON.parse(await readFile(editalPath, 'utf8'));
        autoMaterials = detectMaterials(editalContent);
      }
    } catch (e) {}

    // Detect maximum modification time of files in this directory to serve as update date
    let maxMtime = 0;
    try {
      const folderStat = await stat(folder);
      maxMtime = folderStat.mtimeMs;
      const files = await readdir(folder, { withFileTypes: true });
      for (const file of files) {
        if (file.isFile()) {
          const fileStat = await stat(path.join(folder, file.name));
          if (fileStat.mtimeMs > maxMtime) {
            maxMtime = fileStat.mtimeMs;
          }
        }
      }
    } catch (e) {
      maxMtime = Date.now();
    }
    const atualizadoEm = new Date(maxMtime).toISOString();

    const isDestaque = manifest.destaque || 
                       manifest.tags?.includes('destaque') || 
                       manifest.tags?.includes('premium') || 
                       entry.name.toLowerCase().includes('premium') || 
                       entry.name.toLowerCase().includes('destaque');

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
      destaque: !!isDestaque,
      materiais: manifest.materiais || autoMaterials,
      atualizadoEm,
    });
  }

  // Sort: destaque (premium) first, then by update date descending
  editais.sort((a, b) => {
    const aDestaque = a.destaque ? 1 : 0;
    const bDestaque = b.destaque ? 1 : 0;
    if (aDestaque !== bDestaque) {
      return bDestaque - aDestaque;
    }
    const dateA = new Date(a.atualizadoEm || 0).getTime();
    const dateB = new Date(b.atualizadoEm || 0).getTime();
    if (dateA !== dateB) {
      return dateB - dateA;
    }
    return a.titulo.localeCompare(b.titulo, 'pt-BR');
  });

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
