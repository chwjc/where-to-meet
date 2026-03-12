import type { Category } from './types'

/** 预设活动分类 */
export const categories: Category[] = [
  { id: 'food', label: '聚餐', icon: '🍽️', keyword: '餐厅' },
  { id: 'hotpot', label: '火锅', icon: '🍲', keyword: '火锅' },
  { id: 'cafe', label: '咖啡', icon: '☕', keyword: '咖啡厅' },
  { id: 'movie', label: '电影', icon: '🎬', keyword: '电影院' },
  { id: 'ktv', label: 'KTV', icon: '🎤', keyword: 'KTV' },
  { id: 'sport', label: '运动', icon: '🏃', keyword: '运动' },
  { id: 'shopping', label: '购物', icon: '🛍️', keyword: '商场' },
  { id: 'bar', label: '酒吧', icon: '🍻', keyword: '酒吧' },
]
