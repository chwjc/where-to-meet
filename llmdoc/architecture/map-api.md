# 腾讯地图 API 封装

所有腾讯地图 API 调用封装在 `src/utils/map.ts`。

## API Key 管理

API Key 通过 Vite 环境变量注入：

```typescript
const MAP_KEY = import.meta.env.VITE_MAP_KEY || ''
```

配置方式：在项目根目录 `.env` 文件中设置 `VITE_MAP_KEY=你的Key`。

## API 函数列表

| 函数 | 腾讯地图接口 | 用途 |
|------|-------------|------|
| `searchSuggestion(keyword, region?)` | `/ws/place/v1/suggestion` | 地址搜索联想，region 可选（不传则不限地区） |
| `searchNearbyPOI(lat, lng, keyword, radius, pageSize?, pageIndex?)` | `/ws/place/v1/search` | 圆形范围 POI 搜索，按距离排序，默认 pageSize=40 |
| `reverseGeocode(lat, lng)` | `/ws/geocoder/v1/` | 坐标转地址名 |
| `mapPOIToPlace(poi, distances)` | — | 将腾讯地图 POI 原始数据转为 Place 对象 |

## 函数签名

```typescript
export function searchSuggestion(keyword: string, region?: string): Promise<any[]>

export function searchNearbyPOI(
  lat: number, lng: number,
  keyword: string, radius: number,
  pageSize = 40, pageIndex = 1
): Promise<any[]>

export function reverseGeocode(lat: number, lng: number): Promise<any>

export function mapPOIToPlace(poi: any, distances: number[]): Place
```

## 错误处理

`getApiErrorMessage(status, fallback)` 根据腾讯地图 API 的 status 码返回友好错误文案：

| status 码 | 错误文案 |
|-----------|----------|
| 120, 121 | "后台额度不足，请稍后再试" |
| 110, 111 | "API Key 无效" |
| 199 | "API Key 未开启 WebService 功能" |
| 其他 | 使用传入的 fallback 文案 |

错误处理链路：
1. `uni.request` → `success` 回调检查 `res.data.status`
2. `status !== 0` → `reject(new Error(getApiErrorMessage(...)))`
3. 上层 `try/catch` → `uni.showToast` 提示用户

## 调用方式

所有 API 通过 `uni.request` 发起 HTTP GET 请求，返回 Promise。不使用 fetch/axios。

## API 配额（免费版）

| API | 免费日限 | 当前用途 |
|-----|----------|----------|
| 搜索建议 (/suggestion) | 10,000 | 地址输入联想 |
| POI 搜索 (/search) | 10,000 | 搜索推荐候选地点 |
| 逆地理编码 (/geocoder) | 10,000 | GPS 坐标转地址名 |

## 微信服务器域名配置

小程序需在微信公众平台配置 request 合法域名：

```
https://apis.map.qq.com
```

不配置此域名，体验版和正式版的网络请求会被微信拦截（开发者调试模式下不受影响）。
