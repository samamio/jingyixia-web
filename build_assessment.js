// 生成 assessment.html：复用小程序 assessment-data.js 的真实题目与分级
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const ad = require(path.join(root, 'utils/assessment-data.js'));

// 仅导出页面所需
const GAD7 = ad.GAD7, PHQ9 = ad.PHQ9, ISI = ad.ISI;
const PROMPT = ad.PROMPT, ISI_PROMPT = ad.ISI_PROMPT;
const GAD_LEVELS = ad.GAD_LEVELS, PHQ_LEVELS = ad.PHO_LEVELS || ad.PHQ_LEVELS, ISI_LEVELS = ad.ISI_LEVELS;

function def(d){ return { type:d.type, name:d.name, short:d.short, criticalIndex:d.criticalIndex, opts:d.opts, items:d.items, prompt:d.prompt||PROMPT }; }
const DEFS = { 'GAD-7': def(GAD7), 'PHQ-9': def(PHQ9), 'ISI': def(ISI) };
// 分级（用于前端复现 scoreLevel）
const LEVELS = { 'GAD-7': GAD_LEVELS, 'PHQ-9': PHQ_LEVELS, 'ISI': ISI_LEVELS };

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
<title>静一下心 · 权威自测</title>
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
  <div class="flex flex-col w-full max-w-3xl mx-auto">
    <div class="mb-section-gap">
      <h1 class="font-headline-lg text-headline-lg text-on-surface">权威心理自测</h1>
      <p class="font-body-md text-body-md text-on-surface-variant text-sm mt-1">采用国际通用的 GAD-7、PHQ-9 与 ISI 量表，帮助你了解近两周的状态程度。<strong class="text-primary">仅供筛查，不构成诊断。</strong></p>
    </div>

    <!-- Selector -->
    <section id="select-view">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-section-gap">
        <button class="test-card text-left rounded-lg bg-surface-container-lowest p-card-inner-padding shadow-[0_12px_36px_rgba(28,107,80,0.05)] hover:shadow-md transition-all flex flex-col gap-2" data-type="GAD-7">
          <span class="w-11 h-11 rounded-full bg-primary-container/50 flex items-center justify-center text-primary"><span class="material-symbols-outlined text-[24px]">psychology</span></span>
          <span class="font-headline-md text-body-md text-on-surface font-semibold">GAD-7 焦虑量表</span>
          <span class="font-body-md text-body-md text-on-surface-variant text-sm">7 题 · 了解近两周焦虑相关症状</span>
        </button>
        <button class="test-card text-left rounded-lg bg-surface-container-lowest p-card-inner-padding shadow-[0_12px_36px_rgba(28,107,80,0.05)] hover:shadow-md transition-all flex flex-col gap-2" data-type="PHQ-9">
          <span class="w-11 h-11 rounded-full bg-secondary-container/50 flex items-center justify-center text-on-secondary-container"><span class="material-symbols-outlined text-[24px]">mood</span></span>
          <span class="font-headline-md text-body-md text-on-surface font-semibold">PHQ-9 抑郁量表</span>
          <span class="font-body-md text-body-md text-on-surface-variant text-sm">9 题 · 了解近两周情绪相关症状</span>
        </button>
        <button class="test-card text-left rounded-lg bg-surface-container-lowest p-card-inner-padding shadow-[0_12px_36px_rgba(28,107,80,0.05)] hover:shadow-md transition-all flex flex-col gap-2" data-type="ISI">
          <span class="w-11 h-11 rounded-full bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed"><span class="material-symbols-outlined text-[24px]">bedtime</span></span>
          <span class="font-headline-md text-body-md text-on-surface font-semibold">ISI 失眠量表</span>
          <span class="font-body-md text-body-md text-on-surface-variant text-sm">7 题 · 了解近两周睡眠困扰程度</span>
        </button>
      </div>
      <div id="history-box" class="rounded-lg bg-surface-container-lowest p-card-inner-padding shadow-[0_12px_36px_rgba(28,107,80,0.05)] hidden">
        <h3 class="font-headline-md text-body-md text-on-surface font-semibold flex items-center gap-2 mb-3"><span class="material-symbols-outlined text-primary">history</span>我的自测记录</h3>
        <div id="history-list" class="flex flex-col gap-2"></div>
        <button id="clear-history" class="mt-3 font-label-md text-label-md text-on-surface-variant text-sm hover:text-error underline">清除本地记录</button>
      </div>
    </section>

    <!-- Quiz -->
    <section id="quiz-view" class="hidden">
      <button id="quiz-back" class="flex items-center gap-2 text-on-surface-variant hover:text-on-surface mb-4 font-label-md text-label-md"><span class="material-symbols-outlined text-[20px]">arrow_back</span>换一个量表</button>
      <div id="quiz-head" class="mb-4"></div>
      <div id="quiz-items" class="flex flex-col gap-4"></div>
      <button id="submit-quiz" class="mt-6 w-full sm:w-auto px-6 py-3 rounded-full bg-primary text-on-primary font-label-md text-body-md font-semibold shadow-sm hover:bg-primary/95 transition-all flex items-center justify-center gap-2"><span class="material-symbols-outlined text-[20px]">task_alt</span>查看结果</button>
    </section>

    <!-- Result -->
    <section id="result-view" class="hidden">
      <button id="result-back" class="flex items-center gap-2 text-on-surface-variant hover:text-on-surface mb-4 font-label-md text-label-md"><span class="material-symbols-outlined text-[20px]">arrow_back</span>返回</button>
      <div id="result-content"></div>
    </section>
  </div>
</main>
</div>

<!-- Safety overlay (PHQ-9 第9项触发) -->
<div id="safety-overlay" class="fixed inset-0 z-[100] bg-on-surface/40 backdrop-blur-sm hidden flex items-center justify-center p-4">
  <div class="rounded-lg bg-surface-container-lowest p-card-inner-padding shadow-[0_20px_60px_rgba(0,0,0,0.2)] max-w-md w-full">
    <div class="flex items-center gap-3 mb-3"><span class="w-12 h-12 rounded-full bg-error text-on-error flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-[26px]">favorite</span></span><h3 class="font-headline-md text-headline-md text-on-surface font-semibold">请先照顾好自己</h3></div>
    <p class="font-body-md text-body-md text-on-surface-variant text-sm leading-relaxed mb-4">你刚才的选择提示可能存在伤害自己的念头。这些感受是症状在说话，不是事实。请优先保证安全，并尽快联系你所在地区的心理危机干预渠道或前往最近急诊。</p>
    <a href="safety.html" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-primary/95 transition-all"><span class="material-symbols-outlined text-[18px]">support_agent</span>查看安全与帮助</a>
    <button id="safety-close" class="ml-2 px-5 py-2.5 rounded-full bg-surface-container-low text-on-surface-variant font-label-md text-label-md hover:bg-surface-container transition-all">我明白了</button>
  </div>
</div>

<script>
  const DEFS = ${JSON.stringify(DEFS)};
  const LEVELS = ${JSON.stringify(LEVELS)};

  const selectView = document.getElementById('select-view');
  const quizView = document.getElementById('quiz-view');
  const resultView = document.getElementById('result-view');
  const quizItems = document.getElementById('quiz-items');
  const quizHead = document.getElementById('quiz-head');
  const resultContent = document.getElementById('result-content');

  let currentType = null;
  let answers = {};

  function esc(s){ return (s||'').replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])); }
  function scoreLevel(type, score){
    const lv = LEVELS[type] || [];
    for(const x of lv){ if(score <= x.max) return x; }
    return lv[lv.length-1] || { level:'', desc:'' };
  }

  document.querySelectorAll('.test-card').forEach(c => c.addEventListener('click', () => startQuiz(c.dataset.type)));
  document.getElementById('quiz-back').addEventListener('click', () => { quizView.classList.add('hidden'); selectView.classList.remove('hidden'); });
  document.getElementById('result-back').addEventListener('click', () => { resultView.classList.add('hidden'); selectView.classList.remove('hidden'); });
  document.getElementById('submit-quiz').addEventListener('click', submitQuiz);
  document.getElementById('safety-close').addEventListener('click', () => document.getElementById('safety-overlay').classList.add('hidden'));

  function startQuiz(type){
    currentType = type; answers = {};
    const d = DEFS[type];
    quizHead.innerHTML = '<div class="rounded-lg bg-surface-container-lowest p-card-inner-padding shadow-[0_12px_36px_rgba(28,107,80,0.05)]"><h2 class="font-headline-md text-headline-md text-on-surface">'+esc(d.name)+'</h2><p class="font-body-md text-body-md text-on-surface-variant text-sm mt-1">'+esc(d.short)+'</p><p class="font-body-md text-body-md text-on-surface-variant text-sm mt-2">'+esc(d.prompt)+'</p></div>';
    quizItems.innerHTML = '';
    d.items.forEach((q, i) => {
      const wrap = document.createElement('div');
      wrap.className = 'rounded-lg bg-surface-container-lowest p-card-inner-padding shadow-[0_12px_36px_rgba(28,107,80,0.05)]';
      let opts = '<div class="flex flex-wrap gap-2 mt-3">';
      d.opts.forEach(o => {
        opts += '<button type="button" class="opt px-4 py-2 rounded-full bg-surface-container-low text-on-surface-variant hover:bg-surface-container font-label-md text-label-md transition-all" data-q="'+i+'" data-score="'+o.score+'">'+esc(o.label)+'</button>';
      });
      opts += '</div>';
      wrap.innerHTML = '<p class="font-body-md text-body-md text-on-surface"><span class="text-primary font-semibold mr-2">'+(i+1)+'.</span>'+esc(q)+'</p>'+opts;
      quizItems.appendChild(wrap);
    });
    quizItems.querySelectorAll('.opt').forEach(b => b.addEventListener('click', () => {
      const q = b.dataset.q;
      answers[q] = parseInt(b.dataset.score,10);
      const sib = b.parentElement.querySelectorAll('.opt');
      sib.forEach(x => { x.classList.remove('bg-primary-container','text-on-primary-container','font-semibold'); x.classList.add('bg-surface-container-low','text-on-surface-variant'); });
      b.classList.add('bg-primary-container','text-on-primary-container','font-semibold'); b.classList.remove('bg-surface-container-low','text-on-surface-variant');
    }));
    selectView.classList.add('hidden'); resultView.classList.add('hidden'); quizView.classList.remove('hidden');
    window.scrollTo(0,0);
  }

  function submitQuiz(){
    const d = DEFS[currentType];
    const total = d.items.length;
    let unanswered = 0;
    for(let i=0;i<total;i++){ if(answers[i] === undefined){ unanswered++; } }
    if(unanswered > 0){ alert('还有 '+unanswered+' 题未作答，请完成全部题目。'); return; }
    const score = Object.values(answers).reduce((a,b)=>a+b,0);
    const lv = scoreLevel(currentType, score);
    const critical = (d.criticalIndex >= 0 && answers[d.criticalIndex] > 0);
    // 保存历史
    saveHistory(currentType, score, lv.level);
    renderResult(d, score, lv, critical);
    if(critical){ document.getElementById('safety-overlay').classList.remove('hidden'); }
  }

  function renderResult(d, score, lv, critical){
    let html = '';
    html += '<div class="rounded-lg bg-surface-container-lowest p-card-inner-padding shadow-[0_12px_36px_rgba(28,107,80,0.05)] text-center">';
    html += '<span class="font-label-md text-label-md text-on-surface-variant text-sm">'+esc(d.name)+' · 总分</span>';
    html += '<div class="font-headline-lg text-headline-lg text-primary font-bold my-1">'+score+'<span class="text-base text-on-surface-variant"> / '+(d.opts.length-1)*d.items.length+'</span></div>';
    html += '<div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-container text-on-primary-container font-label-md text-label-md font-semibold">'+esc(lv.level)+'</div>';
    html += '<p class="font-body-md text-body-md text-on-surface-variant text-sm mt-3">'+esc(lv.desc)+'</p>';
    html += '</div>';
    if(critical){
      html += '<div class="mt-4 rounded-lg bg-error-container/50 p-card-inner-padding flex items-center gap-3"><span class="material-symbols-outlined text-error text-[24px]">favorite</span><p class="font-body-md text-body-md text-on-surface text-sm">你的回答提示可能存在伤害自己的念头。请优先保证安全，查看<a href="safety.html" class="text-primary font-semibold underline">安全与帮助</a>或就近寻求专业支持。</p></div>';
    }
    html += '<div class="mt-4 rounded-lg bg-surface-container-lowest p-card-inner-padding shadow-[0_12px_36px_rgba(28,107,80,0.05)]"><h4 class="font-headline-md text-body-md text-on-surface font-semibold mb-2">接下来可以做什么</h4><ul class="flex flex-col gap-2 font-body-md text-body-md text-on-surface-variant text-sm list-disc pl-5"><li>本结果只是症状筛查，不是医学诊断，请勿据此自行下结论。</li><li>若症状已持续两周以上并影响生活，建议前往精神科或心理科评估。</li><li>尝试一个缓解工具：<a href="breathing-space.html" class="text-primary font-semibold underline">呼吸训练</a>、<a href="toolbox.html" class="text-primary font-semibold underline">疗愈工具箱</a>。</li><li>了解更多：<a href="knowledge.html" class="text-primary font-semibold underline">焦虑知识库</a>。</li></ul></div>';
    resultContent.innerHTML = html;
    quizView.classList.add('hidden'); selectView.classList.remove('hidden'); resultView.classList.remove('hidden');
    renderHistory();
    window.scrollTo(0,0);
  }

  // ---- localStorage 历史（镜像小程序 assessment-history）----
  function saveHistory(type, score, level){
    try{
      const arr = JSON.parse(localStorage.getItem('jy_assess_history')||'[]');
      arr.unshift({ type, score, level, date: new Date().toISOString().slice(0,10) });
      localStorage.setItem('jy_assess_history', JSON.stringify(arr.slice(0,10)));
    }catch(e){}
  }
  function renderHistory(){
    const box = document.getElementById('history-box');
    const list = document.getElementById('history-list');
    let arr = [];
    try{ arr = JSON.parse(localStorage.getItem('jy_assess_history')||'[]'); }catch(e){}
    if(!arr.length){ box.classList.add('hidden'); return; }
    box.classList.remove('hidden');
    list.innerHTML = '';
    arr.forEach(h => {
      const row = document.createElement('div');
      row.className = 'flex items-center justify-between bg-surface-container-low rounded-DEFAULT px-4 py-3';
      row.innerHTML = '<div class="flex items-center gap-3"><span class="font-body-md text-body-md text-on-surface font-semibold">'+esc(h.type)+'</span><span class="font-label-md text-label-md text-on-surface-variant text-xs">'+esc(h.date)+'</span></div><div class="flex items-center gap-3"><span class="font-headline-md text-body-md text-primary font-bold">'+h.score+'</span><span class="font-label-md text-label-md text-on-surface-variant text-xs">'+esc(h.level)+'</span></div>';
      list.appendChild(row);
    });
  }
  document.getElementById('clear-history').addEventListener('click', () => { localStorage.removeItem('jy_assess_history'); renderHistory(); });

  renderHistory();
</script>
<script>
  (function(){ const cur=location.pathname.split('/').pop()||'assessment.html'; const map={'index.html':'overview','toolbox.html':'toolbox','breathing-space.html':'breathing-space','mood.html':'mood-and-insights','science.html':'science-basis','knowledge.html':'knowledge','assessment.html':'assessment','safety.html':'safety','privacy.html':'compliance-privacy','profile.html':'profile'}; const ap=map[cur]; document.querySelectorAll('aside nav a.nav-link').forEach(a=>{ if(a.dataset.path===ap){ a.classList.add('bg-primary-container','text-on-primary-container','font-semibold'); a.classList.remove('text-on-surface-variant'); a.setAttribute('aria-current','page'); } }); })();
</script>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, 'assessment.html'), tpl);
console.log('assessment.html written; types=', Object.keys(DEFS).join(','));
