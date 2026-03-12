<template>
  <view class="min-h-screen bg-page-bg p-[24rpx]">
    <view v-if="places.length > 0">
      <view class="mb-[20rpx]">
        <text class="text-[30rpx] font-semibold text-[#333]">为你推荐 {{ places.length }} 个地点</text>
      </view>
      <PlaceCard
        v-for="(place, index) in places"
        :key="place.id || index"
        :place="place"
        :rank="index + 1"
        @tap="goDetail(index)"
      />
    </view>

    <view v-else class="flex flex-col items-center justify-center pt-[200rpx]">
      <text class="text-[30rpx] text-[#999] mb-[32rpx]">暂无推荐结果</text>
      <button class="bg-primary text-white text-[28rpx] px-[48rpx] py-[16rpx] rounded-[12rpx] border-none" @tap="goBack">返回重试</button>
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
