<template>
  <div :class="$style.contnet">
    <div class="player__sound_effect_title" :class="$style.header">
      <h3>
        {{ $t('player__sound_effect_compressor') }}
        <svg-icon
          class="help-icon"
          name="information-slab-circle-outline"
          :aria-label="$t('player__sound_effect_compressor_tip')"
        />
      </h3>
      <base-btn min @click="handleUpdate(0)">{{
        $t('player__sound_effect_compressor_reset_btn')
      }}</base-btn>
    </div>
    <div :class="$style.eqList">
      <div :class="$style.eqItem">
        <span :class="$style.label">{{ label }}</span>
        <base-slider-bar
          :class="$style.slider"
          :value="amount"
          :min="0"
          :max="100"
          @change="handleUpdate"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from '@common/utils/vueTools'
import { useI18n } from '@renderer/plugins/i18n'
import { appSetting, updateSetting } from '@renderer/store/setting'

const t = useI18n()
const amount = computed(() => appSetting['player.compressor'])
const label = computed(() =>
  amount.value == 0
    ? t('player__sound_effect_compressor_off')
    : `${t('player__sound_effect_compressor_on')} ${amount.value}%`
)

const handleUpdate = (value) => {
  updateSetting({ 'player.compressor': Math.round(value) })
}
</script>

<style lang="less" module>
@import '@renderer/assets/styles/layout.less';
.contnet {
  padding-top: 15px;
  position: relative;
  display: flex;
  flex-flow: column nowrap;
  gap: 8px;
  min-height: 0;
  flex: none;
  &:before {
    .mixin-after();
    position: absolute;
    top: 0;
    height: 1px;
    width: 100%;
    border-top: 1px dashed var(--color-primary-light-100-alpha-700);
  }
}
.header {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 5px;
}
.eqList {
  display: flex;
  flex-flow: column nowrap;
  gap: 15px;
  width: 100%;
}
.eqItem {
  display: flex;
  flex-flow: row nowrap;
  gap: 8px;
}
.label {
  flex: none;
  font-size: 12px;
}
.slider {
  flex: auto;
}
</style>
