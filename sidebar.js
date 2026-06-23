/* ─────────────────────────────────────────
   칸칸 — sidebar.js
   ───────────────────────────────────────── */

'use strict';

// ── 공지사항 ──
const NOTICE = '몇 장 사야 할지 몰라서 검색하셨나요?     ·     한 장 더 시켰다가 반품 못 한 경험, 있죠?     ·     어림잡지 마세요, 칸칸이 계산합니다     ·     자재 발주가 두려운 당신에게     ·     현장 오차를 줄이는 정밀 실무 로직     ·     셀프 인테리어의 필수 도구 칸칸';

function renderNotice() {
  const el = document.getElementById('topbarNotice');
  if (el) el.textContent = NOTICE;
}

// ── 네비게이션 구조 ──
const NAV_ITEMS = [
  {
    category: '단열재/목공/보드',
    items: [
      {
        name: '단열재 수량 계산기',
        children: [
          { name: '판상형 단열재 수량 계산기', url: 'calc/insulation-board.html' },
          { name: '열반사 단열재 소요량 계산기', url: 'calc/reflective-insulation.html' },
          { name: '캠핑 단열재 소요량 계산기',    url: 'calc/insulation-board-camp.html' },
          { name: '빙어낚시 매트 소요량 계산기',  url: 'calc/ice-fishing-mat.html' },
        ],
      },
      { name: '단열재 두께 계산기',          url: 'calc/insulation-thickness.html' },
      { name: '석고보드 수량 계산기',   url: 'calc/gypsum.html' },
      { name: '천장재[텍스] 수량 계산기', url: 'calc/tex.html' },
      { name: '방음/흡음재 수량 계산기', url: 'calc/acoustic.html' },
    ],
  },
  {
    category: '마감/인테리어',
    items: [
      { name: '단열벽지 소요량 계산기',           url: 'calc/thermal-wallpaper.html' },
      { name: '단열초배지 소요량 계산기',          url: 'calc/thermal-base-wallpaper.html' },
      { name: '인테리어필름/시트지 소요량 계산기', url: 'calc/interior-film.html' },
      { name: '장판 소요량 계산기',              url: 'calc/flooring.html' },
      { name: '전기난방필름 단열재 소요량 계산기', url: 'calc/heating-film-insulation.html' },
      {
        name: '우레탄폼 소요량 계산기',
        children: [
          { name: '우레탄폼 이액형[대용량] 소요량 계산기',  url: 'calc/foam-2k.html' },
          { name: '우레탄폼 스프레이형[소량] 소요량 계산기', url: 'calc/foam-spray.html' },
          { name: '우레탄폼 폼본드 소요량 계산기',          url: 'calc/foam-bond.html' },
        ],
      },
      { name: '실리콘/줄눈 소요량 계산기',        url: 'calc/sealant.html' },
    ],
  },
  {
    category: '창호/도어/유리',
    items: [
      { name: '창문 단열재 견적 계산기', url: 'calc/window-insulation.html' },
      { name: '블라인드 사이즈 계산기',  url: 'calc/blind.html' },
    ],
  },
  {
    category: '기타',
    items: [
      { name: '재료별 열전도율 표',          url: 'calc/thermal-conductivity.html' },
      { name: '지역별 부위별 허용 열관류율', url: 'calc/u-value-table.html' },
      { name: '열관류율 계산기',            url: null },
      { name: '단열재 적재·운임 계산기',    url: 'calc/freight.html' },
      { name: '단열재 차량별 적재량 확인',      url: 'calc/freight-load.html' },
    ],
  },
];

// ── 헬퍼 ──
function isCurrentPath(currentPath, url) {
  return url && currentPath && (
    currentPath === url ||
    currentPath.endsWith('/' + url)
  );
}

function getComingSoonName() {
  if (!location.pathname.includes('coming-soon')) return null;
  return new URLSearchParams(location.search).get('name');
}

function isComingSoonMatch(itemName) {
  const name = getComingSoonName();
  return name && decodeURIComponent(name) === itemName;
}

// ── 사이드바 렌더링 ──
function renderSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  const currentPath = location.pathname.replace(/^\//, '');
  const root = sidebar.dataset.root || '';

  let html = `
    <div class="sidebar-logo">
      <a href="${root}index.html" class="logo">KAN KAN</a>
    </div>
    <div class="sidebar-nav">`;

  for (const section of NAV_ITEMS) {
    html += `
      <nav class="nav-section">
        <div class="nav-category">${section.category}</div>
        <ul>
    `;

    for (const item of section.items) {
      if (item.children) {
        const anyChildActive = item.children.some(child =>
          isCurrentPath(currentPath, child.url) || isComingSoonMatch(child.name)
        );
        const firstReady = item.children.find(c => c.url);
        const parentHref = firstReady
          ? `${root}${firstReady.url}`
          : `${root}coming-soon.html?name=${encodeURIComponent(item.name)}`;

        html += `
          <li class="nav-item nav-group ${anyChildActive ? 'open active-parent' : ''}">
            <a class="nav-group-label" href="${parentHref}">
              <span class="nav-group-text">${item.name}</span>
              <span class="nav-group-icon">${anyChildActive ? '−' : '+'}</span>
            </a>
            <ul class="nav-sub">
        `;

        for (const child of item.children) {
          const href = child.url
            ? `${root}${child.url}`
            : `${root}coming-soon.html?name=${encodeURIComponent(child.name)}`;
          const isActive = isCurrentPath(currentPath, child.url) || isComingSoonMatch(child.name);

          html += `
            <li class="nav-sub-item ${isActive ? 'active' : ''} ${!child.url ? 'soon' : ''}">
              <a href="${href}">
                ${child.name}
                ${!child.url ? '<span class="sub-badge">준비중</span>' : ''}
              </a>
            </li>
          `;
        }

        html += `</ul></li>`;

      } else {
        const href = item.url
          ? `${root}${item.url}`
          : `${root}coming-soon.html?name=${encodeURIComponent(item.name)}`;
        const isActive = isCurrentPath(currentPath, item.url) || isComingSoonMatch(item.name);

        html += `
          <li class="nav-item ${isActive ? 'active' : ''}">
            <a href="${href}">
              ${item.name}
              ${!item.url ? '<span class="sub-badge">준비중</span>' : ''}
            </a>
          </li>
        `;
      }
    }

    html += `</ul></nav>`;
  }

  sidebar.innerHTML = html + '</div>';
  initSidebarEvents(sidebar);
}

// ── 사이드바 이벤트 ──
function initSidebarEvents(sidebar) {
  sidebar.querySelectorAll('.nav-group-label').forEach(label => {
    const icon = label.querySelector('.nav-group-icon');
    if (!icon) return;
    icon.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      const group = label.closest('.nav-group');
      group.classList.toggle('open');
      icon.textContent = group.classList.contains('open') ? '−' : '+';
    });
  });
}

// ── 공유 유틸리티 ──
function initCustomSelect(wrapId, btnId, listId, hiddenId, onSelect) {
  const wrap   = document.getElementById(wrapId);
  const btn    = document.getElementById(btnId);
  const list   = document.getElementById(listId);
  const hidden = document.getElementById(hiddenId);
  if (!wrap || !btn || !list || !hidden) return;

  btn.addEventListener('click', e => {
    if (btn.disabled) return;
    e.stopPropagation();
    wrap.classList.toggle('open');
    document.querySelectorAll('.custom-select-wrap').forEach(w => {
      if (w !== wrap) w.classList.remove('open');
    });
  });

  list.querySelectorAll('.custom-select-item:not(.soon)').forEach(item => {
    item.addEventListener('click', e => {
      e.stopPropagation();
      list.querySelectorAll('.custom-select-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      btn.querySelector('span').textContent = item.textContent.trim();
      hidden.value = item.dataset.value;
      wrap.classList.remove('open');
      if (onSelect) onSelect(item.dataset.value);
    });
  });

  document.addEventListener('click', () => wrap.classList.remove('open'));
}

function showToast(msg) {
  const wrap = document.getElementById('toast-wrap');
  if (!wrap) return;
  const el = document.createElement('div');
  el.className   = 'toast-msg toast-warn';
  el.textContent = msg;
  wrap.appendChild(el);
  const remove = () => { el.classList.add('hiding'); el.addEventListener('transitionend', () => el.remove(), {once:true}); };
  const t = setTimeout(remove, 3500);
  el.addEventListener('click', () => { clearTimeout(t); remove(); });
}

// ── 모바일 드로어 ──
function initMobileDrawers() {
  const overlay      = document.getElementById('mobileOverlay');
  const sidebar      = document.getElementById('sidebar');
  const historyPanel = document.getElementById('historyPanel');
  const btnHamburger = document.getElementById('btnHamburger');
  const btnDotMenu   = document.getElementById('btnDotMenu');
  if (!overlay) return;

  function closeAll() {
    sidebar      && sidebar.classList.remove('mobile-open');
    historyPanel && historyPanel.classList.remove('mobile-open');
    overlay.classList.remove('active');
  }
  function openSidebar() {
    historyPanel && historyPanel.classList.remove('mobile-open');
    sidebar && sidebar.classList.add('mobile-open');
    overlay.classList.add('active');
  }
  function openHistory() {
    sidebar && sidebar.classList.remove('mobile-open');
    historyPanel && historyPanel.classList.add('mobile-open');
    overlay.classList.add('active');
  }

  btnHamburger && btnHamburger.addEventListener('click', () => {
    sidebar && sidebar.classList.contains('mobile-open') ? closeAll() : openSidebar();
  });

  btnDotMenu && btnDotMenu.addEventListener('click', () => {
    historyPanel && historyPanel.classList.contains('mobile-open') ? closeAll() : openHistory();
  });

  overlay.addEventListener('click', closeAll);

  sidebar && sidebar.addEventListener('click', e => {
    if (e.target.closest('a[href]')) closeAll();
  });
}

// ── 초기화 ──
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => { renderSidebar(); renderNotice(); initMobileDrawers(); });
} else {
  renderSidebar();
  renderNotice();
  initMobileDrawers();
}