import { faker } from "@faker-js/faker";
import { useRef, useState } from "react";
import { Dimensions, Image, Animated, View, StyleSheet, Text, TouchableOpacity, ViewToken } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context"


const { width, height } = Dimensions.get("window")

const imageWidth = width * 0.65
const imageHeight = imageWidth * 0.7

interface ViewSlider {
  viewableItems: ViewToken[];
  changed: ViewToken[];
}


const images = [
  'https://images.pexels.com/photos/1799912/pexels-photo-1799912.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  'https://images.pexels.com/photos/1769524/pexels-photo-1769524.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  'https://images.pexels.com/photos/1758101/pexels-photo-1758101.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  'https://images.pexels.com/photos/1738434/pexels-photo-1738434.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  'https://images.pexels.com/photos/1698394/pexels-photo-1698394.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  'https://images.pexels.com/photos/1684429/pexels-photo-1684429.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  'https://images.pexels.com/photos/1690351/pexels-photo-1690351.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  'https://images.pexels.com/photos/1668211/pexels-photo-1668211.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  'https://images.pexels.com/photos/1647372/pexels-photo-1647372.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  'https://images.pexels.com/photos/1616164/pexels-photo-1616164.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  'https://images.pexels.com/photos/1799901/pexels-photo-1799901.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  'https://images.pexels.com/photos/1789968/pexels-photo-1789968.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  'https://images.pexels.com/photos/1774301/pexels-photo-1774301.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  'https://images.pexels.com/photos/1734364/pexels-photo-1734364.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  'https://images.pexels.com/photos/1724888/pexels-photo-1724888.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
]

const content = [...Array(images.length).keys()].map((_, index) => {
  return {
    key: faker.datatype.uuid(),
    image: images[index],
    title: faker.commerce.productName(),
    subTitle: faker.company.bs(),
    price: faker.finance.amount(80, 200, 0)
  }
})


export default function FlatlistCarousel3d() {
  const { top } = useSafeAreaInsets()
  const scrollX = useRef(new Animated.Value(0)).current
  const refList = useRef<FlatList>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const rotateAnimated = Animated.modulo(Animated.divide(scrollX, width), width)
  // com modulo eu não vou ter um valor negativo e com divide, 
  // vou didivir animação de acordo com scrollX ou seja quando estiver na metade da tela irei girar a view

  function renderItem({ item, index }: { item: string, index: number }) {
    const inputRange = [
      (index - 1) * width, // anterior
      width * index, //atual
      (index + 1) * width, //proxima

    ]

    const translateY = scrollX.interpolate({
      inputRange,
      outputRange: [50, 0, 20]
    })

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0, 1, 0.5]
    })


    return (
      <Animated.View style={[styles.contentItem, { paddingTop: top + 20, width, height, opacity, transform: [{ translateY }] }]} >
        <Animated.Image
          source={{ uri: item }}
          style={{ width: imageWidth, height: imageHeight }}
        />
      </Animated.View>
    )

  }


  const handleIndex = useRef((info: ViewSlider) => {
    const infoIndex = info.viewableItems[0].index!
    setCurrentIndex(infoIndex)
  })

  function handleNextSlider() {
    refList.current?.scrollToOffset({
      offset: (currentIndex + 1) * width,
      animated: true
    })
  }

  function handlePreviousSlider() {
    refList.current?.scrollToOffset({
      offset: (currentIndex - 1) * width,
      animated: true
    })

  }

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={refList}
        data={images}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        contentContainerStyle={{
          height: 100,
        }}
        pagingEnabled
        horizontal
        style={{ zIndex: 9999 }} // segredo para perspective não ficar cortanto no meio quando rodar
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={handleIndex.current}
        keyExtractor={(_, index) => `${index}`}
        renderItem={renderItem}
      />

      {/*precisa de uma view em volta como container, pois e ela que sera 9999 para evitar o percepecitv*/}
      <View style={[styles.content, { zIndex: 99 }]}>
        {content.map((it, index) => {
          //vai ser mais rapido pois coloquei 0.4 basciamente e 40 por cento antes da tela aparecer
          const inputRange = [
            (index - 0.4) * width, // anterior
            width * index, //atual
            (index + 0.4) * width, //proxima

          ]

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0, 1, 0]
          })

          // inputRange trabalha em conjunto com outputRange ou seja nesse caso quando a tela estiver visivel sera 0 e não visivel 90de
          const rotate = scrollX.interpolate({
            inputRange,
            outputRange: ["45deg", "0deg", "90deg"]
          })


          return (
            <Animated.View
              key={it.key}
              style={{
                position: "absolute",
                opacity,
                transform: [{
                  perspective: imageWidth * 4
                },
                { rotateY: rotate }

                ],
                top: imageHeight - 350, left: 25,
              }}>
              <Text style={styles.title} >{it.title.toUpperCase()} </Text>
              <Text style={styles.subTitle}  >{it.subTitle} </Text>
              <Text style={styles.price}   >{it.price} USD </Text>
            </Animated.View>
          )
        })}
      </View>
      <Animated.View style={[styles.backgroundView, {
        width: imageWidth + 25, height: imageHeight + 170, top: imageHeight - 80,
        transform: [
          { perspective: imageWidth * 4 }, // ideia e usar para permitir a scala em z, com ele a imagem ira girar 
          //https://medium.com/swlh/the-heart-of-react-native-transform-e0f4995ebdb6
          {
            rotateY: rotateAnimated.interpolate({
              inputRange: [0, 0.5, 1], // casso der erro que não pode ser valor negativo mudar para 1
              outputRange: ["0deg", "90deg", "180deg"]
            })
          }
        ]
      }]} />
      <View style={[styles.footer, { width: imageWidth + 60 }]} >
        <TouchableOpacity disabled={currentIndex === 0} onPress={handlePreviousSlider} style={[styles.button, {
          opacity: currentIndex === 0 ? 0.5 : 1,
        }]}>
          <Image source={require("../assets/back.png")} resizeMode="contain" style={styles.imgBack} />
          <Text style={styles.textButton} >Previous </Text>
        </TouchableOpacity>
        <TouchableOpacity disabled={currentIndex === content.length} onPress={handleNextSlider} style={[styles.button, {
          opacity: currentIndex === content.length - 1 ? 0.5 : 1
        }]}>
          <Text style={styles.textButton}   >Next </Text>
          <Image source={require("../assets/next.png")} resizeMode="contain" style={styles.imgBack} />
        </TouchableOpacity>
      </View>
    </View>
  )

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#A5F1FA",
  },
  contentItem: {
    paddingHorizontal: 30,
    position: "relative"
  },
  content: {
    marginLeft: 17,
    width: 240,
  },
  backgroundView: {
    position: "absolute",
    backgroundColor: "white",
    backfaceVisibility: "visible", //https://reactnative-examples.com/backfacevisibility-on-view-in-react-native/
    marginLeft: 17,
    zIndex: -1,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 24,
    shadowOffset: {
      height: 0,
      width: 0,
    }

  },
  title: {
    fontSize: 17,
    fontWeight: "600",
  },
  subTitle: {
    fontSize: 13,
    fontWeight: "400",
    opacity: 0.5,

  },
  price: {
    fontSize: 30,
    fontWeight: "600",
    marginTop: 20,
  },
  footer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    alignItems: "flex-start"
  },
  row: {
    flexDirection: "row",
  },
  imgBack: {
    width: 20,
    height: 20
  },
  button: {
    flexDirection: "row",
    alignItems: "center"
  },
  textButton: {
    fontSize: 15,
    fontWeight: "bold",
    marginHorizontal: 10,
  }

})

