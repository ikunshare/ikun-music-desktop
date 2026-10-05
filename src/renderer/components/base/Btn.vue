<template>
  <button
    :class="[$style.btn, { [$style.min]: min }, { [$style.outline]: outline }]"
    tabindex="0"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<script>
export default {
  props: {
    min: {
      type: Boolean,
    },
    outline: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="less" module>
@import '@renderer/assets/styles/layout.less';

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 32px;
  border: 1px solid var(--color-control-stroke);
  border-radius: var(--radius-control);
  cursor: pointer;
  padding: 4px 12px;
  color: var(--color-button-font);
  outline: none;
  transition: background-color 0.1s ease;
  background-color: var(--color-control-fill);
  font-size: 14px;
  box-sizing: border-box;
  &[disabled] {
    opacity: 0.4;
    cursor: default;
  }

  &.outline {
    background-color: transparent;
    border-color: transparent;

    &:hover {
      border-color: var(--color-control-stroke);
    }
  }

  &:hover {
    background-color: var(--color-control-fill-hover);
  }
  &:active {
    background-color: var(--color-control-fill-active);
  }
}

.min {
  min-height: 24px;
  padding: 1px 8px;
  font-size: 12px;
}
</style>
