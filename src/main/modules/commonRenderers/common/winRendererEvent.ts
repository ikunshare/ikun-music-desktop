import { CMMON_EVENT_NAME } from '@common/ipcNames'

// 发送列表操作事件到渲染进程的注册方法
// 哪个渲染进程需要接收则引入此方法注册
export const registerRendererEvents = (
  sendEvent: <T = any>(name: string, params?: T | undefined) => void
) => {
  const sendDeeplink = (link: string) => {
    sendEvent(CMMON_EVENT_NAME.deeplink, link)
  }
  const sendSystemThemeChange = () => {
    sendEvent(CMMON_EVENT_NAME.theme_change, global.lx.theme)
  }
  const sendMaximizeChange = (isMaximized: boolean) => {
    sendEvent(CMMON_EVENT_NAME.maximize_change, isMaximized)
  }

  global.lx.event_app.on('deeplink', sendDeeplink)
  global.lx.event_app.on('theme_change', sendSystemThemeChange)
  global.lx.event_app.on('maximize_change', sendMaximizeChange)

  return () => {
    global.lx.event_app.off('deeplink', sendDeeplink)
    global.lx.event_app.off('theme_change', sendSystemThemeChange)
    global.lx.event_app.off('maximize_change', sendMaximizeChange)
  }
}
