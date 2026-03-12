import type { Location, Place, RecommendParams } from './types'
import { getCenter, getMaxSpan, getSearchRadius, distanceBetween } from './geo'
import { searchNearbyPOI, mapPOIToPlace } from './map'

/** 归一化到 [0, 1] */
function normalize(value: number, min: number, max: number): number {
  if (max === min) return 0.5
  return (value - min) / (max - min)
}

/** 计算综合评分并排序 */
function scorePlaces(places: Place[]): Place[] {
  if (places.length === 0) return []

  // 收集各维度的最值用于归一化
  const avgDistances = places.map((p) => p.avgDistance)
  const maxDistances = places.map((p) => p.maxDistance)

  const minAvg = Math.min(...avgDistances)
  const maxAvg = Math.max(...avgDistances)
  const minMax = Math.min(...maxDistances)
  const maxMax = Math.max(...maxDistances)

  for (const place of places) {
    // 距离越近越好，所以用 1 - normalize
    const avgDistScore = 1 - normalize(place.avgDistance, minAvg, maxAvg)
    const maxDistScore = 1 - normalize(place.maxDistance, minMax, maxMax)

    // 评分（如果有的话，0-5 归一化到 0-1）
    const ratingScore = place.rating ? place.rating / 5 : 0.6 // 无评分给默认 0.6

    place.score =
      0.4 * ratingScore +
      0.35 * avgDistScore +
      0.15 * maxDistScore +
      0.1 * 0.5 // category_match_bonus 固定给 0.5（已经通过关键词筛选过了）
  }

  return places.sort((a, b) => b.score - a.score)
}

/** 获取推荐地点 */
export async function getRecommendations(
  params: RecommendParams,
  topN = 8
): Promise<Place[]> {
  const { locations, keyword } = params

  if (locations.length === 0) {
    return []
  }

  // 1. 计算汇合中心
  const center = getCenter(locations)

  // 2. 确定搜索半径
  const maxSpan = getMaxSpan(locations)
  const radius = getSearchRadius(maxSpan)

  // 3. 搜索 POI
  const pois = await searchNearbyPOI(center.lat, center.lng, keyword, radius)

  if (!pois || pois.length === 0) {
    return []
  }

  // 4. 计算每个 POI 到每个人的距离
  const places: Place[] = pois.map((poi: any) => {
    const poiLoc: Location = {
      lat: poi.location?.lat || 0,
      lng: poi.location?.lng || 0,
      name: poi.title || '',
    }
    const distances = locations.map((loc) => distanceBetween(loc, poiLoc))
    return mapPOIToPlace(poi, distances)
  })

  // 5. 综合评分排序
  const scored = scorePlaces(places)

  // 6. 返回 Top N
  return scored.slice(0, topN)
}
