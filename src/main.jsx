import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowLeft,
  BookOpenCheck,
  CalendarClock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  FileJson,
  FileText,
  Github,
  GraduationCap,
  Layers3,
  LibraryBig,
  Menu,
  MonitorCheck,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  X,
} from 'lucide-react';
import './styles.css';
import localCatalog from '../public/data/catalog.sample.json';
import { guideDetails, guideGroups } from './data/guides.js';

function getYouTubeEmbedUrl(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return `https://www.youtube-nocookie.com/embed/${match[1]}`;
  }
  return null;
}

const urlRegex = /https?:\/\/[^\s<]+/g;

function linkifyText(text) {
  const parts = [];
  let lastIndex = 0;
  let match;
  const regex = new RegExp(urlRegex.source, 'g');
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push({ url: match[0], start: match.index, end: match.index + match[0].length });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts.length === 1 && typeof parts[0] === 'string' ? text : parts;
}

function renderContent(value) {
  if (typeof value !== 'string') return value;
  const linked = linkifyText(value);
  if (typeof linked === 'string') return linked;
  return linked.map((part, i) =>
    typeof part === 'string' ? part : <a key={i} className="content-link" href={part.url} target="_blank" rel="noreferrer">{part.url}</a>
  );
}

const catalogUrl =
  import.meta.env.VITE_EDITAIS_CATALOG_URL ||
  'https://raw.githubusercontent.com/michel-softwares/Editais-Premium/main/catalog.json';
const localCatalogUrl = './data/catalog.sample.json';
const fallbackRelease = {
  version: 'v1.0.2',
  name: 'Track Concursos v1.0.2',
  downloadUrl: 'https://github.com/michel-softwares/track-concursos/releases/download/v1.0.2/TrackConcursos-Setup-v1.0.2.exe',
  htmlUrl: 'https://github.com/michel-softwares/track-concursos/releases/tag/v1.0.2',
  publishedAt: '2026-05-07T20:10:49Z',
  body: 'Atualização pequena focada em manutenção, novos fluxos de exportação, grupos de concursos, melhorias nos cronômetros, Painel da Prova e correções.',
  assets: [
    {
      name: 'TrackConcursos-Setup-v1.0.2.exe',
      browser_download_url: 'https://github.com/michel-softwares/track-concursos/releases/download/v1.0.2/TrackConcursos-Setup-v1.0.2.exe',
      size: 29321921,
      download_count: 0,
    },
  ],
};

const appScreenshots = [
  { src: './assets/screenshots/screen-01.png', alt: 'Mural de concursos do Track Concursos' },
  { src: './assets/screenshots/screen-02.png', alt: 'Tela de organização de concurso no Track Concursos' },
  { src: './assets/screenshots/screen-03.png', alt: 'Tela de edital e tópicos do Track Concursos' },
  { src: './assets/screenshots/screen-04.png', alt: 'Estatísticas de estudos no Track Concursos' },
  { src: './assets/screenshots/screen-05.png', alt: 'Painel de simulados do Track Concursos' },
  { src: './assets/screenshots/screen-06.png', alt: 'Ferramentas de estudo do Track Concursos' },
  { src: './assets/screenshots/screen-07.png', alt: 'Configurações do Track Concursos' },
  { src: './assets/screenshots/screen-08.png', alt: 'Fluxo de importação do Track Concursos' },
];

const navItems = [
  { id: 'home', label: 'Início' },
  { id: 'guias', label: 'Guias' },
  { id: 'editais', label: 'Editais Premium' },
  { id: 'release', label: 'Release' },
];

function getRoute() {
  return (window.location.hash.replace('#/', '') || 'home').split('?')[0];
}

function getGuideSlug() {
  const hash = window.location.hash.replace('#/guias', '');
  const params = new URLSearchParams(hash.startsWith('?') ? hash : '');
  return params.get('guia');
}

function App() {
  const [route, setRoute] = useState(getRoute);
  const [menuOpen, setMenuOpen] = useState(false);
  const [latestVersion, setLatestVersion] = useState(fallbackRelease.version);

  useEffect(() => {
    const onHashChange = () => setRoute(getRoute());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    fetch('https://api.github.com/repos/michel-softwares/track-concursos/releases/latest')
      .then((response) => {
        if (!response.ok) throw new Error();
        return response.json();
      })
      .then((data) => setLatestVersion(data.tag_name || fallbackRelease.version))
      .catch(() => {});
  }, []);

  const goTo = (id) => {
    window.location.hash = `/${id}`;
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-shell">
      <SiteHeader route={route} goTo={goTo} menuOpen={menuOpen} setMenuOpen={setMenuOpen} latestVersion={latestVersion} />
      <main>
        {route === 'guias' && <GuidesPage />}
        {route === 'editais' && <PremiumEditalsPage />}
        {route === 'release' && <ReleasePage />}
        {route !== 'guias' && route !== 'editais' && route !== 'release' && <HomePage goTo={goTo} />}
      </main>
      <Footer goTo={goTo} latestVersion={latestVersion} />
    </div>
  );
}

function SiteHeader({ route, goTo, menuOpen, setMenuOpen, latestVersion }) {
  return (
    <header className="site-header">
      <a className="brand" href="#/home" aria-label="Track Concursos">
        <img src="./assets/track-logo.png" alt="" />
        <span>Track Concursos</span>
      </a>
      <nav className={menuOpen ? 'nav nav-open' : 'nav'} aria-label="Navegação principal">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={route === item.id ? 'nav-link active' : 'nav-link'}
            onClick={() => goTo(item.id)}
          >
            {item.id === 'release' ? `Track Concursos ${latestVersion}` : item.label}
          </button>
        ))}
      </nav>
      <button className="icon-button menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menu">
        {menuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
    </header>
  );
}

function HomePage({ goTo }) {
  const [release, setRelease] = useState(fallbackRelease);
  const [starLightboxOpen, setStarLightboxOpen] = useState(false);

  useEffect(() => {
    fetch('https://api.github.com/repos/michel-softwares/track-concursos/releases/latest')
      .then((response) => {
        if (!response.ok) throw new Error('Release indisponível');
        return response.json();
      })
      .then((data) => {
        const exeAsset = (data.assets || []).find((asset) => asset.name.toLowerCase().endsWith('.exe'));
        setRelease({
          version: data.tag_name || fallbackRelease.version,
          downloadUrl: exeAsset?.browser_download_url || data.html_url || fallbackRelease.downloadUrl,
        });
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">Organizador de estudos 100% gratuito</p>
          <h1>Organize seus estudos com o Track Concursos!</h1>
          <p className="hero-text">
            O Track Concursos veio para facilitar a vida dos concurseiros que gostam de organizar seus estudos por planilhas.
            Com ele é possível verticalizar editais automaticamente; cadastrar todas as informações do Edital; configurar um painel de prova que lhe mostrará a nota real dos seus simulados; linkar PDFs, cadernos de questões, videoaulas em cada tópico para iniciar sua sessão de estudos com um clique. Também é possível analisar gráficos com suas estatísticas de estudos e muito mais! 
          </p>
          <div className="hero-actions">
            <a className="primary-button download-release-button" href={release.downloadUrl}>
              <span>
                Baixe a versão mais atual
                <small>{release.version}</small>
              </span>
              <Download size={18} />
            </a>
            <button className="secondary-button" onClick={() => goTo('guias')}>
              Ver Guias <BookOpenCheck size={18} />
            </button>
            <button className="secondary-button" onClick={() => goTo('editais')}>
              Editais Prontos <FileJson size={18} />
            </button>
            <button className="secondary-button release-nav-button" onClick={() => goTo('release')}>
              Track Concursos {release.version} <FileText size={18} />
            </button>
          </div>
        </div>
        <div className="hero-visual">
          <img src="./assets/hero-photo.png" alt="Material visual do Track Concursos" />
        </div>
      </section>

      <section className="feature-band">
        <SectionHeading
          eyebrow="Por que usar"
          title="Feito para registrar toda a sua jornada de estudos até a sonhada aprovação."
          text="Chega de perder tempo configurando planilhas, organizando pastas com editais e planilhas avulsas para cada concurso que você realiza, o Track Concursos foi pensado para fazer você aposentar as planilhas de vez e reunir todas as informações e estatísticas dos seus estudos em um lugar só."
        />
        <div className="feature-grid">
          <FeatureCard icon={<Target />} title="Prioridade por concurso" text="Você pode criar vários cards de concursos e priorizar aqueles que você deseja focar no momento." />
          <FeatureCard icon={<MonitorCheck />} title="Gráficos de Estatísticas" text="Visualize suas estatísticas de estudos em gráficos claros e intuitivos para uma análise pós-prova precisa ou durante seus estudos." />
          <FeatureCard icon={<FileJson />} title="Importação instantânea de Editais" text="Importe editais prontos já organizados para iniciar os estudos mais rapidamente." />
          <FeatureCard icon={<ShieldCheck />} title="Backup e continuidade" text="Você pode criar perfis diferentes e salvar seu progresso individualmente." />
        </div>
      </section>

      <section className="showcase-section">
        <div className="showcase-copy">
          <p className="eyebrow">Interface real do app</p>
          <h2>Veja como o Track Concursos funciona</h2>
          <p>
            Registre concursos já realizados; linke PDFs, videoaulas e cadernos de questões, localizados no seu PC ou em um Drive do Google, em cada tópico e muito mais.
          </p>
          <ul className="check-list">
            <li><CheckCircle2 size={18} /> Cards por concurso com banca, cargo, progresso e outras informações.</li>
            <li><CheckCircle2 size={18} /> Estatísticas gerais para acompanhar evolução.</li>
            <li><CheckCircle2 size={18} /> Importação de Editais Prontos para começar a estudar rapidamente.</li>
          </ul>
        </div>
        <ScreenshotCarousel screenshots={appScreenshots} />
      </section>

      <section className="github-star-section">
        <div className="github-star-copy">
          <p className="eyebrow">Apoie o projeto</p>
          <h2>Se gostou do Track Concursos, dê uma estrela no Github!</h2>
          <p>
            O projeto é gratuito e público. Dar uma estrela aumenta a visibilidade,
            mostra que a ferramenta está sendo útil e incentiva novas melhorias.
          </p>
          <a
            className="primary-button"
            href="https://github.com/michel-softwares/track-concursos"
            target="_blank"
            rel="noreferrer"
          >
            Acessar página do projeto no GitHub <Github size={18} />
          </a>
        </div>
        <button
          className="github-star-preview"
          onClick={() => setStarLightboxOpen(true)}
          aria-label="Ver imagem em tela cheia"
        >
          <img src="./assets/github-star.png" alt="Botão de estrela do Track Concursos no GitHub" />
        </button>
        {starLightboxOpen && (
          <div className="lightbox" role="dialog" aria-modal="true" aria-label="GitHub Star em tela cheia">
            <button className="lightbox-backdrop" onClick={() => setStarLightboxOpen(false)} aria-label="Fechar" />
            <div className="lightbox-content">
              <button className="lightbox-close" onClick={() => setStarLightboxOpen(false)} aria-label="Fechar">
                <X size={22} />
              </button>
              <img src="./assets/github-star.png" alt="Botão de estrela do Track Concursos no GitHub" />
            </div>
          </div>
        )}
      </section>

    </>
  );
}

function GuidesPage() {
  const [guideSlug, setGuideSlug] = useState(getGuideSlug);
  const selectedGuide = guideSlug ? guideDetails[guideSlug] : null;

  useEffect(() => {
    const onHashChange = () => setGuideSlug(getGuideSlug());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  if (selectedGuide) {
    return <GuideDetail guide={selectedGuide} />;
  }

  return (
    <section className="page-section">
      <SectionHeading
        eyebrow="Central de ajuda"
        title="Guias e tutoriais do Track Concursos"
        text="A estrutura já está organizada para você preencher cada guia depois, mantendo uma experiência limpa para o usuário final."
      />
      <div className="guide-layout">
        {guideGroups.map((group) => (
          <article className="guide-group" key={group.title}>
            <div className="guide-group-header">
              <group.icon size={22} />
              <div>
                <h2>{group.title}</h2>
                <p>{group.description}</p>
              </div>
            </div>
            <div className="guide-list">
              {group.guides.map((guide) => (
                <a className="guide-item" href={`#/guias?guia=${guide.slug}`} key={guide.slug}>
                  <span>{guide.title}</span>
                  <small className={`badge ${guide.status === 'Pronto' ? 'badge-pronto' : 'badge-em-breve'}`}>{guide.status}</small>
                </a>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function GuideDetail({ guide }) {
  const [release, setRelease] = useState(fallbackRelease);
  const [htmlContent, setHtmlContent] = useState(null);
  const [htmlLoading, setHtmlLoading] = useState(false);

  useEffect(() => {
    fetch('https://api.github.com/repos/michel-softwares/track-concursos/releases/latest')
      .then((response) => {
        if (!response.ok) throw new Error('Release indisponível');
        return response.json();
      })
      .then((data) => {
        const exeAsset = (data.assets || []).find((asset) => asset.name.toLowerCase().endsWith('.exe'));
        setRelease({
          version: data.tag_name || fallbackRelease.version,
          downloadUrl: exeAsset?.browser_download_url || data.html_url || fallbackRelease.downloadUrl,
        });
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (guide.htmlFile) {
      setHtmlLoading(true);
      fetch(guide.htmlFile)
        .then((res) => res.text())
        .then((html) => {
          const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
          setHtmlContent(bodyMatch ? bodyMatch[1] : html);
          setHtmlLoading(false);
        })
        .catch(() => setHtmlLoading(false));
    }
  }, [guide.htmlFile]);

  return (
    <section className="page-section guide-detail-page">
      <a className="back-link" href="#/guias">
        <ArrowLeft size={18} /> Voltar para guias
      </a>
      <article className="guide-article">
        <p className="eyebrow">{guide.category}</p>
        <h1>{guide.title}</h1>
        <p className="guide-lead">{guide.description}</p>

        <div className="guide-article-body">
          {htmlLoading ? (
            <p>Carregando guia...</p>
          ) : htmlContent ? (
            <div className="guide-html-content" dangerouslySetInnerHTML={{ __html: htmlContent }} />
          ) : (
            guide.sections?.map((section) => (
              <section key={section.title}>
                <h2>{section.title}</h2>
                {section.paragraphs?.map((paragraph) => <p key={paragraph}>{renderContent(paragraph)}</p>)}
                {section.items && (
                  <ul>
                    {section.items.map((item) => <li key={item}>{renderContent(item)}</li>)}
                  </ul>
                )}
                {section.video && (() => {
                  const embedUrl = getYouTubeEmbedUrl(section.video);
                  return embedUrl ? (
                    <div className="video-embed">
                      <iframe src={embedUrl} title={section.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen loading="lazy" />
                    </div>
                  ) : null;
                })()}
              </section>
            ))
          )}
        </div>

        <div className="guide-download-cta">
          <p className="eyebrow">Pronto para começar?</p>
          <h2>Baixe o Track Concursos</h2>
          <p>Clique no botão abaixo para baixar a versão mais recente do aplicativo.</p>
          <a className="primary-button download-release-button" href={release.downloadUrl}>
            <span>
              Baixe a versão mais atual
              <small>{release.version}</small>
            </span>
            <Download size={18} />
          </a>
        </div>
      </article>
    </section>
  );
}

function ScreenshotCarousel({ screenshots }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % screenshots.length);
    }, 5500);

    return () => window.clearInterval(timer);
  }, [screenshots.length]);

  useEffect(() => {
    if (!lightboxOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setLightboxOpen(false);
      if (event.key === 'ArrowLeft') previous();
      if (event.key === 'ArrowRight') next();
    };

    document.body.classList.add('modal-open');
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.classList.remove('modal-open');
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [lightboxOpen]);

  const previous = () => {
    setActiveIndex((current) => (current === 0 ? screenshots.length - 1 : current - 1));
  };

  const next = () => {
    setActiveIndex((current) => (current + 1) % screenshots.length);
  };

  return (
    <div className="screenshot-carousel" aria-label="Prints reais do Track Concursos">
      <div className="carousel-viewport">
        {screenshots.map((screenshot, index) => (
          <button
            key={screenshot.src}
            className={index === activeIndex ? 'carousel-slide active' : 'carousel-slide'}
            onClick={() => setLightboxOpen(true)}
            aria-label="Abrir print em tela cheia"
          >
            <img src={screenshot.src} alt={screenshot.alt} />
          </button>
        ))}
      </div>
      <div className="carousel-controls">
        <button className="carousel-arrow" onClick={previous} aria-label="Print anterior">
          <ChevronLeft size={20} />
        </button>
        <div className="carousel-dots" aria-label="Selecionar print">
          {screenshots.map((screenshot, index) => (
            <button
              key={screenshot.src}
              className={index === activeIndex ? 'carousel-dot active' : 'carousel-dot'}
              onClick={() => setActiveIndex(index)}
              aria-label={`Mostrar print ${index + 1}`}
            />
          ))}
        </div>
        <button className="carousel-arrow" onClick={next} aria-label="Proximo print">
          <ChevronRight size={20} />
        </button>
      </div>
      {lightboxOpen && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Prints do Track Concursos em tela cheia">
            <button className="lightbox-backdrop" onClick={() => setLightboxOpen(false)} aria-label="Fechar visualização" />
          <div className="lightbox-content">
            <button className="lightbox-close" onClick={() => setLightboxOpen(false)} aria-label="Fechar">
              <X size={22} />
            </button>
            <button className="lightbox-arrow left" onClick={previous} aria-label="Print anterior">
              <ChevronLeft size={26} />
            </button>
            <img src={screenshots[activeIndex].src} alt={screenshots[activeIndex].alt} />
            <button className="lightbox-arrow right" onClick={next} aria-label="Proximo print">
              <ChevronRight size={26} />
            </button>
            <div className="lightbox-counter">
              {activeIndex + 1} / {screenshots.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PremiumEditalsPage() {
  const [catalog, setCatalog] = useState([]);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('Carregando catálogo...');

  useEffect(() => {
    let cancelled = false;
    const isLocal = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1' || 
                    window.location.protocol === 'file:';
    
    if (isLocal) {
      // Prioritize bundled local catalog directly to bypass browser security/CORS on file://
      const items = (localCatalog.editais || []).map((item) => normalizeCatalogItem(item, './data/catalog.sample.json', localCatalog.atualizadoEm));
      setCatalog(items);
      setStatus('');
      hydrateCatalogExamNotices(items).then((hydrated) => {
        if (!cancelled) setCatalog(hydrated);
      });
    } else {
      // Online mode: fetch from remote URL
      const freshCatalogUrl = withCacheBust(catalogUrl);
      fetch(freshCatalogUrl, { cache: 'no-store' })
        .then((response) => {
          if (!response.ok) throw new Error('Catálogo indisponível');
          return response.json();
        })
        .then((data) => {
          const items = (data.editais || []).map((item) => normalizeCatalogItem(item, freshCatalogUrl, data.atualizadoEm));
          if (cancelled) return;
          setCatalog(items);
          setStatus('');
          hydrateCatalogExamNotices(items).then((hydrated) => {
            if (!cancelled) setCatalog(hydrated);
          });
        })
        .catch(() => {
          // Fallback to bundled local catalog
          if (cancelled) return;
          const items = (localCatalog.editais || []).map((item) => normalizeCatalogItem(item, './data/catalog.sample.json', localCatalog.atualizadoEm));
          setCatalog(items);
          setStatus('');
          hydrateCatalogExamNotices(items).then((hydrated) => {
            if (!cancelled) setCatalog(hydrated);
          });
        });
    }

    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    let list = catalog;
    const normalized = normalizeSearchText(query);
    if (normalized) {
      list = catalog.filter((item) => {
        const haystack = [item.titulo, item.orgao, item.banca, item.cargo, item.descricao, item.arquivoNome, ...(item.tags || [])]
          .join(' ')
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase();
        return haystack.includes(normalized);
      });
    }

    // Sort: destaque (premium) first, then alphabetical by title
    return [...list].sort((a, b) => {
      const aDestaque = a.destaque ? 1 : 0;
      const bDestaque = b.destaque ? 1 : 0;
      if (aDestaque !== bDestaque) {
        return bDestaque - aDestaque;
      }
      return a.titulo.localeCompare(b.titulo, 'pt-BR');
    });
  }, [catalog, query]);

  return (
    <section className="page-section premium-page">
      <div className="premium-hero">
        <div>
          <p className="eyebrow">Biblioteca pública</p>
          <h1>Pesquise e baixe estruturas de Pré ou Pós-edital prontas para importar e começar a estudar!</h1>
          <p>
            Todos os Editais aqui são disponibilizados de graça, possuem conteúdo programático verticalizado, painel de prova com quantidade de questões + pesos já preenchido, Ciclo de Estudos sugeridos, edital oficial linkado e diversas outras informações essenciais. Baixe, importe e comece a estudar sem perder tempo se organizando!
          </p>
        </div>
        <div className="repo-card">
          <Github size={24} />
          <strong>Editais Premium gratuitos</strong>
          <span>esses editais são organizados por mim e disponibilizados gratuitamente, se não encontrou um edital para o concurso que você quer estudar entre em contato comigo e solicite um Edital Premium GRÁTIS! Peço apenas que apoie o projeto dando uma Estrela no repositório Github</span>
          <a
            href="https://github.com/michel-softwares/track-concursos/stargazers"
            target="_blank"
            rel="noreferrer"
            className="github-star-shields-link"
          >
            <img
              src="https://img.shields.io/github/stars/michel-softwares/track-concursos?label=Star&style=social"
              alt="GitHub Stars"
            />
          </a>
        </div>
      </div>

      <div className="search-panel">
        <Search size={20} />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Pesquisar por concurso, órgão, banca, cargo ou tag"
          aria-label="Pesquisar editais premium"
        />
      </div>

      {status && <p className="catalog-status">{status}</p>}
      <div className="results-toolbar">
        <span>{filtered.length} editais encontrados</span>
        <small>Origem: <code>{catalogUrl}</code></small>
      </div>
      <div className="editals-grid">
        {filtered.map((item) => {
          const hasVideos = item.materiais?.includes('youtube') || item.materiais?.includes('estrategia');
          const hasQuestions = item.materiais?.includes('qconcursos') || item.materiais?.includes('tecconcursos');
          
          let badgeText = 'PREMIUM LINKADO';
          let highlightText = 'materiais de estudo';
          
          if (hasVideos && hasQuestions) {
            badgeText = 'AULAS + QUESTÕES';
            highlightText = 'videoaulas e cadernos de questões';
          } else if (hasQuestions) {
            badgeText = 'CADERNOS DE QUESTÕES';
            highlightText = 'cadernos de questões';
          } else if (hasVideos) {
            badgeText = 'VIDEOAULAS INCLUSAS';
            highlightText = 'videoaulas';
          }

          return (
            <article className={`edital-card ${item.destaque ? 'destaque' : ''}`} key={item.id}>
              {item.destaque && (
                <span className="destaque-badge">
                  <Star size={12} fill="currentColor" /> Premium
                </span>
              )}
              {item.materiais && item.materiais.length > 0 && (
                <div className="edital-materials-badges premium-badge-box">
                  <span className="premium-badge-text">{badgeText}</span>
                  <div className="premium-badge-logos">
                    {item.materiais.map((mat) => (
                      <img
                        key={mat}
                        src={`./logos/${mat}.png`}
                        alt={mat}
                        className="material-logo-badge"
                        title={`Material: ${mat}`}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <img src={item.imagem} alt={`Capa do edital ${item.titulo}`} />
              <div className="edital-content">
                <div className="edital-topline">
                  <span>{item.banca}</span>
                  <span>{item.ano}</span>
                </div>
                <h2>{item.titulo}</h2>
                <p>{item.cargo}</p>
                {item.materiais && item.materiais.length > 0 ? (
                  <div className="premium-highlight-info">
                    <CheckCircle2 size={16} className="highlight-icon" />
                    <span>Possui <strong>{highlightText}</strong> linkados tópico por tópico!</span>
                  </div>
                ) : (
                  item.descricao && <p className="edital-description">{item.descricao}</p>
                )}
                {item.examNotice && (
                  <div className={`exam-notice ${item.examNotice.type}`}>
                    <CalendarClock size={17} />
                    <span>{item.examNotice.text}</span>
                  </div>
                )}
                <button className={`download-button ${item.destaque ? 'button-destaque' : ''}`} onClick={() => downloadCatalogFile(item)}>
                  Baixar JSON <Download size={17} />
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function ReleasePage() {
  const [release, setRelease] = useState(fallbackRelease);
  const [status, setStatus] = useState('Carregando release mais recente...');

  useEffect(() => {
    fetch('https://api.github.com/repos/michel-softwares/track-concursos/releases/latest', { cache: 'no-store' })
      .then((response) => {
        if (!response.ok) throw new Error('Release indisponível');
        return response.json();
      })
      .then((data) => {
        const exeAsset = (data.assets || []).find((asset) => asset.name.toLowerCase().endsWith('.exe'));
        setRelease({
          version: data.tag_name || fallbackRelease.version,
          name: data.name || data.tag_name || fallbackRelease.name,
          downloadUrl: exeAsset?.browser_download_url || data.html_url || fallbackRelease.downloadUrl,
          htmlUrl: data.html_url || fallbackRelease.htmlUrl,
          publishedAt: data.published_at || fallbackRelease.publishedAt,
          body: data.body || fallbackRelease.body,
          assets: data.assets?.length ? data.assets : fallbackRelease.assets,
        });
        setStatus('');
      })
      .catch(() => {
        setRelease(fallbackRelease);
        setStatus('Mostrando informações salvas localmente.');
      });
  }, []);

  const releaseSections = useMemo(() => parseReleaseNotes(release.body), [release.body]);
  const installer = release.assets?.find((asset) => asset.name.toLowerCase().endsWith('.exe'));
  const extraAssets = (release.assets || []).filter((asset) => asset !== installer);

  return (
    <section className="page-section release-page">
      <div className="release-hero">
        <div>
          <p className="eyebrow">Última versão</p>
          <h1>{release.name || release.version}</h1>
          <p>
            Informações sincronizadas automaticamente com o release mais recente publicado no GitHub.
          </p>
        </div>
        <div className="release-download-card">
          <span>{release.version}</span>
          <strong>{formatReleaseDate(release.publishedAt)}</strong>
          <a className="primary-button" href={release.downloadUrl}>
            Baixar instalador <Download size={18} />
          </a>
          <a className="github-release-link" href={release.htmlUrl} target="_blank" rel="noreferrer">
            Ver no GitHub
          </a>
        </div>
      </div>

      {status && <p className="catalog-status">{status}</p>}

      <div className="release-grid">
        <article className="release-notes">
          <h2>Notas da versão</h2>
          <div className="release-note-list">
            {releaseSections.map((section) => (
              <section key={section.title}>
                <h3>{section.title}</h3>
                {section.paragraphs.map((paragraph) => {
                  const embedUrl = getYouTubeEmbedUrl(paragraph.trim());
                  return embedUrl ? (
                    <div key={paragraph} className="video-embed">
                      <iframe src={embedUrl} title={section.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen loading="lazy" />
                    </div>
                  ) : (
                    <p key={paragraph}>{renderContent(paragraph)}</p>
                  );
                })}
                {section.items.length > 0 && (
                  <ul>
                    {section.items.map((item) => {
                      const embedUrl = getYouTubeEmbedUrl(item.trim());
                      return embedUrl ? (
                        <li key={item} style={{ listStyle: 'none', paddingLeft: 0 }}>
                          <div className="video-embed">
                            <iframe src={embedUrl} title={section.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen loading="lazy" />
                          </div>
                        </li>
                      ) : (
                        <li key={item}>{renderContent(item)}</li>
                      );
                    })}
                  </ul>
                )}
              </section>
            ))}
          </div>
        </article>

        <aside className="release-assets">
          <h2>Arquivos</h2>
          {installer && <AssetCard asset={installer} primary />}
          {extraAssets.map((asset) => <AssetCard asset={asset} key={asset.name} />)}
        </aside>
      </div>
    </section>
  );
}

function AssetCard({ asset, primary = false }) {
  return (
    <a className={primary ? 'asset-card primary-asset' : 'asset-card'} href={asset.browser_download_url}>
      <div>
        <strong>{asset.name}</strong>
        <span>{formatBytes(asset.size)} - {asset.download_count ?? 0} downloads</span>
      </div>
      <Download size={18} />
    </a>
  );
}

async function downloadCatalogFile(item) {
  const response = await fetch(item.arquivo, { cache: 'no-store' });
  if (!response.ok) throw new Error('Arquivo indisponível');

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = item.arquivoNome || `${item.id || 'edital'}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(objectUrl);
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

function normalizeCatalogItem(item, baseUrl = catalogUrl, catalogVersion = '') {
  const version = item.atualizadoEm || catalogVersion || Date.now();

  return {
    ...item,
    imagem: normalizeCatalogUrl(item.imagem, baseUrl, version),
    arquivo: normalizeCatalogUrl(item.arquivo, baseUrl, version),
    destaque: item.destaque || item.tags?.includes('destaque') || item.tags?.includes('premium') || false,
    materiais: item.materiais || [],
  };
}

async function hydrateCatalogExamNotices(items) {
  return Promise.all(
    items.map(async (item) => {
      try {
        const response = await fetch(item.arquivo, { cache: 'no-store' });
        if (!response.ok) throw new Error('Arquivo indisponível');
        const data = await response.json();
        const examNotice = getExamNotice(item, data);
        
        // Auto-detect materials from JSON file
        const autoMaterials = detectMaterials(data);
        const combinedMaterials = Array.from(new Set([
          ...(item.materiais || []),
          ...autoMaterials
        ]));

        const hasDestaqueInJson = data.destaque === true || 
                                  data.concurso?.destaque === true || 
                                  data.premium === true ||
                                  data.concurso?.premium === true;

        return { 
          ...item, 
          examNotice,
          materiais: combinedMaterials,
          destaque: item.destaque || hasDestaqueInJson,
        };
      } catch {
        return item;
      }
    }),
  );
}

function getExamNotice(item, data) {
  const concurso = data?.concurso || {};
  if (!isPostEdital(item, concurso)) return null;

  const examDate = parseExamDate(concurso.dataProva);
  if (!examDate) return null;

  const today = getLocalDateOnly();
  const diffDays = Math.ceil((examDate.getTime() - today.getTime()) / 86400000);

  if (diffDays < 0) {
    return {
      type: 'past',
      text: 'A prova desse concurso já passou, mas você ainda pode utilizar a estrutura como pré-edital e estudar pro próximo concurso!',
    };
  }

  const formattedDate = formatExamDate(examDate);
  const daysText = diffDays === 1 ? '1 dia' : `${diffDays} dias`;
  const scheduleWarning =
    ' ⚠️ O cronograma e a data da prova podem ser modificados pela banca a qualquer momento. Fique sempre atento às retificações!';
  const text =
    diffDays === 0
      ? `A prova desse concurso ocorrerá hoje, no dia ${formattedDate}.${scheduleWarning}`
      : `A prova desse concurso ocorrerá em ${daysText} no dia ${formattedDate}.${scheduleWarning}`;

  return {
    type: 'upcoming',
    text,
  };
}

function isPostEdital(item, concurso) {
  if (concurso.preEdital === false) return true;
  if (concurso.preEdital === true) return false;

  const source = [item.titulo, item.descricao, item.arquivoNome, item.arquivo, ...(item.tags || [])]
    .filter(Boolean)
    .join(' ');

  return normalizeSearchText(source).includes('pos-edital');
}

function parseExamDate(value) {
  if (!value) return null;
  if (value instanceof Date && !Number.isNaN(value.getTime())) return getLocalDateOnly(value);

  const raw = String(value).trim();
  const isoMatch = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) return buildValidDate(Number(isoMatch[1]), Number(isoMatch[2]), Number(isoMatch[3]));

  const brMatch = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (brMatch) return buildValidDate(Number(brMatch[3]), Number(brMatch[2]), Number(brMatch[1]));

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return null;
  return getLocalDateOnly(parsed);
}

function buildValidDate(year, month, day) {
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  return date;
}

function getLocalDateOnly(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function formatExamDate(date) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

function normalizeCatalogUrl(value, baseUrl = catalogUrl, version = '') {
  if (!value || value.startsWith('http') || value.startsWith('/')) {
    return version && value ? appendCacheBust(value, version) : value;
  }

  if (!baseUrl.startsWith('http')) return value;

  try {
    return appendCacheBust(new URL(value, baseUrl).href, version);
  } catch {
    return value;
  }
}

function withCacheBust(url) {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}v=${Date.now()}`;
}

function appendCacheBust(url, version) {
  if (!version) return url;
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}v=${encodeURIComponent(version)}`;
}

function normalizeSearchText(value) {
  return value
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function formatReleaseDate(value) {
  if (!value) return 'Data indisponível';
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value));
}

function formatBytes(value = 0) {
  if (!value) return 'Tamanho indisponível';
  const mb = value / 1024 / 1024;
  return `${mb.toFixed(1)} MB`;
}

function parseReleaseNotes(markdown = '') {
  const sections = [];
  let current = { title: 'Resumo', paragraphs: [], items: [] };

  for (const rawLine of markdown.split('\n')) {
    const line = rawLine.trim();
    if (!line) continue;

    if (line.startsWith('#')) {
      const title = line.replace(/^#+\s*/, '').trim();
      if (title && !title.toLowerCase().startsWith('track concursos')) {
        if (current.paragraphs.length || current.items.length || current.title !== 'Resumo') sections.push(current);
        current = { title, paragraphs: [], items: [] };
      }
      continue;
    }

    if (line.startsWith('- ')) {
      current.items.push(stripMarkdown(line.slice(2)));
      continue;
    }

    if (/^\d+\.\s/.test(line)) {
      current.items.push(stripMarkdown(line.replace(/^\d+\.\s/, '')));
      continue;
    }

    current.paragraphs.push(stripMarkdown(line));
  }

  if (current.paragraphs.length || current.items.length || sections.length === 0) sections.push(current);
  return sections.slice(0, 8);
}

function stripMarkdown(value) {
  return value
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .trim();
}

function Metric({ value, label }) {
  return (
    <div>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function FeatureCard({ icon, title, text }) {
  return (
    <article className="feature-card">
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

function SectionHeading({ eyebrow, title, text }) {
  return (
    <div className="section-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  );
}

function Step({ number, title, text }) {
  return (
    <article className="step-card">
      <span>{number}</span>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

function Footer({ goTo, latestVersion }) {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <strong>Track Concursos</strong>
        <p>Esse projeto é gratuito para uso pessoal, sendo proibida sua comercialização sem minha autorização.</p>
      </div>
      <div className="footer-info">
        <span>© 2026 Todos os direitos reservados</span>
        <a className="footer-michel-logo" href="https://github.com/michel-softwares" target="_blank" rel="noreferrer" aria-label="GitHub da Michel Softwares">
          <img src="./assets/michel-softwares.png" alt="Michel Softwares" />
        </a>
      </div>
    </footer>
  );
}

createRoot(document.getElementById('root')).render(<App />);
