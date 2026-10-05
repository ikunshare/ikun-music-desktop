<template>
  <div v-show="!isFullscreen" ref="dom_btns" :class="$style.controlBtn">
    <button
      type="button"
      :class="[$style.btn, $style.close]"
      :aria-label="$t('close')"
      ignore-tip
      :title="$t('close')"
      @click="closeWindow"
    >
      <svg
        :class="$style.controlBtniIcon"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xlink="http://www.w3.org/1999/xlink"
        width="100%"
        viewBox="0 0 24 24"
        space="preserve"
      >
        <use xlink:href="#icon-window-close" />
      </svg>
    </button>
    <button
      type="button"
      :class="[$style.btn, $style.min]"
      :aria-label="$t('min')"
      ignore-tip
      :title="$t('min')"
      @click="minWindow"
    >
      <svg
        :class="$style.controlBtniIcon"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xlink="http://www.w3.org/1999/xlink"
        width="100%"
        viewBox="0 0 24 24"
        space="preserve"
      >
        <use xlink:href="#icon-window-minimize" />
      </svg>
    </button>
    <button
      type="button"
      :class="[$style.btn, $style.max]"
      :aria-label="isMaximized ? $t('unmax') : $t('max')"
      ignore-tip
      :title="isMaximized ? $t('unmax') : $t('max')"
      @click="toggleMaximizeWindow"
    >
      <svg
        :class="$style.controlBtniIcon"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xlink="http://www.w3.org/1999/xlink"
        width="100%"
        viewBox="0 0 24 24"
        space="preserve"
      >
        <use :xlink:href="isMaximized ? '#icon-window-restore-2' : '#icon-window-maximize-2'" />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { minWindow, closeWindow, toggleMaximizeWindow } from '@renderer/utils/ipc'
import { onMounted, onBeforeUnmount, ref, useCssModule } from '@common/utils/vueTools'
// import { getRandom } from '../../utils'
import { isFullscreen, isMaximized } from '@renderer/store'

const dom_btns = ref()

const cssModule = useCssModule()

const handle_focus = () => {
  if (!dom_btns.value) return
  dom_btns.value.classList.remove(cssModule.hover)
}
const handle_mouseenter = () => {
  dom_btns.value.classList.add(cssModule.hover)
}
const handle_mouseleave = () => {
  dom_btns.value.classList.remove(cssModule.hover)
}

onMounted(() => {
  window.app_event.on('focus', handle_focus)
  dom_btns.value.addEventListener('mouseenter', handle_mouseenter)
  dom_btns.value.addEventListener('mouseleave', handle_mouseleave)
})
onBeforeUnmount(() => {
  window.app_event.off('focus', handle_focus)
  dom_btns.value.removeEventListener('mouseenter', handle_mouseenter)
  dom_btns.value.removeEventListener('mouseleave', handle_mouseleave)
})
</script>

<style lang="less" module>
@import '@renderer/assets/styles/layout.less';

@control-btn-width: @height-toolbar * 0.26;
@control-btn-height: 6%;
.controlBtn {
  box-sizing: border-box;
  padding: 0 7px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  width: 100%;
  height: @control-btn-height;
  -webkit-app-region: no-drag;
  opacity: 0.5;
  transition: opacity @transition-normal;
  &.hover {
    opacity: 0.8;
    .controlBtniIcon {
      opacity: 1;
    }
  }
}
.btn {
  position: relative;
  width: @control-btn-width;
  height: @control-btn-width;
  background: none;
  border: none;
  display: flex;
  // justify-content: center;
  // align-items: center;
  outline: none;
  padding: 1px;
  cursor: pointer;
  border-radius: var(--radius-control);
  color: var(--color-text-primary);
  transition: background-color 0.1s ease-in-out;

  &.min,
  &.max {
    &:hover {
      background-color: var(--color-caption-btn-hover);
    }
  }
  &.close {
    &:hover {
      background-color: var(--color-caption-btn-close-hover);
      color: #ffffff;
    }
  }
}

.controlBtniIcon {
  opacity: 1;
  transition: opacity 0.2s ease-in-out;
}
</style>
