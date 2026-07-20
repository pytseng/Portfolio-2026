/** Soft crack SFX on hero click (Web Audio). */

let ctx: AudioContext | null = null
let master: GainNode | null = null

function ensureCtx() {
  if (!ctx) {
    ctx = new AudioContext()
    master = ctx.createGain()
    master.gain.value = 0.85
    master.connect(ctx.destination)
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

function noiseBuffer(audio: AudioContext, seconds: number) {
  const len = Math.floor(audio.sampleRate * seconds)
  const buffer = audio.createBuffer(1, len, audio.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
  return buffer
}

/** Short icy crack / chip on click */
export function playCrackSound() {
  const audio = ensureCtx()
  if (!master) return
  const now = audio.currentTime

  const src = audio.createBufferSource()
  src.buffer = noiseBuffer(audio, 0.16)
  const filter = audio.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.setValueAtTime(1600, now)
  filter.frequency.exponentialRampToValueAtTime(480, now + 0.11)
  filter.Q.value = 1.8
  const noiseGain = audio.createGain()
  noiseGain.gain.setValueAtTime(0.0001, now)
  noiseGain.gain.exponentialRampToValueAtTime(0.16, now + 0.008)
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.13)
  src.connect(filter)
  filter.connect(noiseGain)
  noiseGain.connect(master)
  src.start(now)
  src.stop(now + 0.16)

  const osc = audio.createOscillator()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(740, now)
  osc.frequency.exponentialRampToValueAtTime(180, now + 0.1)
  const clickGain = audio.createGain()
  clickGain.gain.setValueAtTime(0.0001, now)
  clickGain.gain.exponentialRampToValueAtTime(0.05, now + 0.006)
  clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.11)
  osc.connect(clickGain)
  clickGain.connect(master)
  osc.start(now)
  osc.stop(now + 0.12)
}

export function stopHeroAudio() {
  if (!ctx) return
  void ctx.close()
  ctx = null
  master = null
}
