<template lang="pug">
dt#source {{ $t('setting__basic_source') }}
dd
  div
    .gap-top(v-for="item in apiSources" :key="item.id")
      base-checkbox(
        :id="`setting_api_source_${item.id}`" name="setting_api_source"
        need :model-value="appSetting['common.apiSource']" :disabled="item.disabled" :value="item.id" :aria-label="item.label" @update:model-value="updateSetting({'common.apiSource': $event})")
        span(:class="$style.sourceLabel")
          | {{ item.name }}
          span(v-if="item.desc" :class="$style.desc") {{ item.desc }}
          span(v-if="item.statusLabel" :class="$style.status") {{ item.statusLabel }}
    .p.gap-top
      base-btn.btn(min @click="isShowUserApiModal = true") {{ $t('setting__basic_source_user_api_btn') }}
user-api-modal(v-model="isShowUserApiModal")
</template>

<script>
import { computed, ref } from '@common/utils/vueTools'
import { userApi } from '@renderer/store'
import { useI18n } from '@root/lang'
import apiSourceInfo from '@renderer/utils/musicSdk/api-source-info'

import UserApiModal from './UserApiModal.vue'
import { appSetting, updateSetting } from '@renderer/store/setting'

export default {
  name: 'SettingSource',
  components: {
    UserApiModal,
  },
  setup() {
    const t = useI18n()

    const isShowUserApiModal = ref(false)
    const getApiStatus = () => {
      let status
      if (userApi.status) status = t('setting__basic_source_status_success')
      else if (userApi.message == 'initing') status = t('setting__basic_source_status_initing')
      else status = `${t('setting__basic_source_status_failed')}`

      return status
    }
    const apiSources = computed(() => {
      return [
        ...apiSourceInfo.map((api) => ({
          id: api.id,
          name: api.name,
          label: api.name,
          disabled: api.disabled,
        })),
        ...userApi.list.map((api) => ({
          id: api.id,
          name: api.name,
          label: `${api.name}${api.id == appSetting['common.apiSource'] ? `[${getApiStatus()}]` : ''}`,
          desc: [/^\d/.test(api.version) ? `v${api.version}` : api.version]
            .filter(Boolean)
            .join(', '),
          statusLabel: api.id == appSetting['common.apiSource'] ? `[${getApiStatus()}]` : '',
          status: api.status,
          message: api.message,
          disabled: false,
        })),
      ]
    })

    return {
      appSetting,
      updateSetting,
      apiSources,
      isShowUserApiModal,
    }
  },
}
</script>

<style lang="less" module>
.sourceLabel {
  flex: auto;
  margin-left: 5px;
  line-height: 1.5;
  cursor: pointer;

  .desc {
    color: var(--color-500);
    font-size: 12px;
    margin-left: 5px;
  }

  .status {
    margin-left: 5px;
  }
}
</style>
