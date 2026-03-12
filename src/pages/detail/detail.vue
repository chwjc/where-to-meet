<template>
  <view class="min-h-screen bg-page-bg">
    <view v-if="place">
      <!-- 地图 -->
      <map
        class="w-full h-[400rpx]"
        :latitude="place.lat"
        :longitude="place.lng"
        :markers="markers"
        :scale="14"
        :show-location="true"
      />

      <!-- 地点信息 -->
      <view class="bg-white mx-[24rpx] my-[24rpx] rounded-[16rpx] p-[28rpx]">
        <text class="text-[36rpx] font-bold text-[#333] block mb-[8rpx]">{{ place.title }}</text>
        <text class="text-[26rpx] text-[#666] block mb-[20rpx]">{{ place.address }}</text>

        <view v-if="place.category" class="flex justify-between items-center py-[12rpx] border-b border-[#f5f5f5]">
          <text class="text-[26rpx] text-[#999]">分类</text>
          <text class="text-[26rpx] text-[#333]">{{ place.category }}</text>
        </view>

        <view v-if="place.tel" class="flex justify-between items-center py-[12rpx] border-b border-[#f5f5f5]">
          <text class="text-[26rpx] text-[#999]">电话</text>
          <text class="text-[26rpx] text-primary" @tap="callPhone">{{ place.tel }}</text>
        </view>

        <view class="flex justify-between items-center py-[12rpx] border-b border-[#f5f5f5]">
          <text class="text-[26rpx] text-[#999]">综合评分</text>
          <text class="text-[26rpx] text-accent font-semibold">{{ (place.score * 10).toFixed(1) }} 分</text>
        </view>

        <!-- 各人距离 -->
        <view class="mt-[20rpx]">
          <text class="text-[26rpx] text-[#999]">各人距离</text>
          <view class="mt-[12rpx]">
            <view
              v-for="(d, i) in place.distances"
              :key="i"
              class="flex items-center mb-[12rpx]"
            >
              <text class="text-[24rpx] text-[#666] w-[60rpx] shrink-0">人{{ i + 1 }}</text>
              <view class="flex-1 h-[16rpx] bg-[#f0f0f0] rounded-[8rpx] mx-[16rpx] overflow-hidden">
                <view
                  class="h-full bg-primary rounded-[8rpx] min-w-[8rpx]"
                  :style="{ width: getBarWidth(d) + '%' }"
                />
              </view>
              <text class="text-[24rpx] text-[#333] w-[100rpx] text-right shrink-0">{{ formatDistance(d) }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 操作按钮 -->
      <view class="px-[24rpx] pb-[48rpx]">
        <button
          class="w-full h-[88rpx] bg-primary text-white text-[32rpx] font-semibold rounded-[16rpx] flex items-center justify-center border-none"
          @tap="openNavigation"
        >导航前往</button>
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
