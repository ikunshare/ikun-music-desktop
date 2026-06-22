import { onMounted, onBeforeUnmount, watch } from '@common/utils/vueTools'
import { useRoute, useRouter } from '@common/utils/vueRouter'
import { setListPosition, getListPosition } from '@renderer/utils/data'
import { appSetting } from '@renderer/store/setting'

export default ({ props, listRef, list, handleRestoreScroll, playerInfo }) => {
  const route = useRoute()
  const router = useRouter()

  const saveListPosition = () => {
    setListPosition(props.listId, listRef.value?.getScrollTop() || 0)
  }

  const handleScrollList = (index, isAnimation, callback = () => {}) => {
    listRef.value.scrollToIndex(index, -150, isAnimation, callback)
  }

  const restoreScroll = async (index, isAnimation) => {
    // console.log(index, isAnimation)
    if (!list.value.length) return
    if (index == null) {
      let location = (await getListPosition(props.listId)) || 0
      if (appSetting['list.isSaveScrollLocation'] && location != null) {
        listRef.value?.scrollTo(location)
      }
      return
    }

    handleScrollList(index, isAnimation)
  }

  // 自动定位到正在播放的音乐
  let prevPlayIndex = -1
  watch(
    () => playerInfo.value,
    (info) => {
      if (!info.isPlayList || info.playIndex === prevPlayIndex || info.playIndex < 0) return
      prevPlayIndex = info.playIndex
      handleScrollList(info.playIndex, true)
    },
    { deep: true }
  )

  onMounted(() => {
    handleRestoreScroll(route.query.scrollIndex, false)
    if (route.query.scrollIndex != null) {
      router.replace({
        path: '/list',
        query: {
          id: props.listId,
          updated: true,
        },
      })
    }
  })
  onBeforeUnmount(() => {
    saveListPosition()
  })

  return {
    saveListPosition,
    restoreScroll,
  }
}
