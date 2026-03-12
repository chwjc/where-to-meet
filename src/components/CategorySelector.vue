<template>
  <view class="bg-white rounded-[16rpx] p-[24rpx] mb-[24rpx]">
    <view class="flex justify-between items-center mb-[20rpx]">
      <text class="text-[32rpx] font-semibold text-[#333]">活动类型</text>
    </view>
    <view class="flex flex-wrap gap-[16rpx]">
      <view
        v-for="cat in categories"
        :key="cat.id"
        class="flex flex-col items-center justify-center py-[20rpx] rounded-[12rpx] border-[2rpx] transition-all duration-200"
        :class="selected === cat.id
          ? 'bg-[#e8f0fe] border-primary'
          : 'bg-page-bg border-transparent'"
        :style="{ width: 'calc(25% - 12rpx)' }"
        @tap="selectCategory(cat)"
      >
        <text class="text-[40rpx] mb-[8rpx]">{{ cat.icon }}</text>
        <text
          class="text-[24rpx]"
          :class="selected === cat.id ? 'text-primary font-semibold' : 'text-[#333]'"
        >{{ cat.label }}</text>
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
