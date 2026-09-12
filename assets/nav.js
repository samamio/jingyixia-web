// assets/nav.js — 共享：逐级返回导航 + 基于本机记录的真实统计
// 所有数据仅存于本设备（localStorage），不做任何 mock。
(function () {
  'use strict';
  var PRACTICE_KEY = 'jy_practice_log';
  var MAX = 2000;

  // 生产域名强制走 HTTPS：若因旧链接 / 缓存 / 代理吞掉 301 而以 http:// 打开，立即升级协议
  (function forceHttps() {
    try {
      var h = location.hostname || '';
      var ours = /(^|\.)yxylws\.com$/i.test(h) || /(^|\.)github\.io$/i.test(h);
      if (ours && location.protocol === 'http:') {
        location.replace('https://' + location.host + location.pathname + location.search + location.hash);
      }
    } catch (e) {}
  })();

  function load(key, fallback) {
    try {
      var v = JSON.parse(localStorage.getItem(key));
      return (v && typeof v === 'object') ? v : fallback;
    } catch (e) { return fallback; }
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function ymd(ts) {
    var d = new Date(ts);
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }

  // 记录一次真实的练习 / 记录行为
  function recordPractice(tool) {
    try {
      var arr = load(PRACTICE_KEY, []);
      if (!Array.isArray(arr)) arr = [];
      arr.push({ tool: tool, ts: Date.now() });
      if (arr.length > MAX) arr = arr.slice(arr.length - MAX);
      localStorage.setItem(PRACTICE_KEY, JSON.stringify(arr));
    } catch (e) {}
  }

  // 逐级返回：优先回到上一页（站内），否则回到首页
  function goBack(e) {
    try {
      if (e && e.preventDefault) e.preventDefault();
      var ref = (document.referrer || '');
      var sameOrigin = ref && ref.indexOf(location.origin) === 0;
      if (sameOrigin && history.length > 1) {
        history.back();
      } else {
        location.href = 'index.html';
      }
    } catch (err) {
      location.href = 'index.html';
    }
  }

  // 工具 key -> 友好名称 / 图标
  var TOOL_LABEL = {
    breathing: '呼吸训练', grounding: '54321 练习', schulte: '动态舒尔特', pmr: '身体放松',
    stroop: 'Stroop 训练', tiny: '微小行动', rumination: '反刍打断', sleep: '睡前放松',
    sleepmind: '睡前思绪整理', mood: '情绪记录', assessment: '权威自测'
  };
  var TOOL_ICON = {
    breathing: 'air', grounding: 'visibility', schulte: 'grid_view', pmr: 'fitness_center',
    stroop: 'style', tiny: 'emoji_objects', rumination: 'psychology', sleep: 'bedtime',
    sleepmind: 'edit_note', mood: 'auto_graph', assessment: 'quiz'
  };

  // 汇总本机真实数据
  function getStats() {
    var practice = load(PRACTICE_KEY, []);
    if (!Array.isArray(practice)) practice = [];
    var moods = load('jy_mood_log', []);
    if (!Array.isArray(moods)) moods = [];
    var assess = load('jy_assess_history', []);
    if (!Array.isArray(assess)) assess = [];

    // 活跃天数（去重，跨练习/情绪/自测）
    var days = {};
    practice.forEach(function (p) { if (p && p.ts) days[ymd(p.ts)] = true; });
    moods.forEach(function (m) { if (m && m.ts) days[ymd(m.ts)] = true; });
    assess.forEach(function (a) { if (a && a.date) days[a.date] = true; });
    var dayList = Object.keys(days).sort();

    // 连续打卡天数（截止到今天或昨天）
    var streak = 0;
    if (dayList.length) {
      var today = ymd(Date.now());
      var yest = ymd(Date.now() - 86400000);
      var cursor = dayList[dayList.length - 1];
      if (cursor === today || cursor === yest) {
        streak = 1;
        for (var i = dayList.length - 2; i >= 0; i--) {
          var prev = new Date(cursor);
          prev.setDate(prev.getDate() - 1);
          if (dayList[i] === ymd(prev.getTime())) { streak++; cursor = dayList[i]; }
          else break;
        }
      }
    }

    // 各工具使用次数
    var byTool = {};
    practice.forEach(function (p) { if (p && p.tool) byTool[p.tool] = (byTool[p.tool] || 0) + 1; });
    var methods = Object.keys(byTool).map(function (k) {
      return { key: k, label: TOOL_LABEL[k] || k, count: byTool[k] };
    }).sort(function (a, b) { return b.count - a.count; });

    // 五维状态圆点（level: 0-100，越高代表状态越好；null = 暂无数据）
    var dims = [];
    if (moods.length) {
      var recent = moods.slice(-14);
      var sum = 0; recent.forEach(function (m) { sum += (Number(m.anxiety) || 5); });
      var avg = sum / recent.length;
      dims.push({ key: 'mood', label: '情绪', level: Math.round((10 - avg) / 10 * 100), has: true });
    } else dims.push({ key: 'mood', label: '情绪', level: null, has: false });

    var gad = assess.filter(function (a) { return a.type === 'GAD-7'; })[0];
    if (gad) dims.push({ key: 'anxiety', label: '焦虑', level: Math.max(0, Math.round((1 - (Number(gad.score) || 0) / 21) * 100)), has: true });
    else dims.push({ key: 'anxiety', label: '焦虑', level: null, has: false });

    var isi = assess.filter(function (a) { return a.type === 'ISI'; })[0];
    if (isi) dims.push({ key: 'sleep', label: '睡眠', level: Math.max(0, Math.round((1 - (Number(isi.score) || 0) / 28) * 100)), has: true });
    else dims.push({ key: 'sleep', label: '睡眠', level: null, has: false });

    dims.push({ key: 'energy', label: '精力', level: null, has: false });
    dims.push({ key: 'stress', label: '压力', level: null, has: false });

    return {
      practiceCount: practice.length,
      practiceDays: dayList.length,
      streak: streak,
      moodCount: moods.length,
      assessCount: assess.length,
      methods: methods,
      dims: dims,
      hasData: (practice.length + moods.length + assess.length) > 0
    };
  }

  window.JY = {
    recordPractice: recordPractice,
    goBack: goBack,
    getStats: getStats,
    TOOL_LABEL: TOOL_LABEL,
    TOOL_ICON: TOOL_ICON
  };
})();
