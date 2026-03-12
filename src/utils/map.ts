import type { Location, Place } from './types'

// 腾讯地图 WebService API Key
// TODO: 替换为你自己的 Key，申请地址：https://lbs.qq.com
const MAP_KEY = 'YOUR_TENCENT_MAP_KEY'

/** 腾讯地图搜索提示 API —— 用于地址搜索输入联想 */
export function searchSuggestion(keyword: string, region = '北京'): Promise<any[]> {
  return new Promise((resolve, reject) => {
    uni.request({
      url: 'https://apis.map.qq.com/ws/place/v1/suggestion',
      data: {
        keyword,
        region,
        key: MAP_KEY,
        output: 'json',
      },
      success: (res: any) => {
        if (res.data && res.data.status === 0) {
          resolve(res.data.data || [])
        } else {
          reject(new Error(res.data?.message || '搜索失败'))
        }
      },
      fail: reject,
    })
  })
}

/** 腾讯地图 POI 搜索 —— 在指定圆形范围内搜索指定类型的地点 */
export function searchNearbyPOI(
  lat: number,
  lng: number,
  keyword: string,
  radius: number,
  pageSize = 20,
  pageIndex = 1
): Promise<any[]> {
  return new Promise((resolve, reject) => {
    uni.request({
      url: 'https://apis.map.qq.com/ws/place/v1/search',
      data: {
        keyword,
        boundary: `nearby(${lat},${lng},${radius})`,
        page_size: pageSize,
        page_index: pageIndex,
        orderby: '_distance',
        key: MAP_KEY,
        output: 'json',
      },
      success: (res: any) => {
        if (res.data && res.data.status === 0) {
          resolve(res.data.data || [])
        } else {
          reject(new Error(res.data?.message || 'POI 搜索失败'))
        }
      },
      fail: reject,
    })
  })
}

/** 腾讯地图逆地理编码 —— 坐标转地址 */
export function reverseGeocode(lat: number, lng: number): Promise<any> {
  return new Promise((resolve, reject) => {
    uni.request({
      url: 'https://apis.map.qq.com/ws/geocoder/v1/',
      data: {
        location: `${lat},${lng}`,
        key: MAP_KEY,
        output: 'json',
      },
      success: (res: any) => {
        if (res.data && res.data.status === 0) {
          resolve(res.data.result)
        } else {
          reject(new Error(res.data?.message || '逆地理编码失败'))
        }
      },
      fail: reject,
    })
  })
}

/** 将腾讯地图 POI 原始数据转为 Place 对象 */
export function mapPOIToPlace(poi: any, distances: number[]): Place {
  const avgDistance =
    distances.length > 0
      ? distances.reduce((a, b) => a + b, 0) / distances.length
      : 0
  const maxDistance = distances.length > 0 ? Math.max(...distances) : 0

  return {
    id: poi.id || '',
    title: poi.title || '',
    address: poi.address || '',
    lat: poi.location?.lat || 0,
    lng: poi.location?.lng || 0,
    tel: poi.tel || '',
    category: poi.category || '',
    rating: undefined, // 腾讯地图 POI 搜索不一定返回评分
    distances,
    avgDistance,
    maxDistance,
    score: 0,
  }
}
