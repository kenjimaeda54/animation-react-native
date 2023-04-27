import { SafeAreaView } from "react-native-safe-area-context";
import { MotiView } from "moti"
import { Image, StyleSheet, } from "react-native";
import { Easing } from "react-native-reanimated";


export default function CallAnimation() {
  return (
    <SafeAreaView style={styles.container}>
      {[...Array(10).keys()].map((index) =>
        <MotiView
          key={index}
          from={{
            opacity: 0.7,
            scale: 1,
          }}
          animate={{
            opacity: 0,
            scale: 3,
          }}
          transition={{
            loop: true,
            type: "timing",
            easing: Easing.out(Easing.ease),
            duration: 2000,
            delay: index * 50,
          }}
          style={styles.viewAnimated} />
      )}
      <Image resizeMode="contain" style={styles.imgPhone} source={require("../assets/phone.png")} />
    </SafeAreaView>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000"
  },
  imgPhone: {
    width: 120,
    height: 120,
    position: "absolute"

  },
  viewAnimated: {
    position: "absolute",
    height: 140,
    width: 140,
    borderRadius: 70,
    borderColor: '#EF5261',
    borderWidth: 55,
  }

})

