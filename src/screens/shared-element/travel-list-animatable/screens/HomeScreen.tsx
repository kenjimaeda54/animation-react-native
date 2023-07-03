import { Animated, Image, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { data } from "../utils/data";
import { TravelList } from "../utils/types"
import { spec } from "../utils/constants"
import { useRef } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { SharedElement } from "react-navigation-shared-element";



export default function HomeScreen() {
  const scrollX = useRef(new Animated.Value(0)).current
  const { navigate } = useNavigation()


  function renderItem({ item, index }: { item: TravelList, index: number }) {
    const inputRange = [
      (index - 1) * spec.fullSize,
      index * spec.fullSize,
      (index + 1) * spec.fullSize,
    ]

    const translateX = scrollX.interpolate({
      inputRange,
      outputRange: [spec.itemWidth - 170, 0, -spec.itemWidth], //sempre comparar a largura dele ou seja total da tela width com dimensions ou largura do compontente
      extrapolate: "clamp"
    })

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [1, 1.1, 1]
    })


    return (

      <TouchableOpacity activeOpacity={0.9} onPress={() => navigate("details", { item })} >
        <View style={styles.viewImg}>
          <SharedElement id={`${item.key}.photo`}>
            <Animated.Image source={{ uri: item.image }} style={[styles.img, { transform: [{ scale }] }]} />
          </SharedElement>
        </View>
        <SharedElement style={styles.locationText} id={`${item.key}.location`} >
          <Animated.Text style={[styles.locationText, { transform: [{ translateX }] }]}>{item.location}</Animated.Text>
        </SharedElement>
        <View style={styles.viewDays} >
          <Text style={styles.numberDays}>{item.numberOfDays}</Text>
          <Text style={styles.numberDays}>days</Text>
        </View>
      </TouchableOpacity>
    )

  }




  return (
    <SafeAreaView style={{ flex: 1 }}>

      <Animated.FlatList
        data={data}
        keyExtractor={item => item.key}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        renderItem={renderItem}
        snapToInterval={spec.spacing}
        decelerationRate="fast"
        bounces={false}
        showsHorizontalScrollIndicator={false}
        horizontal
      />

    </SafeAreaView>
  )

}


const styles = StyleSheet.create({
  viewImg: {
    marginHorizontal: spec.spacing,
    overflow: "hidden",
    borderRadius: 20,

  },
  img: {
    height: spec.itemHeight,
    width: spec.itemWidth,
    resizeMode: "cover",
    borderRadius: 20,
    overflow: "hidden",
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent: "space-between",
    position: "relative",
  },
  locationText: {
    fontSize: 30,
    color: "#ffffff",
    fontWeight: "800",
    position: "absolute",
    left: 20,
    width: 180,
    top: 30,
  },
  viewDays: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: "#B80F0A",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    left: 30,
    top: 350,
  },
  numberDays: {
    fontSize: 11,
    fontWeight: "300",
    color: "#ffffff"
  }
})
