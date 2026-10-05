<template lang="pug">
dt#search {{ $t('setting__search') }}
dd
  .gap-top
    base-checkbox(id="setting_search_showHot_enable" :model-value="appSetting['search.isShowHotSearch']" :label="$t('setting__search_hot')" @update:model-value="updateSetting({'search.isShowHotSearch': $event})")
  .gap-top
    base-checkbox(id="setting_search_showHistory_enable" :model-value="appSetting['search.isShowHistorySearch']" :label="$t('setting__search_history')" @update:model-value="updateSetting({'search.isShowHistorySearch': $event})")
  .gap-top
    base-checkbox(id="setting_search_focusSearchBox_enable" :model-value="appSetting['search.isFocusSearchBox']" :label="$t('setting__search_focus_search_box')" @update:model-value="updateSetting({'search.isFocusSearchBox': $event})")

dd
  h3#odc {{ $t('setting__odc') }}
  div
    .gap-top
      base-checkbox(id="setting_odc_isAutoClearSearchInput" :model-value="appSetting['odc.isAutoClearSearchInput']" :label="$t('setting__odc_clear_search_input')" @update:model-value="updateSetting({'odc.isAutoClearSearchInput': $event})")
    .gap-top
      base-checkbox(id="setting_odc_isAutoClearSearchList" :model-value="appSetting['odc.isAutoClearSearchList']" :label="$t('setting__odc_clear_search_list')" @update:model-value="updateSetting({'odc.isAutoClearSearchList': $event})")

</template>

<script>
// import { ref, onBeforeUnmount } from '@common/utils/vueTools'
import { appSetting, updateSetting } from '@renderer/store/setting'

export default {
  name: 'SettingSearch',
  setup() {
    return {
      appSetting,
      updateSetting,
    }
  },
}
</script>
