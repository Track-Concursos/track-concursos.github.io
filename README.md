# Track Concursos Landing Page

Landing page pública para apresentar o Track Concursos no GitHub Pages.

## Rodando localmente

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Catalogo de Editais Premium

A página de Editais Premium lê um catálogo JSON. Por padrão, ela usa:

```txt
public/data/catalog.sample.json
```

Quando o repositorio publico de editais estiver pronto, configure a variavel:

```txt
VITE_EDITAIS_CATALOG_URL=https://raw.githubusercontent.com/USUARIO/REPOSITORIO/main/catalog.json
```

Estrutura recomendada para o repositorio de editais:

```txt
editais/
  nome-do-concurso/
    manifest.json
    edital.json
    capa.png
catalog.json
scripts/generate-catalog.mjs
```

O arquivo `scripts/generate-catalog.mjs` le cada `manifest.json` e gera o `catalog.json`.

## Importando a pasta "Editais Premium"

Também existe um importador para o formato simples:

```txt
Editais Premium/
  Nome do Concurso/
    foto-do-card.jpg
    arquivo-do-edital.json
    informacoes.txt
```

O `.txt` pode ter título, cargo, banca, ano e descrição em texto livre. O script extrai o que conseguir e gera os cards automaticamente.

Para importar a pasta local:

```bash
npm run import:premium -- "C:\Users\miche\Desktop\Editais Premium"
```

Esse comando copia imagem e JSON para `public/data/premium-editais/` e atualiza `public/data/catalog.sample.json`.

Quando a pasta virar um repositorio publico no GitHub, gere um `catalog.json` nesse repositorio e configure a landing page com:

```txt
VITE_EDITAIS_CATALOG_URL=https://raw.githubusercontent.com/USUARIO/REPOSITORIO/main/catalog.json
```
