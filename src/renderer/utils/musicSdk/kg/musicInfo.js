import { createHttpFetch } from './util'
import { filterData } from './quality_detail'

const createGetMusicInfosTask = (hashs) => {
  let data = {
    area_code: '1',
    show_privilege: 1,
    show_album_info: '1',
    is_publish: '',
    appid: 1005,
    clientver: 11451,
    mid: '1',
    dfid: '-',
    clienttime: Date.now(),
    key: 'OIlwieks28dk2k092lksi2UIkp',
    fields: 'album_info,author_name,audio_info,ori_audio_name,base,songname,classification',
  }
  let list = hashs
  let tasks = []
  while (list.length) {
    tasks.push(Object.assign({ data: list.slice(0, 100) }, data))
    if (list.length < 100) break
    list = list.slice(100)
  }
  let url = 'http://gateway.kugou.com/v3/album_audio/audio'
  return tasks.map((task) =>
    createHttpFetch(url, {
      method: 'POST',
      body: task,
      headers: {
        'KG-THash': '13a3164',
        'KG-RC': '1',
        'KG-Fake': '0',
        'KG-RF': '00869891',
        'User-Agent': 'Android712-AndroidPhone-11451-376-0-FeeCacheUpdate-wifi',
        'x-router': 'kmr.service.kugou.com',
      },
    }).then((data) => data.map((s) => s[0]))
  )
}

export const filterMusicInfoList = async (rawList) => {
  return await filterData(rawList, { removeDuplicates: true })
}

export const getMusicInfos = async (hashs) => {
  return await filterMusicInfoList(
    await Promise.all(createGetMusicInfosTask(hashs)).then((data) => data.flat())
  )
}

export const getMusicInfoRaw = async (hash) => {
  return Promise.all(createGetMusicInfosTask([{ hash }])).then((data) => data.flat()[0])
}

export const getMusicInfo = async (hash) => {
  return getMusicInfos([{ hash }]).then((data) => data[0])
}

export const getMusicInfosByList = (list) => {
  return getMusicInfos(list.map((item) => ({ hash: item.hash })))
}
