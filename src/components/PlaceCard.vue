<template>
  <view class="place-card" @tap="$emit('tap')">
    <view class="card-header">
      <view class="card-title-row">
        <text class="card-rank">{{ rank }}</text>
        <text class="card-title">{{ place.title }}</text>
      </view>
      <view class="card-score">
        <text class="score-value">{{ (place.score * 10).toFixed(1) }}</text>
        <text class="score-label">分</text>
      </view>
    </view>

    <view class="card-info">
      <text class="card-address">{{ place.address }}</text>
      <view class="card-tags">
        <text class="tag distance-tag">
          平均 {{ formatDistance(place.avgDistance) }}
        </text>
        <text v-if="place.category" class="tag category-tag">
          {{ place.category }}
        </text>
      </view>
    </view>

    <!-- 各人距离详情 -->
    <view v-if="place.distances.length > 0" class="card-distances">
      <text
        v-for="(d, i) in place.distances"
        :key="i"
        class="distance-item"
      >
        人{{ i + 1 }}：{{ formatDistance(d) }}
      </text>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { Place } from '../utils/types'

defineProps<{
  place: Place
  rank: number
}>()

defineEmits<{
  (e: 'tap'): void
}>()

function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`
  }
  return `${(meters / 1000).toFixed(1)}km`
}
</script>

<style scoped>
.place-card {
  background: #ffffff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12rpx;
}

.card-title-row {
  display: flex;
  align-items: center;
  flex: 1;
  overflow: hidden;
}

.card-rank {
  font-size: 28rpx;
  font-weight: 700;
  color: #4a90d9;
  margin-right: 12rpx;
  flex-shrink: 0;
}

.card-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #333333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-score {
  display: flex;
  align-items: baseline;
  flex-shrink: 0;
  margin-left: 16rpx;
  background: #fff3e0;
  border-radius: 8rpx;
  padding: 6rpx 12rpx;
}

.score-value {
  font-size: 32rpx;
  font-weight: 700;
  color: #f57c00;
}

.score-label {
  font-size: 20rpx;
  color: #f57c00;
  margin-left: 4rpx;
}

.card-info {
  margin-bottom: 12rpx;
}

.card-address {
  font-size: 24rpx;
  color: #666666;
  display: block;
  margin-bottom: 10rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;
}

.tag {
  font-size: 22rpx;
  padding: 4rpx 12rpx;
  border-radius: 6rpx;
}

.distance-tag {
  background: #e8f0fe;
  color: #4a90d9;
}

.category-tag {
  background: #f0f0f0;
  color: #666666;
}

.card-distances {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  padding-top: 12rpx;
  border-top: 1rpx solid #f0f0f0;
}

.distance-item {
  font-size: 22rpx;
  color: #999999;
}
</style>
