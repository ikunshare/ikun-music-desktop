<template lang="pug">
dt#other {{ $t('setting__other') }}
dd(v-if="!isWin")
  div
    .gap-top
      base-checkbox(id="setting_transparent_window" :model-value="appSetting['common.transparentWindow']" :label="$t('setting__other_transparent_window')" @update:model-value="updateSetting({'common.transparentWindow': $event})")
      svg-icon(class="help-icon" name="help-circle-outline" :aria-label="$t('setting__other_transparent_window_tip')")

dd
  h3#other_tray_theme {{ $t('setting__other_tray_theme') }}
  div
    base-checkbox.gap-left(
      v-for="item in trayThemeList" :id="'setting_tray_theme_' + item.id" :key="item.id" :model-value="appSetting['tray.themeId']" name="setting_tray_theme"
      need :label="item.label" :value="item.id" @update:model-value="updateSetting({'tray.themeId': $event})")

dd
  h3#other_dislike_list {{ $t('setting__other_dislike_list') }}
  div
    .p
      | {{ $t('setting__other_dislike_list_label') }}
      span.auto-hidden {{ dislikeRuleCount }}
    .p
      base-btn.btn(min @click="isShowDislikeList = true") {{ $t('setting__other_dislike_list_show_btn') }}
  DislikeListModal(v-model="isShowDislikeList")
</template>

<script>
import { ref, computed } from '@common/utils/vueTools'
import { useI18n } from '@renderer/plugins/i18n'
import { appSetting, updateSetting } from '@renderer/store/setting'
import { dislikeRuleCount } from '@renderer/store/dislikeList'
import DislikeListModal from './DislikeListModal.vue'
import { TRAY_AUTO_ID } from '@common/constants'
import { isWin } from '@common/utils'

export default {
  name: 'SettingOther',
  components: {
    DislikeListModal,
  },
  setup() {
    const t = useI18n()

    const trayThemeList = computed(() => {
      return [
        { id: 0, name: 'native', label: t('setting__other_tray_theme_native') },
        { id: 2, name: 'black', label: t('setting__other_tray_theme_black') },
        { id: 1, name: 'origin', label: t('setting__other_tray_theme_origin') },
        { id: TRAY_AUTO_ID, name: 'auto', label: t('setting__other_tray_theme_auto') },
      ]
    })

    const isShowDislikeList = ref(false)

    return {
      appSetting,
      updateSetting,
      isWin,
      trayThemeList,
      dislikeRuleCount,
      isShowDislikeList,
    }
  },
}
</script>
