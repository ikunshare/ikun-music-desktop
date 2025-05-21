<template>
  <material-modal :show="show" :bg-close="bgClose" :teleport="teleport" @close="handleClose">
    <main :class="$style.main">
      <h2>
        {{ $t('download__multiple_tip', { len: list.length }) }}<br />{{
          $t('download__multiple_tip2')
        }}
      </h2>

      <template v-if="qualityOptions.length <= 4">
        <base-btn
          v-for="quality in qualityOptions"
          :key="quality.value"
          :class="$style.btn"
          @click="handleClick(quality.value)"
        >
          {{ quality.label }}
        </base-btn>
      </template>

      <template v-else>
        <div :class="$style.selectWrapper">
          <select v-model="selectedQuality" :class="$style.select">
            <option v-for="quality in qualityOptions" :key="quality.value" :value="quality.value">
              {{ quality.label }}
            </option>
          </select>
        </div>
        <base-btn :class="$style.downloadBtn" @click="handleSelectDownload">
          {{ $t('download') }}
        </base-btn>
      </template>
    </main>
  </material-modal>
</template>

<script>
import { createDownloadTasks } from '@renderer/store/download/action'

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    bgClose: {
      type: Boolean,
      default: true,
    },
    listId: {
      type: String,
      default: '',
    },
    list: {
      type: Array,
      default() {
        return []
      },
    },
    teleport: {
      type: String,
      default: '#root',
    },
  },
  emits: ['update:show', 'confirm'],
  data() {
    return {
      selectedQuality: '128k',
      qualityOptions: [
        { value: '128k', label: this.$t('download__normal') + ' - 128K' },
        { value: '320k', label: this.$t('download__high_quality') + ' - 320K' },
        { value: 'flac', label: this.$t('download__lossless') + ' - FLAC' },
        { value: 'hires', label: this.$t('download__lossless') + ' - FLAC Hires' },
        { value: 'atmos', label: this.$t('download__lossless') + ' - Atmos' },
        { value: 'atmos_plus', label: this.$t('download__lossless') + ' - Atmos 2.0' },
        { value: 'master', label: this.$t('download__lossless') + ' - Master' },
      ],
    }
  },
  methods: {
    handleClick(quality) {
      void createDownloadTasks(
        this.list.filter((item) => item.source != 'local'),
        quality,
        this.listId
      )
      this.handleClose()
      this.$emit('confirm')
    },
    handleSelectDownload() {
      if (this.selectedQuality) {
        this.handleClick(this.selectedQuality)
      }
    },
    handleClose() {
      this.$emit('update:show', false)
    },
  },
}
</script>

<style lang="less" module>
@import '@renderer/assets/styles/layout.less';

.main {
  padding: 15px;
  max-width: 400px;
  min-width: 200px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  h2 {
    font-size: 13px;
    color: var(--color-font);
    line-height: 1.3;
    text-align: center;
    margin-bottom: 15px;
  }
}

.btn {
  display: block;
  margin-bottom: 15px;
  &:last-child {
    margin-bottom: 0;
  }
}

.selectWrapper {
  margin-bottom: 15px;
  width: 100%;
}

.select {
  width: 100%;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid var(--color-border);
  background-color: var(--color-secondary-background);
  color: var(--color-font);
  font-size: 14px;
  cursor: pointer;
}

.downloadBtn {
  display: block;
  margin-bottom: 0;
}
</style>
