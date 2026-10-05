<template>
  <ul :class="[$style.list, $style[align]]" role="tablist">
    <li
      v-for="item in list"
      :key="item[itemKey]"
      :class="[$style.listItem, { [$style.active]: modelValue == item[itemKey] }]"
      tabindex="-1"
      role="tab"
      :aria-label="item[itemLabel]"
      ignore-tip
      :aria-selected="modelValue == item[itemKey]"
      @click="handleToggle(item[itemKey])"
    >
      <span :class="$style.label">{{ item[itemLabel] }}</span>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default() {
        return []
      },
    },
    align: {
      type: String,
      default: 'left',
    },
    itemKey: {
      type: String,
      default: 'id',
    },
    itemLabel: {
      type: String,
      default: 'label',
    },
    modelValue: {
      type: [String, Number],
      default: '',
    },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const handleToggle = (id) => {
      if (id == props.modelValue) return
      emit('update:modelValue', id)
      emit('change', id)
    }

    return {
      handleToggle,
    }
  },
}
</script>

<style lang="less" module>
@import '@renderer/assets/styles/layout.less';

.list {
  display: flex;
  flex-flow: row nowrap;
  font-size: 12px;
  gap: 25px;
  padding: 0 15px;

  &.left {
    justify-content: flex-start;
  }
  &.center {
    justify-content: center;
  }
  &.right {
    justify-content: flex-end;
  }
}
.listItem {
  display: block;
  // padding: 5px 15px;
  cursor: pointer;
  transition: color @transition-normal;
  color: var(--color-text-secondary);

  &:hover {
    color: var(--color-text-primary);
  }

  &.active {
    color: var(--color-text-primary);
    cursor: default;

    > .label {
      &:after {
        opacity: 1;
        transform: translateY(0);
      }
    }
  }
}

.label {
  display: block;
  position: relative;
  padding: 8px 0;
  &:after {
    .mixin-after();
    left: 0;
    bottom: 0;
    width: 100%;
    height: 3px;
    border-radius: 2px;
    transform: translateY(-4px);
    opacity: 0;
    background-color: var(--color-accent);
    transition: @transition-fast;
    transition-property: transform, opacity;
  }
}
</style>
