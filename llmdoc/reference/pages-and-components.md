# 页面与组件规格

## 页面

### 首页 (pages/index/index.vue)

**职责**：收集用户输入（位置 + 活动类型 + 搜索距离），触发推荐算法，跳转结果页。

**关键状态**：
- `locations: Location[]` — 已添加的位置列表
- `selectedCategory: Category | null` — 当前选中的活动类型
- `searchRadius: number` — 搜索半径（米），默认 3000
- `maxRadius: number` — 最大搜索半径，默认 12000
- `loading: boolean` — 是否正在请求中

**按钮启用条件**：`locations.length >= 2 && selectedCategory !== null && !loading`

**页面布局**：
- **可滚动区域**（`scroll-view`，占满剩余空间）：
  1. 顶部横幅 — 主色背景，产品名 + Slogan
  2. LocationInput 组件
  3. CategorySelector 组件
  4. DistanceSlider 组件（仅 `locations.length >= 2` 时显示）
- **底部固定区域**（不随页面滚动）：
  5. "开始推荐"按钮 + 提示文案

**位置变化时的联动**：当位置更新且 >= 2 个时，自动计算 `maxRadius`（用户间最远距离向上取整到 km，最少 3km）和默认 `searchRadius`。

---

### 推荐结果页 (pages/result/result.vue)

**职责**：展示推荐地点列表，按综合评分从高到低排列。

**数据获取**：`onLoad` 时从 Storage 读取 `recommend_results` 和 `recommend_locations`。

**关键状态**：
- `places: Place[]` — 推荐结果
- `userLocations: Location[]` — 用户位置（传给 PlaceCard 用于距离显示）

**空状态**：无结果时显示"暂无推荐结果" + "返回重试"按钮。

---

### 地点详情页 (pages/detail/detail.vue)

**职责**：展示单个地点的完整信息，包含地图、距离对比、导航和大众点评。

**数据获取**：`onLoad` 时从 Storage 读取 `detail_place` 和 `detail_locations`。

**地图标记**：
| 标记类型 | 图标 | 尺寸 | 气泡内容 | 气泡样式 |
|----------|------|------|----------|----------|
| 目标地点 | `marker-dest.png` | 32×32 | 地点名称 | 白底，14px |
| 用户位置 | 默认标记 | 24×24 | "人1"/"人2"/... | 蓝底(#4A90D9)白字，12px |

**功能入口**：
- **导航前往** — `uni.openLocation()` 调用微信内置导航
- **拨打电话** — `uni.makePhoneCall()` 调用系统拨号（有 tel 才显示）
- **去大众点评查看评价** — `wx.navigateToMiniProgram` 跳转大众点评小程序搜索店名，失败时复制店名到剪贴板

**页面布局**：
- **可滚动区域**（`scroll-view`，占满剩余空间）：
  1. 地图区域（400rpx 高）
  2. 地点信息卡片（名称、地址、分类、电话、推荐分、各人距离柱状图）
- **底部固定区域**（不随页面滚动）：
  3. "去大众点评查看评价"按钮
  4. "导航前往"按钮

---

## 组件

### LocationInput — 位置输入组件

**文件**：`src/components/LocationInput.vue`

**职责**：管理多人位置的添加和删除。

**三种添加方式**：
1. **GPS 定位**：`uni.getLocation({type: 'gcj02'})` → `reverseGeocode()` 获取地址名
2. **搜索添加**：输入关键词 → 300ms 防抖 → `searchSuggestion()` → 用户选择建议项
3. （未来 V2：分享链接他人自助上报）

**事件**：`@update` — 向父组件传递完整的位置列表 `Location[]`

**异常处理**：
| 场景 | 处理方式 |
|------|----------|
| 定位权限被拒 | Toast: "获取定位失败" |
| 搜索 API 失败 | 静默处理，建议列表保持空 |
| 逆地理编码失败 | 仍然添加，名称显示"当前位置" |

---

### CategorySelector — 活动类型选择组件

**文件**：`src/components/CategorySelector.vue`

**职责**：4×2 网格展示活动类型，单选。

**事件**：`@select` — 向父组件传递选中的 `Category` 对象

**状态**：
| 状态 | 样式 |
|------|------|
| 未选中 | 背景 #F5F6FA，边框透明 |
| 选中 | 背景 #E8F0FE，边框 #4A90D9(2rpx)，文字加粗 |

---

### DistanceSlider — 搜索距离选择组件

**文件**：`src/components/DistanceSlider.vue`

**职责**：通过滑块让用户手动调整搜索半径。

**Props**：

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `modelValue` | `number` | — | 当前搜索半径（米），v-model 绑定 |
| `maxRadius` | `number` | — | 最大搜索半径（米） |
| `minRadius` | `number` | `1000` | 最小搜索半径（米） |
| `step` | `number` | `500` | 步长（米） |

**事件**：`@update:modelValue` — v-model 双向绑定

**显示条件**：仅当用户已添加 >= 2 个位置时在首页显示

**距离格式化**：`< 1000m` → "Xm"，`>= 1000m` → "X.Xkm"

---

### PlaceCard — 推荐地点卡片组件

**文件**：`src/components/PlaceCard.vue`

**职责**：展示单个推荐地点的概要信息。

**Props**：
| 参数 | 类型 | 说明 |
|------|------|------|
| `place` | `Place` | 地点数据 |
| `rank` | `number` | 排名序号 |
| `userLocations` | `Location[]` | 用户位置列表 |

**展示内容**：排名序号、地点名称、综合评分(×10)、地址、平均距离标签、分类标签、各人距离明细

**事件**：`@tap` — 整张卡片可点击
