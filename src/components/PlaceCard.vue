<template>
  <view class="bg-white rounded-[16rpx] p-[24rpx] mb-[20rpx] shadow-sm" @tap="$emit('tap')">
    <view class="flex justify-between items-start mb-[12rpx]">
      <view class="flex items-center flex-1 overflow-hidden">
        <text class="text-[28rpx] font-bold text-primary mr-[12rpx] shrink-0">{{ rank }}</text>
        <text class="text-[30rpx] font-semibold text-[#333] truncate">{{ place.title }}</text>
      </view>
      <view class="flex items-baseline shrink-0 ml-[16rpx] bg-[#fff3e0] rounded-[8rpx] px-[12rpx] py-[6rpx]">
        <text class="text-[32rpx] font-bold text-accent">{{ (place.score * 10).toFixed(1) }}</text>
        <text class="text-[20rpx] text-accent ml-[4rpx]">分</text>
      </view>
    </view>

    <view class="mb-[12rpx]">
      <text class="text-[24rpx] text-[#666] block mb-[10rpx] truncate">{{ place.address }}</text>
      <view class="flex flex-wrap gap-[8rpx]">
        <text class="text-[22rpx] px-[12rpx] py-[4rpx] rounded-[6rpx] bg-[#e8f0fe] text-primary">
          平均 {{ formatDistance(place.avgDistance) }}
        </text>
        <text v-if="place.category" class="text-[22rpx] px-[12rpx] py-[4rpx] rounded-[6rpx] bg-[#f0f0f0] text-[#666]">
          {{ place.category }}
        </text>
      </view>
    </view>

    <!-- 各人距离详情 -->
    <view v-if="place.distances.length > 0" class="flex flex-wrap gap-x-[24rpx] gap-y-[8rpx] pt-[12rpx] border-t border-[#f0f0f0]">
      <view
        v-for="(d, i) in place.distances"
        :key="i"
        class="flex items-center"
      >
        <text class="text-[22rpx] text-[#999] max-w-[160rpx] truncate">{{ userLocations?.[i]?.name || '人' + (i + 1) }}</text>
        <text class="text-[22rpx] text-[#999]">：{{ formatDistance(d) }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { Place, Location } from '../utils/types'

defineProps<{
  place: Place
  rank: number
  userLocations?: Location[]
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
