import { Fragment, useEffect, useRef, useState } from "react";
import { StyleSheet, View, Text, Animated } from "react-native";

interface ProgressIndicatorProps {
  steps: number
  step: number
  height: number
}

function ProgressIndicator({ step, steps, height }: ProgressIndicatorProps) {
  const [currentWidth, setCurrentWidth] = useState(0)
  const animatedValue = useRef(new Animated.Value(-1000)).current
  const reactive = useRef(new Animated.Value(-1000)).current


  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: reactive,
      duration: 300,
      useNativeDriver: true
    }).start()

  }, [])


  useEffect(() => {
    // - currentWidth + currentWidth * step /steps  para pegar o tamanho do tranlastex 
    reactive.setValue(-currentWidth + (currentWidth * step) / steps)

  }, [currentWidth, step])


  const handleWidthLayout = (value: number) => {
    setCurrentWidth(value)
  }

  return (
    <Fragment>
      <Text style={styles.progressText}> {step}/{steps} </Text>
      {/*on layout tem que ser na view do pai*/}
      <View


        onLayout={e => handleWidthLayout(e.nativeEvent.layout.width)} // IDEAL PRA PEGAR O TAMANHO INTERNO,https://reactnative.dev/docs/view 
        //DEPOIS QUE PEGARO TAMANHO SERA FIXO
        style={[styles.viewProgress, { height }]}
      >
        <Animated.View
          style={[styles.progress, { height, transform: [{ translateX: animatedValue }] }]} />
      </View>
    </Fragment>
  )
}


export default function StepAnimation() {
  const [currentStep, setCurrentStep] = useState(0);


  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep(previous => (previous + 1) % (10 + 1))
    }, 500)


    return () => clearInterval(timer)

  }, [])


  return (
    <View style={styles.container}>
      <ProgressIndicator height={10} steps={10} step={currentStep} />
    </View>
  )
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center", //para position absolute funcionar com rigth and left 0, não pode ter aligent itens center,
    //pois o align ira trabalhr no eixo horizontal e quero que meu absolute ocupe todo espaço disponivel com left 0 e right 0
    paddingHorizontal: 20,

  },
  viewProgress: {
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.1)",
    overflow: "hidden",
  },
  progress: {
    backgroundColor: "rgba(0,0,0,0.5)",
    position: "absolute",
    right: 0,
    left: 0,
    width: "100%"
  },
  progressText: {
    fontSize: 14,
    fontWeight: "500",
    width: "100%",
    textAlign: "left",
    marginBottom: 20,

  }
})


