<template>
  <view class="page">
    <view class="header">
      <text class="header-title">去哪儿聚</text>
      <text class="header-subtitle">找到大家都方便的聚会地点</text>
    </view>

    <view class="content">
      <LocationInput @update="onLocationsUpdate" />
      <CategorySelector @select="onCategorySelect" />

      <view class="action-area">
        <button
          class="recommend-btn"
          :class="{ disabled: !canRecommend }"
          :disabled="!canRecommend"
          @tap="startRecommend"
        >
          {{ loading ? '正在搜索...' : '开始推荐' }}
        </button>
        <text v-if="!canRecommend" class="action-hint">
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
    uni.showToast({
      title: err.message || '搜索失败，请重试',
      icon: 'none',
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f6fa;
}

.header {
  background: #4a90d9;
  padding: 40rpx 32rpx 48rpx;
}

.header-title {
  font-size: 44rpx;
  font-weight: 700;
  color: #ffffff;
  display: block;
}

.header-subtitle {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 8rpx;
  display: block;
}

.content {
  padding: 24rpx;
  margin-top: -20rpx;
}

.action-area {
  margin-top: 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.recommend-btn {
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

.recommend-btn.disabled {
  background: #cccccc;
}

.recommend-btn::after {
  border: none;
}

.action-hint {
  font-size: 24rpx;
  color: #999999;
  margin-top: 12rpx;
}
</style>
