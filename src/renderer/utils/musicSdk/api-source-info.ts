const sources: Array<{
  id: string
  name: string
  disabled: boolean
  supportQualitys: Partial<Record<LX.OnlineSource, LX.Quality[]>>
}> = [
  {
    id: 'ikun',
    name: 'ikun音源',
    disabled: false,
    supportQualitys: {
      kw: ['128k', '320k', 'flac', 'hires', 'atmos', 'atmos_plus', 'master'],
      kg: ['128k', '320k', 'flac', 'hires', 'atmos', 'master'],
      tx: ['128k', '320k', 'flac', 'hires', 'atmos', 'atmos_plus', 'master'],
      wy: ['128k', '320k', 'flac', 'hires', 'atmos', 'master'],
      mg: ['128k', '320k', 'flac', 'hires'],
    },
  },
  {
    id: 'mobi',
    name: 'Mobi(酷我破解版用的接口)',
    disabled: false,
    supportQualitys: {
      kw: ['128k', '320k', 'flac', 'hires'],
    },
  },
]

export default sources
