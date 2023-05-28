import { createSharedElementStackNavigator } from "react-navigation-shared-element"
import { Details } from "../screens/DetailsScreen"
import { HomeScreen } from "../screens/HomeScreen"
import { ConstantsRoutes } from "../utils/constants"


const { Screen, Navigator } = createSharedElementStackNavigator()


export default function RoutesTropical() {


  return (
    <Navigator screenOptions={{
      headerShown: false
    }}>

      <Screen name={ConstantsRoutes.details} component={Details} />
      <Screen name={ConstantsRoutes.home} component={HomeScreen} />
    </Navigator>
  )
}
