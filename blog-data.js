/* ─────────────────────────────────────────
   칸칸 — blog-data.js
   새 글은 배열 맨 앞에 추가하세요.
   ───────────────────────────────────────── */

/* ── 작성자 정보 ── */
const AUTHORS = window.AUTHORS = {
  'energuard': {
    name: '에너가드 실무팀',
    role: '자재 유통 전문',
    avatar: 'blog/authors/energuard.jpg',
  },
  'taekwon': {
    name: '박태권',
    role: '대표 · 현장 전문가',
    avatar: 'blog/authors/taekwon.jpg',
  },
};

const BLOG_POSTS = window.BLOG_POSTS = [
  {
    id: 'eps-vs-xps-2024',
    author: 'energuard',
    tag: '제품비교',
    title: 'EPS vs XPS, 뭘 골라야 할까? 현장에서 매일 보는 사람이 정리했습니다',
    excerpt: '스티로폼이라 부르는 EPS와 아이소핑크로 알려진 XPS, 가격 차이가 꽤 나는데 언제 어떤 걸 써야 하는지 헷갈리는 분들이 많습니다. 유통 현장에서 직접 느낀 차이를 솔직하게 썼습니다.',
    date: '2026.06.20',
    readTime: '6분',
    thumb: null,
  },
  {
    id: 'insulation-thickness-guide',
    author: 'taekwon',
    tag: '단열재',
    title: '단열재 두께, 어떻게 결정해야 하나요? 지역별·부위별 기준 총정리',
    excerpt: '중부1지역 외벽 최소 열관류율은 0.150 W/㎡K. 이 숫자 하나가 단열재 두께를 결정합니다. 실무에서 자주 묻는 두께 계산 로직을 정리했습니다.',
    date: '2026.06.15',
    readTime: '8분',
    thumb: null,
  },
  {
    id: 'gypsum-board-type-guide',
    author: 'energuard',
    tag: '석고보드',
    title: '석고보드 종류 한눈에 보기 — 일반·방수·방화, 언제 어디에 쓰나',
    excerpt: '욕실 옆 벽에 일반 석고보드 붙이면 곰팡이 핍니다. 방수보드와 방화보드, 두 가지만 제대로 알아도 시공 실수를 반 이상 줄일 수 있습니다.',
    date: '2026.06.08',
    readTime: '5분',
    thumb: null,
  },
  {
    id: 'reflective-insulation-how-to',
    author: 'taekwon',
    tag: '단열재',
    title: '열반사 단열재 제대로 붙이는 법 — 에어갭 없으면 반사 효과 0입니다',
    excerpt: '열반사 단열재는 공기층이 핵심입니다. 밀착 시공하면 일반 발포 단열재와 성능 차이가 거의 없어요. 올바른 시공 방법과 흔한 실수를 짚었습니다.',
    date: '2026.05.30',
    readTime: '7분',
    thumb: null,
  },
  {
    id: 'self-interior-insulation-checklist',
    author: 'energuard',
    tag: '셀프인테리어',
    title: '셀프 단열 공사 전에 체크해야 할 것 7가지',
    excerpt: '자재비 아끼려고 직접 하다가 오히려 비용이 더 드는 경우가 있습니다. 직접 해도 되는 공정과 전문가 맡겨야 할 공정을 구분하는 기준을 정리했습니다.',
    date: '2026.05.22',
    readTime: '6분',
    thumb: null,
  },
  {
    id: 'foam-spray-usage-tips',
    author: 'taekwon',
    tag: '시공팁',
    title: '우레탄폼 스프레이, 이것만 알면 낭비 없이 쓸 수 있습니다',
    excerpt: '캔 하나에 얼마나 채울 수 있는지, 겨울에 성능이 떨어지는 이유, 굳은 뒤 깎아내는 타이밍까지. 한 통이라도 아껴 써야 할 분들을 위한 실용 팁입니다.',
    date: '2026.05.14',
    readTime: '4분',
    thumb: null,
  },
];