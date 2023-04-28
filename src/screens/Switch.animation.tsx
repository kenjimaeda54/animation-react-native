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
  const trackWidth = size * 2.3
  const trackHeight = size * 0.5
  const knobSize = size * 0.7



  return (
    <Pressable style={styles.container} {...rest} >
      <MotiView
        transition={transition}
        animate={{
          backgroundColor: isActive ? colors.active : colors.inactive
        }}
        style={{
          width: trackWidth,
          height: trackHeight,
          backgroundColor: colors.active,
          borderRadius: 10,
          justifyContent: "center",
          alignItems: "center"

        }}

      >
        <MotiView
          transition={transition}
          animate={{
            translateX: isActive ? trackWidth / 3 : -trackWidth / 3
          }}
          style={{
            width: size * 0.9,
            height: size * 0.9,
            backgroundColor: "#FFFFff",
            borderRadius: size * 0.9 / 2,
            justifyContent: "center",
            alignItems: "center"

          }}

        >
          <MotiView
            transition={transition}
            animate={{
              width: isActive ? 0 : knobSize
            }}
            style={{
              height: knobSize,
              width: knobSize,
              borderRadius: knobSize,
              borderWidth: 4,
              borderColor: "#000000"

            }}

          />
        </MotiView>
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
})
