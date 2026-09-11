# 静一下心 · 静态 Web 版（calm web）

把微信小程序「静一下心」的焦虑舒缓工具，以**纯静态网页**形式呈现，可直接部署到 GitHub Pages / 任意静态托管。本版本已对照小程序做完整**查漏补缺**：小程序有、Web 缺的功能已补齐；Web 多出小程序没有的功能已移除。

## 技术说明
- 纯静态、零构建：HTML + Tailwind CSS（CDN 加载运行时，`tailwind.config` 由 `assets/tailwind-setup.js` 统一提供）+ 原生 JavaScript。
- 设计系统沿用小程序原版 **Serenity & Breath**（primary `#1c6b50`、primary-container `#7cc6a6`、玻璃卡片、`Plus Jakarta Sans` + `Material Symbols Outlined`，均走 Google Fonts CDN）。
- 左侧固定导航 **10 项**：首页 / 疗愈工具箱 / 呼吸训练 / 情绪日志 / 科学依据 / 焦虑知识库 / 权威自测 / 安全与帮助 / 隐私与合规 / 个人中心。当前页由 `location.pathname` 自动高亮（`aside nav a.nav-link` + `data-path`）。
- 品牌标志为本地 `assets/logo.png`（统一风格生成，无外链图片依赖）；`assets/logo.svg` 为早期占位，已不再引用。
- 外链字体走 Google Fonts CDN（需联网加载）；其余资源全部本地化，部署后不会因外链失效。

## 页面清单（10 页，与小程序功能对齐）
| 文件 | 对应小程序 | 内容 |
|------|-----------|------|
| `index.html` | 首页 + calm 引擎 | 即时干预入口：6 状态（脑子停不下来 / 一直担心 / 身体很紧 / 睡不着 / 什么都不想做 / 说不上来）→ 规则匹配推荐工具；「今天静一下」（呼吸 / 5-4-3-2-1 着陆 / 微小行动）；知识库与科学依据 banner |
| `toolbox.html` | 疗愈工具箱 | 全部 10 个工具（舒尔特 / 呼吸 / 着陆 / 渐进式肌肉放松 / Stroop / 微小行动 / 反刍打断 / 睡眠 / 睡前思绪整理 / 夜间醒来），每卡内联「怎么做」步骤，含 6 筛选 pill |
| `breathing-space.html` | 呼吸训练 | 三种节律（4-7-8 / 箱式 / 共振）+ 呼吸曼陀罗状态机 |
| `mood.html` | 情绪日志 | 自评滑块、情绪标签、趋势图、历史流（本地 widget） |
| `science.html` | 科学依据 | 概念卡（焦虑是什么 / 为什么有效 / 工具原理）+ 各工具科学原理 + FAQ（危机条目改为 region 指引并链 `safety.html`）+ 专业帮助入口 |
| `knowledge.html` | 焦虑知识库 | 9 分类 49 篇文章；每篇含一句话结论 / 为什么 / 感受 / 可以做什么 / 何时求助 / 相关工具 / 信源（WHO·APA·NICE·DSM-5 等）。由 `build_knowledge.js` 从小程序 `utils/knowledge-data.js` 生成 |
| `assessment.html` | 权威自测 | GAD-7 / PHQ-9 / ISI 三量表，答题 → 计分 → 分级；PHQ-9 第 9 项非 0 触发安全浮层；历史存 `localStorage`（最多 10 条，可清除）。由 `build_assessment.js` 从小程序 `utils/assessment-data.js` 生成 |
| `safety.html` | 安全与帮助 | region-based 危机资源：紧急 120/110 指引 + 按地区搜索心理援助热线引导 + 公开可查示例热线（以官方最新为准）；专业帮助时机；免责声明 |
| `privacy.html` | 隐私与合规 | 本地存储与加密说明、数据权利、合规定位；危机条指向 `safety.html`（不再硬编码全国统一热线） |
| `profile.html` | 个人中心 | 「认识自己 · 状态中心」五维圆点（焦虑 / 睡眠 / 情绪 / 精力 / 压力，标注非医学评分）+ 做权威自测入口 + 设置（含「我的自测记录」→ `assessment.html`）；微信用户头、统计、有效方法、加密开关 |

## 文件结构
```
jingyixia-web/
├─ index.html / toolbox.html / breathing-space.html / mood.html
├─ science.html / knowledge.html / assessment.html
├─ safety.html / privacy.html / profile.html
├─ assets/
│  ├─ logo.png           品牌标志（本地，统一风格）
│  ├─ tailwind-setup.js  共享 tailwind.config（10 页中 7 页引用；breathing-space / mood / privacy 仍内联同一份配置，渲染等价）
│  └─ styles.css         共享基础样式与动效
├─ build_knowledge.js    生成器：require 小程序 utils/knowledge-data.js → 写出 knowledge.html
├─ build_assessment.js   生成器：require 小程序 utils/assessment-data.js → 写出 assessment.html
└─ update_old_pages.js   辅助脚本：批量把旧页导航/logo/favicon/高亮脚本统一为 10 项标准块
```

> 生成器依赖小程序源码：`build_*.js` 通过 `path.join(root,'utils/...')` 读取**上级目录** `../utils/` 的小程序数据（与 `jingyixia-web/` 同父级的小程序工程）。修改小程序数据后重跑生成器即可同步 Web 内容，无需手抄。

## 本地预览
```bash
cd jingyixia-web
python -m http.server 8000
# 浏览器打开 http://localhost:8000
```

## 部署到 GitHub Pages
1. 将 `jingyixia-web/` 内全部文件推送到仓库（建议独立仓库，或放在仓库根目录）。
2. 仓库 → **Settings → Pages** → Source 选 `Deploy from a branch` → 分支 `main` → 目录 `/ (root)` → Save。
3. 约 1 分钟后访问 `https://<用户名>.github.io/<仓库名>/`。
   - 若作为**用户/组织页**（`<用户名>.github.io`），根目录即首页，裸文件名链接同样正常。

> 所有页面使用相对路径（如 `toolbox.html`、`assets/logo.png`），在任意子路径下均能正确解析，刷新不会 404。

## 交互与数据范围（当前版本）
- 前端实现：呼吸状态机、工具箱筛选与步骤展开、calm 状态匹配、科学依据 FAQ 手风琴、个人中心开关。
- 本地持久化：`assessment.html` 的自测历史写入 `localStorage`（最多 10 条，可清除）；`mood.html` 情绪记录为本地封存动效演示（示例数据，未接长期存档）。其余页面为静态展示 + 客户端交互。
- 知识库与自测内容由生成器从小程序权威数据产出，**与小程序的真实数据保持一致**。

## 合规
- 定位为通用身心健康（General Wellness）辅助工具，**不提供医疗诊断、不替代专业治疗**。
- 自测（GAD-7 / PHQ-9 / ISI）= 症状筛查 / 严重程度评估，**≠ 诊断、≠ 替代治疗**；PHQ-9 第 9 项非 0 必触发「请先照顾好自己」安全页。
- 危机资源采用 **region-based** 方案（与小程序一致）：不硬编码全国统一热线。`safety.html` 提供按地区搜索心理援助热线的引导与公开可查示例；`privacy.html` 危机条指向 `safety.html`；`science.html` FAQ 危机条目同样改为 region 指引。产品内不写死全球/全国统一热线号码。
- 部署到境外（如美国 App Store 版）时，危机资源须替换为当地（如美国 988 Suicide & Crisis Lifeline + Crisis Text Line），并补充独立英文隐私政策与 General Wellness 合规文案。
