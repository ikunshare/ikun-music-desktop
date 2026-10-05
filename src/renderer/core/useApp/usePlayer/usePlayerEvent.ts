import { onBeforeUnmount } from '@common/utils/vueTools'
import {
  onPlaying,
  onPause,
  onEnded,
  onError,
  onLoadeddata,
  onLoadstart,
  onCanplay,
  onEmptied,
  onWaiting,
  getErrorCode,
  isSwitchingAudioSource,
} from '@renderer/plugins/player'

export default () => {
  const rOnPlaying = onPlaying(() => {
    console.log('onPlaying')
    // 切歌渐出期间还在出声的是上一首，它的 playing 不能拿来把播放状态置为播放中，
    // 否则新歌的链接会被当成过期丢掉，表现就是卡在 0:00/0:00 不出声
    if (isSwitchingAudioSource()) return
    window.app_event.playerPlaying()
    window.app_event.play()
  })
  const rOnPause = onPause(() => {
    console.log('onPause')
    window.app_event.playerPause()
    window.app_event.pause()
  })
  const rOnEnded = onEnded(() => {
    console.log('onEnded')
    // 渐出中的是上一首，它播完了也不该再触发一次自动切歌
    if (isSwitchingAudioSource()) return
    window.app_event.playerEnded()
    // window.app_event.pause()
  })
  const rOnError = onError(() => {
    console.log('onError')
    const errorCode = getErrorCode()
    window.app_event.error(errorCode)
    window.app_event.playerError(errorCode)
  })
  const rOnLoadeddata = onLoadeddata(() => {
    console.log('onLoadeddata')
    window.app_event.playerLoadeddata()
  })
  const rOnLoadstart = onLoadstart(() => {
    console.log('onLoadstart')
    window.app_event.playerLoadstart()
  })
  const rOnCanplay = onCanplay(() => {
    console.log('onCanplay')
    window.app_event.playerCanplay()
  })
  const rOnEmptied = onEmptied(() => {
    console.log('onEmptied')
    window.app_event.playerEmptied()
    // window.app_event.stop()
  })
  const rOnWaiting = onWaiting(() => {
    console.log('onWaiting')
    window.app_event.pause()
    window.app_event.playerWaiting()
  })

  onBeforeUnmount(() => {
    rOnPlaying()
    rOnPause()
    rOnEnded()
    rOnError()
    rOnLoadeddata()
    rOnLoadstart()
    rOnCanplay()
    rOnEmptied()
    rOnWaiting()
  })
}
