import { View } from "moti";
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { dataTropical } from "../utils/data";
import { DataTropical } from "../utils/types";


const { width } = Dimensions.get("screen")
const spacing = 20

const renderItem = ({ item }: { item: DataTropical, index: number }) => (
  <ScrollView bounces={false} showsVerticalScrollIndicator={false} style={styles.scrollTitle}>
    <View style={styles.viewText} >

      <Text style={styles.fillText}>{Array(50).fill(`${item.title} inner text \n`)}</Text>
    </View>
  </ScrollView>
)

export function Details() {
  const { top } = useSafeAreaInsets()

  return (
    <View style={[styles.container, { marginVertical: top + 20 }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
      >

        {dataTropical.map(it => (
          <View style={styles.contentImg} >
            <TouchableOpacity style={styles.viewImg}>
              <Image style={styles.img} resizeMode="center" source={it.image} />
            </TouchableOpacity>
            <Text style={styles.titleSlider}>{it.title}</Text>
          </View>
        ))}
      </ScrollView>
      <FlatList
        data={dataTropical}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        pagingEnabled
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index
        })}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingVertical: 20,
        }}
        horizontal
      />
    </View>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentImg: {
    alignItems: "center",
    paddingHorizontal: spacing - 5,
  },
  viewImg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
    backgroundColor: "#d3d3d3"
  },
  img: {
    width: 30,
    height: 30,
  },
  titleSlider: {
    fontSize: 12,
    color: "black",
    fontWeight: "300",
    marginVertical: 10,
    paddingRight: 20,

  },
  scrollTitle: {
    borderRadius: 15,
    width: width - spacing * 2, //2 e porque e lado esquerdo e direito
    marginHorizontal: spacing
  },
  viewText: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#d3d3d3",
  },
  fillText: {
    fontSize: 17,
    lineHeight: 23,
    fontWeight: "300",
    color: "black"
  }
}

)
