/** 位置信息 */
export interface Location {
  /** 纬度 */
  lat: number
  /** 经度 */
  lng: number
  /** 地址名称 */
  name: string
  /** 详细地址 */
  address?: string
}

/** 活动分类 */
export interface Category {
  /** 分类标识 */
  id: string
  /** 分类名称 */
  label: string
  /** 分类图标（emoji） */
  icon: string
  /** 腾讯地图 POI 分类关键词 */
  keyword: string
}

/** POI 地点信息 */
export interface Place {
  /** 地点 ID */
  id: string
  /** 地点名称 */
  title: string
  /** 地址 */
  address: string
  /** 纬度 */
  lat: number
  /** 经度 */
  lng: number
  /** 联系电话 */
  tel?: string
  /** 分类 */
  category: string
  /** 评分（腾讯地图 POI 评分，0-5） */
  rating?: number
  /** 距离各人的距离（米） */
  distances: number[]
  /** 平均距离（米） */
  avgDistance: number
  /** 最大距离（米） */
  maxDistance: number
  /** 综合评分 */
  score: number
}

/** 推荐请求参数 */
export interface RecommendParams {
  /** 所有人的位置 */
  locations: Location[]
  /** 选择的活动类型关键词 */
  keyword: string
}
