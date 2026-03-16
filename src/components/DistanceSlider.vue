<template>
  <view class="bg-white rounded-[16rpx] p-[24rpx] mb-[24rpx]">
    <view class="flex justify-between items-center mb-[20rpx]">
      <text class="text-[32rpx] font-semibold text-[#333]">搜索范围</text>
      <text class="text-[26rpx] text-primary font-semibold">{{ formatDistance(modelValue) }}</text>
    </view>
    <view class="px-[16rpx]">
      <slider
        class="w-full m-0"
        :min="minRadius"
        :max="maxRadius"
        :step="step"
        :value="modelValue"
        activeColor="#4a90d9"
        backgroundColor="#f0f0f0"
        block-size="14"
        @change="onChange"
      />
    </view>
    <view class="flex justify-between mt-[8rpx] px-[16rpx]">
      <text class="text-[22rpx] text-[#999]">{{ formatDistance(minRadius) }}</text>
      <text class="text-[22rpx] text-[#999]">{{ formatDistance(maxRadius) }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: number
  maxRadius: number
  minRadius?: number
  step?: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const minRadius = props.minRadius || 1000
const step = props.step || 500

function onChange(e: any) {
  emit('update:modelValue', e.detail.value)
}

function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${meters}m`
  }
  return `${(meters / 1000).toFixed(1)}km`
}
</script>

<style scoped>
/* 加粗滑动条轨道 */
:deep(.wx-slider-track) {
  height: 8rpx !important;
}
:deep(.wx-slider-handle) {
  margin-top: -10rpx !important;
}
</style>
