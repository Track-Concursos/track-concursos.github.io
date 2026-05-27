import { cp, mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const sourceRoot = process.argv[2];
const publicRoot = process.argv[3] || 'public/data/premium-editais';
const catalogOutput = process.argv[4] || 'public/data/catalog.sample.json';

if (!sourceRoot) {
  console.error('Uso: node scripts/import-premium-folder.mjs "C:\\\\caminho\\\\Editais Premium"');
  process.exit(1);
}

const imageExtensions = new Set(['.png', '.jpg', '.jpeg', '.webp']);

function slugify(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function cleanText(value) {
  return value
    .replace(/\r/g, '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .join('\n');
}

function repairMojibake(value) {
  if (!/[ÃÂð]/.test(value)) return value;
  try {
    return Buffer.from(value, 'latin1').toString('utf8');
  } catch {
    return value;
  }
}

function normalizeSearch(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function stripDecorativePrefix(value) {
  return value.replace(/^[^\p{L}\p{N}]+/u, '').trim();
}

function parseInfo(text, folderName, jsonName) {
  const cleaned = cleanText(repairMojibake(text));
  const lines = cleaned.split('\n');
  
  let titleLine = folderName;
  let cargoLine = folderName;
  let descriptionLine = "baixe o arquivo .JSON importe no seu Track Concursos e comece a estudar";
  let bancaYearLine = "";
  
  const isPremiumFormat = text.includes("FICHA INFORMATIVA - EDITAL PREMIUM TRACK CONCURSOS");
  
  if (isPremiumFormat) {
    for (const line of lines) {
      if (line.includes("🏢 ÓRGÃO:")) {
        titleLine = line.replace("🏢 ÓRGÃO:", "").trim();
      } else if (line.includes("🪪 CARGO:")) {
        cargoLine = line.replace("🪪 CARGO:", "").trim();
      } else if (line.includes("🧾 BANCA:")) {
        bancaYearLine = line;
      }
    }
  } else {
    titleLine = lines[0] || folderName;
    cargoLine = lines[1] || titleLine;
    descriptionLine = lines[2] || cargoLine;
    bancaYearLine = lines[3] || '';
  }
  
  const yearMatch = bancaYearLine.match(/\b(20\d{2})\b/);
  let banca = 'A definir';
  
  let cleanBancaLine = bancaYearLine
    .replace(/🧾\s*(?:BANCA:)?/i, '')
    .replace(/\b(20\d{2})\b/, '')
    .replace(/:/g, '')
    .trim();
    
  if (cleanBancaLine) {
    banca = cleanBancaLine;
  }

  return {
    titulo: stripDecorativePrefix(titleLine),
    orgao: inferAgency(folderName, titleLine),
    banca: banca,
    cargo: stripDecorativePrefix(cargoLine),
    ano: yearMatch ? Number(yearMatch[1]) : new Date().getFullYear(),
    tags: buildTags(cleaned, folderName),
    descricao: stripDecorativePrefix(descriptionLine),
    arquivoNome: repairMojibake(jsonName),
  };
}

function inferAgency(folderName, title) {
  const source = `${folderName} ${title}`;
  const match = source.match(/\b(INSS|PF|PRF|TRF|TJ|TRE|Banco do Brasil|Caixa)\b/i);
  return match ? match[0].toUpperCase() : folderName;
}

function buildTags(text, folderName) {
  const tags = new Set(['edital pronto']);
  const source = normalizeSearch(`${text} ${folderName}`);
  if (source.includes('pre-edital')) tags.add('pre-edital');
  if (source.includes('nivel medio')) tags.add('nivel medio');
  if (source.includes('cebraspe')) tags.add('cebraspe');
  if (source.includes('fgv')) tags.add('fgv');
  if (source.includes('inss')) tags.add('inss');
  return [...tags];
}

async function main() {
  const folders = await readdir(sourceRoot, { withFileTypes: true });
  const editais = [];

  await mkdir(publicRoot, { recursive: true });

  for (const folder of folders) {
    if (!folder.isDirectory()) continue;

    const folderPath = path.join(sourceRoot, folder.name);
    const files = await readdir(folderPath, { withFileTypes: true });
    const jsonFile = files.find((file) => file.isFile() && path.extname(file.name).toLowerCase() === '.json');
    const imageFile = files.find((file) => file.isFile() && imageExtensions.has(path.extname(file.name).toLowerCase()));
    const textFile = files.find((file) => file.isFile() && file.name.toLowerCase().endsWith('.txt'));

    if (!jsonFile || !imageFile) continue;

    const id = slugify(folder.name);
    const targetFolder = path.join(publicRoot, id);
    const imageTarget = `capa${path.extname(imageFile.name).toLowerCase()}`;
    const jsonTarget = 'edital.json';
    const infoText = textFile ? await readFile(path.join(folderPath, textFile.name), 'utf8') : folder.name;
    const info = parseInfo(infoText, folder.name, jsonFile.name);

    await mkdir(targetFolder, { recursive: true });
    await cp(path.join(folderPath, imageFile.name), path.join(targetFolder, imageTarget));
    await cp(path.join(folderPath, jsonFile.name), path.join(targetFolder, jsonTarget));

    editais.push({
      id,
      titulo: info.titulo,
      orgao: info.orgao,
      banca: info.banca,
      cargo: info.cargo,
      ano: info.ano,
      tags: info.tags,
      descricao: info.descricao,
      imagem: `./data/premium-editais/${id}/${imageTarget}`,
      arquivo: `./data/premium-editais/${id}/${jsonTarget}`,
      arquivoNome: info.arquivoNome,
    });
  }

  editais.sort((a, b) => a.titulo.localeCompare(b.titulo, 'pt-BR'));

  await writeFile(
    catalogOutput,
    `${JSON.stringify({ atualizadoEm: new Date().toISOString(), editais }, null, 2)}\n`,
    'utf8',
  );

  console.log(`Catalogo gerado com ${editais.length} edital(is): ${catalogOutput}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
