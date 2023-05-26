import { Text } from "moti";
import { useRef } from "react";
import { Dimensions, Image, Animated, StyleSheet, View } from "react-native";


interface DataProps {
  key: string
  photo: string
  avatar_url: string
}

const { width, height } = Dimensions.get('screen');
const itemWidth = width * 0.76;
const itemHeigth = itemWidth * 1.47;

const images = [
  'https://images.unsplash.com/photo-1551316679-9c6ae9dec224?w=800&q=80',
  'https://images.unsplash.com/photo-1562569633-622303bafef5?w=800&q=80',
  'https://images.unsplash.com/photo-1503656142023-618e7d1f435a?w=800&q=80',
  'https://images.unsplash.com/photo-1555096462-c1c5eb4e4d64?w=800&q=80',
  'https://images.unsplash.com/photo-1517957754642-2870518e16f8?w=800&q=80',
  'https://images.unsplash.com/photo-1546484959-f9a381d1330d?w=800&q=80',
  'https://images.unsplash.com/photo-1548761208-b7896a6ff225?w=800&q=80',
  'https://images.unsplash.com/photo-1511208687438-2c5a5abb810c?w=800&q=80',
  'https://images.unsplash.com/photo-1548614606-52b4451f994b?w=800&q=80',
  'https://images.unsplash.com/photo-1548600916-dc8492f8e845?w=800&q=80',
];
const data: DataProps[] = images.map((image, index) => ({
  key: String(index),
  photo: image,
  avatar_url: `https://randomuser.me/api/portraits/women/${Math.floor(
    Math.random() * 40
  )}.jpg`,
}));

export default function ParalaxCarousel() {
  const scrollX = useRef(new Animated.Value(0)).current


  function renderItem({ item, index }: { item: DataProps, index: number }) {
    const inputRange = [
      (index - 1) * width,
      width * index,
      (index + 1) * width,
    ]

    const translateX = scrollX.interpolate({
      inputRange,
      outputRange: [- width * 0.75, 0, width * 0.75]
    })

    return (
      <View style={styles.content}>
        {/*view abaixo e para fazer a borda ja que o hiden do overflow não deixa*/}
        <View style={styles.viewWithBorder}>
          {/*view abaixo e para ajudar no paralax*/}
          <View style={styles.viewParalax}  >
            <Animated.Image source={{ uri: item.photo }} style={[styles.image, { transform: [{ translateX }] }]} resizeMode="cover" />
          </View>
          <Image style={styles.imageAvatar} source={{ uri: item.avatar_url }} />
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Animated.FlatList
        data={data}
        keyExtractor={item => item.key}
        renderItem={renderItem}
        horizontal
        bounces={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        showsHorizontalScrollIndicator={false}
        pagingEnabled
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    width,
    height,
    justifyContent: "center",
    alignItems: "center"
  },
  image: {
    width: itemWidth * 1.4, //imagem precisa ser maior que a view
    height: itemHeigth,
  },
  viewParalax: {
    width: itemWidth,
    alignItems: "center",
    height: itemHeigth,
    overflow: "hidden", //com esse overflow hiden a imagem não estrapalo o continare
    borderRadius: 13,
  },
  imageAvatar: {
    width: 60,
    position: "absolute",
    height: 60,
    bottom: -30,
    right: 50,
    borderRadius: 60,
    borderColor: "white",
    borderWidth: 6,
  },
  viewWithBorder: {
    borderRadius: 15,
    borderColor: "white",
    borderWidth: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 11,
    },
    shadowOpacity: 0.55,
    shadowRadius: 14.78,
    elevation: 22,
  }
})
