# 推荐算法

核心逻辑在 `src/utils/recommend.ts`，依赖 `src/utils/geo.ts` 和 `src/utils/map.ts`。

## 完整流程

```
输入: locations: Location[], keyword: string, radius?: number
  │
  ├─ 1. 计算几何中心 center = getCenter(locations)
  │     空数组返回北京中心 (39.9042, 116.4074)
  │
  ├─ 2. 计算最大间距 maxSpan = getMaxSpan(locations)
  │     所有两两组合中的最大 Haversine 距离
  │
  ├─ 3. 确定搜索半径
  │     优先使用用户传入的 radius
  │     否则自动计算: getSearchRadius(maxSpan)
  │       <5km → 3000m
  │       5-15km → 8000m
  │       >15km → 12000m
  │
  ├─ 4. POI 搜索
  │     searchNearbyPOI(center.lat, center.lng, keyword, radius)
  │     调用腾讯地图 API，返回最多 40 个 POI
  │
  ├─ 5. 距离计算
  │     对每个 POI，用 Haversine 计算到每个人的距离
  │     distances[i] = distanceBetween(locations[i], poiLocation)
  │
  ├─ 6. 综合评分 scorePlaces(places)
  │     score = 0.40 × ratingScore
  │           + 0.35 × avgDistScore
  │           + 0.15 × maxDistScore
  │           + 0.10 × 0.5  (分类匹配固定奖励)
  │
  ├─ 7. 按 score 降序排序
  │
  └─ 8. 返回 Top N（默认 20）
```

## 评分公式详解

### 权重分配

| 维度 | 权重 | 意义 |
|------|------|------|
| 地点评分 (ratingScore) | 40% | 优先推荐口碑好的地点 |
| 平均距离 (avgDistScore) | 35% | 所有人到该地点的平均距离越短越好 |
| 公平性 (maxDistScore) | 15% | 最远那个人的距离不能太远 |
| 分类匹配 | 10% | 已通过关键词筛选，固定给 0.5 分 |

### 各维度计算方式

- **ratingScore**: `rating / 5`（无评分时默认 0.6）
- **avgDistScore**: `1 - normalize(avgDistance)` — 距离越近分越高
- **maxDistScore**: `1 - normalize(maxDistance)` — 最远的人越近越好
- **normalize**: `(value - min) / (max - min)` — min-max 归一化到 [0,1]

## 几何计算模块 (geo.ts)

| 函数 | 签名 | 说明 |
|------|------|------|
| `distanceBetween` | `(a: Location, b: Location) → number` | Haversine 公式，返回米，地球半径 6371km |
| `getCenter` | `(locations: Location[]) → {lat, lng}` | 算术平均中心点 |
| `getMaxSpan` | `(locations: Location[]) → number` | 所有两两组合的最大距离(米) |
| `getSearchRadius` | `(maxSpan: number) → number` | 距离→搜索半径映射 |

## 关键函数签名

```typescript
// recommend.ts
export async function getRecommendations(
  params: RecommendParams,  // { locations, keyword, radius? }
  topN = 20
): Promise<Place[]>

// 内部函数
function scorePlaces(places: Place[]): Place[]
function normalize(value: number, min: number, max: number): number
```
