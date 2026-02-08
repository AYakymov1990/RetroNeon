let uiSoundEnabled = true

let audioContext: AudioContext | null = null

export function setUiSoundEnabled(isEnabled: boolean) {
  uiSoundEnabled = isEnabled
}

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') {
    return null
  }

  if (!audioContext) {
    const AudioContextClass = window.AudioContext
    if (!AudioContextClass) {
      return null
    }

    audioContext = new AudioContextClass()
  }

  return audioContext
}

export function playUiClick() {
  if (!uiSoundEnabled) {
    return
  }

  const ctx = getAudioContext()
  if (!ctx) {
    return
  }

  if (ctx.state === 'suspended') {
    void ctx.resume()
  }

  const oscillator = ctx.createOscillator()
  const gainNode = ctx.createGain()

  oscillator.type = 'triangle'
  oscillator.frequency.setValueAtTime(980, ctx.currentTime)
  oscillator.frequency.exponentialRampToValueAtTime(620, ctx.currentTime + 0.04)

  gainNode.gain.setValueAtTime(0.0001, ctx.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime + 0.01)
  gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05)

  oscillator.connect(gainNode)
  gainNode.connect(ctx.destination)

  oscillator.start()
  oscillator.stop(ctx.currentTime + 0.055)
}
