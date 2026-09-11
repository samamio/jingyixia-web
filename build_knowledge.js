// 生成 knowledge.html：复用小程序 knowledge-data.js 的真实内容，保证功能对齐
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const { ARTICLES, CAT_NAMES, CAT_DESC } = require(path.join(root, 'utils/knowledge-data.js'));

// 相关工具路由 → Web 页映射
function mapRoute(route) {
  if (!route) return 'toolbox.html';
  if (route.indexOf('assessment') > -1) return 'assessment.html';
  if (route.indexOf('calm') > -1) return 'index.html#calm';
  if (route.indexOf('sleep') > -1 || route.indexOf('nightwake') > -1) return 'toolbox.html#sleep';
  return 'toolbox.html';
}

// 注入猫名与安全映射
const cats = JSON.stringify(CAT_NAMES);
const catDesc = JSON.stringify(CAT_DESC);
const articles = JSON.stringify(ARTICLES.map(a => ({ ...a, related: a.related ? { name: a.related.name, href: mapRoute(a.related.route) } : null })));

const NAV = `<aside class="jy-sidebar fixed left-0 top-0 h-screen w-72 bg-surface-container-lowest/80 backdrop-blur-xl z-50 flex flex-col justify-between p-container-padding shadow-[0_1px_12px_rgba(28,107,80,0.05)]">
  <div class="flex flex-col gap-stack-gap">
    <div class="flex items-center gap-stack-gap px-card-inner-padding py-2">
      <img alt="静一下心 品牌标志" class="h-8 w-auto object-contain" src="assets/logo.png"/>
      <div class="flex flex-col"><span class="font-headline-md text-body-lg text-primary tracking-tight font-semibold">静一下心</span><span class="font-label-md text-label-md text-on-surface-variant opacity-80 text-[12px] leading-tight">科学缓解焦虑</span></div>
    </div>
    <div class="h-[1px] w-full bg-surface-container-high/60 my-1"></div>
    <nav class="flex flex-col gap-1" data-active-classes="bg-primary-container text-on-primary-container font-semibold rounded-full">
      <a class="nav-link flex items-center gap-3 px-card-inner-padding py-3 rounded-full text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all" data-path="overview" href="index.html"><span class="material-symbols-outlined text-[20px]">cottage</span><span class="font-label-md text-label-md">首页</span></a>
      <a class="nav-link flex items-center gap-3 px-card-inner-padding py-3 rounded-full text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all" data-path="toolbox" href="toolbox.html"><span class="material-symbols-outlined text-[20px]">self_improvement</span><span class="font-label-md text-label-md">疗愈工具箱</span></a>
      <a class="nav-link flex items-center gap-3 px-card-inner-padding py-3 rounded-full text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all" data-path="mood-and-insights" href="mood.html"><span class="material-symbols-outlined text-[20px]">auto_graph</span><span class="font-label-md text-label-md">情绪日志</span></a>
      <a class="nav-link flex items-center gap-3 px-card-inner-padding py-3 rounded-full text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all" data-path="science-basis" href="science.html"><span class="material-symbols-outlined text-[20px]">psychology</span><span class="font-label-md text-label-md">科学依据</span></a>
      <a class="nav-link flex items-center gap-3 px-card-inner-padding py-3 rounded-full text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all" data-path="knowledge" href="knowledge.html"><span class="material-symbols-outlined text-[20px]">menu_book</span><span class="font-label-md text-label-md">焦虑知识库</span></a>
      <a class="nav-link flex items-center gap-3 px-card-inner-padding py-3 rounded-full text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all" data-path="assessment" href="assessment.html"><span class="material-symbols-outlined text-[20px]">quiz</span><span class="font-label-md text-label-md">权威自测</span></a>
      <a class="nav-link flex items-center gap-3 px-card-inner-padding py-3 rounded-full text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all" data-path="safety" href="safety.html"><span class="material-symbols-outlined text-[20px]">support_agent</span><span class="font-label-md text-label-md">安全与帮助</span></a>
    </nav>
  </div>
  <div class="flex flex-col gap-stack-gap">
    <div class="h-[1px] w-full bg-surface-container-high/60"></div>
    <nav class="flex flex-col gap-1" data-active-classes="bg-primary-container text-on-primary-container font-semibold rounded-full">
      <a class="nav-link flex items-center gap-3 px-card-inner-padding py-2.5 rounded-full text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all" data-path="compliance-privacy" href="privacy.html"><span class="material-symbols-outlined text-[20px]">verified_user</span><span class="font-label-md text-label-md">隐私与合规</span></a>
      <a class="nav-link flex items-center gap-3 px-card-inner-padding py-2.5 rounded-full text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all" data-path="profile" href="profile.html"><span class="material-symbols-outlined text-[20px]">account_circle</span><span class="font-label-md text-label-md">个人中心</span></a>
    </nav>
    <div class="px-card-inner-padding py-2 flex items-center justify-between text-on-surface-variant/60 font-label-md text-[12px]"><span>心境平伏 呼吸自然</span><span class="material-symbols-outlined text-[16px] text-primary">spa</span></div>
  </div>
</aside>`;

const HEADER = `<header class="jy-header fixed top-0 left-72 right-0 h-16 bg-surface/75 backdrop-blur-xl shadow-[0_1px_8px_rgba(28,107,80,0.03)] z-40 flex items-center justify-between px-section-gap">
  <div class="flex items-center gap-stack-gap">
    <img alt="静一下心 品牌标志" class="h-8 w-auto object-contain" src="assets/logo.png"/>
    <span class="font-headline-md text-body-md text-on-surface font-medium hidden sm:inline">静一下心</span>
  </div>
  <div class="flex items-center gap-4">
    <div class="flex items-center bg-surface-container-low px-4 py-1.5 rounded-full text-on-surface-variant"><span class="material-symbols-outlined text-[18px] text-primary mr-2">spa</span><span class="font-label-md text-label-md text-on-surface-variant">身心处于平缓状态</span></div>
  </div>
</header>`;

const tpl = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>静一下心 · 焦虑知识库</title>
<link rel="icon" href="assets/logo.png"/>
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/>
<link rel="stylesheet" href="assets/styles.css"/>
<script src="https://cdn.tailwindcss.com"></script>
<script src="assets/tailwind-setup.js"></script>
</head>
<body class="bg-background font-body-md text-body-md text-on-surface antialiased">
${NAV}
<div class="jy-main-wrap pl-72">
${HEADER}
<main class="w-full pt-16 bg-surface min-h-screen px-section-gap py-container-padding">
  <div class="flex flex-col w-full">
    <!-- List view -->
    <section id="list-view">
      <div class="mb-section-gap">
        <h1 class="font-headline-lg text-headline-lg text-on-surface">焦虑知识库</h1>
        <p class="font-body-md text-body-md text-on-surface-variant text-sm mt-1 max-w-2xl">关于焦虑、睡眠与情绪的科普内容。所有文章仅作了解与筛查之用，<strong class="text-primary">不替代专业诊断或治疗</strong>。</p>
      </div>
      <div class="flex flex-wrap items-center gap-2 mb-section-gap" id="cat-pills"></div>
      <div id="article-list" class="flex flex-col gap-section-gap"></div>
    </section>
    <!-- Detail view -->
    <section id="detail-view" class="hidden">
      <button id="back-btn" class="flex items-center gap-2 text-on-surface-variant hover:text-on-surface mb-4 font-label-md text-label-md"><span class="material-symbols-outlined text-[20px]">arrow_back</span>返回知识库</button>
      <div id="detail-content"></div>
    </section>
    <!-- Disclaimer -->
    <div class="mt-section-gap rounded-lg bg-surface-container-lowest p-card-inner-padding shadow-[0_12px_36px_rgba(28,107,80,0.05)] flex items-start gap-3">
      <span class="material-symbols-outlined text-primary text-[22px] shrink-0">info</span>
      <p class="font-body-md text-body-md text-on-surface-variant text-xs leading-relaxed">本页内容为科普性质，依据 WHO、APA、NICE 等公开权威资料整理。文章中的自测量表（GAD-7 / PHQ-9 / ISI）仅供症状筛查与严重程度了解，<strong class="text-on-surface">不构成医学诊断</strong>。若你正经历持续或加重的困扰，请寻求执业医师或专业机构帮助。</p>
    </div>
  </div>
</main>
</div>
<script>
  const CAT_NAMES = ${cats};
  const CAT_DESC = ${catDesc};
  const ARTICLES = ${articles};
  const catColor = {1:'primary',2:'secondary',3:'tertiary',4:'primary',5:'error',6:'primary',7:'secondary',8:'tertiary',9:'secondary'};
  const colorClass = { primary:'bg-primary-container text-on-primary-container', secondary:'bg-secondary-container/50 text-on-secondary-container', tertiary:'bg-tertiary-fixed text-on-tertiary-fixed', error:'bg-error-container text-on-error-container' };

  const catPills = document.getElementById('cat-pills');
  const listEl = document.getElementById('article-list');
  const listView = document.getElementById('list-view');
  const detailView = document.getElementById('detail-view');
  const detailContent = document.getElementById('detail-content');

  function esc(s){ return (s||'').replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])); }

  // category pills
  const allPill = document.createElement('button');
  allPill.dataset.cat = 'all';
  allPill.className = 'px-4 py-2 rounded-full bg-primary-container text-on-primary-container font-semibold font-label-md text-label-md transition-all';
  allPill.textContent = '全部';
  catPills.appendChild(allPill);
  Object.keys(CAT_NAMES).forEach(k => {
    const b = document.createElement('button');
    b.dataset.cat = k;
    b.className = 'px-4 py-2 rounded-full bg-surface-container-low text-on-surface-variant hover:bg-surface-container font-label-md text-label-md transition-all';
    b.textContent = CAT_NAMES[k];
    catPills.appendChild(b);
  });
  catPills.querySelectorAll('[data-cat]').forEach(p => p.addEventListener('click', () => {
    catPills.querySelectorAll('[data-cat]').forEach(x => { x.classList.remove('bg-primary-container','text-on-primary-container','font-semibold'); x.classList.add('bg-surface-container-low','text-on-surface-variant'); });
    p.classList.add('bg-primary-container','text-on-primary-container','font-semibold'); p.classList.remove('bg-surface-container-low','text-on-surface-variant');
    renderList(p.dataset.cat);
  }));

  function renderList(cat) {
    listEl.innerHTML = '';
    const groups = cat === 'all'
      ? Object.keys(CAT_NAMES).map(k => ({ key:k, name:CAT_NAMES[k], desc:CAT_DESC[k], items:ARTICLES.filter(a=>a.cat==k) }))
      : [{ key:cat, name:CAT_NAMES[cat], desc:CAT_DESC[cat], items:ARTICLES.filter(a=>a.cat==cat) }];
    groups.forEach(g => {
      const sec = document.createElement('div');
      sec.className = 'flex flex-col gap-4';
      sec.innerHTML = '<div class="flex items-center gap-3"><h2 class="font-headline-md text-headline-md text-on-surface">'+esc(g.name)+'</h2><span class="font-label-md text-label-md text-on-surface-variant text-sm">'+esc(g.desc||'')+'</span></div>';
      const grid = document.createElement('div');
      grid.className = 'grid grid-cols-1 md:grid-cols-2 gap-4';
      g.items.forEach(a => {
        const card = document.createElement('button');
        card.className = 'text-left rounded-lg bg-surface-container-lowest p-card-inner-padding shadow-[0_12px_36px_rgba(28,107,80,0.05)] hover:shadow-md transition-all flex flex-col gap-2 group';
        card.innerHTML = '<div class="flex items-center gap-2"><span class="font-label-md text-label-md text-xs '+colorClass[catColor[a.cat]]+' px-2.5 py-1 rounded-full">'+esc(g.name)+'</span></div><h3 class="font-headline-md text-body-md text-on-surface font-semibold group-hover:text-primary transition-colors">'+esc(a.title)+'</h3><p class="font-body-md text-body-md text-on-surface-variant text-sm">'+esc(a.oneLine)+'</p>';
        card.addEventListener('click', () => openDetail(a.id));
        grid.appendChild(card);
      });
      sec.appendChild(grid);
      listEl.appendChild(sec);
    });
  }

  function openDetail(id) {
    const a = ARTICLES.find(x => x.id === id);
    if(!a) return;
    history.replaceState(null, '', '#/article/' + id);
    const sec = (t,h) => '<div class="mb-4"><h4 class="font-headline-md text-body-md text-primary font-semibold flex items-center gap-2 mb-2"><span class="material-symbols-outlined text-[20px]">'+esc(iconFor(t))+'</span>'+esc(h)+'</h4><p class="font-body-md text-body-md text-on-surface-variant text-sm leading-relaxed">'+esc(a[t])+'</p></div>';
    let html = '';
    html += '<div class="rounded-lg bg-surface-container-lowest p-card-inner-padding shadow-[0_12px_36px_rgba(28,107,80,0.05)] mb-section-gap">';
    html += '<span class="font-label-md text-label-md text-xs '+colorClass[catColor[a.cat]]+' px-2.5 py-1 rounded-full">'+esc(CAT_NAMES[a.cat])+'</span>';
    html += '<h1 class="font-headline-lg text-headline-lg text-on-surface mt-3">'+esc(a.title)+'</h1>';
    html += '<p class="font-body-md text-body-md text-on-surface text-base mt-2">'+esc(a.oneLine)+'</p>';
    html += '</div>';
    html += sec('why','为什么会这样');
    html += sec('feel','你可能会有什么感觉');
    html += sec('do','可以做什么');
    html += sec('seek','何时该求助');
    if(a.related){ html += '<div class="mb-4"><h4 class="font-headline-md text-body-md text-primary font-semibold flex items-center gap-2 mb-2"><span class="material-symbols-outlined text-[20px]">build</span>相关工具</h4><a href="'+esc(a.related.href)+'" class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-container/50 text-primary font-label-md text-label-md font-semibold hover:bg-primary-container transition-all"><span class="material-symbols-outlined text-[18px]">arrow_forward</span>'+esc(a.related.name)+'</a></div>'; }
    if(a.source){ html += '<div class="mb-2"><h4 class="font-headline-md text-body-md text-primary font-semibold flex items-center gap-2 mb-2"><span class="material-symbols-outlined text-[20px]">verified</span>权威信源</h4><p class="font-body-md text-body-md text-on-surface-variant text-xs leading-relaxed">'+esc(a.source)+'</p></div>'; }
    // related by cat
    const rel = ARTICLES.filter(x=>x.cat===a.cat && x.id!==a.id).slice(0,3);
    if(rel.length){ html += '<div class="mt-4 pt-4 border-t border-surface-container-low"><h4 class="font-headline-md text-body-md text-on-surface font-semibold mb-3">同分类文章</h4><div class="flex flex-col gap-2">'; rel.forEach(r=>{ html += '<button class="text-left font-body-md text-body-md text-primary hover:underline py-1" data-id="'+esc(r.id)+'">'+esc(r.title)+'</button>'; }); html += '</div></div>'; }
    detailContent.innerHTML = html;
    detailContent.querySelectorAll('[data-id]').forEach(b => b.addEventListener('click', () => openDetail(b.dataset.id)));
    listView.classList.add('hidden');
    detailView.classList.remove('hidden');
    window.scrollTo(0,0);
  }
  function iconFor(t){ return ({why:'psychology',feel:'sentiment_satisfied',do:'task_alt',seek:'support_agent'}[t]||'info'); }

  document.getElementById('back-btn').addEventListener('click', () => { detailView.classList.add('hidden'); listView.classList.remove('hidden'); history.replaceState(null,'','#/'); window.scrollTo(0,0); });
  function fromHash(){ const m = location.hash.match(/^#\/article\/(.+)$/); if(m){ openDetail(m[1]); } }
  window.addEventListener('hashchange', fromHash);
  renderList('all');
  fromHash();
</script>
<script>
  (function(){ const cur=location.pathname.split('/').pop()||'knowledge.html'; const map={'index.html':'overview','toolbox.html':'toolbox','breathing-space.html':'breathing-space','mood.html':'mood-and-insights','science.html':'science-basis','knowledge.html':'knowledge','assessment.html':'assessment','safety.html':'safety','privacy.html':'compliance-privacy','profile.html':'profile'}; const ap=map[cur]; document.querySelectorAll('aside nav a.nav-link').forEach(a=>{ if(a.dataset.path===ap){ a.classList.add('bg-primary-container','text-on-primary-container','font-semibold'); a.classList.remove('text-on-surface-variant'); a.setAttribute('aria-current','page'); } }); })();
</script>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, 'knowledge.html'), tpl);
console.log('knowledge.html written, articles=', ARTICLES.length);
