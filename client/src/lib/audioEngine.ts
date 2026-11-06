/**
 * Zero-asset cinematic audio engine.
 * Everything is synthesised with the Web Audio API — no downloads, no autoplay
 * (the context is only created after an explicit user gesture).
 */
class AudioEngine {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private droneGain: GainNode | null = null
  private droneOscs: OscillatorNode[] = []
  private noiseBuffer: AudioBuffer | null = null
  private _enabled = false

  get enabled(): boolean {
    return this._enabled
  }

  async toggle(): Promise<boolean> {
    if (this._enabled) {
      this._enabled = false
      this.stopDrone()
      return false
    }

    const started = await this.ensureContext()
    if (!started) return false

    this._enabled = true
    this.startDrone()
    this.playBoot()
    return true
  }

  private async ensureContext(): Promise<boolean> {
    if (typeof window === 'undefined') return false

    if (!this.ctx) {
      const AudioCtor =
        window.AudioContext ??
        (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!AudioCtor) return false

      this.ctx = new AudioCtor()
      this.master = this.ctx.createGain()
      this.master.gain.value = 0.6
      this.master.connect(this.ctx.destination)
      this.noiseBuffer = this.createNoiseBuffer()
    }

    if (this.ctx.state === 'suspended') {
      await this.ctx.resume()
    }

    return true
  }

  private createNoiseBuffer(): AudioBuffer {
    const ctx = this.ctx as AudioContext
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < data.length; i += 1) {
      data[i] = Math.random() * 2 - 1
    }
    return buffer
  }

  private startDrone(): void {
    if (!this.ctx || !this.master || this.droneGain) return

    const ctx = this.ctx
    const gain = ctx.createGain()
    gain.gain.value = 0.0001
    gain.connect(this.master)

    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 420
    filter.Q.value = 1.6
    filter.connect(gain)

    const freqs = [55, 82.5, 110, 164.8]
    this.droneOscs = freqs.map((freq, index) => {
      const osc = ctx.createOscillator()
      osc.type = index % 2 === 0 ? 'sine' : 'triangle'
      osc.frequency.value = freq
      osc.detune.value = index * 4 - 6
      osc.connect(filter)
      osc.start()
      return osc
    })

    this.droneGain = gain
    const now = ctx.currentTime
    gain.gain.exponentialRampToValueAtTime(0.08, now + 2.4)
  }

  private stopDrone(): void {
    if (!this.ctx || !this.droneGain) return
    const now = this.ctx.currentTime
    const gain = this.droneGain
    gain.gain.cancelScheduledValues(now)
    gain.gain.setValueAtTime(Math.max(gain.gain.value, 0.0001), now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5)
    const oscs = this.droneOscs
    window.setTimeout(() => {
      oscs.forEach((osc) => {
        try {
          osc.stop()
        } catch {
          /* already stopped */
        }
      })
    }, 600)
    this.droneOscs = []
    this.droneGain = null
  }

  private tone(
    from: number,
    to: number,
    duration: number,
    type: OscillatorType,
    volume: number,
    delay = 0,
  ): void {
    if (!this.ctx || !this.master) return
    const ctx = this.ctx
    const t0 = ctx.currentTime + delay
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(Math.max(from, 1), t0)
    osc.frequency.exponentialRampToValueAtTime(Math.max(to, 1), t0 + duration)
    gain.gain.setValueAtTime(0.0001, t0)
    gain.gain.exponentialRampToValueAtTime(volume, t0 + Math.min(0.08, duration * 0.2))
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration)
    osc.connect(gain)
    gain.connect(this.master)
    osc.start(t0)
    osc.stop(t0 + duration + 0.05)
  }

  playBoot(): void {
    if (!this._enabled) return
    this.tone(90, 440, 1.6, 'sine', 0.055, 0)
    this.tone(220, 880, 1.1, 'triangle', 0.02, 0.35)
  }

  playWhoosh(duration = 1.4): void {
    if (!this._enabled || !this.ctx || !this.master || !this.noiseBuffer) return
    const ctx = this.ctx
    const t0 = ctx.currentTime
    const source = ctx.createBufferSource()
    source.buffer = this.noiseBuffer
    source.loop = true

    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.Q.value = 0.85
    filter.frequency.setValueAtTime(220, t0)
    filter.frequency.exponentialRampToValueAtTime(5200, t0 + duration * 0.42)
    filter.frequency.exponentialRampToValueAtTime(260, t0 + duration)

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.0001, t0)
    gain.gain.exponentialRampToValueAtTime(0.16, t0 + duration * 0.35)
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration)

    source.connect(filter)
    filter.connect(gain)
    gain.connect(this.master)
    source.start(t0)
    source.stop(t0 + duration + 0.1)
  }

  playImpact(): void {
    if (!this._enabled) return
    this.tone(140, 32, 1.1, 'sine', 0.32, 0)
    this.tone(320, 48, 0.55, 'triangle', 0.1, 0.02)
    this.playNoiseBurst(0.5, 0.1)
  }

  playPulse(freq = 880): void {
    if (!this._enabled) return
    this.tone(freq, freq * 1.5, 0.22, 'sine', 0.035, 0)
  }

  private playNoiseBurst(duration: number, volume: number): void {
    if (!this.ctx || !this.master || !this.noiseBuffer) return
    const ctx = this.ctx
    const t0 = ctx.currentTime
    const source = ctx.createBufferSource()
    source.buffer = this.noiseBuffer

    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 900

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(volume, t0)
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration)

    source.connect(filter)
    filter.connect(gain)
    gain.connect(this.master)
    source.start(t0)
    source.stop(t0 + duration + 0.05)
  }
}

export const audioEngine = new AudioEngine()
