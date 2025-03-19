import { httpFetch } from '../../request'
import { dnsLookup } from '../utils'
import { headers, timeout } from '../options'
import { sizeFormate } from '../../index'


export const getMusicQualityInfo = (id) => {
  const requestObj = httpFetch(`https://music.163.com/api/song/music/detail/get?songId=${id}`, {
    method: 'get',
    timeout,
    headers,
    lookup: dnsLookup,
    family: 4,
  })

  const types = []
  const _types = {}

  requestObj.promise = requestObj.promise.then(({ statusCode, body }) => {
    if (statusCode != 200 && body.code != 200) return Promise.reject(new Error('获取音质信息失败'))

    const data = body.data

    if (data.l != null && data.l.size != null) {
      let size = sizeFormate(data.l.size)
      types.push({ type: '128k', size })
      _types['128k'] = {
        size,
      }
    } else if (data.m != null && data.m.size != null) {
      let size = sizeFormate(data.m.size)
      types.push({ type: '128k', size })
      _types['128k'] = {
        size,
      }
    }

    if (data.h != null && data.h.size != null) {
      let size = sizeFormate(data.h.size)
      types.push({ type: '320k', size })
      _types['320k'] = {
        size,
      }
    }

    if (data.sq != null && data.sq.size != null) {
      let size = sizeFormate(data.sq.size)
      types.push({ type: 'flac', size })
      _types.flac = {
        size,
      }
    }

    if (data.hr != null && data.hr.size != null) {
      let size = sizeFormate(data.hr.size)
      types.push({ type: 'hires', size })
      _types.hires = {
        size,
      }
    }

    if (data.jm != null && data.jm.size != null) {
      let size = sizeFormate(data.jm.size)
      types.push({ type: 'master', size })
      _types.master = {
        size,
      }
    }

    if (data.je != null && data.je.size != null) {
      let size = sizeFormate(data.je.size)
      types.push({ type: 'atmos', size })
      _types.atmos = {
        size,
      }
    }
  })
  return { types, _types }
}
