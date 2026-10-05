<template>
  <button :class="$style.btn" :aria-label="$t('player__artwork_background')" @click="visible = true">
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xlink="http://www.w3.org/1999/xlink"
      width="90%"
      viewBox="0 0 24 24"
      space="preserve"
    >
      <use xlink:href="#icon-palette-swatch" />
    </svg>
  </button>
  <material-modal :show="visible" bg-close="bg-close" :teleport="teleport" @close="visible = false">
    <div :class="$style.content">
      <div :class="$style.header">
        <h3>
          {{ $t('player__artwork_background') }}
          <svg-icon
            class="help-icon"
            name="information-slab-circle-outline"
            :aria-label="$t('player__artwork_background_tip')"
          />
        </h3>
        <base-btn min @click="handleReset">{{
          $t('player__artwork_background_reset_btn')
        }}</base-btn>
      </div>
      <base-checkbox
        id="player_artwork_background_enable"
        :model-value="appSetting['player.artworkColorBackground']"
        :label="$t('player__artwork_background_enable')"
        @update:model-value="updateSetting({ 'player.artworkColorBackground': $event })"
      />
      <div v-for="item in items" :key="item.key" :class="$style.item">
        <span :class="$style.label">{{ $t(item.labelKey) }}</span>
        <base-slider-bar
          :class="$style.slider"
          :value="appSetting[item.key]"
          :min="0"
          :max="100"
          @change="handleUpdate(item.key, $event)"
        />
        <span :class="$style.value">{{ item.text }}</span>
      </div>
    </div>
  </material-modal>
</template>

<script setup>
import { computed, ref } from '@common/utils/vueTools'
import defaultSetting from '@common/defaultSetting'
import { useI18n } from '@renderer/plugins/i18n'
import { appSetting, updateSetting } from '@renderer/store/setting'
import { ARTWORK_SETTING_KEYS, getMorphDuration } from '@renderer/utils/artworkBackground'

defineProps({
  teleport: {
    type: String,
    default: '#root',
  },
})

const t = useI18n()
const visible = ref(false)

const items = computed(() => {
  const { motion, speed, intensity, duration } = ARTWORK_SETTING_KEYS
  const value = (key) => appSetting[key]
  return [
    {
      key: motion,
      labelKey: 'player__artwork_background_motion',
      text: `${value(motion)}%`,
    },
    {
      key: speed,
      labelKey: 'player__artwork_background_speed',
      text: `${value(speed)}%`,
    },
    {
      key: intensity,
      labelKey: 'player__artwork_background_intensity',
      text: `${value(intensity)}%`,
    },
    {
      key: duration,
      labelKey: 'player__artwork_background_duration',
      // 滑块是 0-100，实际是秒数，直接显示秒更好理解
      text: `${getMorphDuration(value(duration)).replace(/s$/, '')}${t('player__artwork_background_second_unit')}`,
    },
  ]
})

const handleUpdate = (key, value) => {
  updateSetting({ [key]: Math.round(value) })
}

const handleReset = () => {
  updateSetting({
    [ARTWORK_SETTING_KEYS.motion]: defaultSetting[ARTWORK_SETTING_KEYS.motion],
    [ARTWORK_SETTING_KEYS.speed]: defaultSetting[ARTWORK_SETTING_KEYS.speed],
    [ARTWORK_SETTING_KEYS.intensity]: defaultSetting[ARTWORK_SETTING_KEYS.intensity],
    [ARTWORK_SETTING_KEYS.duration]: defaultSetting[ARTWORK_SETTING_KEYS.duration],
  })
}
</script>

<style lang="less" module>
@import '@renderer/assets/styles/layout.less';

.btn {
  width: 20px;
  color: var(--color-font);
  opacity: 0.5;
  cursor: pointer;
  transition: opacity @transition-normal;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border: none;
  padding: 0;

  &:hover {
    opacity: 0.9;
  }
}

.content {
  display: flex;
  flex-flow: column nowrap;
  gap: 12px;
  min-height: 0;
  padding: 5px 0;
}
.header {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 5px;
}
.item {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: 8px;
}
.label {
  flex: none;
  font-size: 12px;
  width: 72px;
}
.slider {
  flex: auto;
}
.value {
  flex: none;
  font-size: 12px;
  width: 48px;
  text-align: right;
  color: var(--color-font-label);
}
</style>
