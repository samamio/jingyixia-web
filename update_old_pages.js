// 统一更新旧页面（mood.html / privacy.html）的导航、logo、favicon、自动高亮脚本
const fs = require('fs');
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

const ACTIVE = `<script>
  (function(){ const cur=location.pathname.split('/').pop()||'page.html'; const map={'index.html':'overview','toolbox.html':'toolbox','breathing-space.html':'breathing-space','mood.html':'mood-and-insights','science.html':'science-basis','knowledge.html':'knowledge','assessment.html':'assessment','safety.html':'safety','privacy.html':'compliance-privacy','profile.html':'profile'}; const ap=map[cur]; document.querySelectorAll('aside nav a.nav-link').forEach(a=>{ if(a.dataset.path===ap){ a.classList.add('bg-primary-container','text-on-primary-container','font-semibold'); a.classList.remove('text-on-surface-variant'); a.setAttribute('aria-current','page'); } }); })();
</script>`;

const files = process.argv.slice(2);
files.forEach(f => {
  let html = fs.readFileSync(f, 'utf8');
  html = html.replace(/<aside[\s\S]*?<\/aside>/, NAV);
  html = html.replace(/<header[\s\S]*?<\/header>/, HEADER);
  if (!html.includes('rel="icon"')) {
    html = html.replace('<link rel="stylesheet" href="assets/styles.css"/>', '<link rel="stylesheet" href="assets/styles.css"/>\n<link rel="icon" href="assets/logo.png"/>');
  }
  if (!html.includes('aside nav a.nav-link')) {
    html = html.replace('</body>', ACTIVE + '\n</body>');
  }
  fs.writeFileSync(f, html);
  console.log('updated', f);
});
