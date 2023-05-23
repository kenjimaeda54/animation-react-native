import { faker } from "@faker-js/faker"
import { View } from "moti"
import { useRef } from "react"
import { Image, StyleSheet, Text, Animated } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"


interface IDataProps {
  key: string
  image: string
  name: string
  email: string
  jobTitle: string
}

const data = [...Array(30).keys()].map((_) => {
  return {
    key: faker.datatype.uuid(),
    image: `https://randomuser.me/api/portraits/${faker.helpers.arrayElement(['women', 'men'])}/${faker.datatype.number(60)}.jpg`,
    name: faker.name.fullName(),
    jobTitle: faker.name.jobTitle(),
    email: faker.internet.email()

  }
}) as IDataProps[]

const backgroundImg = "https://images.pexels.com/photos/1231265/pexels-photo-1231265.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"


export default function FlatlistVerticalItemAnimation() {
  const { top } = useSafeAreaInsets()
  const scroolY = useRef(new Animated.Value(0)).current
  const spacing = 20
  const avatarSize = 70
  const itemSize = avatarSize + spacing * 3


  function renderItem({ item, index }: { item: IDataProps, index: number }) {
    const inputRange = [
      -1, // não faz nada
      0, // não faz nada
      itemSize * index,   // começa 
      itemSize * (index + 2) // finaliza
    ]

    const opactiyInputRange = [
      -1,
      0,
      itemSize * index,
      itemSize * (index + 0.5)
    ]

    const scale = scroolY.interpolate({
      inputRange,
      outputRange: [1, 1, 1, 0]
    })



    const opacity = scroolY.interpolate({
      inputRange: opactiyInputRange,
      outputRange: [1, 1, 1, 0]
    })


    return (
      <Animated.View style={[styles.containerItem, { marginBottom: spacing, transform: [{ scale }], opacity }]}>
        <Image
          source={{ uri: item.image }}
          resizeMode="contain"
          style={{
            height: avatarSize,
            width: avatarSize,
            borderRadius: avatarSize / 2,
          }}

        />
        <View style={styles.content}>
          <Text style={styles.name} >{item.name}</Text>
          <Text style={styles.email} >{item.email}</Text>
          <Text style={styles.job} >{item.jobTitle}</Text>
        </View>
      </Animated.View>

    )
  }

  return (
    <>
      <Image
        source={{ uri: backgroundImg }}
        style={StyleSheet.absoluteFillObject} // para couber certinho no fundo
        blurRadius={25}
      />
      <Animated.FlatList
        data={data}
        keyExtractor={item => item.key}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scroolY } } }],
          { useNativeDriver: true }
        )} // para lidar com scrool
        contentContainerStyle={{
          padding: spacing,
          paddingVertical: top
        }}

        renderItem={renderItem}
        showsVerticalScrollIndicator={false}



      />
    </>
  )
}

const styles = StyleSheet.create({
  containerItem: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.8)",
    alignItems: "center",
    shadowColor: "#000",
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 20,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.46,
    shadowRadius: 11.14,
    elevation: 17,
  },
  content: {
    marginLeft: 10,
  },
  name: {
    fontSize: 20,
  },
  email: {
    fontSize: 14,
    opacity: 0.8
  },
  job: {
    fontSize: 12,
    opacity: 0.7,
    color: "#0000EE"
  }
})


