import { View } from "moti";
import { useRef, useState } from "react";
import { Dimensions, Image, StyleSheet, FlatList, ViewToken } from "react-native";

const { width, height } = Dimensions.get("window")

interface ViewSliderProps {
  viewableItems: ViewToken[];
  changed: ViewToken[];
}

const data = [
  'https://cdn.dribbble.com/users/3281732/screenshots/11192830/media/7690704fa8f0566d572a085637dd1eee.jpg?compress=1&resize=1200x1200',
  'https://cdn.dribbble.com/users/3281732/screenshots/13130602/media/592ccac0a949b39f058a297fd1faa38e.jpg?compress=1&resize=1200x1200',
  'https://cdn.dribbble.com/users/3281732/screenshots/9165292/media/ccbfbce040e1941972dbc6a378c35e98.jpg?compress=1&resize=1200x1200',
  'https://cdn.dribbble.com/users/3281732/screenshots/11205211/media/44c854b0a6e381340fbefe276e03e8e4.jpg?compress=1&resize=1200x1200',
  'https://cdn.dribbble.com/users/3281732/screenshots/7003560/media/48d5ac3503d204751a2890ba82cc42ad.jpg?compress=1&resize=1200x1200',
  'https://cdn.dribbble.com/users/3281732/screenshots/6727912/samji_illustrator.jpeg?compress=1&resize=1200x1200',
  'https://cdn.dribbble.com/users/3281732/screenshots/13661330/media/1d9d3cd01504fa3f5ae5016e5ec3a313.jpg?compress=1&resize=1200x1200'
] as Array<string>;

export default function FlalistCarouselAnimation() {
  const imageW = width * 0.7
  const imageH = imageW * 1.54
  const [currentIndex, setCurrentIndex] = useState(0)


  function renderImg({ item }: { item: string }) {
    return (
      <View style={[styles.content, {
        width,
        height,
        shadowColor: "#000",
        shadowOpacity: 1,
        shadowOffset: {
          width: 0,
          height: 0
        },
        shadowRadius: 20,


      }]} >
        <Image
          source={{ uri: item }}
          resizeMode="cover"
          style={{
            width: imageW,
            height: imageH,
            borderRadius: 15,
          }}
        />
      </View>
    )
  }

  // vai trazer um objeto contento imagem anteiror,proxima e a present
  const handleCurrentIndex = useRef((info: ViewSliderProps) => {
    const index = info.viewableItems[0].index!
    setCurrentIndex(index)
  })



  return (
    <View style={styles.container}>
      <Image
        source={{ uri: data[currentIndex] }}
        style={[StyleSheet.absoluteFillObject]}
        blurRadius={50}
      />
      <FlatList
        data={data}
        horizontal
        onViewableItemsChanged={handleCurrentIndex.current}
        pagingEnabled
        keyExtractor={(_, index) => `${index}`}
        renderItem={renderImg}

      />

    </View>
  )
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000"


  },
  content: {
    justifyContent: "center",
    alignItems: "center"

  }
})
