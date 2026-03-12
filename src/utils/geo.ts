import type { Location } from './types'

/** 将角度转为弧度 */
function toRad(deg: number): number {
  return (deg * Math.PI) / 180
}

/** 计算两点间的距离（米），使用 Haversine 公式 */
export function distanceBetween(a: Location, b: Location): number {
  const R = 6371000 // 地球半径，米
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const sinLat = Math.sin(dLat / 2)
  const sinLng = Math.sin(dLng / 2)
  const h =
    sinLat * sinLat +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinLng * sinLng
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h))
}

/** 计算多个位置的几何中心点 */
export function getCenter(locations: Location[]): { lat: number; lng: number } {
  if (locations.length === 0) {
    return { lat: 39.9042, lng: 116.4074 } // 默认北京中心
  }
  if (locations.length === 1) {
    return { lat: locations[0].lat, lng: locations[0].lng }
  }
  const sum = locations.reduce(
    (acc, loc) => ({ lat: acc.lat + loc.lat, lng: acc.lng + loc.lng }),
    { lat: 0, lng: 0 }
  )
  return {
    lat: sum.lat / locations.length,
    lng: sum.lng / locations.length,
  }
}

/** 计算多人之间的最大距离（米） */
export function getMaxSpan(locations: Location[]): number {
  let max = 0
  for (let i = 0; i < locations.length; i++) {
    for (let j = i + 1; j < locations.length; j++) {
      const d = distanceBetween(locations[i], locations[j])
      if (d > max) max = d
    }
  }
  return max
}

/** 根据多人间最大距离确定搜索半径（米） */
export function getSearchRadius(maxSpan: number): number {
  if (maxSpan < 5000) return 3000
  if (maxSpan < 15000) return 8000
  return 12000
}
