import { MotiTranformProps, MotiTransitionProp, MotiView } from "moti";
import { Pressable, PressableProps, StyleSheet, View } from "react-native";
import { Easing } from "react-native-reanimated";


interface ISwitchAnimationProps extends PressableProps {
  size: number
  isActive: boolean

}


const colors = {
  active: "#2C2C2C",
  inactive: "#DCDCDC"

}

const transition: MotiTransitionProp = {
  type: "timing",
  duration: 800,
  easing: Easing.inOut(Easing.ease)

}


export default function SwitchAnimation({ size, isActive, ...rest }: ISwitchAnimationProps) {
  const trackWidth = size * 2.0
  const trackHeight = size * 0.5
  const knobSize = size * 0.7



  return (
    <Pressable style={styles.container} {...rest} >
      <MotiView
        transition={transition}
        animate={{
          backgroundColor: isActive ? colors.active : colors.inactive
        }}
        style={[styles.viewTrackAnimation, { width: trackWidth, height: trackHeight, borderRadius: size / 2 }]}

      />

      <MotiView
        transition={transition}
        animate={{
          translateX: isActive ? trackWidth / 3 : - trackWidth / 3
        }}
        style={[styles.button, { width: size, height: size, borderRadius: size / 2 }]}

      >

        <MotiView
          transition={transition}
          animate={{
            width: isActive ? 0 : knobSize
          }}
          style={{
            height: knobSize,
            width: knobSize,
            borderRadius: knobSize / 2,
            borderWidth: size * 0.1,
            borderColor: colors.active,

          }}

        />
      </MotiView>
    </Pressable>
  )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000"

  },
  viewTrackAnimation: {
    position: "absolute",
    backgroundColor: colors.active
  },
  button: {
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center"
  }
})
