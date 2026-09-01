declare module 'three'

declare module 'vanta/dist/vanta.waves.min' {
  interface VantaEffect {
    destroy: () => void
    setOptions?: (options: Partial<VantaWavesOptions>) => void
  }

  interface VantaWavesOptions {
    el: HTMLElement
    THREE: unknown
    mouseControls?: boolean
    touchControls?: boolean
    gyroControls?: boolean
    minHeight?: number
    minWidth?: number
    scale?: number
    scaleMobile?: number
    color?: number
    shininess?: number
    waveHeight?: number
    waveSpeed?: number
    zoom?: number
  }

  export default function WAVES(options: VantaWavesOptions): VantaEffect
}
