import { decodeName, formatPlayTime } from '../../index'
import { createHttpFetch } from './util'
import { getMusicQualityInfo } from './quality_detail'

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
  return tasks.map(task => createHttpFetch(url, {
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
  }).then(data => data.map(s => s[0])))
}

export const filterMusicInfoList = (rawList) => {
  // console.log(rawList)
  let ids = new Set()
  let list = []
  rawList.forEach(item => {
    if (!item) return
    if (ids.has(item.audio_info.audio_id)) return
    ids.add(item.audio_info.audio_id)
    const { types, _types } = getMusicQualityInfo(item.FileHash)
    list.push({
      singer: decodeName(item.author_name),
      name: decodeName(item.songname),
      albumName: decodeName(item.album_info.album_name),
      albumId: item.album_info.album_id,
      songmid: item.audio_info.audio_id,
      source: 'kg',
      interval: formatPlayTime(parseInt(item.audio_info.timelength) / 1000),
      img: null,
      lrc: null,
      hash: item.audio_info.hash,
      otherSource: null,
      types,
      _types,
      typeUrl: {},
    })
  })
  return list
}

export const getMusicInfos = async(hashs) => {
  return filterMusicInfoList(await Promise.all(createGetMusicInfosTask(hashs)).then(data => data.flat()))
}

export const getMusicInfoRaw = async(hash) => {
  return Promise.all(createGetMusicInfosTask([{ hash }])).then(data => data.flat()[0])
}

export const getMusicInfo = async(hash) => {
  return getMusicInfos([{ hash }]).then(data => data[0])
}

export const getMusicInfosByList = (list) => {
  return getMusicInfos(list.map(item => ({ hash: item.hash })))
}
