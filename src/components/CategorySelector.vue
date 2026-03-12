<template>
  <view class="category-selector">
    <view class="section-title">
      <text class="title-text">活动类型</text>
    </view>
    <view class="category-grid">
      <view
        v-for="cat in categories"
        :key="cat.id"
        class="category-item"
        :class="{ active: selected === cat.id }"
        @tap="selectCategory(cat)"
      >
        <text class="category-icon">{{ cat.icon }}</text>
        <text class="category-label">{{ cat.label }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue'
import type { Category } from '../utils/types'
import { categories } from '../utils/categories'

const emit = defineEmits<{
  (e: 'select', category: Category): void
}>()

const selected = ref('')

function selectCategory(cat: Category) {
  selected.value = cat.id
  emit('select', cat)
}
</script>

<style scoped>
.category-selector {
  background: #ffffff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
}

.section-title {
  margin-bottom: 20rpx;
}

.title-text {
  font-size: 32rpx;
  font-weight: 600;
  color: #333333;
}

.category-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: calc(25% - 12rpx);
  padding: 20rpx 0;
  background: #f5f6fa;
  border-radius: 12rpx;
  border: 2rpx solid transparent;
  transition: all 0.2s;
}

.category-item.active {
  background: #e8f0fe;
  border-color: #4a90d9;
}

.category-icon {
  font-size: 40rpx;
  margin-bottom: 8rpx;
}

.category-label {
  font-size: 24rpx;
  color: #333333;
}

.category-item.active .category-label {
  color: #4a90d9;
  font-weight: 600;
}
</style>
