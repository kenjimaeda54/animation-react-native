import { useRef } from "react";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Dimensions, Animated, View, Image, StyleSheet } from "react-native"
import { Text } from "moti";

const { width, height } = Dimensions.get("window")

const itemWidth = width
const itemHeight = height * 0.70

const sizeDot = 8;
const spacingDot = 8;

const sizeOverlay = sizeDot + spacingDot


const images = [
  'https://static.zara.net/photos///2020/I/1/1/p/6543/610/091/2/w/2460/6543610091_1_1_1.jpg?ts=1606727905128',
  'https://static.zara.net/photos///2020/I/1/1/p/6543/610/091/2/w/2460/6543610091_2_1_1.jpg?ts=1606727908993',
  'https://static.zara.net/photos///2020/I/1/1/p/6543/610/091/2/w/2460/6543610091_2_2_1.jpg?ts=1606727889015',
  'https://static.zara.net/photos///2020/I/1/1/p/6543/610/091/2/w/2460/6543610091_2_3_1.jpg?ts=1606727896369',
  'https://static.zara.net/photos///2020/I/1/1/p/6543/610/091/2/w/2460/6543610091_2_4_1.jpg?ts=1606727898445',
];

const product = {
  title: 'SOFT MINI CROSSBODY BAG WITH KISS LOCK',
  description: [
    'Mini crossbody bag available in various colours. Featuring two compartments. Handles and detachable crossbody shoulder strap. Lined interior. Clasp with two metal pieces.',
    'Height x Length x Width: 14 x 21.5 x 4.5 cm. / 5.5 x 8.4 x 1.7"'
  ],
  price: '29.99£'
}

export default function ButtonSheetWithPagination() {
  const scrollYRef = useRef(new Animated.Value(0)).current;

  function handleItem({ item }: { item: string }) {
    return <Image source={{ uri: item }} resizeMode="cover" style={styles.image} />
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: itemHeight, position: "relative" }} >
        <Animated.FlatList
          data={images}
          renderItem={handleItem}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollYRef } } }],
            { useNativeDriver: true }
          )}
          snapToInterval={itemHeight} //intervalo que a imagem vai parar e ideal colocar o uso do decelarationRate
          bounces={false} // quando chegar no final não ira fazer o efeito de arrastar
          decelerationRate="fast"
          showsVerticalScrollIndicator={false}
        />
      </View>
      <View style={styles.pagination}>
        {images.map((_, index) =>
          <View key={index} style={styles.dot} />
        )}
        {/*dica a view precisa estar dentro da paginação para encaixar perfieto*/}
        <Animated.View style={[styles.overlay, {
          transform: [{
            translateY: Animated.divide(scrollYRef, itemHeight).interpolate({
              inputRange: [0, 1],
              outputRange: [0, sizeOverlay + 8]
            })
          }]
        }]} />
      </View>
      <BottomSheet
        index={0}
        snapPoints={[height - itemHeight, height]}
      >
        <BottomSheetScrollView contentContainerStyle={{
          paddingHorizontal: 30,
          paddingVertical: 35,
        }} style={{ backgroundColor: "white" }}>
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.title}>{product.price}</Text>
          {product.description.map((it, index) => <Text key={index} style={styles.description}>{it}</Text>)}
          {product.description.map((it, index) => <Text key={index} style={styles.description}>{it}</Text>)}
          {product.description.map((it, index) => <Text key={index} style={styles.description}>{it}</Text>)}
          {product.description.map((it, index) => <Text key={index} style={styles.description}>{it}</Text>)}
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  )
}

const styles = StyleSheet.create({
  image: {
    width: itemWidth,
    height: itemHeight
  },
  pagination: {
    position: "absolute",
    top: itemHeight / 2,
    left: 20,
  },
  dot: {
    height: sizeDot,
    width: sizeDot,
    borderRadius: sizeDot / 2,
    backgroundColor: "#353839",
    marginVertical: spacingDot,
  },
  overlay: {
    width: sizeOverlay,
    height: sizeOverlay,
    borderRadius: sizeOverlay / 2,
    borderWidth: 1,
    borderColor: "#414a4c",
    position: "absolute",
    top: -sizeDot / 2 + spacingDot,
    left: -sizeDot / 2,
  },
  title: {
    fontWeight: "bold",
    fontSize: 17
  },
  description: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "400"
  }
})

