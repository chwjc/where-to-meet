<template>
  <view class="h-screen flex flex-col bg-page-bg">
    <scroll-view scroll-y class="flex-1">
      <view class="bg-primary px-[32rpx] pt-[40rpx] pb-[48rpx]">
        <text class="text-[44rpx] font-bold text-white block">不远不近</text>
        <text class="text-[26rpx] text-white/80 mt-[8rpx] block">不远不近，刚刚好</text>
      </view>

      <view class="px-[24rpx] -mt-[20rpx] pb-[24rpx]">
        <LocationInput @update="onLocationsUpdate" />
        <CategorySelector @select="onCategorySelect" />
        <DistanceSlider
          v-if="locations.length >= 2"
          v-model="searchRadius"
          :max-radius="maxRadius"
        />
      </view>
    </scroll-view>

    <view class="bg-white border-t border-[#f0f0f0] px-[24rpx] pt-[16rpx] pb-[32rpx] flex flex-col items-center">
      <button
        class="w-full h-[88rpx] text-white text-[32rpx] font-semibold rounded-[16rpx] flex items-center justify-center border-none"
        :class="canRecommend ? 'bg-primary' : 'bg-[#cccccc]'"
        :disabled="!canRecommend"
        @tap="startRecommend"
      >
        {{ loading ? '正在搜索...' : '开始推荐' }}
      </button>
      <text v-if="!canRecommend" class="text-[24rpx] text-[#999] mt-[12rpx]">
        {{ getHintText() }}
      </text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Location, Category } from '../../utils/types'
import { getRecommendations } from '../../utils/recommend'
import { getMaxSpan, getSearchRadius } from '../../utils/geo'
import LocationInput from '../../components/LocationInput.vue'
import CategorySelector from '../../components/CategorySelector.vue'
import DistanceSlider from '../../components/DistanceSlider.vue'

const locations = ref<Location[]>([])
const selectedCategory = ref<Category | null>(null)
const loading = ref(false)
const searchRadius = ref(3000)
const maxRadius = ref(12000)

const canRecommend = computed(() => {
  return locations.value.length >= 2 && selectedCategory.value !== null && !loading.value
})

function getHintText(): string {
  if (locations.value.length < 2) return '请至少添加 2 个位置'
  if (!selectedCategory.value) return '请选择活动类型'
  return ''
}

function onLocationsUpdate(locs: Location[]) {
  locations.value = locs
  if (locs.length >= 2) {
    const span = getMaxSpan(locs)
    // 最大半径 = 用户间最远距离，最少 3km
    maxRadius.value = Math.max(Math.ceil(span / 1000) * 1000, 3000)
    // 默认半径 = 自动计算值
    searchRadius.value = Math.min(getSearchRadius(span), maxRadius.value)
  }
}

function onCategorySelect(cat: Category) {
  selectedCategory.value = cat
}

async function startRecommend() {
  if (!canRecommend.value) return

  loading.value = true
  try {
    const results = await getRecommendations({
      locations: locations.value,
      keyword: selectedCategory.value!.keyword,
      radius: searchRadius.value,
    })

    if (results.length === 0) {
      uni.showToast({ title: '未找到合适的地点', icon: 'none' })
      return
    }

    // 将结果存入 storage，传递到结果页
    uni.setStorageSync('recommend_results', JSON.stringify(results))
    uni.setStorageSync('recommend_locations', JSON.stringify(locations.value))

    uni.navigateTo({
      url: '/pages/result/result',
    })
  } catch (err: any) {
    console.error('[startRecommend] 推荐失败:', err)
    uni.showToast({
      title: err.message || '搜索失败，请重试',
      icon: 'none',
    })
  } finally {
    loading.value = false
  }
}
</script>
