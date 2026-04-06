import apiSourceInfo from './api-source-info'
import { apiSource, userApi } from '@renderer/store'

const allApi: Record<string, any> = {}

const apiList: Record<string, any> = {}
const supportQuality: Record<string, Partial<Record<LX.OnlineSource, LX.Quality[]>>> = {}

for (const api of apiSourceInfo) {
  supportQuality[api.id] = api.supportQualitys
  for (const source of Object.keys(api.supportQualitys)) {
    apiList[`${api.id}_api_${source}`] = allApi[`${api.id}_${source}`]
  }
}

const getAPI = (source: string): any => apiList[`${apiSource.value}_api_${source}`]

const apis = (source: string): any => {
  if (/^user_api/.test(apiSource.value!)) return userApi.apis[source as keyof typeof userApi.apis]
  let api = getAPI(source)
  if (api) return api
  throw new Error('Api is not found')
}

export { apis, supportQuality }
