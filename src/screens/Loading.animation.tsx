import { SafeAreaView } from "react-native-safe-area-context";
import { MotiView } from "moti"
import { StyleSheet } from "react-native";


export default function LoadingAnimation() {
  return (
    <SafeAreaView style={styles.container}>
      <MotiView
        from={{
          width: 80, // se for dinamico e size 
          height: 80, // se for dinamico e size 
          borderRadius: 40, // se for dinamico size / 2
          borderWidth: 0,
          shadowOpacity: 0.5

        }}
        animate={{
          width: 100, // se for dinamico size + 20
          height: 100, //  se for dinamico size + 20
          borderRadius: 50, // se for dinamico (size + 20) / 2
          borderWidth: 10, // se for dinamico size / 10
          shadowOpacity: 1
        }}
        transition={{
          type: "timing",
          duration: 2000,
          loop: true

        }}
        style={styles.viewAnimation}
      />


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
  viewAnimation: {
    borderColor: "#ffffff",
    shadowColor: "#ffffff",
    shadowOffset: { height: -2, width: 0 },
    shadowRadius: 3,

  }

})

