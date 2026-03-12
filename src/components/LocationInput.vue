<template>
  <view class="bg-white rounded-[16rpx] p-[24rpx] mb-[24rpx]">
    <view class="flex justify-between items-center mb-[20rpx]">
      <text class="text-[32rpx] font-semibold text-[#333]">参与人位置</text>
      <text class="text-[24rpx] text-[#999]">至少添加 2 个位置</text>
    </view>

    <!-- 已添加的位置列表 -->
    <view class="mb-[16rpx]">
      <view
        v-for="(loc, index) in locations"
        :key="index"
        class="flex items-center justify-between px-[20rpx] py-[16rpx] bg-page-bg rounded-[12rpx] mb-[12rpx]"
      >
        <view class="flex items-center flex-1 overflow-hidden">
          <text class="text-[28rpx] mr-[12rpx]">📍</text>
          <view class="flex flex-col overflow-hidden">
            <text class="text-[28rpx] text-[#333] truncate">{{ loc.name }}</text>
            <text v-if="loc.address" class="text-[22rpx] text-[#999] mt-[4rpx] truncate">{{ loc.address }}</text>
          </view>
        </view>
        <text class="text-[28rpx] text-[#cc4444] px-[16rpx] py-[8rpx] shrink-0" @tap="removeLocation(index)">✕</text>
      </view>
    </view>

    <!-- 搜索输入 -->
    <view class="flex items-center bg-page-bg rounded-[12rpx] pl-[20rpx] pr-[8rpx] py-[4rpx]">
      <input
        class="flex-1 h-[72rpx] text-[28rpx] text-[#333]"
        v-model="searchText"
        placeholder="搜索地址添加位置"
        confirm-type="search"
        @input="onSearchInput"
        @confirm="onSearchConfirm"
      />
      <view class="shrink-0">
        <view class="flex items-center bg-primary rounded-[8rpx] px-[20rpx] py-[12rpx]" @tap="getCurrentLocation">
          <text class="text-[28rpx] text-white mr-[4rpx]">⊙</text>
          <text class="text-[24rpx] text-white">定位</text>
        </view>
      </view>
    </view>

    <!-- 搜索建议列表 -->
    <view v-if="suggestions.length > 0" class="mt-[12rpx] bg-white border border-[#eee] rounded-[12rpx] max-h-[400rpx] overflow-y-auto">
      <view
        v-for="(item, idx) in suggestions"
        :key="idx"
        class="px-[20rpx] py-[16rpx] border-b border-[#f0f0f0] last:border-b-0"
        @tap="selectSuggestion(item)"
      >
        <text class="text-[28rpx] text-[#333] block">{{ item.title }}</text>
        <text class="text-[22rpx] text-[#999] mt-[4rpx] block">{{ item.address }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue'
import type { Location } from '../utils/types'
import { searchSuggestion } from '../utils/map'
import { reverseGeocode } from '../utils/map'

const emit = defineEmits<{
  (e: 'update', locations: Location[]): void
}>()

const locations = ref<Location[]>([])
const searchText = ref('')
const suggestions = ref<any[]>([])

let searchTimer: ReturnType<typeof setTimeout> | null = null

function onSearchInput() {
  if (searchTimer) clearTimeout(searchTimer)
  const keyword = searchText.value.trim()
  if (!keyword) {
    suggestions.value = []
    return
  }
  // 防抖 300ms
  searchTimer = setTimeout(async () => {
    try {
      suggestions.value = await searchSuggestion(keyword)
    } catch {
      suggestions.value = []
    }
  }, 300)
}

function onSearchConfirm() {
  onSearchInput()
}

function selectSuggestion(item: any) {
  const loc: Location = {
    lat: item.location?.lat || 0,
    lng: item.location?.lng || 0,
    name: item.title || '',
    address: item.address || '',
  }
  locations.value.push(loc)
  searchText.value = ''
  suggestions.value = []
  emit('update', [...locations.value])
}

function removeLocation(index: number) {
  locations.value.splice(index, 1)
  emit('update', [...locations.value])
}

async function getCurrentLocation() {
  try {
    const res: any = await new Promise((resolve, reject) => {
      uni.getLocation({
        type: 'gcj02',
        success: resolve,
        fail: reject,
      })
    })
    // 逆地理编码获取地址名
    try {
      const geo = await reverseGeocode(res.latitude, res.longitude)
      const loc: Location = {
        lat: res.latitude,
        lng: res.longitude,
        name: geo.formatted_addresses?.recommend || geo.address || '当前位置',
        address: geo.address || '',
      }
      locations.value.push(loc)
      emit('update', [...locations.value])
    } catch {
      // 逆地理编码失败，仍然添加
      const loc: Location = {
        lat: res.latitude,
        lng: res.longitude,
        name: '当前位置',
      }
      locations.value.push(loc)
      emit('update', [...locations.value])
    }
  } catch {
    uni.showToast({ title: '获取定位失败', icon: 'none' })
  }
}
</script>
