# 版本规划

## 版本总览

```
V1.0 (当前) ──→ V2.1 多人协作 ──→ V2.2 投票 ──→ V2.3 收藏/历史
                                                        │
                                        V3.1 AI 偏好 ←──┘
                                            │
                                        V3.2 多城市
                                            │
                                        V3.3 智能推荐
```

**关键里程碑**：
- V2.0 核心依赖：开通微信云开发
- V3.0 核心依赖：选定并接入 LLM API 服务

---

## V2.0 — 多人协作版

### V2.1 多人实时协作

让多人通过微信社交关系各自独立上报位置。

**功能描述**：
- 发起人创建「聚会房间」，生成唯一房间码
- 通过微信小程序卡片分享到群聊或好友
- 被邀请人打开后自动获取定位并上报到房间
- 所有人位置实时汇聚，人数 >= 2 时可发起推荐

**技术方案**：
- 接入微信云开发（CloudBase）
- 云数据库 `watch()` 实现实时监听

**数据结构**：

```typescript
interface Room {
  id: string              // 房间码（6位随机字符）
  creatorId: string       // 发起人 openid
  createdAt: number       // 创建时间戳
  expiresAt: number       // 过期时间（24小时后）
  members: RoomMember[]   // 成员列表
  status: 'waiting' | 'recommending' | 'done'
}

interface RoomMember {
  openid: string
  nickname: string
  avatarUrl: string
  location: Location
  joinedAt: number
}
```

**影响范围**：
- 新增 `pages/room/room.vue`
- 新增 `utils/room.ts`
- 修改 `pages/index/index.vue` 添加"创建房间"入口
- `pages.json` 添加房间页路由
- 开通微信云开发

### V2.2 投票功能

推荐结果出来后，房间内所有成员可对地点投票。

**功能描述**：
- 每人可投 1-3 票
- 实时显示投票结果（票数 + 投票人头像）
- 最终结果按「综合评分 + 投票数」加权排序

**数据结构**：

```typescript
interface Vote {
  roomId: string
  placeId: string
  openid: string
  createdAt: number
}
```

### V2.3 收藏与历史记录

**功能描述**：
- 收藏推荐地点
- 首页显示最近 10 次推荐历史

**数据结构**：

```typescript
interface HistoryRecord {
  id: string
  date: string            // ISO 日期
  locationCount: number   // 参与人数
  category: Category      // 活动类型
  topPlace: Place         // 排名第一的地点
  allPlaces: Place[]      // 所有推荐结果
}
```

---

## V3.0 — AI 增强版

### V3.1 AI 自然语言偏好

在首页增加偏好输入框，用自然语言描述需求（如"想吃辣的，人均 80 以内，最好有包间"），AI 解析后过滤和加权推荐结果。

**技术方案**：
- 后端接入 LLM API（候选：DeepSeek / 智谱 GLM / 百度文心）
- 云函数调用 AI API，前端不持有 AI API Key

**AI 解析输出结构**：

```typescript
interface AIPreference {
  cuisineType?: string[]     // 菜系偏好
  priceRange?: { min?: number; max?: number }
  features?: string[]        // 特殊要求（包间、停车场等）
  atmosphere?: string[]      // 氛围偏好
  keywords?: string[]        // 额外搜索关键词
}
```

### V3.2 多城市支持

支持北京以外的城市（上海、广州、深圳、成都等），自动检测或手动切换城市。

**数据结构**：

```typescript
interface CityConfig {
  id: string
  name: string
  center: { lat: number; lng: number }
}
```

### V3.3 智能推荐优化

基于用户历史行为优化推荐，考虑时间因素（工作日午餐 vs 周末聚会）和天气因素。
