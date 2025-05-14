import { httpFetch } from '../../request'
import { requestMsg } from '../../message'
import { timeout } from '../options'
import { dnsLookup } from '../utils'


const kw_quality_format = {
  '128k': { e: '128kmp3', f: 'mp3' },
  '320k': { e: '320kmp3', f: 'mp3' },
  flac: { e: '2000kflac', f: 'flac' },
  hires: { e: '4000kflac', f: 'flac' },
}

const api_mobi = {
  getMusicUrl(songInfo, type) {
    const rawData = {
      f: 'web',
      rid: parseInt(songInfo.songmid),
      br: kw_quality_format[type].e,
      source: 'jiakong',
      type: 'convert_url_with_sign',
      surl: '1',
    }
    const queryString = Object.entries(rawData)
      .map(([k, v]) => `${k}=${v}`)
      .join('&')
    console.log(queryString)
    const requestObj = httpFetch(`https://nmsublist.kuwo.cn/mobi.s?${queryString}`, {
      method: 'get',
      headers: {
        'User-Agent': 'okhttp/3.10.0',
      },
      timeout,
      lookup: dnsLookup,
      family: 4,
    })
    requestObj.promise = requestObj.promise.then(({ statusCode, body }) => {
      if (statusCode != 200) return Promise.reject(new Error(requestMsg.fail))
      switch (body.code) {
        case 200: return Promise.resolve({ type, url: body.data.surl })
        default: return Promise.reject(new Error('获取URL失败'))
      }
    })
    return requestObj
  },
}

export default api_mobi
