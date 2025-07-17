declare module 'components/lib/three/loaders/FontLoader' {
  import { Loader } from 'three'
  export class FontLoader extends Loader {
    load(
      url: string,
      onLoad: (font: any) => void,
      onProgress?: (event: ProgressEvent) => void,
      onError?: (event: ErrorEvent) => void
    ): void

    parse(json: any): any
  }
}

declare module 'components/lib/three/geometries/TextGeometry' {
  import { ExtrudeGeometryOptions, BufferGeometry } from 'three'
  export class TextGeometry extends BufferGeometry {
    constructor(
      text: string,
      parameters: ExtrudeGeometryOptions & { font: any }
    )
  }
}
