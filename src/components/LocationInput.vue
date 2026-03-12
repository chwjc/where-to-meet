<template>
  <view class="location-input">
    <view class="section-title">
      <text class="title-text">参与人位置</text>
      <text class="title-hint">至少添加 2 个位置</text>
    </view>

    <!-- 已添加的位置列表 -->
    <view class="location-list">
      <view
        v-for="(loc, index) in locations"
        :key="index"
        class="location-item"
      >
        <view class="location-info">
          <text class="location-icon">📍</text>
          <view class="location-text">
            <text class="location-name">{{ loc.name }}</text>
            <text v-if="loc.address" class="location-address">{{ loc.address }}</text>
          </view>
        </view>
        <text class="remove-btn" @tap="removeLocation(index)">✕</text>
      </view>
    </view>

    <!-- 搜索输入 -->
    <view class="search-box">
      <input
        class="search-input"
        v-model="searchText"
        placeholder="搜索地址添加位置"
        confirm-type="search"
        @input="onSearchInput"
        @confirm="onSearchConfirm"
      />
      <view class="search-actions">
        <view class="locate-btn" @tap="getCurrentLocation">
          <text class="locate-icon">⊙</text>
          <text class="locate-text">定位</text>
        </view>
      </view>
    </view>

    <!-- 搜索建议列表 -->
    <view v-if="suggestions.length > 0" class="suggestion-list">
      <view
        v-for="(item, idx) in suggestions"
        :key="idx"
        class="suggestion-item"
        @tap="selectSuggestion(item)"
      >
        <text class="suggestion-name">{{ item.title }}</text>
        <text class="suggestion-address">{{ item.address }}</text>
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

<style scoped>
.location-input {
  background: #ffffff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.title-text {
  font-size: 32rpx;
  font-weight: 600;
  color: #333333;
}

.title-hint {
  font-size: 24rpx;
  color: #999999;
}

.location-list {
  margin-bottom: 16rpx;
}

.location-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 20rpx;
  background: #f5f6fa;
  border-radius: 12rpx;
  margin-bottom: 12rpx;
}

.location-info {
  display: flex;
  align-items: center;
  flex: 1;
  overflow: hidden;
}

.location-icon {
  font-size: 28rpx;
  margin-right: 12rpx;
}

.location-text {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.location-name {
  font-size: 28rpx;
  color: #333333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.location-address {
  font-size: 22rpx;
  color: #999999;
  margin-top: 4rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.remove-btn {
  font-size: 28rpx;
  color: #cc4444;
  padding: 8rpx 16rpx;
  flex-shrink: 0;
}

.search-box {
  display: flex;
  align-items: center;
  background: #f5f6fa;
  border-radius: 12rpx;
  padding: 4rpx 8rpx 4rpx 20rpx;
}

.search-input {
  flex: 1;
  height: 72rpx;
  font-size: 28rpx;
  color: #333333;
}

.search-actions {
  flex-shrink: 0;
}

.locate-btn {
  display: flex;
  align-items: center;
  background: #4a90d9;
  border-radius: 8rpx;
  padding: 12rpx 20rpx;
}

.locate-icon {
  font-size: 28rpx;
  color: #ffffff;
  margin-right: 4rpx;
}

.locate-text {
  font-size: 24rpx;
  color: #ffffff;
}

.suggestion-list {
  margin-top: 12rpx;
  background: #ffffff;
  border: 1rpx solid #eeeeee;
  border-radius: 12rpx;
  max-height: 400rpx;
  overflow-y: auto;
}

.suggestion-item {
  padding: 16rpx 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.suggestion-item:last-child {
  border-bottom: none;
}

.suggestion-name {
  font-size: 28rpx;
  color: #333333;
  display: block;
}

.suggestion-address {
  font-size: 22rpx;
  color: #999999;
  margin-top: 4rpx;
  display: block;
}
</style>
