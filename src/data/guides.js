import { GraduationCap, HardDriveDownload, Layers3, Sparkles } from 'lucide-react';

export const guideGroups = [
  {
    title: 'Instalação',
    description: 'Requisitos e instalação',
    icon: HardDriveDownload,
    guides: [
      { title: 'Windows 10 e 11: Requisitos e link para download', slug: 'requisitos-instalacao', status: 'Pronto' },
    ],
  },
  {
    title: 'Primeiros passos',
    description: 'Criando ou importando seu primeiro card de Concurso.',
    icon: GraduationCap,
    guides: [
      { title: 'Cadastrando seu pré ou pós-edital', slug: 'cadastrando-manual', status: 'Pronto' },
      { title: 'Baixando e Importando um Edital Premium', slug: 'primeiro-concurso', status: 'Pronto' },
      { title: 'Mural de Concursos Realizados', slug: 'mural-concursos', status: 'Pronto' },
    ],
  },
  {
    title: 'Organização de estudos',
    description: 'Use progresso, questões e simulados para tomar decisões melhores.',
    icon: Layers3,
    guides: [
      { title: 'Como registrar horas e questões manualmente', slug: 'questoes', status: 'Pronto' },
      { title: 'Como preencher o Painel da Prova', slug: 'painel-prova', status: 'Pronto' },
      { title: 'Como configurar um Ciclo de Estudos', slug: 'simulados', status: 'Em breve' },
    ],
  },
  {
    title: 'Recursos avançados',
    description: 'Espaço para guias futuros sobre ferramentas, automações e prompts com IA.',
    icon: Sparkles,
    guides: [
      { title: 'Como verticalizar automaticamente um edital com auxílio de uma IA', slug: 'links-sugeridos', status: 'Em breve' },
      { title: 'Como exportar um Edital feito por você', slug: 'catalogos-drive', status: 'Em breve' },
      { title: 'Linkar automaticamente todos os seus livros PDFs nos tópicos', slug: 'revisao', status: 'Em breve' },
      { title: 'Adicionar matérias extras com auxílio de IA', slug: 'materias-extras-ia', status: 'Em breve' },
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
  'primeiro-concurso': {
    htmlFile: 'guides/primeiro-concurso.html',
    category: 'Primeiros passos',
    title: 'Importando um Edital Premium',
    description:
      'Saiba como instalar Editais Premium facilmente no Track Concursos e comece a estudar agora!',
  },
  'cadastrando-manual': {
    htmlFile: 'guides/cadastrando-manual.html',
    category: 'Primeiros passos',
    title: 'Cadastrando seu pré ou pós-edital',
    description:
      'Veja o passo a passo de como cadastrar manualmente um pré ou pós-edital no Track Concursos.',
  },
  'mural-concursos': {
    htmlFile: 'guides/mural-concursos.html',
    category: 'Primeiros passos',
    title: 'Mural de Concursos Realizados',
    description:
      'Entenda como funciona o Mural de Concursos Realizados.',
  },
  'questoes': {
    htmlFile: 'guides/questoes.html',
    category: 'Organização de estudos',
    title: 'Como registrar horas e questões manualmente',
    description:
      'Veja o passo a passo de como registrar suas horas de estudo e o lançamento de questões de forma manual.',
  },
  'painel-prova': {
    htmlFile: 'guides/painel-prova.html',
    category: 'Organização de estudos',
    title: 'Como preencher o Painel da Prova',
    description:
      'Aprenda como preencher o Painel da Prova no Track Concursos para acompanhar seu desempenho.',
  },
};
