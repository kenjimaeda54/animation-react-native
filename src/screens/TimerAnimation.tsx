import { useCallback, useEffect, useRef, useState } from "react";
import { Dimensions, Animated, Text, TouchableOpacity, StyleSheet, View, FlatList, Vibration } from "react-native"
import { TextInput } from "react-native-gesture-handler";


const { width, height } = Dimensions.get("window")

const timers = [...Array(13).keys()].map((i) => (i === 0 ? 1 : i * 5));
const itemSize = width * 0.38
const itemSpacing = (width - itemSize) / 2

const colors = {
  black: '#323F4E',
  red: '#F76A6A',
  text: '#ffffff',
};

export default function TimerAnimation() {
  const scrollX = useRef(new Animated.Value(0)).current
  const [currentDuration, setCurrentDuration] = useState(timers[0])
  const inputRef = useRef<TextInput>(null)
  const timerAnimationRef = useRef(new Animated.Value(height)).current;
  const inputTimerAnimation = useRef(new Animated.Value(timers[0])).current;
  const buttonAnimated = useRef(new Animated.Value(0)).current;


  useEffect(() => {
    const listenInput = inputTimerAnimation.addListener(({ value }) => {
      inputRef?.current?.setNativeProps({
        text: Math.ceil(value).toString()
      })
    })

    return () => {
      textInputAnimated.removeListener(listenInput);
    }

  })


  const animatedBackground = useCallback(() => {
    inputTimerAnimation.setValue(currentDuration)
    Animated.sequence(
      [

        Animated.timing(buttonAnimated, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true
        }), // aqui vai interferi no interpolation [0,1] // por isso comecei em 1 , para que a opacidade seja 0 quando inicar a contagem, 


        Animated.timing(timerAnimationRef, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true
        }),


        Animated.parallel([

          Animated.timing(inputTimerAnimation, {
            toValue: 0,
            duration: currentDuration * 1000,
            useNativeDriver: true
          }),


          Animated.timing(timerAnimationRef, {
            toValue: height,
            duration: currentDuration * 1000,
            useNativeDriver: true
          })

        ]),

        Animated.delay(400)
      ]).start(() => {
        Vibration.cancel()
        Vibration.vibrate()
        inputTimerAnimation.setValue(currentDuration)
        Animated.timing(buttonAnimated, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true
        }).start()

      })

  }, [currentDuration])

  function renderItem({ item, index }: { item: number, index: number }) {
    const inputRange = [
      (index - 1) * itemSize,
      itemSize * index, // cuidado e vezes o valor do meio não pode ser menor que os outros dois nesse casso
      // porque a logica e anterior,atual e proximo se não ira acusar erro de non decrase 
      (index + 1) * itemSize
    ]


    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [.4, 1, .4]
    })

    // inputRange trabalha em conjunto com outputRange ou seja nesse caso quando a tela estiver visivel sera 0 e não visivel 90de
    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [.70, 1, .70]
    })


    return (
      <View style={{ width: itemSize, justifyContent: "center", alignItems: "center" }}>
        <Animated.Text style={[styles.textItem, {
          transform: [{ scale }],
          opacity,
        }]} >{item}</Animated.Text>
      </View>
    )
  }

  function handleMomentScrool(index: number) {
    setCurrentDuration(timers[index])
  }

  const buttonOpacityAnimated = buttonAnimated.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0]
  })

  const buttonTranslateAnimate = buttonAnimated.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200]
  })

  const textInputAnimated = buttonAnimated.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1]
  })



  return (
    <View style={{ flex: 1, backgroundColor: colors.black }}>
      <Animated.View
        style={[styles.containerOverlay, {
          transform: [{ translateY: timerAnimationRef }] // para determinar altura dinamicamente com animação usamos sempre translateY, não height
        }]}
      />
      <Animated.View style={[styles.btnView, {
        opacity: buttonOpacityAnimated,
        transform: [{ translateY: buttonTranslateAnimate }]
      }]}>
        <TouchableOpacity onPress={animatedBackground}>
          <View style={styles.btn} />
        </TouchableOpacity>
      </Animated.View>
      {/*a view force e para lainhar no centro*/}
      <Animated.View style={styles.forceFlatlist}>
        {/*a view que vai ficar em cima da outra precisa estar envoldia pelo pai que forcça a flatlist*/}
        <Animated.View style={{ position: "absolute", width: itemSize, alignSelf: "center", justifyContent: "center", alignItems: "center", opacity: textInputAnimated }}>
          <TextInput ref={inputRef} defaultValue={currentDuration.toString()} style={styles.textItem} />
        </Animated.View>
        <Animated.FlatList
          data={timers}
          horizontal
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true }
          )}
          contentContainerStyle={{
            paddingHorizontal: itemSpacing
          }}
          bounces={false}
          pagingEnabled
          style={{ opacity: buttonOpacityAnimated }}
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={e => handleMomentScrool(Math.round(e.nativeEvent.contentOffset.x / itemSize))}
          snapToInterval={itemSize}
          decelerationRate="fast"
          keyExtractor={(_, index) => `${index}`}
          renderItem={renderItem}
        />
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  btnView: {
    position: "absolute",
    bottom: 0,
    paddingBottom: 100,
    width: width,
    alignItems: "center",
  },
  containerOverlay: {
    height,
    position: "absolute",
    backgroundColor: colors.red,
    width,

  },
  forceFlatlist: {
    flex: 1,
    position: "absolute",
    top: height / 3,
    left: 0,
    right: 0,
  },
  btn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.red
  },
  textItem: {
    fontSize: itemSize * 0.6,
    fontWeight: "900",
    color: colors.text,
  }
})
