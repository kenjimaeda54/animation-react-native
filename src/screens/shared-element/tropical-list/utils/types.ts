import { ImageSourcePropType } from "react-native";

export interface DataTropical {
  image: ImageSourcePropType
  title: string
  id: string
}

export interface SliderDataTropical {
  title: string
  color: string

}

export interface IRoutesCore {
  details: { item: DataTropical }
  home: undefined
}
