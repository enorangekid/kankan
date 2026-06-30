/* ─────────────────────────────────────────
   칸칸 — blog.js
   블로그 목록 렌더링 + 태그 필터
   ───────────────────────────────────────── */

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

function defaultIcon() {
  return `<svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`;
}

function postCardHTML(post) {
  const color = TAG_COLOR[post.tag] || '#888';
  const hasThumb = !!post.thumb;

  const thumbHTML = hasThumb
    ? `<img src="${BASE}/${post.thumb}" alt="${post.title}" loading="lazy" />`
    : `<span class="blog-thumb-icon" style="color:${color}99">${THUMB_ICONS[post.tag] || defaultIcon()}</span>`;

  return `
    <article class="blog-card">
      <a class="blog-card-link" href="${BASE}/blog/post.html?id=${post.id}">
        <div class="blog-card-thumb ${hasThumb ? '' : 'blog-card-thumb--placeholder'}"
             style="${hasThumb ? '' : `background:${color}0d`}">
          ${thumbHTML}
          <span class="blog-card-tag-badge"${post.thumbBadgeColor ? ` style="background:${post.thumbBadgeColor}"` : ''}>${post.thumbBadge || post.tag}</span>
        </div>
        <div class="blog-card-body">
          ${post.badge ? `<span class="blog-card-body-badge"${post.thumbBadgeColor ? ` style="background:${post.thumbBadgeColor}1a;color:${post.thumbBadgeColor}"` : ''}>${post.badge}</span>` : ''}
          <h2 class="blog-card-title">${post.title}</h2>
          <p class="blog-card-excerpt">${post.excerpt}</p>
          <div class="blog-card-meta">
            <span class="blog-card-date">${post.date}</span>
            ${post.readTime ? `<span class="blog-card-read">⏱ ${post.readTime}</span>` : ''}
          </div>
        </div>
      </a>
    </article>
  `;
}

function renderBlogGrid(tag = '') {
  const grid = document.getElementById('blogGrid');
  const countEl = document.getElementById('postCount');
  if (!grid) return;

  const filtered = tag ? BLOG_POSTS.filter(p => p.tag === tag) : BLOG_POSTS;
  if (countEl) countEl.textContent = filtered.length;

  grid.innerHTML = filtered.length
    ? filtered.map(postCardHTML).join('')
    : '<p class="blog-empty">해당 카테고리의 포스트가 없습니다.</p>';
}

function initTagFilter() {
  const filter = document.getElementById('tagFilter');
  if (!filter) return;
  filter.addEventListener('click', e => {
    const btn = e.target.closest('.blog-tag-btn');
    if (!btn) return;
    filter.querySelectorAll('.blog-tag-btn').forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    renderBlogGrid(btn.dataset.tag);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderBlogGrid();
  initTagFilter();
});
