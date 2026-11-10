/**
 * Reader progressive enhancements:
 * 1. Mermaid diagram zoom / height controls & local bundled dynamic fallback (zero external CDN).
 * 2. Contextual collapsible TOC chapters + scroll-spy active location tracking.
 * 3. Auto-expanding #research-details when navigating to reference/contract heading anchors.
 */

function initMermaidControls(): void {
  const figures = document.querySelectorAll<HTMLElement>('.mermaid-figure');
  figures.forEach((figure) => {
    const viewport = figure.querySelector<HTMLElement>('.mermaid-viewport');
    const stage = figure.querySelector<HTMLElement>('.mermaid-svg-stage');
    const resetBtn = figure.querySelector<HTMLButtonElement>('[data-zoom-action="reset"]');
    const expandBtn = figure.querySelector<HTMLButtonElement>('[data-zoom-action="toggle-height"]');
    if (!viewport || !stage) return;

    let zoom = 1;
    const applyZoom = (nextZoom: number) => {
      zoom = Math.min(2.25, Math.max(0.5, Math.round(nextZoom * 100) / 100));
      const svg = stage.querySelector<SVGElement>('svg');
      if (svg) {
        const naturalW = Number(figure.dataset.diagramWidth) || svg.getBoundingClientRect().width || 800;
        if (zoom === 1) {
          delete figure.dataset.zoomed;
          svg.style.removeProperty('width');
          svg.style.removeProperty('height');
        } else {
          figure.dataset.zoomed = 'true';
          svg.style.width = `${Math.round(naturalW * zoom)}px`;
          svg.style.height = 'auto';
        }
      }
      if (resetBtn) {
        resetBtn.textContent = `${Math.round(zoom * 100)}%`;
      }
    };

    figure.addEventListener('click', (evt) => {
      const btn = (evt.target as HTMLElement | null)?.closest<HTMLButtonElement>('[data-zoom-action]');
      if (!btn) return;
      const action = btn.dataset.zoomAction;
      if (action === 'in') applyZoom(zoom + 0.25);
      else if (action === 'out') applyZoom(zoom - 0.25);
      else if (action === 'reset') applyZoom(1);
      else if (action === 'toggle-height') {
        const expanded = viewport.classList.toggle('is-expanded');
        btn.setAttribute('aria-expanded', String(expanded));
        const isZh = document.documentElement.lang.startsWith('zh');
        btn.textContent = expanded
          ? (isZh ? '收合高度' : 'Compact height')
          : (isZh ? '展開全高' : 'Full height');
      }
    });
  });
}

async function renderPendingMermaidDiagrams(): Promise<void> {
  const pending = document.querySelectorAll<HTMLElement>('.mermaid-figure[data-mermaid-pending="true"]');
  if (pending.length === 0) return;

  try {
    const { default: mermaid } = await import('mermaid');
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'strict',
      theme: 'base',
      flowchart: { htmlLabels: true, curve: 'basis', padding: 20, useMaxWidth: false },
      themeVariables: {
        darkMode: true,
        background: '#0d1322',
        primaryColor: '#1a2234',
        primaryTextColor: '#f8fafc',
        primaryBorderColor: '#38bdf8',
        secondaryColor: '#121826',
        secondaryTextColor: '#e2e8f0',
        lineColor: '#7dd3fc',
        textColor: '#f8fafc',
        clusterBkg: '#111827',
        clusterBorder: '#334155',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        fontSize: '14px',
      },
    });

    for (let i = 0; i < pending.length; i++) {
      const figure = pending[i];
      const src = figure.dataset.mermaidSrc || '';
      const stage = figure.querySelector<HTMLElement>('.mermaid-svg-stage');
      const errBox = figure.querySelector<HTMLElement>('.mermaid-error-box');
      const errMsg = figure.querySelector<HTMLElement>('.mermaid-error-msg');
      const hash = figure.dataset.mermaidHash || String(i);
      if (!stage) continue;

      try {
        const { svg } = await mermaid.render(`mermaid-live-${hash}-${i}`, src);
        stage.innerHTML = svg;
        const svgEl = stage.querySelector('svg');
        if (svgEl) {
          const vb = svgEl.getAttribute('viewBox') || '';
          const m = vb.match(/[\d.-]+\s+[\d.-]+\s+([\d.]+)\s+([\d.]+)/);
          if (m) {
            figure.dataset.diagramWidth = String(Math.ceil(parseFloat(m[1])));
            figure.dataset.diagramHeight = String(Math.ceil(parseFloat(m[2])));
          }
          svgEl.setAttribute('role', 'img');
        }
        figure.dataset.mermaidRendered = 'true';
        figure.removeAttribute('data-mermaid-pending');
        figure.classList.remove('mermaid-figure-pending');
      } catch (renderErr) {
        figure.classList.add('mermaid-figure-error');
        stage.innerHTML = '';
        if (errMsg) errMsg.textContent = String(renderErr);
        if (errBox) errBox.hidden = false;
        const sourceDrawer = figure.querySelector<HTMLDetailsElement>('.mermaid-source-drawer');
        if (sourceDrawer) sourceDrawer.open = true;
      }
    }
  } catch (loadErr) {
    pending.forEach((figure) => {
      const errBox = figure.querySelector<HTMLElement>('.mermaid-error-box');
      const errMsg = figure.querySelector<HTMLElement>('.mermaid-error-msg');
      if (errMsg) errMsg.textContent = String(loadErr);
      if (errBox) errBox.hidden = false;
    });
  }
}

function openParentDetailsForTarget(targetId: string): void {
  if (!targetId) return;
  const el = document.getElementById(targetId);
  if (!el) return;
  let parent: HTMLElement | null = el;
  while (parent) {
    if (parent.tagName === 'DETAILS') {
      (parent as HTMLDetailsElement).open = true;
    }
    parent = parent.parentElement;
  }
}

function initTocInteraction(): void {
  const tocRoots = document.querySelectorAll<HTMLElement>('[data-toc-root]');
  if (tocRoots.length === 0) return;

  const setGroupExpanded = (group: HTMLElement, expanded: boolean) => {
    const btn = group.querySelector<HTMLButtonElement>('.toc-toggle-btn');
    const sublist = group.querySelector<HTMLElement>('.toc-sublist');
    group.classList.toggle('is-expanded', expanded);
    if (btn) btn.setAttribute('aria-expanded', String(expanded));
    if (sublist) sublist.hidden = !expanded;
  };

  // Manual toggle support on chapter chevron buttons
  tocRoots.forEach((root) => {
    root.addEventListener('click', (evt) => {
      const toggleBtn = (evt.target as HTMLElement | null)?.closest<HTMLButtonElement>('.toc-toggle-btn');
      if (toggleBtn) {
        const group = toggleBtn.closest<HTMLElement>('.toc-group');
        if (group) {
          const nextExpanded = !group.classList.contains('is-expanded');
          if (nextExpanded) group.dataset.userPinned = 'true';
          else delete group.dataset.userPinned;
          setGroupExpanded(group, nextExpanded);
        }
        return;
      }

      const link = (evt.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (link) {
        const targetId = decodeURIComponent(link.getAttribute('href')!.slice(1));
        openParentDetailsForTarget(targetId);
        // Close mobile outline drawer cleanly after jumping
        const mobileOutline = link.closest<HTMLDetailsElement>('.mobile-toc-drawer');
        if (mobileOutline) mobileOutline.open = false;
      }
    });
  });

  // Also ensure any in-page anchor click (e.g. "Research Details ↓") opens target details cleanly
  document.addEventListener('click', (evt) => {
    const link = (evt.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
    if (!link) return;
    const hash = link.getAttribute('href');
    if (hash && hash.length > 1) {
      openParentDetailsForTarget(decodeURIComponent(hash.slice(1)));
    }
  });

  // Ensure initial URL hash opens collapsed research drawer if needed
  if (window.location.hash.length > 1) {
    openParentDetailsForTarget(decodeURIComponent(window.location.hash.slice(1)));
  }
  window.addEventListener('hashchange', () => {
    if (window.location.hash.length > 1) {
      openParentDetailsForTarget(decodeURIComponent(window.location.hash.slice(1)));
    }
  });

  // Scroll-spy for open lesson headings: highlight current heading & auto-expand its TOC group
  const headings = Array.from(
    document.querySelectorAll<HTMLElement>('#lesson-start h2[id], #lesson-start h3[id]')
  );
  if (headings.length === 0) return;

  const activateHeading = (headingId: string) => {
    tocRoots.forEach((root) => {
      const allLinks = root.querySelectorAll<HTMLAnchorElement>('a[href^="#"]');
      allLinks.forEach((a) => {
        const isMatch = a.getAttribute('href') === `#${headingId}`;
        a.classList.toggle('active', isMatch);
        if (isMatch) a.setAttribute('aria-current', 'location');
        else a.removeAttribute('aria-current');
      });

      const activeLink = root.querySelector<HTMLElement>(`a[href="#${CSS.escape(headingId)}"]`);
      const activeGroup = activeLink?.closest<HTMLElement>('.toc-group');
      if (activeGroup) {
        root.querySelectorAll<HTMLElement>('.toc-group').forEach((g) => {
          if (g !== activeGroup && g.dataset.userPinned !== 'true') {
            setGroupExpanded(g, false);
          }
        });
        setGroupExpanded(activeGroup, true);
      }
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible.length > 0 && visible[0].target.id) {
        activateHeading(visible[0].target.id);
      }
    },
    { rootMargin: '-80px 0px -65% 0px', threshold: 0.01 }
  );

  headings.forEach((h) => observer.observe(h));
  activateHeading(headings[0].id);
}

initMermaidControls();
renderPendingMermaidDiagrams();
initTocInteraction();
