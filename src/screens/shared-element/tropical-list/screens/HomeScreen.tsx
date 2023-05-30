import { useNavigation } from "@react-navigation/native";
import { Text, View, FlatList, TouchableOpacity, StyleSheet, Image, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SharedElement } from "react-navigation-shared-element";
import { dataTropical, sliderData } from "../utils/data";
import { DataTropical, SliderDataTropical } from "../utils/types";


const { width } = Dimensions.get("screen")

const renderItem = ({ item }: { item: SliderDataTropical }) => {
  return (
    <View style={[styles.viewRenderItem, { backgroundColor: item.color }]}>
      <Text style={styles.text}>{item.title}</Text>
    </View>
  )

}



export function HomeScreen() {
  const { top } = useSafeAreaInsets()
  const { navigate } = useNavigation()


  const handleNavigation = (item: DataTropical) => navigate("details", { item })

  return (
    <View style={[styles.container, { paddingVertical: top + 20, }]}>
      <FlatList
        data={sliderData}
        horizontal
        contentContainerStyle={{
          paddingHorizontal: 20,
        }}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => `${index}`}
        renderItem={renderItem}
      />
      <View style={styles.contentImg}>
        {dataTropical.map(it =>
          <SharedElement key={it.id} id={`${it.id}.photo`} >
            <TouchableOpacity onPress={() => handleNavigation(it)} style={styles.imgView}>
              <Image source={it.image} style={styles.img} />
            </TouchableOpacity>
          </SharedElement>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  viewRenderItem: {
    borderRadius: 7,
    marginRight: 30,
    height: 100,
    width: 180,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  text: {
    fontWeight: "700",
    fontSize: 20,
    color: "white"
  },
  contentImg: {
    paddingHorizontal: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",

  },
  imgView: {
    width: width * 0.17,
    height: width * 0.17,
    borderRadius: width * 0.17,
    backgroundColor: "#d3d3d3",
    marginHorizontal: width * 0.05,
    marginVertical: width * 0.05,
    justifyContent: "center",
    alignItems: "center"
  },
  img: {
    width: 33,
    height: 33,
  }

})
