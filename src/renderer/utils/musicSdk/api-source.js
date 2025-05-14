import apiSourceInfo from './api-source-info'
import { apiSource, userApi } from '@renderer/store'
import api_mobi_kw from './kw/api-mobi'

const allApi = {
  mobi_kw: api_mobi_kw,
}

const apiList = {}
const supportQuality = {}

for (const api of apiSourceInfo) {
  supportQuality[api.id] = api.supportQualitys
  for (const source of Object.keys(api.supportQualitys)) {
    apiList[`${api.id}_api_${source}`] = allApi[`${api.id}_${source}`]
  }
}

const getAPI = (source) => apiList[`${apiSource.value}_api_${source}`]

const apis = (source) => {
  if (/^user_api/.test(apiSource.value)) return userApi.apis[source]
  let api = getAPI(source)
  if (api) return api
  throw new Error('Api is not found')
}

export { apis, supportQuality }
