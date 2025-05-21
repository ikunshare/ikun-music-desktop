<template>
  <material-modal :show="show" :bg-close="bgClose" :teleport="teleport" @close="handleClose">
    <main :class="$style.main">
      <h2>{{ info.name }}<br />{{ info.singer }}</h2>

      <template v-if="qualitys.length <= 4">
        <base-btn
          v-for="quality in qualitys"
          :key="quality.type"
          :class="$style.btn"
          @click="handleClick(quality.type)"
        >
          {{ getTypeName(quality.type) }}{{ quality.size && ` - ${quality.size.toUpperCase()}` }}
        </base-btn>
      </template>

      <template v-else>
        <div :class="$style.selectWrapper">
          <select v-model="selectedQuality" :class="$style.select">
            <option v-for="quality in qualitys" :key="quality.type" :value="quality.type">
              {{ getTypeName(quality.type)
              }}{{ quality.size && ` - ${quality.size.toUpperCase()}` }}
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
import { qualityList } from '@renderer/store'
import { createDownloadTasks } from '@renderer/store/download/action'

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    musicInfo: {
      type: [Object, null],
      required: true,
    },
    listId: {
      type: String,
      default: '',
    },
    bgClose: {
      type: Boolean,
      default: true,
    },
    teleport: {
      type: String,
      default: '#root',
    },
  },
  emits: ['update:show'],
  setup() {
    return {
      qualityList,
    }
  },
  computed: {
    info() {
      return this.musicInfo || {}
    },
    sourceQualityList() {
      return this.qualityList[this.musicInfo.source] || []
    },
    qualitys() {
      return this.info.meta?.qualitys?.filter((quality) => this.checkSource(quality.type)) || []
    },
  },
  watch: {
    qualitys: {
      immediate: true,
      handler(newQualitys) {
        if (newQualitys.length > 0) {
          this.selectedQuality = newQualitys[0].type
        }
      },
    },
  },
  methods: {
    handleClick(quality) {
      void createDownloadTasks([this.musicInfo], quality, this.listId)
      this.handleClose()
    },
    handleSelectDownload() {
      if (this.selectedQuality) {
        this.handleClick(this.selectedQuality)
      }
    },
    handleClose() {
      this.$emit('update:show', false)
    },
    getTypeName(quality) {
      switch (quality) {
        case 'master':
          return this.$t('download__lossless') + ' Master'
        case 'atmos_plus':
          return this.$t('download__lossless') + ' Atmos 2.0'
        case 'atmos':
          return this.$t('download__lossless') + ' Atmos'
        case 'hires':
          return this.$t('download__lossless') + ' FLAC Hires'
        case 'flac':
        case '320k':
          return this.$t('download__high_quality') + ' ' + quality.toUpperCase()
        case '192k':
        case '128k':
          return this.$t('download__normal') + ' ' + quality.toUpperCase()
      }
    },
    checkSource(quality) {
      return this.sourceQualityList.includes(quality)
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
