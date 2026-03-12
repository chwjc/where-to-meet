<template>
  <view class="min-h-screen bg-page-bg">
    <view class="bg-primary px-[32rpx] pt-[40rpx] pb-[48rpx]">
      <text class="text-[44rpx] font-bold text-white block">不远不近</text>
      <text class="text-[26rpx] text-white/80 mt-[8rpx] block">不远不近，刚刚好</text>
    </view>

    <view class="px-[24rpx] -mt-[20rpx]">
      <LocationInput @update="onLocationsUpdate" />
      <CategorySelector @select="onCategorySelect" />

      <view class="mt-[16rpx] flex flex-col items-center">
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
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Location, Category } from '../../utils/types'
import { getRecommendations } from '../../utils/recommend'
import LocationInput from '../../components/LocationInput.vue'
import CategorySelector from '../../components/CategorySelector.vue'

const locations = ref<Location[]>([])
const selectedCategory = ref<Category | null>(null)
const loading = ref(false)

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
