import { httpGet } from './request'
import pkg from '../../../package.json'

// TODO add Notice

const author = pkg.author.name
const name = pkg.name

const address: [string, string][] = [
  [`https://raw.githubusercontent.com/${author}/${name}/master/publish/version.json`, 'direct'],
  [`https://raw.dgithub.xyz/${author}/${name}/master/publish/version.json`, 'direct'],
  [`https://fastly.jsdelivr.net/gh/${author}/${name}/publish/version.json`, 'direct'],
  [`https://gcore.jsdelivr.net/gh/${author}/${name}/publish/version.json`, 'direct'],
]

const request = async (url: string, retryNum = 0): Promise<any> => {
  return new Promise((resolve, reject) => {
    httpGet(
      url,
      {
        timeout: 10000,
      },
      (err: Error | null, resp: any, body: any) => {
        if (err || resp.statusCode != 200) {
          ++retryNum >= 3
            ? reject(err || new Error(resp.statusMessage || resp.statusCode))
            : request(url, retryNum).then(resolve).catch(reject)
        } else resolve(body)
      }
    )
  })
}

const getDirectInfo = async (url: string) => {
  return request(url).then((info: any) => {
    if (info.version == null) throw new Error('failed')
    return info
  })
}

const getNpmPkgInfo = async (url: string) => {
  return request(url).then((json: any) => {
    if (!json.versionInfo) throw new Error('failed')
    const info = JSON.parse(json.versionInfo)
    if (info.version == null) throw new Error('failed')
    return info
  })
}

export const getVersionInfo = async (index = 0): Promise<any> => {
  const [url, source] = address[index]
  let promise
  switch (source) {
    case 'direct':
      promise = getDirectInfo(url)
      break
    case 'npm':
      promise = getNpmPkgInfo(url)
      break
  }

  return promise!.catch(async (err) => {
    index++
    if (index >= address.length) throw err
    return getVersionInfo(index)
  })
}

// getVersionInfo().then(info => {
//   console.log(info)
// })
