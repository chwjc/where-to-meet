<template>
  <view class="page">
    <view v-if="place" class="detail-content">
      <!-- 地图 -->
      <map
        class="detail-map"
        :latitude="place.lat"
        :longitude="place.lng"
        :markers="markers"
        :scale="14"
        :show-location="true"
      />

      <!-- 地点信息 -->
      <view class="info-card">
        <text class="info-title">{{ place.title }}</text>
        <text class="info-address">{{ place.address }}</text>

        <view v-if="place.category" class="info-row">
          <text class="info-label">分类</text>
          <text class="info-value">{{ place.category }}</text>
        </view>

        <view v-if="place.tel" class="info-row">
          <text class="info-label">电话</text>
          <text class="info-value tel" @tap="callPhone">{{ place.tel }}</text>
        </view>

        <view class="info-row">
          <text class="info-label">综合评分</text>
          <text class="info-value score">{{ (place.score * 10).toFixed(1) }} 分</text>
        </view>

        <!-- 各人距离 -->
        <view class="distances-section">
          <text class="info-label">各人距离</text>
          <view class="distances-list">
            <view
              v-for="(d, i) in place.distances"
              :key="i"
              class="distance-row"
            >
              <text class="distance-person">人{{ i + 1 }}</text>
              <view class="distance-bar-container">
                <view
                  class="distance-bar"
                  :style="{ width: getBarWidth(d) + '%' }"
                />
              </view>
              <text class="distance-value">{{ formatDistance(d) }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 操作按钮 -->
      <view class="action-buttons">
        <button class="nav-btn" @tap="openNavigation">导航前往</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import type { Place, Location } from '../../utils/types'

const place = ref<Place | null>(null)
const userLocations = ref<Location[]>([])

const markers = computed(() => {
  const list: any[] = []
  if (place.value) {
    // 目标地点标记
    list.push({
      id: 0,
      latitude: place.value.lat,
      longitude: place.value.lng,
      title: place.value.title,
      iconPath: '/static/marker-dest.png',
      width: 32,
      height: 32,
      callout: {
        content: place.value.title,
        display: 'ALWAYS',
        fontSize: 14,
        borderRadius: 4,
        padding: 6,
        bgColor: '#ffffff',
      },
    })
  }
  // 各人位置标记
  userLocations.value.forEach((loc, i) => {
    list.push({
      id: i + 1,
      latitude: loc.lat,
      longitude: loc.lng,
      title: loc.name,
      width: 24,
      height: 24,
      callout: {
        content: `人${i + 1}`,
        display: 'ALWAYS',
        fontSize: 12,
        borderRadius: 4,
        padding: 4,
        bgColor: '#4a90d9',
        color: '#ffffff',
      },
    })
  })
  return list
})

onLoad(() => {
  try {
    const placeData = uni.getStorageSync('detail_place')
    if (placeData) {
      place.value = JSON.parse(placeData)
    }
    const locData = uni.getStorageSync('detail_locations')
    if (locData) {
      userLocations.value = JSON.parse(locData)
    }
  } catch {
    // ignore
  }
})

function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`
  }
  return `${(meters / 1000).toFixed(1)}km`
}

function getBarWidth(distance: number): number {
  if (!place.value || place.value.distances.length === 0) return 0
  const maxD = Math.max(...place.value.distances)
  if (maxD === 0) return 0
  return (distance / maxD) * 100
}

function openNavigation() {
  if (!place.value) return
  uni.openLocation({
    latitude: place.value.lat,
    longitude: place.value.lng,
    name: place.value.title,
    address: place.value.address,
  })
}

function callPhone() {
  if (!place.value?.tel) return
  uni.makePhoneCall({
    phoneNumber: place.value.tel,
  })
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f6fa;
}

.detail-map {
  width: 100%;
  height: 400rpx;
}

.info-card {
  background: #ffffff;
  margin: 24rpx;
  border-radius: 16rpx;
  padding: 28rpx;
}

.info-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #333333;
  display: block;
  margin-bottom: 8rpx;
}

.info-address {
  font-size: 26rpx;
  color: #666666;
  display: block;
  margin-bottom: 20rpx;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}

.info-label {
  font-size: 26rpx;
  color: #999999;
}

.info-value {
  font-size: 26rpx;
  color: #333333;
}

.info-value.tel {
  color: #4a90d9;
}

.info-value.score {
  color: #f57c00;
  font-weight: 600;
}

.distances-section {
  margin-top: 20rpx;
}

.distances-list {
  margin-top: 12rpx;
}

.distance-row {
  display: flex;
  align-items: center;
  margin-bottom: 12rpx;
}

.distance-person {
  font-size: 24rpx;
  color: #666666;
  width: 60rpx;
  flex-shrink: 0;
}

.distance-bar-container {
  flex: 1;
  height: 16rpx;
  background: #f0f0f0;
  border-radius: 8rpx;
  margin: 0 16rpx;
  overflow: hidden;
}

.distance-bar {
  height: 100%;
  background: #4a90d9;
  border-radius: 8rpx;
  min-width: 8rpx;
}

.distance-value {
  font-size: 24rpx;
  color: #333333;
  width: 100rpx;
  text-align: right;
  flex-shrink: 0;
}

.action-buttons {
  padding: 0 24rpx 48rpx;
}

.nav-btn {
  width: 100%;
  height: 88rpx;
  background: #4a90d9;
  color: #ffffff;
  font-size: 32rpx;
  font-weight: 600;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
}

.nav-btn::after {
  border: none;
}
</style>
