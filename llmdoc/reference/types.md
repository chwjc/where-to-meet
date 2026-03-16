# 类型系统

所有类型定义在 `src/utils/types.ts`。

## Location — 位置信息

```typescript
export interface Location {
  /** 纬度 */
  lat: number
  /** 经度 */
  lng: number
  /** 地址名称（如 "望京 SOHO"） */
  name: string
  /** 详细地址（如 "北京市朝阳区望京街..."） */
  address?: string
}
```

## Category — 活动分类

```typescript
export interface Category {
  /** 分类标识（如 "food"） */
  id: string
  /** 分类名称（如 "聚餐"） */
  label: string
  /** 分类图标 Emoji（如 "🍽️"） */
  icon: string
  /** 腾讯地图 POI 搜索关键词（如 "餐厅"） */
  keyword: string
}
```

## Place — 推荐地点

```typescript
export interface Place {
  /** 地点 ID（POI 唯一 ID） */
  id: string
  /** 地点名称 */
  title: string
  /** 详细地址 */
  address: string
  /** 纬度 */
  lat: number
  /** 经度 */
  lng: number
  /** 联系电话（可能为空） */
  tel?: string
  /** POI 分类名 */
  category: string
  /** 地点评分（腾讯地图 POI 评分，0-5，可能为空） */
  rating?: number
  /** 到各人的距离（米），与输入位置顺序对应 */
  distances: number[]
  /** 平均距离（米） */
  avgDistance: number
  /** 最大距离（米） */
  maxDistance: number
  /** 综合评分 0-1 */
  score: number
}
```

## RecommendParams — 推荐请求参数

```typescript
export interface RecommendParams {
  /** 所有人的位置 */
  locations: Location[]
  /** 选择的活动类型搜索关键词 */
  keyword: string
  /** 用户手动设定的搜索半径（米），不传则自动计算 */
  radius?: number
}
```

## 预设活动分类数据

定义在 `src/utils/categories.ts`：

| ID | 图标 | 名称 | 搜索关键词 |
|----|------|------|------------|
| food | 🍽️ | 聚餐 | 餐厅 |
| hotpot | 🍲 | 火锅 | 火锅 |
| cafe | ☕ | 咖啡 | 咖啡厅 |
| movie | 🎬 | 电影 | 电影院 |
| ktv | 🎤 | KTV | KTV |
| sport | 🏃 | 运动 | 运动 |
| shopping | 🛍️ | 购物 | 商场 |
| bar | 🍻 | 酒吧 | 酒吧 |

扩展方式：在 `categories.ts` 数组中新增条目即可，前端自动渲染。
