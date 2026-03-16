# 技术栈与项目结构

## 技术栈

| 层级 | 技术 | 版本 | 说明 |
|------|------|------|------|
| 框架 | UniApp | 3.0.0-4080420251103001 | 跨平台小程序框架 |
| 视图层 | Vue 3 | ^3.4.21 | Composition API + `<script setup>` |
| 语言 | TypeScript | ^4.9.4 | 类型检查 |
| 构建工具 | Vite | 5.2.8 | HMR 开发体验 |
| 样式 | Tailwind CSS | ^3.4.19 | 原子化 CSS，通过 weapp-tailwindcss(^4.10.3) 适配小程序 |
| 地图 API | 腾讯地图 WebService | v1 | POI 搜索、地址搜索、逆地理编码 |
| 运行时 | 微信小程序 | — | 目标平台 (mp-weixin) |
| 坐标系 | GCJ-02 | — | 国测局坐标，腾讯地图和微信定位共用 |

## 项目目录结构

```
src/
├── pages/                          # 页面（路由在 pages.json 中定义）
│   ├── index/index.vue             # 首页：位置输入 + 类型选择 + 距离选择 + 发起推荐
│   ├── result/result.vue           # 推荐结果页：地点卡片列表
│   └── detail/detail.vue           # 地点详情页：地图 + 信息 + 导航 + 大众点评
├── components/                     # 可复用组件
│   ├── LocationInput.vue           # 位置输入组件（GPS 定位/地址搜索/多位置管理）
│   ├── CategorySelector.vue        # 活动类型 4×2 网格选择器
│   ├── DistanceSlider.vue          # 搜索距离范围滑块
│   └── PlaceCard.vue               # 推荐地点卡片
├── utils/                          # 工具函数
│   ├── types.ts                    # 全局类型定义（Location, Place, Category, RecommendParams）
│   ├── geo.ts                      # 几何计算（Haversine 距离、中心点、搜索半径）
│   ├── map.ts                      # 腾讯地图 API 封装（POI 搜索、地址搜索、逆地理编码）
│   ├── recommend.ts                # 推荐算法（综合评分 + 排序）
│   └── categories.ts               # 预设活动分类配置（8 种）
├── static/                         # 静态资源
│   └── marker-dest.png             # 地图目标地点图标
├── pages.json                      # 页面路由 + 导航栏配置
├── App.vue                         # 应用入口
├── main.ts                         # Vue 初始化
├── env.d.ts                        # 环境类型声明
├── shime-uni.d.ts                  # UniApp 类型声明
└── uni.scss                        # 全局样式变量
```

## 构建工具链

`vite.config.ts` 配置要点：

- **`@dcloudio/vite-plugin-uni`** — UniApp Vite 插件
- **`weapp-tailwindcss`** — 仅在非 H5 平台启用，将 Tailwind 输出转换为小程序兼容格式
- **PostCSS** — 集成 `tailwindcss` 和 `autoprefixer`
- **Tailwind 配置** (`tailwind.config.js`)：
  - `content`: `./src/**/*.{vue,ts,js}`
  - `preflight`: 关闭（避免影响小程序基础样式）
  - 自定义颜色：`primary`(`#4A90D9`)、`accent`(`#F57C00`)、`page-bg`(`#F5F6FA`)、`card-bg`(`#FFFFFF`)

## 关键配置文件

| 文件 | 用途 |
|------|------|
| `src/pages.json` | 页面路由 + 全局导航栏样式 |
| `tailwind.config.js` | Tailwind CSS 配置（颜色、内容路径） |
| `vite.config.ts` | Vite 构建 + PostCSS + weapp-tailwindcss 插件 |
| `tsconfig.json` | TypeScript 编译选项 |
| `package.json` | 依赖与脚本命令 |
| `.env` | 环境变量（`VITE_MAP_KEY` 腾讯地图 API Key） |
