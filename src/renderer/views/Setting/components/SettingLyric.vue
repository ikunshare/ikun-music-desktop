<template lang="pug">
dt#lyric {{ $t('setting__lyric') }}
dd
  div
    .gap-top
      base-checkbox(id="setting_player_lyric_transition" :model-value="appSetting['player.isShowLyricTranslation']" :label="$t('setting__play_lyric_transition')" @update:model-value="updateSetting({ 'player.isShowLyricTranslation': $event })")
    .gap-top
      base-checkbox(id="setting_player_lyric_roma" :model-value="appSetting['player.isShowLyricRoma']" :label="$t('setting__play_lyric_roma')" @update:model-value="updateSetting({ 'player.isShowLyricRoma': $event })")
    .gap-top
      base-checkbox(id="setting_player_awap_lyric_trans_roma" :model-value="appSetting['player.isSwapLyricTranslationAndRoma']" :label="$t('setting__player_swap_lyric_trans_roma')" @update:model-value="updateSetting({'player.isSwapLyricTranslationAndRoma': $event})")
    .gap-top
      base-checkbox(id="setting_player_lyric_s2t" :model-value="appSetting['player.isS2t']" :label="$t('setting__play_lyric_s2t')" @update:model-value="updateSetting({ 'player.isS2t': $event })")
    .gap-top
      base-checkbox(id="setting_player_lyric_play_lxlrc" :model-value="appSetting['player.isPlayLxlrc']" :label="$t('setting__play_lyric_lxlrc')" @update:model-value="updateSetting({ 'player.isPlayLxlrc': $event })")
      svg-icon(class="help-icon" name="help-circle-outline" :aria-label="$t('setting__play_lyric_lxlrc_tip')")

dd
  h3#play_detail {{ $t('setting__play_detail') }}
  div
    .gap-top
      base-checkbox(id="setting_play_detail_font_zoom_enable" :model-value="appSetting['playDetail.isZoomActiveLrc']" :label="$t('setting__play_detail_font_zoom')" @update:model-value="updateSetting({'playDetail.isZoomActiveLrc': $event})")
    .gap-top
      base-checkbox(id="setting_play_detail_lyric_delayScroll" :model-value="appSetting['playDetail.isDelayScroll']" :label="$t('setting__play_detail_lyric_delay_scroll')" @update:model-value="updateSetting({ 'playDetail.isDelayScroll': $event })")
    .gap-top
      base-checkbox(id="setting_play_detail_lyric_progress_enable" :model-value="appSetting['playDetail.isShowLyricProgressSetting']" :label="$t('setting__play_detail_lyric_progress')" @update:model-value="updateSetting({'playDetail.isShowLyricProgressSetting': $event})")

dd
  h3#play_detail_align {{ $t('setting__play_detail_align') }}
  div
    base-checkbox.gap-left(id="setting_play_detail_align_left" :model-value="appSetting['playDetail.style.align']" need value="left" :label="$t('setting__play_detail_align_left')" @update:model-value="updateSetting({ 'playDetail.style.align': $event })")
    base-checkbox.gap-left(id="setting_play_detail_align_center" :model-value="appSetting['playDetail.style.align']" need value="center" :label="$t('setting__play_detail_align_center')" @update:model-value="updateSetting({ 'playDetail.style.align': $event })")
    base-checkbox.gap-left(id="setting_play_detail_align_right" :model-value="appSetting['playDetail.style.align']" need value="right" :label="$t('setting__play_detail_align_right')" @update:model-value="updateSetting({ 'playDetail.style.align': $event })")
</template>

<script>
import { appSetting, updateSetting } from '@renderer/store/setting'

export default {
  name: 'SettingLyric',
  setup() {
    return {
      appSetting,
      updateSetting,
    }
  },
}
</script>
