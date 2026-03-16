# 代码规范

## 文件命名

| 类型 | 命名规则 | 示例 |
|------|----------|------|
| 页面 | `pages/{name}/{name}.vue`（UniApp 约定） | `pages/index/index.vue` |
| 组件 | `components/{PascalCase}.vue` | `components/PlaceCard.vue` |
| 工具函数 | `utils/{camelCase}.ts` | `utils/recommend.ts` |

## Vue 组件规范

- 使用 `<script setup lang="ts">` 组合式 API
- Props 使用 `defineProps<{}>()` 泛型语法
- Emits 使用 `defineEmits<{}>()` 泛型语法
- 样式使用 Tailwind CSS 工具类直接写在模板中，不使用 `<style scoped>`
- 仅在 Tailwind 无法覆盖的场景（如动态 `:style` 绑定、小程序原生组件样式穿透）保留少量内联样式或 `<style scoped>`

## 类型系统

- 所有数据模型定义在 `utils/types.ts`
- 使用 `import type` 导入类型
- API 返回值暂用 `any`（腾讯地图 API 无官方 TS 类型）

## 页面间数据传递

使用 `uni.setStorageSync` / `uni.getStorageSync` 传递复杂数据。

### Storage Key 约定

| Key | 类型 | 用途 |
|-----|------|------|
| `recommend_results` | `string` (JSON序列化的 Place[]) | 推荐结果列表 |
| `recommend_locations` | `string` (JSON序列化的 Location[]) | 用户位置列表 |
| `detail_place` | `string` (JSON序列化的 Place) | 当前详情页的地点 |
| `detail_locations` | `string` (JSON序列化的 Location[]) | 详情页对应的用户位置 |

> 存取时需要 `JSON.stringify` / `JSON.parse`。

## API 调用约定

- 所有腾讯地图 API 调用封装在 `utils/map.ts`
- 使用 `uni.request` 发起请求（不用 fetch/axios）
- API Key 通过环境变量 `import.meta.env.VITE_MAP_KEY` 注入
- 错误处理链路：API 返回 `status !== 0` → `getApiErrorMessage()` 生成友好文案 → `reject(Error)` → 上层 `catch` → `uni.showToast` 提示用户

## 页面布局约定

需要底部固定操作按钮的页面，统一使用以下布局模式：

- 最外层容器：`h-screen flex flex-col`（撑满屏幕，纵向弹性布局）
- 可滚动区域：`<scroll-view scroll-y class="flex-1">`（占满剩余空间）
- 底部固定区域：独立 `<view>`，不在 scroll-view 内部，使用样式 `bg-white border-t border-[#f0f0f0] px-[24rpx] pt-[16rpx] pb-[32rpx]`

已采用此模式的页面：
- `src/pages/index/index.vue` — 底部为"开始推荐"按钮 + 提示文案
- `src/pages/detail/detail.vue` — 底部为"去大众点评查看评价" + "导航前往"按钮

> **注意**：不要使用 `position: fixed` 实现底部固定，在小程序中兼容性差且会遮挡内容。使用 flex 布局 + scroll-view 是更可靠的方案。

## 样式约定

- 使用 **Tailwind CSS** 工具类（通过 `weapp-tailwindcss` 插件适配微信小程序）
- rpx 值通过 Tailwind 任意值语法书写：`px-[24rpx]`、`text-[32rpx]`
- 设计 token 已配置在 `tailwind.config.js` 的 `theme.extend` 中：
  - 颜色类：`bg-primary`、`text-accent`、`bg-page-bg`、`bg-card-bg`
- 详细设计规范见 [reference/design-tokens.md](../reference/design-tokens.md)
