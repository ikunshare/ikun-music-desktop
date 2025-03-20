import { httpFetch } from '../../request'
import { sizeFormate } from '../../index'


export const getMusicQualityInfo = (id) => {
  const requestObj = httpFetch('https://u.y.qq.com/cgi-bin/musicu.fcg', {
    method: 'post',
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0)',
    },
    body: {
      comm: {
        ct: '19',
        cv: '1859',
        uin: '0',
      },
      req: {
        module: 'music.pf_song_detail_svr',
        method: 'get_song_detail_yqq',
        param: {
          song_type: 0,
          song_mid: id,
        },
      },
    },
  })

  const types = []
  const _types = {}

  requestObj.promise = requestObj.promise.then(({ statusCode, body }) => {
    if (statusCode != 200 && body.code != 0) return Promise.reject(new Error('获取音质信息失败'))

    const file = body.req.data.track_info.file

    if (file.size_128mp3 != 0) {
      let size = sizeFormate(file.size_128mp3)
      types.push({ type: '128k', size })
      _types['128k'] = {
        size,
      }
    }
    if (file.size_320mp3 !== 0) {
      let size = sizeFormate(file.size_320mp3)
      types.push({ type: '320k', size })
      _types['320k'] = {
        size,
      }
    }
    if (file.size_flac !== 0) {
      let size = sizeFormate(file.size_flac)
      types.push({ type: 'flac', size })
      _types.flac = {
        size,
      }
    }
    if (file.size_hires !== 0) {
      let size = sizeFormate(file.size_hires)
      types.push({ type: 'hires', size })
      _types.hires = {
        size,
      }
    }
    if (file.size_new[1] !== 0) {
      let size = sizeFormate(file.size_new[1])
      types.push({ type: 'atmos', size })
      _types.atmos = {
        size,
      }
    }
    if (file.size_new[2] !== 0) {
      let size = sizeFormate(file.size_new[2])
      types.push({ type: 'atmos_plus', size })
      _types.atmos_plus = {
        size,
      }
    }
    if (file.size_new[0] !== 0) {
      let size = sizeFormate(file.size_new[0])
      types.push({ type: 'master', size })
      _types.master = {
        size,
      }
    }
  })
  return { types, _types }
}
