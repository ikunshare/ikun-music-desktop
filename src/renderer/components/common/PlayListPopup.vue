<template>
  <material-popup-btn :class="$style.btnContent">
    <button :class="$style.btn" :aria-label="$t('player__play_list')">
      <svg
        version="1.1"
        xmlns="http://www.w3.org/1999/svg"
        xlink="http://www.w3.org/1999/xlink"
        height="100%"
        viewBox="0 0 24 24"
        space="preserve"
      >
        <use xlink:href="#icon-list-add" />
      </svg>
    </button>
    <template #content>
      <div :class="$style.listBox" ref="listBoxRef">
        <div
          v-for="(item, index) in playListMusics"
          :key="item.id"
          :class="[$style.item, { [$style.playing]: currentIndex === index }]"
          :ref="el => setItemRef(el, index)"
          @click="handlePlay(index)"
        >
          <span :class="$style.playIcon" v-if="currentIndex === index">
            <svg viewBox="0 0 512 512" width="10" height="10"><use xlink:href="#icon-play-outline" /></svg>
          </span>
          <div :class="$style.textWrap" ref="textWraps">
            <span
              class="select"
              :class="$style.name"
              :ref="el => setTextRef(el, index)"
              @mouseenter="e => handleMouseEnter(e, index)"
              @mouseleave="handleMouseLeave(index)"
            >{{ item.name }}</span>
          </div>
          <span :class="$style.singer">{{ item.singer }}</span>
        </div>
        <p v-if="!playListMusics.length" :class="$style.empty">{{ $t('no_item') }}</p>
      </div>
    </template>
  </material-popup-btn>
</template>

<script>
import { computed, ref, watch, nextTick } from '@common/utils/vueTools'
import { playInfo } from '@renderer/store/player/state'
import { allMusicList } from '@renderer/store/list/state'
import { playList } from '@renderer/core/player/action'

export default {
  setup() {
    const playListMusics = computed(() => {
      const listId = playInfo.playerListId
      if (!listId) return []
      return allMusicList.get(listId) || []
    })

    const currentIndex = computed(() => playInfo.playerPlayIndex)
    const textRefs = ref([])
    const itemRefs = ref([])
    const listBoxRef = ref(null)
    let prevIndex = -1

    const setTextRef = (el, index) => {
      if (el) textRefs.value[index] = el
    }

    const setItemRef = (el, index) => {
      if (el) itemRefs.value[index] = el
    }

    // 自动定位到正在播放的音乐
    watch(currentIndex, (newIndex) => {
      if (newIndex === prevIndex || newIndex < 0) return
      prevIndex = newIndex
      nextTick(() => {
        const itemEl = itemRefs.value[newIndex]
        const listBox = listBoxRef.value
        if (!itemEl || !listBox) return
        const itemTop = itemEl.offsetTop
        const itemHeight = itemEl.offsetHeight
        const listHeight = listBox.clientHeight
        const currentScroll = listBox.scrollTop
        // 如果当前项不在可见区域内，则滚动到该项居中
        if (itemTop < currentScroll || itemTop + itemHeight > currentScroll + listHeight) {
          listBox.scrollTo({
            top: itemTop - listHeight / 2 + itemHeight / 2,
            behavior: 'smooth',
          })
        }
      })
    })

    const handleMouseEnter = (e, index) => {
      const el = textRefs.value[index]
      if (!el) return

      const textWidth = el.scrollWidth
      const wrapWidth = el.parentElement.clientWidth

      if (textWidth <= wrapWidth) return

      el.style.transition = 'none'
      el.style.transform = 'translateX(0)'

      requestAnimationFrame(() => {
        if (!el) return
        const newTextWidth = el.scrollWidth
        if (newTextWidth > wrapWidth) {
          el.style.transition = `transform ${(newTextWidth - wrapWidth) * 20}ms linear`
          el.style.transform = `translateX(${wrapWidth - newTextWidth}px)`
        }
      })
    }

    const handleMouseLeave = (index) => {
      const el = textRefs.value[index]
      if (!el) return
      el.style.transition = 'transform 150ms ease-out'
      el.style.transform = 'translateX(0)'
    }

    return {
      playListMusics,
      currentIndex,
      textRefs,
      setTextRef,
      setItemRef,
      listBoxRef,
      handleMouseEnter,
      handleMouseLeave,
    }
  },
  methods: {
    handlePlay(index) {
      const listId = playInfo.playerListId
      if (!listId) return
      playList(listId, index)
    },
  },
}
</script>

<style lang="less" module>
@import '@renderer/assets/styles/layout.less';

.btnContent {
  flex: none;
  height: 100%;
}

.btn {
  position: relative;
  justify-content: center;
  align-items: center;
  transition: color @transition-normal;
  cursor: pointer;
  background-color: transparent;
  border: none;
  width: 24px;
  display: flex;
  flex-flow: column nowrap;
  padding: 0;

  svg {
    transition: opacity @transition-fast;
    opacity: 0.6;
    filter: drop-shadow(0 0 1px rgba(0, 0, 0, 0.2));
  }
  &:hover {
    svg {
      opacity: 0.9;
    }
  }
  &:active {
    svg {
      opacity: 1;
    }
  }
}

.listBox {
  display: flex;
  flex-flow: column nowrap;
  max-height: 300px;
  overflow-y: auto;
  width: 280px;
  padding: 4px 0;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--color-scrollbar);
    border-radius: 3px;
  }
}

.item {
  display: flex;
  align-items: center;
  padding: 5px 10px;
  gap: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 12px;

  &:hover {
    background-color: var(--color-primary-background-hover);
  }

  &.playing {
    color: var(--color-primary);
  }
}

.playIcon {
  width: 14px;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    fill: var(--color-primary);
  }
}

.textWrap {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
}

.name {
  display: inline-block;
  white-space: nowrap;
}

.singer {
  flex: none;
  width: 60px;
  font-size: 10px;
  color: var(--color-font-label);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.empty {
  text-align: center;
  color: var(--color-font-label);
  padding: 15px;
  font-size: 12px;
}
</style>