<h1 align="center">不远不近</h1>

<p align="center">
  <strong>不远不近，刚刚好</strong>
</p>

<p align="center">
  一款帮助多人快速找到「对所有人都方便」的聚会地点的微信小程序
</p>

<p align="center">
  <img src="https://img.shields.io/badge/UniApp-Vue%203-4FC08D?logo=vue.js" alt="Vue 3" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind%20CSS-3-06B6D4?logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/平台-微信小程序-07C160?logo=wechat" alt="WeChat" />
</p>

---

## ✨ 功能亮点

- 📍 **多人定位** — 支持 GPS 定位和地址搜索，轻松添加每个人的位置
- 🍽️ **活动分类** — 8 种预设场景：聚餐、火锅、咖啡、电影、KTV、运动、购物、酒吧
- 🧮 **智能推荐** — 基于 Haversine 距离 + 评分的综合算法，推荐距离最均衡的地点
- 🗺️ **地图预览** — 在地图上直观查看目标地点与每个人的相对位置
- 🧭 **一键导航** — 直接调起微信内置导航，快速前往聚会地点

## 🛠️ 技术栈

| 技术 | 说明 |
|------|------|
| [UniApp](https://uniapp.dcloud.net.cn/) | 跨平台框架，当前目标为微信小程序 |
| [Vue 3](https://vuejs.org/) | 组合式 API + `<script setup>` |
| [TypeScript](https://www.typescriptlang.org/) | 类型安全 |
| [Tailwind CSS](https://tailwindcss.com/) | 原子化样式，通过 [weapp-tailwindcss](https://github.com/sonofmagic/weapp-tailwindcss) 适配小程序 |
| [腾讯地图 WebService API](https://lbs.qq.com/) | POI 搜索、逆地理编码、地址联想 |
| [Vite](https://vitejs.dev/) | 构建工具 |

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
- 腾讯地图 [WebService API Key](https://lbs.qq.com/dev/console/application/mine)（需开启 WebServiceAPI 权限）

### 安装

```bash
git clone https://github.com/chwjc/where-to-meet.git
cd where-to-meet
npm install
```

### 配置 API Key

打开 `src/utils/map.ts`，将 `MAP_KEY` 替换为你自己的腾讯地图 Key：

```typescript
const MAP_KEY = '你的腾讯地图WebServiceAPI Key'
```

> 申请地址：https://lbs.qq.com → 控制台 → 创建 Key → 勾选 **WebServiceAPI**

### 开发

```bash
npm run dev:mp-weixin
```

用微信开发者工具导入 `dist/dev/mp-weixin` 目录即可预览。

### 构建

```bash
npm run build:mp-weixin
```

产物位于 `dist/build/mp-weixin`。

## 📁 项目结构

```
src/
├── pages/
│   ├── index/index.vue         # 首页：位置输入 + 类型选择 + 推荐
│   ├── result/result.vue       # 推荐结果列表
│   └── detail/detail.vue       # 地点详情 + 地图 + 导航
├── components/
│   ├── LocationInput.vue       # 位置输入（GPS 定位 / 地址搜索）
│   ├── CategorySelector.vue    # 活动类型选择器（4×2 网格）
│   └── PlaceCard.vue           # 推荐地点卡片
├── utils/
│   ├── types.ts                # 全局类型定义
│   ├── geo.ts                  # Haversine 距离、中心点计算
│   ├── map.ts                  # 腾讯地图 API 封装
│   ├── recommend.ts            # 推荐算法
│   └── categories.ts           # 8 种活动分类配置
├── pages.json                  # 路由配置
├── manifest.json               # 小程序配置
├── App.vue                     # 应用入口
└── tailwind.config.js          # Tailwind CSS 配置
```

## 🧮 推荐算法

```
综合评分 = 0.40 × 评分得分
         + 0.35 × 平均距离得分（越近越高）
         + 0.15 × 最大距离得分（越小越高）
         + 0.10 × 分类匹配奖励
```

1. 计算所有人位置的**几何中心**
2. 根据最远两人距离自动确定**搜索半径**（3km / 8km / 12km）
3. 以中心点调用腾讯地图 POI 搜索
4. 计算每个候选地点到每个人的 Haversine 距离
5. 综合评分排序，返回 **Top 8**

## 📱 页面预览

> 截图待补充

| 首页 | 推荐结果 | 地点详情 |
|:----:|:-------:|:-------:|
| ![首页](docs/screenshots/home.png) | ![结果](docs/screenshots/result.png) | ![详情](docs/screenshots/detail.png) |

## 🗺️ 版本规划

| 版本 | 功能 |
|------|------|
| **V1 (当前)** | 多人位置输入、活动分类、智能推荐、结果展示、地图详情、一键导航 |
| **V2** | 多人实时协作（房间机制）、投票功能、收藏 / 历史记录 |
| **V3** | AI 自然语言偏好解析、多城市支持 |

## 📄 License

[MIT](LICENSE)
