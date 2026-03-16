# 设计规范

## 色彩体系

| 名称 | 色值 | Tailwind 类 | 用途 |
|------|------|-------------|------|
| 主色 | `#4A90D9` | `bg-primary` / `text-primary` | 按钮、选中态、导航栏、进度条、定位按钮 |
| 主色浅 | `#E8F0FE` | `bg-[#E8F0FE]` | 分类选中背景、距离标签背景 |
| 强调色 | `#F57C00` | `text-accent` | 评分数字 |
| 强调色浅 | `#FFF3E0` | `bg-[#FFF3E0]` | 评分徽章背景 |
| 错误色 | `#CC4444` | `text-[#CC4444]` | 删除按钮 |
| 主文字 | `#333333` | `text-[#333]` | 标题、名称 |
| 次文字 | `#666666` | `text-[#666]` | 地址、分类 |
| 辅助文字 | `#999999` | `text-[#999]` | 提示、标签、距离详情 |
| 页面背景 | `#F5F6FA` | `bg-page-bg` | 所有页面底色 |
| 卡片背景 | `#FFFFFF` | `bg-card-bg` / `bg-white` | 白色卡片 |
| 分割线 | `#F0F0F0` | `border-[#f0f0f0]` | 卡片内分隔线 |
| 输入框背景 | `#F5F6FA` | `bg-[#F5F6FA]` | 搜索框、位置条目背景 |
| 禁用色 | `#CCCCCC` | `bg-[#cccccc]` | 按钮禁用态 |
| 导航栏背景 | `#4A90D9` | — | 全局导航栏（pages.json 配置） |
| 导航栏文字 | `#FFFFFF` | — | 导航栏标题（pages.json 配置） |
| 大众点评按钮 | `#FF6633` | `bg-[#FF6633]` | 详情页"去大众点评查看评价"按钮 |

### Tailwind 自定义颜色配置

在 `tailwind.config.js` 中已配置：

```javascript
colors: {
  primary: '#4A90D9',
  accent: '#F57C00',
  'page-bg': '#F5F6FA',
  'card-bg': '#FFFFFF',
}
```

## 字号体系

| 用途 | 大小 | 字重 | Tailwind 写法 |
|------|------|------|--------------|
| 页面大标题 | 44rpx | 700 (bold) | `text-[44rpx] font-bold` |
| 地点详情名称 | 36rpx | 700 (bold) | `text-[36rpx] font-bold` |
| 模块标题/按钮文字 | 32rpx | 600 (semibold) | `text-[32rpx] font-semibold` |
| 地点名称/结果标题 | 30rpx | 600 (semibold) | `text-[30rpx] font-semibold` |
| 搜索建议/位置名称 | 28rpx | 400 | `text-[28rpx]` |
| 副标题/地址 | 26rpx | 400 | `text-[26rpx]` |
| 标签/分类名 | 24rpx | 400 | `text-[24rpx]` |
| 小标签/距离 | 22rpx | 400 | `text-[22rpx]` |
| 评分后缀"分" | 20rpx | 400 | `text-[20rpx]` |

## 圆角规范

| 用途 | 圆角 | Tailwind 写法 |
|------|------|--------------|
| 卡片/模块容器 | 16rpx | `rounded-[16rpx]` |
| 按钮 | 16rpx | `rounded-[16rpx]` |
| 位置条目/搜索框 | 12rpx | `rounded-[12rpx]` |
| 小标签/定位按钮 | 8rpx | `rounded-[8rpx]` |
| 距离进度条 | 8rpx | `rounded-[8rpx]` |
| 标签 | 6rpx | `rounded-[6rpx]` |

## 间距规范

| 用途 | 间距 | Tailwind 写法 |
|------|------|--------------|
| 页面内容内边距 | 24rpx | `px-[24rpx]` |
| 卡片内边距 | 24rpx | `p-[24rpx]` |
| 模块间距 | 24rpx | `mb-[24rpx]` |
| 卡片间距（结果列表） | 20rpx | `mb-[20rpx]` |
| 分类网格间距 | 16rpx | `gap-[16rpx]` |
| 位置条目间距 | 12rpx | `gap-[12rpx]` |

## 底部固定操作栏

需要底部固定按钮的页面，操作栏统一使用以下样式：

| 属性 | 值 | Tailwind 写法 |
|------|-----|--------------|
| 背景色 | `#FFFFFF` | `bg-white` |
| 顶部边框 | 1px `#F0F0F0` | `border-t border-[#f0f0f0]` |
| 左右内边距 | 24rpx | `px-[24rpx]` |
| 顶部内边距 | 16rpx | `pt-[16rpx]` |
| 底部内边距 | 32rpx | `pb-[32rpx]` |

> 底部留 32rpx 以适配小程序安全区域。布局实现方式详见 `/llmdoc/guides/code-conventions.md` 的「页面布局约定」。

## 按钮规格

| 按钮类型 | 高度 | 背景色 | 文字 | 圆角 |
|----------|------|--------|------|------|
| 主操作按钮 | 88rpx | `#4A90D9` | 白色 32rpx semibold | 16rpx |
| 主操作按钮（禁用） | 88rpx | `#CCCCCC` | 白色 32rpx semibold | 16rpx |
| 大众点评按钮 | 88rpx | `#FF6633` | 白色 32rpx semibold | 16rpx |
| 返回按钮 | 自适应 | `#4A90D9` | 白色 28rpx | 12rpx |
| 定位按钮 | 自适应 | `#4A90D9` | 白色 | 8rpx |
