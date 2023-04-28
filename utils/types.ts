

export interface IPexelApi {
  photos: Photos[]
}

export type Photos = {
  id: number
  url: number
  src: Source
}

type Source = {
  original: string
  large2x: string
  portrait: string
}
