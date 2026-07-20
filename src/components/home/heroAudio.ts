/** Soft crack SFX + soothing ambient pad (Web Audio). */

let ctx: AudioContext | null = null
let master: GainNode | null = null
let musicGain: GainNode | null = null
let musicStarted = false
const nodes: AudioScheduledSourceNode[] = []

function ensureCtx() {
  if (!ctx) {
    ctx = new AudioContext()
    master = ctx.createGain()
    master.gain.value = 0.85
    master.connect(ctx.destination)
    musicGain = ctx.createGain()
    musicGain.gain.value = 0
    musicGain.connect(master)
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

function noiseBuffer(audio: AudioContext, seconds: number, brown = false) {
  const len = Math.floor(audio.sampleRate * seconds)
  const buffer = audio.createBuffer(1, len, audio.sampleRate)
  const data = buffer.getChannelData(0)
  let last = 0
  for (let i = 0; i < len; i++) {
    const white = Math.random() * 2 - 1
    if (brown) {
      last = (last + 0.02 * white) / 1.02
      data[i] = last * 3.5
    } else {
      data[i] = white
    }
  }
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

/** Warm, slow ambient bed — starts once from a user gesture. */
export function startAmbientMusic() {
  const audio = ensureCtx()
  if (!musicGain || musicStarted) return
  musicStarted = true
  const now = audio.currentTime

  // Soft lowpass bus for the whole pad
  const padFilter = audio.createBiquadFilter()
  padFilter.type = 'lowpass'
  padFilter.frequency.value = 680
  padFilter.Q.value = 0.3
  padFilter.connect(musicGain)

  // Breath / air bed
  const air = audio.createBufferSource()
  air.buffer = noiseBuffer(audio, 4, true)
  air.loop = true
  const airFilter = audio.createBiquadFilter()
  airFilter.type = 'lowpass'
  airFilter.frequency.value = 340
  const airGain = audio.createGain()
  airGain.gain.value = 0.028
  air.connect(airFilter)
  airFilter.connect(airGain)
  airGain.connect(padFilter)
  air.start(now)
  nodes.push(air)

  // Open, consonant voicing (Cmaj9-ish): C3 E3 G3 B3 D4 — all sine, very quiet
  const chord = [130.81, 164.81, 196.0, 246.94, 293.66]
  for (let i = 0; i < chord.length; i++) {
    const osc = audio.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = chord[i]

    // Ultra-slow pitch drift (almost unnoticeable)
    const lfo = audio.createOscillator()
    lfo.type = 'sine'
    lfo.frequency.value = 0.015 + i * 0.006
    const lfoGain = audio.createGain()
    lfoGain.gain.value = 0.8 + i * 0.15
    lfo.connect(lfoGain)
    lfoGain.connect(osc.frequency)

    // Slow amplitude swell per voice (out of phase)
    const trem = audio.createOscillator()
    trem.type = 'sine'
    trem.frequency.value = 0.03 + i * 0.011
    const tremGain = audio.createGain()
    tremGain.gain.value = 0.012
    const voiceGain = audio.createGain()
    voiceGain.gain.value = 0.028 + (i === 0 ? 0.018 : 0)
    trem.connect(tremGain)
    tremGain.connect(voiceGain.gain)

    osc.connect(voiceGain)
    voiceGain.connect(padFilter)
    osc.start(now)
    lfo.start(now)
    trem.start(now)
    nodes.push(osc, lfo, trem)
  }

  // High airy shimmer (barely there)
  const shimmer = audio.createOscillator()
  shimmer.type = 'sine'
  shimmer.frequency.value = 523.25 // C5
  const shLfo = audio.createOscillator()
  shLfo.frequency.value = 0.05
  const shLfoGain = audio.createGain()
  shLfoGain.gain.value = 0.01
  shLfo.connect(shLfoGain)
  shLfoGain.connect(shimmer.frequency)
  const shGain = audio.createGain()
  shGain.gain.value = 0.012
  shimmer.connect(shGain)
  shGain.connect(padFilter)
  shimmer.start(now)
  shLfo.start(now)
  nodes.push(shimmer, shLfo)

  // Very slow fade in
  musicGain.gain.cancelScheduledValues(now)
  musicGain.gain.setValueAtTime(0, now)
  musicGain.gain.linearRampToValueAtTime(0.7, now + 6)
}

export function stopHeroAudio() {
  if (!ctx) return
  for (const n of nodes) {
    try {
      n.stop()
    } catch {
      /* already stopped */
    }
  }
  nodes.length = 0
  void ctx.close()
  ctx = null
  master = null
  musicGain = null
  musicStarted = false
}
