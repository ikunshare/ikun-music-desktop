<template>
  <div :class="$style.main">
    <div class="scroll" :class="$style.toc">
      <ul :class="$style.tocList" role="tablist">
        <li v-for="group in tocGroups" :key="group.id" :class="$style.tocListItem" role="presentation">
          <button
            :class="[$style.tocItem, { [$style.active]: activeGroupId == group.id }]"
            role="tab"
            :aria-selected="activeGroupId == group.id"
            :aria-label="group.title"
            ignore-tip
            @click="toggleTab(group.id)"
          >
            {{ group.title }}
          </button>
        </li>
      </ul>
    </div>
    <div
      ref="dom_content_ref"
      class="scroll"
      :class="[$style.setting, { [$style.singleSection]: activeGroup.components.length == 1 }]"
    >
      <dl>
        <component :is="name" v-for="name in activeGroup.components" :key="name" />
      </dl>
    </div>
  </div>
</template>

<script>
import { ref, computed, nextTick } from '@common/utils/vueTools'
import { useI18n } from '@renderer/plugins/i18n'
import { useRoute } from '@common/utils/vueRouter'

import SettingBasic from './components/SettingBasic.vue'
import SettingPlay from './components/SettingPlay.vue'
import SettingLyric from './components/SettingLyric.vue'
import SettingDesktopLyric from './components/SettingDesktopLyric.vue'
import SettingSource from './components/SettingSource.vue'
import SettingSearch from './components/SettingSearch.vue'
import SettingList from './components/SettingList.vue'
import SettingDownload from './components/SettingDownload.vue'
import SettingSync from './components/SettingSync/index.vue'
import SettingOpenAPI from './components/SettingOpenAPI.vue'
import SettingNetwork from './components/SettingNetwork.vue'
import SettingCache from './components/SettingCache.vue'
import SettingBackup from './components/SettingBackup.vue'
import SettingHotKey from './components/SettingHotKey.vue'
import SettingOther from './components/SettingOther.vue'
import SettingUpdate from './components/SettingUpdate.vue'
import SettingAbout from './components/SettingAbout.vue'

export default {
  name: 'Setting',
  components: {
    SettingBasic,
    SettingPlay,
    SettingLyric,
    SettingDesktopLyric,
    SettingSource,
    SettingSearch,
    SettingList,
    SettingDownload,
    SettingSync,
    SettingOpenAPI,
    SettingNetwork,
    SettingCache,
    SettingBackup,
    SettingHotKey,
    SettingOther,
    SettingUpdate,
    SettingAbout,
  },
  setup() {
    const t = useI18n()
    const route = useRoute()

    const dom_content_ref = ref(null)

    const tocGroups = computed(() => [
      { id: 'basic', title: t('setting__group_basic'), components: ['SettingBasic'] },
      { id: 'play', title: t('setting__group_play'), components: ['SettingPlay'] },
      {
        id: 'lyric',
        title: t('setting__group_lyric'),
        components: ['SettingLyric', 'SettingDesktopLyric'],
      },
      {
        id: 'source',
        title: t('setting__group_source'),
        components: ['SettingSource', 'SettingSearch'],
      },
      {
        id: 'list',
        title: t('setting__group_list'),
        components: ['SettingList', 'SettingDownload'],
      },
      {
        id: 'sync',
        title: t('setting__group_sync'),
        components: ['SettingSync', 'SettingOpenAPI'],
      },
      { id: 'network', title: t('setting__group_network'), components: ['SettingNetwork'] },
      {
        id: 'storage',
        title: t('setting__group_storage'),
        components: ['SettingCache', 'SettingBackup'],
      },
      { id: 'hotkey', title: t('setting__group_hotkey'), components: ['SettingHotKey'] },
      {
        id: 'other',
        title: t('setting__group_other'),
        components: ['SettingOther', 'SettingUpdate', 'SettingAbout'],
      },
    ])

    const getInitialGroupId = () => {
      const name = route.query.name
      if (!name) return tocGroups.value[0].id
      if (tocGroups.value.some((g) => g.id == name)) return name
      // 兼容旧链接（使用组件名作为标识）
      return tocGroups.value.find((g) => g.components.includes(name))?.id ?? tocGroups.value[0].id
    }

    const activeGroupId = ref(getInitialGroupId())
    const activeGroup = computed(
      () => tocGroups.value.find((g) => g.id == activeGroupId.value) ?? tocGroups.value[0]
    )

    const toggleTab = (id) => {
      if (activeGroupId.value == id) return
      activeGroupId.value = id
      void nextTick(() => {
        dom_content_ref.value?.scrollTo({
          top: 0,
          behavior: 'smooth',
        })
      })
    }

    return {
      tocGroups,
      activeGroupId,
      activeGroup,
      dom_content_ref,
      toggleTab,
    }
  },
}
</script>

<style lang="less" module>
@import '@renderer/assets/styles/layout.less';

.main {
  display: flex;
  flex-flow: row nowrap;
  height: 100%;
  border-top: var(--color-list-header-border-bottom);
}

.toc {
  flex: 0 0 168px;
  padding: 12px 6px 12px 12px;
  overflow-y: auto;
  box-sizing: border-box;
}

.tocList {
  display: flex;
  flex-flow: column nowrap;
  gap: 2px;
}

.tocItem {
  position: relative;
  display: block;
  width: 100%;
  padding: 9px 12px;
  border: none;
  border-radius: @radius-border;
  background: none;
  font-size: 13px;
  font-family: inherit;
  text-align: left;
  color: var(--color-font);
  cursor: pointer;
  .mixin-ellipsis-1();
  transition: @transition-fast;
  transition-property: background-color, color;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    width: 3px;
    height: 16px;
    margin-top: -8px;
    border-radius: 0 3px 3px 0;
    background-color: var(--color-primary);
    transition: @transition-fast;
    transition-property: opacity;
    opacity: 0;
  }

  &:hover {
    background-color: var(--color-button-background-hover);
  }

  &.active {
    background-color: var(--color-primary-alpha-900);
    color: var(--color-primary-font);
    font-weight: 600;

    &::before {
      opacity: 1;
    }
  }
}

.setting {
  flex: auto;
  width: 100%;
  height: 100%;
  padding: 4px 18px 24px;
  box-sizing: border-box;
  overflow-y: auto;
  font-size: 14px;

  :global {
    dt {
      margin: 18px 0 10px;
      font-size: 15px;
      font-weight: 600;
      color: var(--color-font);
    }

    dd {
      padding: 14px 16px;
      margin: 0 0 12px;
      border: 1px solid var(--color-divider);
      border-radius: 10px;
      background-color: var(--color-card-background);
    }

    dd > div {
      padding: 0;
    }

    h3 {
      margin: 0 0 12px;
      font-size: 12px;
      font-weight: 600;
      color: var(--color-text-secondary);
      letter-spacing: 0.02em;
    }

    h3:not(:first-child) {
      margin-top: 16px;
    }

    .p {
      padding: 3px 0;
      line-height: 1.6;
      .btn {
        + .btn {
          margin-left: 10px;
        }
      }
    }

    .help-btn {
      padding: 0;
      margin: 0 0.4em;
      border: none;
      background: none;
      color: var(--color-button-font);
      cursor: pointer;
      transition: opacity 0.2s ease;
      &:hover {
        opacity: 0.7;
      }
    }
    .help-icon {
      margin: 0 0.4em;
    }
  }

  // 分组内只有一个设置页时隐藏页面标题，避免与左侧导航重复
  &.singleSection :global(dt) {
    display: none;
  }
}
</style>
