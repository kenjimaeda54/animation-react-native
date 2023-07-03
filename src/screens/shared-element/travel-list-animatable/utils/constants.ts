import { Dimensions } from "react-native"

export class IRoutesConstants {
  static home = "home"
  static details = "details"
}


const { width, } = Dimensions.get("screen")


export const spacing = 12
const reference = width * 0.68

export const spec = {
  itemWidth: reference,
  itemHeight: reference * 1.5,
  radius: 18,
  spacing,
  fullSize: reference + spacing * 2

}
