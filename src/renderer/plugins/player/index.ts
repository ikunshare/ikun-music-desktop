interface HTMLAudioElementChrome extends HTMLAudioElement {
  setSinkId: (id: string) => Promise<void>
}
let audio: HTMLAudioElementChrome | null = null
let audioContext: AudioContext
let mediaSource: MediaElementAudioSourceNode
let analyser: AnalyserNode
// https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext
// https://benzleung.gitbooks.io/web-audio-api-mini-guide/content/chapter5-1.html
export const freqs = [31, 62, 125, 250, 500, 1000, 2000, 4000, 8000, 16000] as const
type Freqs = (typeof freqs)[number]
let biquads: Map<`hz${Freqs}`, BiquadFilterNode>
export const freqsPreset = [
  {
    name: 'pop',
    hz31: 6,
    hz62: 5,
    hz125: -3,
    hz250: -2,
    hz500: 5,
    hz1000: 4,
    hz2000: -4,
    hz4000: -3,
    hz8000: 6,
    hz16000: 4,
  },
  {
    name: 'dance',
    hz31: 4,
    hz62: 3,
    hz125: -4,
    hz250: -6,
    hz500: 0,
    hz1000: 0,
    hz2000: 3,
    hz4000: 4,
    hz8000: 4,
    hz16000: 5,
  },
  {
    name: 'rock',
    hz31: 7,
    hz62: 6,
    hz125: 2,
    hz250: 1,
    hz500: -3,
    hz1000: -4,
    hz2000: 2,
    hz4000: 1,
    hz8000: 4,
    hz16000: 5,
  },
  {
    name: 'classical',
    hz31: 6,
    hz62: 7,
    hz125: 1,
    hz250: 2,
    hz500: -1,
    hz1000: 1,
    hz2000: -4,
    hz4000: -6,
    hz8000: -7,
    hz16000: -8,
  },
  {
    name: 'vocal',
    hz31: -5,
    hz62: -6,
    hz125: -4,
    hz250: -3,
    hz500: 3,
    hz1000: 4,
    hz2000: 5,
    hz4000: 4,
    hz8000: -3,
    hz16000: -3,
  },
  {
    name: 'slow',
    hz31: 5,
    hz62: 4,
    hz125: 2,
    hz250: 0,
    hz500: -2,
    hz1000: 0,
    hz2000: 3,
    hz4000: 6,
    hz8000: 7,
    hz16000: 8,
  },
  {
    name: 'electronic',
    hz31: 6,
    hz62: 5,
    hz125: 0,
    hz250: -5,
    hz500: -4,
    hz1000: 0,
    hz2000: 6,
    hz4000: 8,
    hz8000: 8,
    hz16000: 7,
  },
  {
    name: 'subwoofer',
    hz31: 8,
    hz62: 7,
    hz125: 5,
    hz250: 4,
    hz500: 0,
    hz1000: 0,
    hz2000: 0,
    hz4000: 0,
    hz8000: 0,
    hz16000: 0,
  },
  {
    name: 'soft',
    hz31: -5,
    hz62: -5,
    hz125: -4,
    hz250: -4,
    hz500: 3,
    hz1000: 2,
    hz2000: 4,
    hz4000: 4,
    hz8000: 0,
    hz16000: 0,
  },
] as const
export const convolutions = [
  { name: 'telephone', mainGain: 0.0, sendGain: 3.0, source: 'filter-telephone.wav' }, // 电话
  { name: 's2_r4_bd', mainGain: 1.8, sendGain: 0.9, source: 's2_r4_bd.wav' }, // 教堂
  { name: 'bright_hall', mainGain: 0.8, sendGain: 2.4, source: 'bright-hall.wav' },
  { name: 'cinema_diningroom', mainGain: 0.6, sendGain: 2.3, source: 'cinema-diningroom.wav' },
  {
    name: 'dining_living_true_stereo',
    mainGain: 0.6,
    sendGain: 1.8,
    source: 'dining-living-true-stereo.wav',
  },
  {
    name: 'living_bedroom_leveled',
    mainGain: 0.6,
    sendGain: 2.1,
    source: 'living-bedroom-leveled.wav',
  },
  { name: 'spreader50_65ms', mainGain: 1, sendGain: 2.5, source: 'spreader50-65ms.wav' },
  // { name: 'spreader25_125ms', mainGain: 1, sendGain: 2.5, source: 'spreader25-125ms.wav' },
  // { name: 'backslap', mainGain: 1.8, sendGain: 0.8, source: 'backslap1.wav' },
  { name: 's3_r1_bd', mainGain: 1.8, sendGain: 0.8, source: 's3_r1_bd.wav' },
  { name: 'matrix_1', mainGain: 1.5, sendGain: 0.9, source: 'matrix-reverb1.wav' },
  { name: 'matrix_2', mainGain: 1.3, sendGain: 1, source: 'matrix-reverb2.wav' },
  {
    name: 'cardiod_35_10_spread',
    mainGain: 1.8,
    sendGain: 0.6,
    source: 'cardiod-35-10-spread.wav',
  },
  {
    name: 'tim_omni_35_10_magnetic',
    mainGain: 1,
    sendGain: 0.2,
    source: 'tim-omni-35-10-magnetic.wav',
  },
  // { name: 'spatialized', mainGain: 1.8, sendGain: 0.8, source: 'spatialized8.wav' },
  // { name: 'zing_long_stereo', mainGain: 0.8, sendGain: 1.8, source: 'zing-long-stereo.wav' },
  { name: 'feedback_spring', mainGain: 1.8, sendGain: 0.8, source: 'feedback-spring.wav' },
  // { name: 'tim_omni_rear_blend', mainGain: 1.8, sendGain: 0.8, source: 'tim-omni-rear-blend.wav' },
] as const
// 半音
// export const semitones = [-1.5, -1, -0.5, 0.5, 1, 1.5, 2, 2.5, 3, 3.5] as const

let convolver: ConvolverNode
let convolverSourceGainNode: GainNode
let convolverOutputGainNode: GainNode
let convolverDynamicsCompressor: DynamicsCompressorNode
let compressorNode: DynamicsCompressorNode
let compressorMakeupNode: GainNode
let gainNode: GainNode
let panner: PannerNode
let pitchShifterNode: AudioWorkletNode
let pitchShifterNodePitchFactor: AudioParam | null
let pitchShifterNodeLoadStatus: 'none' | 'loading' | 'unconnect' | 'connected' = 'none'
let pitchShifterNodeTempValue = 1
let defaultChannelCount = 2
export const soundR = 0.5

// 播放/暂停音量渐变
const FADE_DURATION = 300
// 切歌时的渐出，比播放/暂停慢一点，接歌才不会突然
const SWITCH_FADE_DURATION = 400
const FADE_INTERVAL = 10
let targetVolume = 1
let fadeTimer: ReturnType<typeof setInterval> | null = null
let isFadeInPending = false
let isVolumeFadeEnabled = true

// 当前跑的这段渐出是不是「切歌/停止」的渐出。渐出期间旧曲还在出声，
// 它的 playing / ended 事件描述的是旧曲，不能拿去驱动界面状态。
let isSwitchFadeRunning = false

const clearFade = () => {
  isSwitchFadeRunning = false
  if (fadeTimer == null) return
  clearInterval(fadeTimer)
  fadeTimer = null
}

const fadeVolume = (
  to: number,
  onEnd?: () => void,
  duration = FADE_DURATION,
  isSwitchFade = false
) => {
  if (!audio) return
  clearFade()
  const from = audio.volume
  if (from == to) {
    onEnd?.()
    return
  }
  isSwitchFadeRunning = isSwitchFade
  const startTime = performance.now()
  fadeTimer = setInterval(() => {
    if (!audio) {
      clearFade()
      return
    }
    const progress = Math.min((performance.now() - startTime) / duration, 1)
    audio.volume = from + (to - from) * progress
    if (progress < 1) return
    clearFade()
    onEnd?.()
  }, FADE_INTERVAL)
}

// 切歌时要把「换源」推迟到渐出结束，否则音频会被硬切。
// 挂起的新音源放在这里而不是塞进渐出的回调里：任何一处 clearFade 都可能把回调丢掉，
// 存成数据后，暂停/播放/改设置时补一次 applyPendingSrc 就不会把新歌弄丢。
let pendingSrc: string | null = null

/** 是否处在「旧曲渐出、新曲还没接上」的过程中，这期间旧曲的音频事件要忽略 */
export const isSwitchingAudioSource = () => isSwitchFadeRunning

const applyPendingSrc = () => {
  const src = pendingSrc
  if (!audio || !src) return
  pendingSrc = null
  clearFade()
  if (isVolumeFadeEnabled) {
    audio.volume = 0
    isFadeInPending = true
  } else {
    isFadeInPending = false
  }
  audio.src = src
}

export const setVolumeFadeEnabled = (enabled: boolean) => {
  isVolumeFadeEnabled = enabled
  if (enabled) return
  clearFade()
  isFadeInPending = false
  if (audio && !audio.paused) audio.volume = targetVolume
  applyPendingSrc()
}

export const createAudio = () => {
  if (audio) return
  audio = new window.Audio() as HTMLAudioElementChrome
  audio.controls = false
  audio.autoplay = true
  audio.preload = 'auto'
  audio.crossOrigin = 'anonymous'
  audio.addEventListener('playing', () => {
    if (!isFadeInPending) return
    isFadeInPending = false
    fadeVolume(targetVolume)
  })
}

const initAnalyser = () => {
  analyser = audioContext.createAnalyser()
  analyser.fftSize = 256
}

const initBiquadFilter = () => {
  biquads = new Map()
  let i

  for (const item of freqs) {
    const filter = audioContext.createBiquadFilter()
    biquads.set(`hz${item}`, filter)
    filter.type = 'peaking'
    filter.frequency.value = item
    filter.Q.value = 1.4
    filter.gain.value = 0
  }

  for (i = 1; i < freqs.length; i++) {
    biquads.get(`hz${freqs[i - 1]}`)!.connect(biquads.get(`hz${freqs[i]}`)!)
  }
}

const initConvolver = () => {
  convolverSourceGainNode = audioContext.createGain()
  convolverOutputGainNode = audioContext.createGain()
  convolverDynamicsCompressor = audioContext.createDynamicsCompressor()
  convolver = audioContext.createConvolver()
  convolver.connect(convolverOutputGainNode)
  convolverSourceGainNode.connect(convolverDynamicsCompressor)
  convolverOutputGainNode.connect(convolverDynamicsCompressor)
}

const initPanner = () => {
  panner = audioContext.createPanner()
}

const initGain = () => {
  gainNode = audioContext.createGain()
}

const initCompressor = () => {
  compressorNode = audioContext.createDynamicsCompressor()
  // 默认直通：ratio 1 / threshold 0 不产生任何增益衰减
  compressorNode.threshold.value = 0
  compressorNode.knee.value = 0
  compressorNode.ratio.value = 1
  compressorNode.attack.value = 0.003
  compressorNode.release.value = 0.25
  compressorMakeupNode = audioContext.createGain()
}

// 压缩机：压缩动态范围（响的更安静）+ 慢速增益跟随（让每首歌响度接近）
const COMPRESSOR_AGC_INTERVAL = 250
const COMPRESSOR_AGC_TARGET_DB = -20
const COMPRESSOR_AGC_MAX_GAIN_DB = 12
const COMPRESSOR_AGC_SILENCE_DB = -60
// 每次最多调整 2 dB，避免“喘气”一样的音量抖动
const COMPRESSOR_AGC_MAX_STEP_DB = 2
let compressorAmount = 0
let compressorAgcTimer: ReturnType<typeof setInterval> | null = null
let compressorAgcGainDb = 0

const stopCompressorAgc = () => {
  if (compressorAgcTimer == null) return
  clearInterval(compressorAgcTimer)
  compressorAgcTimer = null
}

const handleCompressorAgc = () => {
  if (!audio || audio.paused || audio.muted) return
  // ponytail: 每 tick 新建 256 长度的临时数组，不值得为它做复用池
  const buf = new Float32Array(analyser.fftSize)
  analyser.getFloatTimeDomainData(buf)
  let sum = 0
  for (const value of buf) sum += value * value
  const rms = Math.sqrt(sum / buf.length)
  if (rms <= 0) return
  const db = 20 * Math.log10(rms)
  // 静音/极弱段落不做增益提升，否则会在安静处把底噪拉起来
  if (db < COMPRESSOR_AGC_SILENCE_DB) return
  const step = Math.min(
    Math.max(COMPRESSOR_AGC_TARGET_DB - db, -COMPRESSOR_AGC_MAX_STEP_DB),
    COMPRESSOR_AGC_MAX_STEP_DB
  )
  compressorAgcGainDb = Math.min(
    Math.max(compressorAgcGainDb + step, -COMPRESSOR_AGC_MAX_GAIN_DB),
    COMPRESSOR_AGC_MAX_GAIN_DB
  )
  compressorMakeupNode.gain.setTargetAtTime(
    10 ** (compressorAgcGainDb / 20),
    audioContext.currentTime,
    0.2
  )
}

const startCompressorAgc = () => {
  if (compressorAgcTimer != null) return
  compressorAgcTimer = setInterval(handleCompressorAgc, COMPRESSOR_AGC_INTERVAL)
}

// amount: 0 = 关闭，100 = 最强
export const setCompressor = (amount: number) => {
  initAdvancedAudioFeatures()
  compressorAmount = Math.min(Math.max(amount, 0), 100)
  const strength = compressorAmount / 100
  if (strength == 0) {
    compressorNode.ratio.value = 1
    compressorNode.threshold.value = 0
    compressorNode.knee.value = 0
    compressorAgcGainDb = 0
    compressorMakeupNode.gain.setTargetAtTime(1, audioContext.currentTime, 0.2)
    stopCompressorAgc()
    return
  }
  compressorNode.threshold.value = -6 - 24 * strength
  compressorNode.ratio.value = 1 + 11 * strength
  compressorNode.knee.value = 6 + 24 * strength
  startCompressorAgc()
}

// 换歌时把增益跟随重置到中位，让新歌重新自己找响度
export const resetCompressorAgc = () => {
  if (compressorAmount == 0 || compressorMakeupNode == null) return
  compressorAgcGainDb = 0
  compressorMakeupNode.gain.setTargetAtTime(1, audioContext.currentTime, 0.3)
}

const initAdvancedAudioFeatures = () => {
  if (audioContext) return
  if (!audio) throw new Error('audio not defined')
  audioContext = new window.AudioContext({ latencyHint: 'playback' })
  defaultChannelCount = audioContext.destination.channelCount

  initAnalyser()
  initBiquadFilter()
  initConvolver()
  initPanner()
  initGain()
  initCompressor()
  // source -> analyser -> biquadFilter -> pitchShifter -> [(convolver & convolverSource)->convolverDynamicsCompressor] -> compressor -> panner -> gain
  mediaSource = audioContext.createMediaElementSource(audio)
  mediaSource.connect(analyser)
  analyser.connect(biquads.get(`hz${freqs[0]}`)!)
  const lastBiquadFilter = biquads.get(`hz${freqs.at(-1)!}`)!
  lastBiquadFilter.connect(convolverSourceGainNode)
  lastBiquadFilter.connect(convolver)
  convolverDynamicsCompressor.connect(compressorNode)
  compressorNode.connect(compressorMakeupNode)
  compressorMakeupNode.connect(panner)
  panner.connect(gainNode)
  gainNode.connect(audioContext.destination)

  // 音频输出设备改变时刷新 audio node 连接
  window.app_event.on('playerDeviceChanged', handleMediaListChange)

  // audio.addEventListener('playing', connectAudioNode)
  // audio.addEventListener('pause', disconnectAudioNode)
  // audio.addEventListener('waiting', disconnectAudioNode)
  // audio.addEventListener('emptied', disconnectAudioNode)
  // if (!audio.paused) connectAudioNode()
}

const handleMediaListChange = () => {
  mediaSource.disconnect()
  mediaSource.connect(analyser)
}

// let isConnected = true
// const connectAudioNode = () => {
//   if (isConnected) return
//   console.log('connect Node')
//   mediaSource.connect(analyser)
//   isConnected = true
//   if (pitchShifterNodeTempValue == 1 && pitchShifterNodeLoadStatus == 'connected') {
//     disconnectPitchShifterNode()
//   }
// }

// const disconnectAudioNode = () => {
//   if (!isConnected) return
//   console.log('disconnect Node')
//   mediaSource.disconnect()
//   isConnected = false
//   if (pitchShifterNodeTempValue == 1 && pitchShifterNodeLoadStatus == 'connected') {
//     disconnectPitchShifterNode()
//   }
// }

export const getAudioContext = () => {
  initAdvancedAudioFeatures()
  return audioContext
}

let unsubMediaListChangeEvent: (() => void) | null = null
export const setMaxOutputChannelCount = (enable: boolean) => {
  if (enable) {
    initAdvancedAudioFeatures()
    audioContext.destination.channelCountMode = 'max'
    audioContext.destination.channelCount = audioContext.destination.maxChannelCount
    // navigator.mediaDevices.addEventListener('devicechange', handleMediaListChange)
    if (!unsubMediaListChangeEvent) {
      let handleMediaListChange = () => {
        setMaxOutputChannelCount(true)
      }
      window.app_event.on('playerDeviceChanged', handleMediaListChange)
      unsubMediaListChangeEvent = () => {
        window.app_event.off('playerDeviceChanged', handleMediaListChange)
        unsubMediaListChangeEvent = null
      }
    }
  } else {
    unsubMediaListChangeEvent?.()
    if (audioContext && audioContext.destination.channelCountMode != 'explicit') {
      audioContext.destination.channelCount = defaultChannelCount
      // audioContext.destination.channelInterpretation
      audioContext.destination.channelCountMode = 'explicit'
    }
  }
}

export const getAnalyser = (): AnalyserNode | null => {
  initAdvancedAudioFeatures()
  return analyser
}

export const getBiquadFilter = () => {
  initAdvancedAudioFeatures()
  return biquads
}

// let isConvolverConnected = false
export const setConvolver = (buffer: AudioBuffer | null, mainGain: number, sendGain: number) => {
  initAdvancedAudioFeatures()
  convolver.buffer = buffer
  // console.log(mainGain, sendGain)
  if (buffer) {
    convolverSourceGainNode.gain.value = mainGain
    convolverOutputGainNode.gain.value = sendGain
  } else {
    convolverSourceGainNode.gain.value = 1
    convolverOutputGainNode.gain.value = 0
  }
}

export const setConvolverMainGain = (gain: number) => {
  if (convolverSourceGainNode.gain.value == gain) return
  // console.log(gain)
  convolverSourceGainNode.gain.value = gain
}

export const setConvolverSendGain = (gain: number) => {
  if (convolverOutputGainNode.gain.value == gain) return
  // console.log(gain)
  convolverOutputGainNode.gain.value = gain
}

let pannerInfo = {
  x: 0,
  y: 0,
  z: 0,
  soundR: 0.5,
  rad: 0,
  speed: 1,
  intv: null as NodeJS.Timeout | null,
}
const setPannerXYZ = (nx: number, ny: number, nz: number) => {
  pannerInfo.x = nx
  pannerInfo.y = ny
  pannerInfo.z = nz
  // console.log(pannerInfo)
  panner.positionX.value = nx * pannerInfo.soundR
  panner.positionY.value = ny * pannerInfo.soundR
  panner.positionZ.value = nz * pannerInfo.soundR
}
export const setPannerSoundR = (r: number) => {
  pannerInfo.soundR = r
}

export const setPannerSpeed = (speed: number) => {
  pannerInfo.speed = speed
  if (pannerInfo.intv) startPanner()
}
export const stopPanner = () => {
  if (pannerInfo.intv) {
    clearInterval(pannerInfo.intv)
    pannerInfo.intv = null
    pannerInfo.rad = 0
  }
  panner.positionX.value = 0
  panner.positionY.value = 0
  panner.positionZ.value = 0
}

export const startPanner = () => {
  initAdvancedAudioFeatures()
  if (pannerInfo.intv) {
    clearInterval(pannerInfo.intv)
    pannerInfo.intv = null
    pannerInfo.rad = 0
  }
  pannerInfo.intv = setInterval(() => {
    pannerInfo.rad += 1
    if (pannerInfo.rad > 360) pannerInfo.rad -= 360
    setPannerXYZ(
      Math.sin((pannerInfo.rad * Math.PI) / 180),
      Math.cos((pannerInfo.rad * Math.PI) / 180),
      Math.cos((pannerInfo.rad * Math.PI) / 180)
    )
  }, pannerInfo.speed * 10)
}

let isConnected = true
const connectNode = () => {
  if (isConnected) return
  console.log('connect Node')
  analyser?.connect(biquads.get(`hz${freqs[0]}`)!)
  isConnected = true
  if (pitchShifterNodeTempValue == 1 && pitchShifterNodeLoadStatus == 'connected') {
    disconnectPitchShifterNode()
  }
}
const disconnectNode = () => {
  if (!isConnected) return
  console.log('disconnect Node')
  analyser?.disconnect()
  isConnected = false
  if (pitchShifterNodeTempValue == 1 && pitchShifterNodeLoadStatus == 'connected') {
    disconnectPitchShifterNode()
  }
}
const connectPitchShifterNode = () => {
  console.log('connect Pitch Shifter Node')
  audio!.addEventListener('playing', connectNode)
  audio!.addEventListener('pause', disconnectNode)
  audio!.addEventListener('waiting', disconnectNode)
  audio!.addEventListener('emptied', disconnectNode)
  if (audio!.paused) disconnectNode()

  const lastBiquadFilter = biquads.get(`hz${freqs.at(-1)!}`)!
  lastBiquadFilter.disconnect()
  lastBiquadFilter.connect(pitchShifterNode)

  pitchShifterNode.connect(convolver)
  pitchShifterNode.connect(convolverSourceGainNode)
  // convolverDynamicsCompressor.disconnect(panner)
  // convolverDynamicsCompressor.connect(pitchShifterNode)
  // pitchShifterNode.connect(panner)
  pitchShifterNodeLoadStatus = 'connected'
  pitchShifterNodePitchFactor!.value = pitchShifterNodeTempValue
}
const disconnectPitchShifterNode = () => {
  console.log('disconnect Pitch Shifter Node')
  const lastBiquadFilter = biquads.get(`hz${freqs.at(-1)!}`)!
  lastBiquadFilter.disconnect()
  lastBiquadFilter.connect(convolver)
  lastBiquadFilter.connect(convolverSourceGainNode)
  pitchShifterNodeLoadStatus = 'unconnect'
  pitchShifterNodePitchFactor = null

  audio!.removeEventListener('playing', connectNode)
  audio!.removeEventListener('pause', disconnectNode)
  audio!.removeEventListener('waiting', disconnectNode)
  audio!.removeEventListener('emptied', disconnectNode)
  connectNode()
}
const loadPitchShifterNode = () => {
  pitchShifterNodeLoadStatus = 'loading'
  initAdvancedAudioFeatures()
  // source -> analyser -> biquadFilter -> audioWorklet(pitch shifter) -> [(convolver & convolverSource)->convolverDynamicsCompressor] -> panner -> gain
  void audioContext.audioWorklet
    .addModule(
      new URL(
        /* webpackChunkName: 'pitch_shifter.audioWorklet' */
        './pitch-shifter/phase-vocoder.js',
        import.meta.url
      )
    )
    .then(() => {
      console.log('pitch shifter audio worklet loaded')
      // https://github.com/olvb/phaze/issues/26#issuecomment-1574629971
      pitchShifterNode = new AudioWorkletNode(audioContext, 'phase-vocoder-processor', {
        outputChannelCount: [2],
      })
      let pitchFactorParam = pitchShifterNode.parameters.get('pitchFactor')
      if (!pitchFactorParam) return
      pitchShifterNodePitchFactor = pitchFactorParam
      pitchShifterNodeLoadStatus = 'unconnect'
      if (pitchShifterNodeTempValue == 1) return

      connectPitchShifterNode()
    })
}

export const setPitchShifter = (val: number) => {
  // console.log('setPitchShifter', val)
  pitchShifterNodeTempValue = val
  switch (pitchShifterNodeLoadStatus) {
    case 'loading':
      break
    case 'none':
      loadPitchShifterNode()
      break
    case 'connected':
      // a: 1 = 半音
      // value = 2 ** (a / 12)
      pitchShifterNodePitchFactor!.value = val
      break
    case 'unconnect':
      connectPitchShifterNode()
      break
  }
}

export const hasInitedAdvancedAudioFeatures = (): boolean => audioContext != null

export const setResource = (src: string) => {
  if (!audio) return
  resetCompressorAgc()
  pendingSrc = src
  // 上一首还在放就先渐出，等音量到 0 再换源，接歌的接缝才不会是硬切
  if (isVolumeFadeEnabled && !audio.paused) {
    isFadeInPending = false
    fadeVolume(0, applyPendingSrc, SWITCH_FADE_DURATION, true)
    return
  }
  applyPendingSrc()
}

export const setPlay = () => {
  if (!audio) return
  applyPendingSrc()
  if (!audio.paused) {
    // 暂停渐出未结束又重新播放时直接渐入
    isFadeInPending = false
    if (isVolumeFadeEnabled) fadeVolume(targetVolume)
    else audio.volume = targetVolume
    return
  }
  clearFade()
  if (isVolumeFadeEnabled) {
    audio.volume = 0
    isFadeInPending = true
  } else {
    isFadeInPending = false
    audio.volume = targetVolume
  }
  void audio.play()
}

export const setPause = () => {
  if (!audio) return
  applyPendingSrc()
  if (audio.paused) return
  if (!isVolumeFadeEnabled) {
    audio.pause()
    return
  }
  isFadeInPending = false
  fadeVolume(0, () => {
    audio?.pause()
  })
}

const stopAudio = () => {
  if (!audio) return
  pendingSrc = null
  clearFade()
  isFadeInPending = false
  audio.src = ''
  audio.removeAttribute('src')
}

export const setStop = () => {
  if (!audio) return
  // 正在播放时先渐出再断源，停止/切歌都不会把声音一刀切掉
  if (isVolumeFadeEnabled && !audio.paused) {
    isFadeInPending = false
    fadeVolume(0, stopAudio, SWITCH_FADE_DURATION, true)
    return
  }
  stopAudio()
}

export const isEmpty = (): boolean => !audio?.src

export const setLoopPlay = (isLoop: boolean) => {
  if (audio) audio.loop = isLoop
}

export const getPlaybackRate = (): number => {
  return audio?.defaultPlaybackRate ?? 1
}

export const setPlaybackRate = (rate: number) => {
  if (!audio) return
  audio.defaultPlaybackRate = rate
  audio.playbackRate = rate
}

export const setPreservesPitch = (preservesPitch: boolean) => {
  if (!audio) return
  audio.preservesPitch = preservesPitch
}

export const getMute = (): boolean => {
  return audio?.muted ?? false
}

export const setMute = (isMute: boolean) => {
  if (audio) audio.muted = isMute
}

export const getCurrentTime = () => {
  return audio?.currentTime || 0
}

export const setCurrentTime = (time: number) => {
  if (audio) audio.currentTime = time
}

export const setMediaDeviceId = async (mediaDeviceId: string): Promise<void> => {
  if (!audio) return
  return audio.setSinkId(mediaDeviceId)
}

export const setVolume = (volume: number) => {
  targetVolume = volume
  // 渐变中或暂停时不直接改动音量，避免打断渐变/破坏下次渐入
  if (!audio || fadeTimer != null || audio.paused) return
  audio.volume = volume
}

export const getDuration = () => {
  return audio?.duration || 0
}

// export const getPlaybackRate = () => {
//   return audio?.playbackRate ?? 1
// }

type Noop = () => void

export const onPlaying = (callback: Noop) => {
  if (!audio) throw new Error('audio not defined')

  audio.addEventListener('playing', callback)
  return () => {
    audio?.removeEventListener('playing', callback)
  }
}

export const onPause = (callback: Noop) => {
  if (!audio) throw new Error('audio not defined')

  audio?.addEventListener('pause', callback)
  return () => {
    audio?.removeEventListener('pause', callback)
  }
}

export const onEnded = (callback: Noop) => {
  if (!audio) throw new Error('audio not defined')

  audio.addEventListener('ended', callback)
  return () => {
    audio?.removeEventListener('ended', callback)
  }
}

export const onError = (callback: Noop) => {
  if (!audio) throw new Error('audio not defined')

  audio.addEventListener('error', callback)
  return () => {
    audio?.removeEventListener('error', callback)
  }
}

export const onLoadeddata = (callback: Noop) => {
  if (!audio) throw new Error('audio not defined')

  audio.addEventListener('loadeddata', callback)
  return () => {
    audio?.removeEventListener('loadeddata', callback)
  }
}

export const onLoadstart = (callback: Noop) => {
  if (!audio) throw new Error('audio not defined')

  audio.addEventListener('loadstart', callback)
  return () => {
    audio?.removeEventListener('loadstart', callback)
  }
}

export const onCanplay = (callback: Noop) => {
  if (!audio) throw new Error('audio not defined')

  audio.addEventListener('canplay', callback)
  return () => {
    audio?.removeEventListener('canplay', callback)
  }
}

export const onEmptied = (callback: Noop) => {
  if (!audio) throw new Error('audio not defined')

  audio.addEventListener('emptied', callback)
  return () => {
    audio?.removeEventListener('emptied', callback)
  }
}

export const onTimeupdate = (callback: Noop) => {
  if (!audio) throw new Error('audio not defined')

  audio.addEventListener('timeupdate', callback)
  return () => {
    audio?.removeEventListener('timeupdate', callback)
  }
}

// 缓冲中
export const onWaiting = (callback: Noop) => {
  if (!audio) throw new Error('audio not defined')

  audio.addEventListener('waiting', callback)
  return () => {
    audio?.removeEventListener('waiting', callback)
  }
}

// 可见性改变
export const onVisibilityChange = (callback: Noop) => {
  document.addEventListener('visibilitychange', callback)
  return () => {
    document.removeEventListener('visibilitychange', callback)
  }
}

export const getErrorCode = () => {
  return audio?.error?.code
}
