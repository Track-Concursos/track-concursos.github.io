import { FileJson, GraduationCap, HardDriveDownload, Layers3, Sparkles } from 'lucide-react';

export const guideGroups = [
     {
    title: 'Instalação',
    description: 'Requisitos e instalação',
    icon: HardDriveDownload,
    guides: [
      { title: 'Windows 11: Requisitos e link para download', slug: 'requisitos-instalacao', status: 'Pronto' },
    ],
  },
  {
    title: 'Primeiros passos',
    description: 'Criando ou importando seu primeiro card de Concurso.',
    icon: GraduationCap,
    guides: [
      { title: 'Cadastrando seu primeiro concurso', slug: 'instalacao', status: 'Em breve' },
      { title: 'Importando um Edital Premium', slug: 'primeiro-concurso', status: 'Em breve' },
    ],
  },
  {
    title: 'Organizacao de estudos',
    description: 'Use progresso, questoes e simulados para tomar decisoes melhores.',
    icon: Layers3,
    guides: [
      { title: 'Como registrar horas e questões manualmente', slug: 'questoes', status: 'Em breve' },
      { title: 'Como preencher o Painel da Prova', slug: 'taxa-acertos', status: 'Em breve' },
      { title: 'Como configurar um Ciclo de Estudos', slug: 'simulados', status: 'Em breve' },
    ],
  },
  {
    title: 'Editais Premium',
    description: 'Importe estruturas prontas.',
    icon: FileJson,
    guides: [
      { title: 'Baixando um edital premium', slug: 'baixar-edital-premium', status: 'Em breve' },
      { title: 'Importando o arquivo JSON', slug: 'importar-json', status: 'Em breve' },
      { title: 'Atualizando um edital ja existente', slug: 'atualizar-edital', status: 'Em breve' },
    ],
  },
   {
    title: 'Recursos avancados',
    description: 'Espaco para guias futuros sobre ferramentas, automacoes e prompts com IA.',
    icon: Sparkles,
    guides: [
      { title: 'Como verticalizar automaticamente um edital com auxílio de uma IA', slug: 'links-sugeridos', status: 'Em breve' },
      { title: 'Como exportar um Edital feito por você', slug: 'catalogos-drive', status: 'Em breve' },
      { title: 'Linkar automaticamente todos os seus livros PDFs nos tópicos', slug: 'revisao', status: 'Em breve' },
    ],
  },
];

export const guideDetails = {
  'requisitos-instalacao': {
    category: 'Instalacao',
    title: 'Requisitos e link para download',
    description:
      'Veja o que voce precisa para instalar o Track Concursos e onde baixar a versao mais recente do aplicativo.',
    sections: [
      {
        title: 'Requisitos recomendados',
        paragraphs: [
          'Atualmente o Track Concursos é compatível com Windows 11. O único requisito é ter instalado:',
        ],
        items: [
          'Sistema operacional Windows 11.',
          'Microsoft Edge WebView2 (O instalador avisará se for necessário baixar). Link para download: https://go.microsoft.com/fwlink/p/?LinkId=2124703 ',
        ],
      },
      {
        title: 'Como baixar',
        paragraphs: [
          'Acesse a pagina de lançamentos do Track Concursos no GitHub para baixar a versão mais recente do aplicativo. Link: https://github.com/michel-softwares/track-concursos/releases',
        ],
      },
    ],
  },
};
