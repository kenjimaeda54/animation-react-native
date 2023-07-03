import { RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { SafeAreaView } from "moti"
import { FlatList, Image, StyleSheet, Text, View } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { SharedElement } from "react-navigation-shared-element"
import { TravelList } from "../utils/types"
import * as Animatable from "react-native-animatable"

type ParamList = {
  DetailsScreen: {
    item: TravelList
  }
}

const zoomIn = {
  0: {
    opacity: 0,
    scale: 0,
  }, // 0% porcento,
  0.5: {
    opacity: 0.5,
    scale: 0.5,

  }, // 50% porcento
  1: {
    opacity: 1,
    scale: 1
  } // 100% porcernto
}


const DetailsScreen = () => {
  const { goBack
  } = useNavigation()
  const { params } = useRoute<RouteProp<ParamList, "DetailsScreen">>()
  const { top } = useSafeAreaInsets()

  if (params?.item === null) {
    return <Text>Não conseguiu enviar item</Text>
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => goBack()}>
          <Image resizeMode="contain" source={require("../../../../assets/back.png")} style={styles.backImg} />
        </TouchableOpacity>
      </View>
      {/*estilo que esta abaixo preciso refletir no sharedelement ou seja o absoluteFillObject e o  zIndex -1*/}
      <SharedElement id={`${params.item.key}.photo`} style={[StyleSheet.absoluteFillObject, { zIndex: -1 }]} >
        <Image
          style={[StyleSheet.absoluteFillObject]}
          source={{ uri: params.item.image }}
        />
      </SharedElement>
      <SharedElement style={[styles.locationText,]} id={`${params.item.key}.location`}>
        <Text style={[styles.locationText, { marginTop: top + 20 }]} >{params.item.location}</Text>
      </SharedElement>
      <View style={styles.viewActive}>
        <Text style={styles.textActivies}>Activities</Text>
        <FlatList
          data={[...Array(8).keys()]}
          keyExtractor={item => `${item}`}
          horizontal
          contentContainerStyle={{
            paddingHorizontal: 20,
          }}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <Animatable.View
              animation={zoomIn}
              duration={100}
              delay={400 * index + 800}
            >
              <Image source={{ uri: "https://conteudo.imguol.com.br/c/noticias/3b/2021/05/18/google-io-1621360834718_v2_900x506.png" }} style={styles.imgRender} />
              <Text style={styles.active} >Active {item}</Text>
            </Animatable.View>
          )}
        />
      </View>
    </SafeAreaView>
  )

}


const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  backImg: {
    width: 20,
    height: 20,
    tintColor: "#fff"
  },
  viewActive: {
    position: "absolute",
    bottom: 300,
  },
  textActivies: {
    fontSize: 25,
    fontWeight: "800",
    color: "#ffffff",
    marginVertical: 10,
    marginLeft: 20,
  },
  imgRender: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 10,
  },
  active: {
    fontSize: 17,
    fontWeight: "300",
    color: "#ffffff"
  },
  locationText: {
    fontSize: 30,
    color: "#ffffff",
    fontWeight: "800",
    position: "absolute",
    left: 10,
    width: 180,
    top: 30,
  },


})

DetailsScreen.sharedElements = (route: RouteProp<ParamList, "DetailsScreen">) => {
  const { params } = route

  return [{ id: `${params.item.key}.photo` }, { id: `${params.item.key}.location` }]

}

export default DetailsScreen
