import { Easing } from "react-native";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import Details from "../screens/Details";
import { ConstantsRoutes } from "../../tropical-list/utils/constants";
import HomeScreen from "../screens/HomeScreen";


const { Screen, Navigator } = createSharedElementStackNavigator()

export default function RoutesTravelAnimatable() {
  return (
    <Navigator screenOptions={{
      headerShown: false
    }} >
      <Screen name={ConstantsRoutes.home} component={HomeScreen} />
      <Screen name={ConstantsRoutes.details} component={Details} options={({
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
        cardStyleInterpolator: ({ current: { progress } }) => ({
          cardStyle: {
            opacity: progress
          }
        })
      })} />
    </Navigator>
  )
}
