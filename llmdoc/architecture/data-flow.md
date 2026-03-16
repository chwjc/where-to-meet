# 数据流架构

## 页面流转

```
                ┌──────────────┐
                │    首页       │
                │ pages/index  │
                └──────┬───────┘
                       │
            点击"开始推荐"
            (位置>=2 & 已选类型)
                       │
                       ▼
           ┌───── API 请求 ─────┐
           │                     │
        有结果               无结果
           │                     │
           ▼                     ▼
  ┌────────────────┐    Toast "未找到
  │   推荐结果页    │    合适的地点"
  │ pages/result   │    留在首页
  └───────┬────────┘
          │
    点击某个卡片
          │
          ▼
  ┌────────────────┐
  │   地点详情页    │
  │ pages/detail   │
  └───────┬────────┘
          │
     ┌────┼────────┐
     │    │         │
  导航前往 查看评价  拨打电话
     │    │         │
     ▼    ▼         ▼
  微信内置 大众点评  系统拨号
  导航页面 小程序    界面
```

## 导航方式

| 跳转 | API | 说明 |
|------|-----|------|
| 首页 → 结果页 | `uni.navigateTo` | 可返回 |
| 结果页 → 详情页 | `uni.navigateTo` | 可返回 |
| 详情页 → 微信导航 | `uni.openLocation` | 内置导航界面 |
| 详情页 → 大众点评 | `wx.navigateToMiniProgram` | 跳转大众点评小程序搜索店名 |
| 详情页 → 系统拨号 | `uni.makePhoneCall` | 系统拨号界面 |
| 所有页面返回 | 导航栏左上角返回按钮 | 系统默认 |

## Storage 数据传递流程

```
首页 (index)
  │
  │ 推荐完成后写入:
  │   uni.setStorageSync('recommend_results', JSON.stringify(places))
  │   uni.setStorageSync('recommend_locations', JSON.stringify(locations))
  │
  ▼
结果页 (result)
  │
  │ onLoad 时读取:
  │   places = JSON.parse(uni.getStorageSync('recommend_results'))
  │   locations = JSON.parse(uni.getStorageSync('recommend_locations'))
  │
  │ 点击卡片时写入:
  │   uni.setStorageSync('detail_place', JSON.stringify(places[index]))
  │   uni.setStorageSync('detail_locations', uni.getStorageSync('recommend_locations'))
  │
  ▼
详情页 (detail)
  │
  │ onLoad 时读取:
  │   place = JSON.parse(uni.getStorageSync('detail_place'))
  │   locations = JSON.parse(uni.getStorageSync('detail_locations'))
```

## 首页数据流

```
用户操作
  │
  ▼
┌────────────────────────────────────────────────┐
│                    首页                          │
│  LocationInput 组件 ──→ locations: Location[]    │
│       │                                         │
│       └──→ 计算 maxRadius 和默认 searchRadius    │
│                                                 │
│  CategorySelector 组件 ──→ category: Category   │
│                                                 │
│  DistanceSlider 组件 ──→ searchRadius: number   │
│  (仅 locations.length >= 2 时显示)                │
│                                                 │
│  "开始推荐" 按钮 ──→ 触发推荐流程                  │
│    └──→ getRecommendations({locations, keyword, radius})  │
└────────────────────────────────────────────────┘
```

## 推荐请求参数来源

| 参数 | 来源 | 说明 |
|------|------|------|
| `locations` | `LocationInput` 组件 `@update` 事件 | Location[] |
| `keyword` | `CategorySelector` 组件 `@select` 事件 → `category.keyword` | 搜索关键词 |
| `radius` | `DistanceSlider` 组件 v-model / 自动计算 | 可选，用户可手动调整 |
