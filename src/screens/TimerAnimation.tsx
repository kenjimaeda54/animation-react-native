import { print } from "@gorhom/bottom-sheet/lib/typescript/utilities/logger";
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
  const scroolX = useRef(new Animated.Value(0)).current
  const timerBackground = useRef(new Animated.Value(height)).current
  const timerAnimatedInput = useRef(new Animated.Value(timers[0])).current
  const [currentDuration, setCurrentDuration] = useState(timers[0])
  const buttonAnimation = useRef(new Animated.Value(0)).current
  const refInput = useRef<TextInput>(null)


  useEffect(() => {

    //value do addListener e o valor contido no calback das animações, nesse caso e o timing 
    const listenerInput = timerAnimatedInput.addListener(({ value }) => {
      refInput.current?.setNativeProps({
        text: Math.ceil(value).toString()
      })

    })

    return () => {
      timerAnimatedInput.removeListener(listenerInput)
    }

  })



  function renderItem({ item, index }: { item: number, index: number }) {

    const inputRange = [
      (index - 1) * itemSize,
      itemSize * index,  // cuidado e vezes o valor do meio não pode ser menor que os outros dois nesse casso
      // porque a logica e anterior,atual e proximo se não ira acusar erro de non decrase 
      (index + 1) * itemSize

    ]

    const opacity = scroolX.interpolate({
      inputRange,
      outputRange: [.45, 1, .45]
    })

    const scale = scroolX.interpolate({
      inputRange,
      outputRange: [.75, 1, .75]
    })



    return (
      <View style={{ width: itemSize, justifyContent: "center", alignItems: "center" }}>
        <Animated.Text style={[styles.textItem, {
          opacity,
          transform: [{ scale }]
        }]} >{item}</Animated.Text>
      </View>
    )
  }

  function handleMomentScroll(index: number) {
    setCurrentDuration(timers[index])
  }


  const pressAnimated = useCallback(() => {
    timerAnimatedInput.setValue(currentDuration)
    Animated.sequence([

      Animated.timing(buttonAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }), // aqui vai interferi no interpolation [0,1] // por isso comecei em 1 , para que a opacidade seja 0 quando inicar a contagem, 

      Animated.timing(timerBackground, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }),

      Animated.parallel([

        Animated.timing(timerAnimatedInput, {
          toValue: 0,
          duration: currentDuration * 1000,
          useNativeDriver: true
        }),

        Animated.timing(timerBackground, {
          toValue: height,
          duration: currentDuration * 1000,
          useNativeDriver: true
        })


      ]),

      Animated.delay(400)

    ]).start(() => {
      Vibration.cancel()
      Vibration.vibrate()
      timerAnimatedInput.setValue(currentDuration)
      Animated.timing(buttonAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }).start()

    })

  }, [currentDuration]) // não esquece de passar o duration no useCalback, conforme o valor e atualizado no onMomentumScrollEnd essa função sera chamada


  const opacityButton = buttonAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  })

  const translateYButton = buttonAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200]

  })

  const textInputOpacity = buttonAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1]
  })




  return (
    <View style={{ flex: 1, backgroundColor: colors.black }}>
      <Animated.View
        style={[styles.containerOverlay, { transform: [{ translateY: timerBackground }] }]} // para determinar altura dinamicamente com animação usamos sempre translateY, não height
      />
      <Animated.View style={[styles.btnView, { opacity: opacityButton, transform: [{ translateY: translateYButton }] }]}>
        <TouchableOpacity onPress={pressAnimated}>
          <View style={styles.btn} />
        </TouchableOpacity>
      </Animated.View>
      {/*a view force e para lainhar no centro*/}
      <Animated.View style={styles.forceFlatlist}>
        {/*a view que vai ficar em cima da outra precisa estar envoldia pelo pai que força a flatlist*/}
        <Animated.View style={[styles.viewTextInput, { opacity: textInputOpacity }]}>
          <TextInput style={styles.textItem} ref={refInput} defaultValue={currentDuration.toString()} />
        </Animated.View>
        <Animated.FlatList
          data={timers}
          horizontal
          contentContainerStyle={{
            paddingHorizontal: itemSpacing
          }}
          bounces={false}
          pagingEnabled
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scroolX } } }],
            { useNativeDriver: true }
          )}
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={e => handleMomentScroll(Math.round(e.nativeEvent.contentOffset.x / itemSize))}
          snapToInterval={itemSize}
          style={{ opacity: opacityButton }}
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
  viewTextInput: {
    position: "absolute",
    width: itemSize,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
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
