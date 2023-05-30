import { Easing } from "react-native"
import { createSharedElementStackNavigator } from "react-navigation-shared-element"
import DetailsScreen from "../screens/DetailsScreen"
import { HomeScreen } from "../screens/HomeScreen"
import { ConstantsRoutes } from "../utils/constants"


const { Screen, Navigator } = createSharedElementStackNavigator()


export default function RoutesTropical() {


  return (
    <Navigator screenOptions={{
      headerShown: false
    }}>
      <Screen name={ConstantsRoutes.home} component={HomeScreen} />
      <Screen name={ConstantsRoutes.details} component={DetailsScreen} options={() => ({
        gestureEnabled: false,
        transitionSpec: {
          open: {
            animation: "timing", config: {
              duration: 500,
              easing: Easing.inOut(Easing.ease)
            }
          },
          close: {
            animation: "timing", config: {
              duration: 500,
              easing: Easing.inOut(Easing.ease)
            }
          }

        },
        cardStyleInterpolator: ({ current: { progress } }) => {
          return {
            cardStyle: {
              opacity: progress
            }
          }
        }

      })} />
    </Navigator>
  )
}
