import { IRoutesCore } from "../utils//types"


declare global {
  namespace ReactNavigation {
    interface RootParamList extends IRoutesCore { }
  }
}
