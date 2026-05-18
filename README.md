# Track Concursos Landing Page

## Analytics dos Editais Premium

Para contabilizar downloads dos arquivos `.json`, configure a variavel de ambiente do Vite:

```env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Todo clique bem-sucedido no botao "Baixar JSON" envia o evento `download_edital_premium` para o Google Analytics com os parametros `edital_id`, `edital_titulo`, `arquivo_nome`, `orgao`, `banca` e `cargo`.

Novos editais adicionados ao catalogo entram automaticamente nessa contagem individual, sem configuracao extra por arquivo.

Landing page pública para apresentar o Track Concursos no GitHub Pages.

A landing page sincroniza informações do release atual e de editais premium automaticamente.
