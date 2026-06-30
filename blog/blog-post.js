/* ─────────────────────────────────────────
   칸칸 — blog-post.js
   URL 파라미터 id로 posts/{id}.md fetch 후 렌더링
   ───────────────────────────────────────── */

'use strict';

const BASE = '/kankan';

const TAG_COLOR = {
  '단열재':       '#3b7dd8',
  '석고보드':     '#7c5cbf',
  '셀프인테리어': '#2aaa75',
  '시공팁':       '#d97706',
  '제품비교':     '#dc4a3b',
};

const THUMB_ICONS = {
  '단열재':       `<svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>`,
  '석고보드':     `<svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/><line x1="12" y1="3" x2="12" y2="17"/></svg>`,
  '셀프인테리어': `<svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  '시공팁':       `<svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
  '제품비교':     `<svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
};

// ── frontmatter 파싱 ──
function parseFrontmatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { meta: {}, body: text };

  const meta = {};
  let currentKey = null;
  let currentObj = null;

  match[1].split('\n').forEach(line => {
    const objField = line.match(/^\s{4}(\w+):\s*(.*)/);
    if (objField && currentObj !== null) {
      currentObj[objField[1]] = objField[2].trim();
      return;
    }
    const objListItem = line.match(/^\s{2}-\s+(\w+):\s*(.*)/);
    if (objListItem && currentKey) {
      if (!Array.isArray(meta[currentKey])) meta[currentKey] = [];
      currentObj = { [objListItem[1]]: objListItem[2].trim() };
      meta[currentKey].push(currentObj);
      return;
    }
    const listItem = line.match(/^\s{2}-\s+(.*)/);
    if (listItem && currentKey) {
      if (!Array.isArray(meta[currentKey])) meta[currentKey] = [];
      meta[currentKey].push(listItem[1].trim());
      currentObj = null;
      return;
    }
    const kv = line.match(/^(\w+):\s*(.*)/);
    if (kv) {
      currentKey = kv[1];
      meta[currentKey] = kv[2].trim() || null;
      currentObj = null;
    }
  });

  return { meta, body: match[2] };
}

// ── 본문 파싱 → HTML ──
function parseBody(md) {
  const lines = md.split('\n');
  const html = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (/^\[(오프닝|문단\d+|아웃트로)\]$/.test(line.trim())) { i++; continue; }

    const imgMatch = line.match(/^\[image:(4:3|16:9)\](.+)/);
    if (imgMatch) {
      const ratio    = imgMatch[1].replace(':', '-');
      const src      = imgMatch[2].trim().replace('images/', '');
      const nextLine = lines[i + 1] || '';
      const hasCaption = nextLine && !nextLine.startsWith('[') && !nextLine.startsWith('#')
        && !nextLine.startsWith('>') && !nextLine.match(/^[-*\d]/) && nextLine.trim() !== '';
      const caption = hasCaption ? lines[++i].trim() : '';
      html.push(`<div class="blog-post-img-wrap blog-post-img--${ratio}">
  <img src="${BASE}/blog/posts/images/${src}" alt="${caption}" loading="lazy"/>
  ${caption ? `<p class="blog-post-img-caption">${caption}</p>` : ''}
</div>`);
      i++; continue;
    }

    if (line.startsWith('> ')) {
      const tipLines = [];
      while (i < lines.length && lines[i].startsWith('> ')) {
        tipLines.push(lines[i].slice(2)); i++;
      }
      const boldTitle = tipLines[0] && tipLines[0].match(/^\*\*(.+?)\*\*$/);
      if (boldTitle) {
        html.push(`<div class="blog-tip-box"><strong>${boldTitle[1]}</strong>${tipLines.slice(1).map(l => inline(l)).join('<br/>')}</div>`);
      } else {
        html.push(`<div class="blog-tip-box">${tipLines.map(l => inline(l)).join('<br/>')}</div>`);
      }
      continue;
    }

    if (line.startsWith('### ')) { html.push(`<h3>${inline(line.slice(4))}</h3>`); i++; continue; }
    if (line.startsWith('## '))  { html.push(`<h2>${inline(line.slice(3))}</h2>`); i++; continue; }

    if (line.match(/^[-*]\s/)) {
      html.push('<ul>');
      while (i < lines.length && lines[i].match(/^[-*]\s/)) {
        html.push(`<li>${inline(lines[i].slice(2))}</li>`); i++;
      }
      html.push('</ul>'); continue;
    }

    if (line.match(/^\d+\.\s/)) {
      html.push('<ol>');
      while (i < lines.length && lines[i].match(/^\d+\.\s/)) {
        html.push(`<li>${inline(lines[i].replace(/^\d+\.\s/, ''))}</li>`); i++;
      }
      html.push('</ol>'); continue;
    }

    if (line.trim() === '') {
      let p = i - 1;
      while (p >= 0 && lines[p].trim() === '') p--;
      let n = i + 1;
      while (n < lines.length && lines[n].trim() === '') n++;
      const prev = p >= 0 ? lines[p].trim() : '';
      const next = n < lines.length ? lines[n].trim() : '';
      const blockRe = /^\[(오프닝|문단\d+|아웃트로)\]$|^\[image:|^##\s|^###\s|^[-*]\s|^\d+\.\s|^>/;
      if (!blockRe.test(prev) && !blockRe.test(next)) html.push('<br>');
      i++; continue;
    }
    html.push(`<p>${inline(line)}</p>`);
    i++;
  }

  return html.join('\n');
}

function inline(text) {
  return text
    .replace(/<br\s*\/?>/gi, '')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

// ── 에디터(작성자) 렌더링 ──
function renderAuthor(authorKey, date, readTime) {
  const authors  = window.AUTHORS || {};
  const author   = authors[authorKey] || null;

  const metaHtml = `
    <span id="postDate">${date}</span>
    ${readTime ? `<span id="postReadTimeSep">·</span><span id="postReadTime">⏱ ${readTime}</span>` : ''}
  `;

  if (author) {
    const avatarHtml = author.avatar
      ? `<img src="${BASE}/${author.avatar}" alt="${author.name}" />`
      : `<span class="blog-author-initial">${author.name.charAt(0)}</span>`;

    const rowEl = document.getElementById('postAuthorRow');
    const avEl  = document.getElementById('postAuthorAvatar');
    const nmEl  = document.getElementById('postAuthorName');
    const rlEl  = document.getElementById('postAuthorRole');
    const dtEl  = document.getElementById('postDate');
    const spEl  = document.getElementById('postReadTimeSep');
    const rtEl  = document.getElementById('postReadTime');
    const soloEl = document.getElementById('postMetaSolo');

    if (rowEl) rowEl.style.display = '';
    if (soloEl) soloEl.style.display = 'none';
    if (avEl) avEl.innerHTML = avatarHtml;
    if (nmEl) nmEl.textContent = author.name;
    if (rlEl) rlEl.textContent = author.role;
    if (dtEl) dtEl.textContent = date;
    if (readTime && spEl && rtEl) {
      spEl.style.display = '';
      rtEl.textContent = `⏱ ${readTime}`;
    }
  } else {
    // 에디터 없으면 날짜만
    const soloEl  = document.getElementById('postMetaSolo');
    const rowEl   = document.getElementById('postAuthorRow');
    const dtSolo  = document.getElementById('postDateSolo');
    const spSolo  = document.getElementById('postReadTimeSepSolo');
    const rtSolo  = document.getElementById('postReadTimeSolo');

    if (rowEl)  rowEl.style.display  = 'none';
    if (soloEl) soloEl.style.display = '';
    if (dtSolo) dtSolo.textContent = date;
    if (readTime && spSolo && rtSolo) {
      spSolo.style.display = '';
      rtSolo.textContent = `⏱ ${readTime}`;
    }
  }
}

// ── FAQ ──
function renderFaq(faqList) {
  if (!faqList || !faqList.length) return '';
  const items = faqList.map((item, i) => `
    <div class="blog-faq-item" id="faq-${i}">
      <button class="blog-faq-q" data-faq="${i}" type="button">
        <span>${item.q}</span>
        <svg class="blog-faq-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      <div class="blog-faq-a" id="faq-a-${i}">${item.a}</div>
    </div>`).join('');
  return `<div class="blog-faq-wrap"><div class="blog-faq-title"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:5px"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>자주 묻는 질문</div>${items}</div>`;
}

// ── 도움됐어요 / 공유하기 ──
function renderActions() {
  return `
    <div class="blog-post-actions">
      <p class="blog-post-actions-label">이 글이 도움이 됐다면 알려주세요.</p>
      <button class="blog-action-btn" id="btnHelpful" type="button">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
        도움됐어요
      </button>
      <button class="blog-action-btn" id="btnShare" type="button">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
        공유하기
      </button>
    </div>`;
}

// ── 관련 포스트 ──
function renderRelatedPosts(currentId, currentTag) {
  const grid = document.getElementById('relatedPostsGrid');
  if (!grid || !window.BLOG_POSTS) return;

  const posts = window.BLOG_POSTS
    .filter(p => p.id !== currentId)
    .sort((a, b) => (a.tag === currentTag ? -1 : 1))
    .slice(0, 2);

  grid.innerHTML = posts.map(p => {
    const color = TAG_COLOR[p.tag] || '#888';
    const icon  = THUMB_ICONS[p.tag] || '';
    const thumbHTML = p.thumb
      ? `<img src="${BASE}/${p.thumb}" alt="${p.title}" loading="lazy"/>`
      : `<span class="blog-thumb-icon" style="color:${color}99">${icon}</span>`;
    return `
      <article class="blog-card">
        <a class="blog-card-link" href="${BASE}/blog/post.html?id=${p.id}">
          <div class="blog-card-thumb ${p.thumb ? '' : 'blog-card-thumb--placeholder'}"
               style="${p.thumb ? '' : `background:${color}0d`}">
            ${thumbHTML}
            <span class="blog-card-tag-badge">${p.tag}</span>
          </div>
          <div class="blog-card-body">
            <h2 class="blog-card-title">${p.title}</h2>
            <p class="blog-card-excerpt">${p.excerpt}</p>
            <div class="blog-card-meta">
              <span>${p.date}</span>
              ${p.readTime ? `<span>⏱ ${p.readTime}</span>` : ''}
            </div>
          </div>
        </a>
      </article>`;
  }).join('');
}

function showError(msg) {
  const t = document.getElementById('postTitle');
  const b = document.getElementById('postBody');
  if (t) t.textContent = '포스트를 찾을 수 없습니다';
  if (b) b.innerHTML = `<p style="color:var(--color-text-muted)">${msg}</p>`;
}

// ── 메인 ──
async function initBlogPost() {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  if (!id) { showError('포스트 ID가 없습니다.'); return; }

  const metaData = window.BLOG_POSTS ? window.BLOG_POSTS.find(p => p.id === id) : null;

  let mdText = null;
  try {
    const res = await fetch(`${BASE}/blog/posts/${id}.md`, { cache: 'no-cache' });
    if (res.ok) mdText = await res.text();
  } catch(e) { console.warn('md fetch 실패:', e); }

  let meta = {}, bodyMd = '';
  if (mdText) {
    const parsed = parseFrontmatter(mdText);
    meta = parsed.meta; bodyMd = parsed.body;
  } else if (metaData) {
    meta = { title: metaData.title, tag: metaData.tag, date: metaData.date, readTime: metaData.readTime };
    bodyMd = '> 본문을 준비 중입니다.\n\n곧 업데이트될 예정입니다.';
  } else {
    showError(`'${id}' 포스트를 찾을 수 없습니다.`); return;
  }

  const title    = meta.title    || metaData?.title    || '';
  const tag      = meta.tag      || metaData?.tag      || '';
  const date     = meta.date     || metaData?.date     || '';
  const readTime = meta.readTime || metaData?.readTime || '';
  const thumb    = meta.thumb    || metaData?.thumb    || null;
  const authorKey = meta.author  || metaData?.author   || null;
  const color    = TAG_COLOR[tag] || '#888';

  // 제목 / 태그
  const bc = document.getElementById('breadcrumbTitle');
  const pt = document.getElementById('postTitle');
  const pg = document.getElementById('postTag');
  if (bc) bc.textContent = title;
  if (pt) pt.textContent = title;
  const thumbLabel = metaData?.thumbBadge || tag;
  const thumbColor = metaData?.thumbBadgeColor || color;
  if (pg) { pg.textContent = thumbLabel; pg.style.cssText = `background:${thumbColor}1a;color:${thumbColor};border:1px solid ${thumbColor}44`; }

  const badge = metaData?.badge || meta.badge || '';
  const pbEl = document.getElementById('postBadge');
  if (pbEl && badge) {
    pbEl.textContent = badge;
    pbEl.style.display = 'block';
    const summaryEl2 = document.getElementById('postSummary');
    if (summaryEl2) summaryEl2.style.display = '';
  }

  document.title = `${title} — 칸칸`;

  // 에디터 + 날짜
  renderAuthor(authorKey, date, readTime);

  // 대표 이미지
  const heroEl = document.getElementById('postHeroImage');
  if (heroEl) {
    if (thumb) {
      heroEl.innerHTML = `<img src="${BASE}/blog/posts/${thumb}" alt="${title}" loading="lazy"/>`;
      heroEl.style.display = '';
    } else {
      heroEl.style.display = 'none';
    }
  }

  // 요약 카드
  const summaryList = Array.isArray(meta.summary) ? meta.summary : [];
  const summaryEl   = document.getElementById('postSummary');
  const listEl      = document.getElementById('postSummaryList');
  if (summaryEl && listEl && summaryList.length) {
    summaryEl.style.display = '';
    listEl.innerHTML = summaryList.map(s => `<li>${s}</li>`).join('');
  }

  // 본문
  const bodyEl = document.getElementById('postBody');
  if (bodyEl) bodyEl.innerHTML = parseBody(bodyMd);

  // FAQ
  const faqEl = document.getElementById('postFaq');
  if (faqEl) {
    const faqList = Array.isArray(meta.faq) ? meta.faq : [];
    faqEl.innerHTML = faqList.length ? renderFaq(faqList) : '';
    faqEl.addEventListener('click', e => {
      const btn = e.target.closest('.blog-faq-q');
      if (!btn) return;
      const idx = btn.dataset.faq;
      const a   = document.getElementById('faq-a-' + idx);
      if (!a) return;
      const isOpen = a.classList.toggle('is-open');
      btn.classList.toggle('is-open', isOpen);
    });
  }

  // 도움됐어요 / 공유하기
  const actionsEl = document.getElementById('postActions');
  if (actionsEl) {
    actionsEl.innerHTML = renderActions();
    document.getElementById('btnHelpful').addEventListener('click', function() {
      this.classList.toggle('is-active');
      const svg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>`;
      this.innerHTML = this.classList.contains('is-active') ? svg + ' 감사합니다!' : svg + ' 도움됐어요';
    });
    document.getElementById('btnShare').addEventListener('click', function() {
      if (navigator.share) {
        navigator.share({ title: document.title, url: location.href });
      } else {
        navigator.clipboard.writeText(location.href).then(() => {
          const orig = this.innerHTML;
          this.textContent = '링크 복사됨!';
          setTimeout(() => { this.innerHTML = orig; }, 2000);
        });
      }
    });
  }

  // 태그
  const tags   = Array.isArray(meta.tags) ? meta.tags : (tag ? [tag] : []);
  const tagsEl = document.getElementById('postTags');
  if (tagsEl) {
    const tagIcon = `<span class="blog-post-tags-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg></span>`;
    tagsEl.innerHTML = tagIcon + tags.map(t => `<a href="${BASE}/blog.html" class="blog-post-tag-item">#${t}</a>`).join('');
  }


  // 관련 포스트
  renderRelatedPosts(id, tag);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBlogPost);
} else {
  initBlogPost();
}