import { httpFetch } from '../../request'
import { dnsLookup } from '../utils'
import { headers, timeout } from '../options'
import { sizeFormate } from '../../index'


export const getMusicQualityInfo = (hash) => {
  const requestObj = httpFetch(`https://gateway.kugou.com/goodsmstore/v1/get_res_privilege?appid=1005&clientver=20049&clienttime=${Date.now()}&mid=NeZha`, {
    method: 'post',
    timeout,
    headers,
    body: {
      behavior: 'play',
      clientver: '20049',
      resource: [
        {
          id: 0,
          type: 'audio',
          hash,
        },
      ],
      area_code: '1',
      quality: '128',
      qualities: [
        '128',
        '320',
        'flac',
        'high',
        'dolby',
        'viper_atmos',
        'viper_tape',
        'viper_clear',
      ],
    },
    lookup: dnsLookup,
    family: 4,
  })

  const types = []
  const _types = {}

  requestObj.promise = requestObj.promise.then(({ statusCode, body }) => {
    if (statusCode != 200 && body.error_code != 0) return Promise.reject(new Error('获取音质信息失败'))
    const data = body.data[0].relate_goods

    for (const quality_data of data) {
      if (quality_data.quality === '128') {
        let size = sizeFormate(quality_data.info.filesize)
        types.push({ type: '128k', size, hash: quality_data.hash })
        _types['128k'] = {
          size,
          hash: quality_data.hash,
        }
      }
      if (quality_data.quality === '320') {
        let size = sizeFormate(quality_data.info.filesize)
        types.push({ type: '320k', size, hash: quality_data.hash })
        _types['320k'] = {
          size,
          hash: quality_data.hash,
        }
      }
      if (quality_data.quality === 'flac') {
        let size = sizeFormate(quality_data.info.filesize)
        types.push({ type: 'flac', size, hash: quality_data.hash })
        _types.flac = {
          size,
          hash: quality_data.hash,
        }
      }
      if (quality_data.quality === 'high') {
        let size = sizeFormate(quality_data.info.filesize)
        types.push({ type: 'hires', size, hash: quality_data.hash })
        _types.hires = {
          size,
          hash: quality_data.hash,
        }
      }
      if (quality_data.quality === 'viper_clear') {
        let size = sizeFormate(quality_data.info.filesize)
        types.push({ type: 'master', size, hash: quality_data.hash })
        _types.master = {
          size,
          hash: quality_data.hash,
        }
      }
      if (quality_data.quality === 'viper_atmos') {
        let size = sizeFormate(quality_data.info.filesize)
        types.push({ type: 'atmos', size, hash: quality_data.hash })
        _types.atmos = {
          size,
          hash: quality_data.hash,
        }
      }
    }
  })
  return { types, _types }
}
