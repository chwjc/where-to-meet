<template>
  <view class="page">
    <view v-if="places.length > 0" class="result-list">
      <view class="result-header">
        <text class="result-title">为你推荐 {{ places.length }} 个地点</text>
      </view>
      <PlaceCard
        v-for="(place, index) in places"
        :key="place.id || index"
        :place="place"
        :rank="index + 1"
        @tap="goDetail(index)"
      />
    </view>

    <view v-else class="empty">
      <text class="empty-text">暂无推荐结果</text>
      <button class="back-btn" @tap="goBack">返回重试</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import type { Place } from '../../utils/types'
import PlaceCard from '../../components/PlaceCard.vue'

const places = ref<Place[]>([])

onLoad(() => {
  try {
    const data = uni.getStorageSync('recommend_results')
    if (data) {
      places.value = JSON.parse(data)
    }
  } catch {
    places.value = []
  }
})

function goDetail(index: number) {
  uni.setStorageSync('detail_place', JSON.stringify(places.value[index]))
  uni.setStorageSync('detail_locations', uni.getStorageSync('recommend_locations'))
  uni.navigateTo({
    url: '/pages/detail/detail',
  })
}

function goBack() {
  uni.navigateBack()
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f6fa;
  padding: 24rpx;
}

.result-header {
  margin-bottom: 20rpx;
}

.result-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #333333;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 200rpx;
}

.empty-text {
  font-size: 30rpx;
  color: #999999;
  margin-bottom: 32rpx;
}

.back-btn {
  background: #4a90d9;
  color: #ffffff;
  font-size: 28rpx;
  padding: 16rpx 48rpx;
  border-radius: 12rpx;
  border: none;
}

.back-btn::after {
  border: none;
}
</style>
