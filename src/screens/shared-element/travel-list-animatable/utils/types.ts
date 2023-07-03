
export interface TravelList {
  key: string
  location: string
  numberOfDays: number
  image: string
  color: string
}

export interface IRoutesCore {
  details: { item: TravelList }
  home: undefined
}
