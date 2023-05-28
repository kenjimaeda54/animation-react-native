import { useRef, useState } from 'react';
import { Animated, Text, Image, View, StyleSheet, Dimensions, ImageProps, ImageSourcePropType, ViewToken } from 'react-native';
const { width, height } = Dimensions.get('screen');

interface DataProps {
  key: string
  title: string
  description: string
  image: ImageSourcePropType
}

interface ViewSlider {
  viewableItems: ViewToken[];
  changed: ViewToken[];
}



// https://www.flaticon.com/packs/retro-wave
// inspiration: https://dribbble.com/shots/11164698-Onboarding-screens-animation
// https://twitter.com/mironcatalin/status/1321180191935373312

const bgs = ['#A5BBFF', '#DDBEFE', '#FF63ED', '#B98EFF'];
const data = [
  {
    "key": "3571572",
    "title": "Multi-lateral intermediate moratorium",
    "description": "I'll back up the multi-byte XSS matrix, that should feed the SCSI application!",
    "image": require("../assets/flamingo.png"),
  },
  {
    "key": "3571747",
    "title": "Automated radical data-warehouse",
    "description": "Use the optical SAS system, then you can navigate the auxiliary alarm!",
    "image": require("../assets/game-controller.png"),

  },
  {
    "key": "3571680",
    "title": "Inverse attitude-oriented system engine",
    "description": "The ADP array is down, compress the online sensor so we can input the HTTP panel!",
    "image": require("../assets/video-game.png")
  },
  {
    "key": "3571603",
    "title": "Monitored global data-warehouse",
    "description": "We need to program the open-source IB interface!",
    "image": require("../assets/sneaker.png")
  }
]

interface PropsScroll {
  scroolX: Animated.Value
}

const Indicator = ({ scroolX }: PropsScroll) => {


  return (<View style={styles.viewIndicator} >
    {data.map((it, index) => {
      const inputRange = [
        (index - 1) * width,
        index * width,
        (index + 1) * width,
      ]

      const opacity = scroolX.interpolate({
        inputRange,
        outputRange: [0.4, 1, 0.4],
        extrapolate: "clamp" //sem extrapolte estava so mostrado duas bolinahs se esse compotamento estranho acontecer e uma jogada
      })

      const scale = scroolX.interpolate({
        inputRange,
        outputRange: [.7, 1.4, .7],
        extrapolate: "clamp"
      })


      return (
        <Animated.View key={it.key} style={[styles.indicator, {
          opacity,
          transform: [{ scale }]
        }]} />
      )
    })}
  </View>)
}


const Background = ({ index }: { index: number }) => {
  return <View style={[StyleSheet.absoluteFillObject, { backgroundColor: bgs[index], zIndex: -3 }]} />
}

const YoloBackground = ({ scroolX }: PropsScroll) => {
  const yolo = Animated.modulo(
    Animated.divide(
      Animated.modulo(scroolX, width), new Animated.Value(width)
    ), 1
  ) //modulo nunca sera um valor negativo, dividi  para termos 1 ou 0,  a logica ai dentro é dividir scrollX mais a largura, pela largura
  // dai para não retornar negativo usamos modulo

  const rotate = yolo.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ["35deg", "0deg", "35deg"]
  })

  const translateX = yolo.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -height, 0]
  })


  return <Animated.View
    style={[styles.viewYolo, {
      transform: [
        {
          rotate: rotate
        },
        {
          translateX
        }
      ]
    }]}

  />


}




export default function IntrodutionCarousel() {
  const scrollX = useRef<Animated.Value>(new Animated.Value(0)).current
  const [currentIndex, setCurrentIndex] = useState(0)


  const handleIndex = useRef((info: ViewSlider) => {
    const infoIndex = info.viewableItems[0].index!
    setCurrentIndex(infoIndex)

  })

  function renderItem({ item }: { item: DataProps }) {
    return (
      <View style={styles.content}>
        <View style={styles.viewImg}>
          <Image source={item.image} style={styles.img} resizeMode="cover" />
        </View>
        <View style={styles.viewContentText}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    )
  }
  return (
    <View style={styles.container}>
      <Background index={currentIndex} />
      {/*a view precisa estar acima da flatlist*/}
      <YoloBackground scroolX={scrollX} />
      <Animated.FlatList
        data={data}
        keyExtractor={(item) => item.key}
        renderItem={renderItem}
        horizontal
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={handleIndex.current}
        scrollEventThrottle={16}
        pagingEnabled
      />
      <Indicator scroolX={scrollX} />

    </View>

  )
}

//deixar a imagem cenralizada tanto vertivalmente e horizontal ira ajudar a fazer o efeito

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  content: {
    width,
    paddingHorizontal: 20,
  },
  viewImg: {
    flex: 0.60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 100,
  },
  viewContentText: {
    flex: 0.4,
    justifyContent: "flex-start",
    alignItems: "center",

  },
  img: {
    width: 120,
    height: 120,
  },
  title: {
    fontWeight: "600",
    fontSize: 20,
    paddingBottom: 20,
    color: "white"

  },
  description: {
    fontWeight: "400",
    fontSize: 13,
    color: "white"


  },
  viewIndicator: {
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: "center",
    marginBottom: 120,

  },
  indicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 10,
    backgroundColor: "white"

  },
  viewYolo: {
    width,
    height,
    position: "absolute",
    top: -height * 0.48,
    backgroundColor: "white",
    borderRadius: 86,
  }
})
