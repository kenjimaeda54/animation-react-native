import { View } from "moti"
import { useEffect, useRef, useState } from "react"
import { Dimensions, FlatList, Image, TouchableOpacity, StyleSheet, Text } from "react-native"
import { apiKey } from "../../utils/key_api"
import { IPexelApi, Photos } from "../../utils/types"

const { width, height } = Dimensions.get("window")

const fetchApi = async () => {
  try {
    const response = await fetch(`https://api.pexels.com/v1/search?query=nature`, {
      headers: {
        "Authorization": apiKey,
        "Content-type": "application/json"
      }
    })
    const result = await response.json()
    return result
  } catch (error) {
    console.log(error)
  }
}

export default function FlatlistHorizontal() {
  const [images, setImages] = useState<Photos[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const topRef = useRef<FlatList>(null)
  const thumbNailRef = useRef<FlatList>(null)
  const heigthImageThumb = 60
  const widthImageThumb = 60
  const spacing = 5

  useEffect(() => {
    (async () => {
      const { photos } = await fetchApi() as IPexelApi
      setImages(photos)
    })()

  }, [])



  if (images.length === 0) {
    return <Text>Não tem</Text>
  }

  const renderItemImage = ({ item }: { item: Photos }) => {
    return (
      <Image
        source={{ uri: item.src.portrait }}
        resizeMode="cover"
        style={{
          width: width,
          height: height
        }}
      />
    )
  }


  //cuidado com views aqui quanto mais puro melhor pra fazer
  //TouchableOpacity e melhor para esse caso de uso sempre prefira ele
  const renderItemThumbNail = ({ item, index }: { item: Photos, index: number }) => {
    return (
      <TouchableOpacity style={{
        elevation: 17,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 7,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,

      }} onPress={() => handleScrool(index)}>
        <Image
          source={{ uri: item.src.portrait }}
          style={{
            width: widthImageThumb,
            height: heigthImageThumb,
            borderRadius: 7,
            backgroundColor: "black",
            marginHorizontal: spacing,
            borderWidth: 1,
            borderColor: index === activeIndex ? "#ffffff" : "transparent",

          }}
        />
      </TouchableOpacity>
    )
  }

  function handleScrool(index: number) {
    setActiveIndex(index)
    topRef.current?.scrollToOffset({
      offset: index * width,
      animated: true
    })

    // esse calculo e para saber se o thumbnail esta proximo do final da tela
    if (index * (widthImageThumb + spacing) - widthImageThumb / 2 > width / 2) {
      thumbNailRef.current?.scrollToOffset({
        offset: index * (widthImageThumb + spacing) - width / 2 + widthImageThumb / 2,  // vai fazer com que a imagem ande ate a metade do thumb
        animated: true

      })

    }


  }



  //segredo do thumbNail e o estilo dele ser absolute

  return (
    <View style={styles.container} >
      <FlatList
        ref={topRef}
        data={images}
        horizontal
        keyExtractor={item => `${item.id}`}
        pagingEnabled
        renderItem={renderItemImage}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={event => handleScrool(Math.floor(event.nativeEvent.contentOffset.x / width))} // quando finalizar o scroll
      />
      <FlatList
        ref={thumbNailRef}
        data={images}
        horizontal
        style={{
          position: "absolute",
          bottom: heigthImageThumb,
          paddingHorizontal: spacing,
        }}
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => `${item.id}`}
        renderItem={renderItemThumbNail}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  }
})



