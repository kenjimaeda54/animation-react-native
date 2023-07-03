import { useRef, useState } from "react";
import { View, Image, StyleSheet, Animated, Text, LayoutRectangle, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";


const { height } = Dimensions.get("window")


const articleParagraphs = [
  'One advanced diverted domestic sex repeated bringing you old. Possible procured her trifling laughter thoughts property she met way. Companions shy had solicitude favourable own. Which could saw guest man now heard but. Lasted my coming uneasy marked so should. Gravity letters it amongst herself dearest an windows by. Wooded ladies she basket season age her uneasy saw. Discourse unwilling am no described dejection incommode no listening of. Before nature his parish boy. ',
  'Folly words widow one downs few age every seven. If miss part by fact he park just shew. Discovered had get considered projection who favourable. Necessary up knowledge it tolerably. Unwilling departure education is be dashwoods or an. Use off agreeable law unwilling sir deficient curiosity instantly. Easy mind life fact with see has bore ten. Parish any chatty can elinor direct for former. Up as meant widow equal an share least. ',
  'Another journey chamber way yet females man. Way extensive and dejection get delivered deficient sincerity gentleman age. Too end instrument possession contrasted motionless. Calling offence six joy feeling. Coming merits and was talent enough far. Sir joy northward sportsmen education. Discovery incommode earnestly no he commanded if. Put still any about manor heard. ',
  'Village did removed enjoyed explain nor ham saw calling talking. Securing as informed declared or margaret. Joy horrible moreover man feelings own shy. Request norland neither mistake for yet. Between the for morning assured country believe. On even feet time have an no at. Relation so in confined smallest children unpacked delicate. Why sir end believe uncivil respect. Always get adieus nature day course for common. My little garret repair to desire he esteem. ',
  'In it except to so temper mutual tastes mother. Interested cultivated its continuing now yet are. Out interested acceptance our partiality affronting unpleasant why add. Esteem garden men yet shy course. Consulted up my tolerably sometimes perpetual oh. Expression acceptance imprudence particular had eat unsatiable. ',
  'Had denoting properly jointure you occasion directly raillery. In said to of poor full be post face snug. Introduced imprudence see say unpleasing devonshire acceptance son. Exeter longer wisdom gay nor design age. Am weather to entered norland no in showing service. Nor repeated speaking shy appetite. Excited it hastily an pasture it observe. Snug hand how dare here too. ',
  'Improve ashamed married expense bed her comfort pursuit mrs. Four time took ye your as fail lady. Up greatest am exertion or marianne. Shy occasional terminated insensible and inhabiting gay. So know do fond to half on. Now who promise was justice new winding. In finished on he speaking suitable advanced if. Boy happiness sportsmen say prevailed offending concealed nor was provision. Provided so as doubtful on striking required. Waiting we to compass assured. ',
];


const getImage = (i: number) => `https://source.unsplash.com/600x${400 + i}/?blackandwhite`;

export default function FooterStick() {
  const { top } = useSafeAreaInsets()
  const [bootomActions, setBootomActions] = useState<LayoutRectangle | null>(null)
  const scroolY = useRef(new Animated.Value(0)).current

  //bootonLayout?.y - height  e pegar altura certa ja que estamos com position absolute
  //você pode ajusart o + 60 a sua vontade
  const topEdge = bootomActions !== null ? (bootomActions?.y - height + 60) + bootomActions?.height : 0

  //topEdge - 30 e a quantidade de pixel ou seja -30 do topo, quanto maior mais suave
  const inputRange = [-1, 0, topEdge - 30, topEdge, topEdge + 1]



  return (
    <>
      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scroolY } } }],
          { useNativeDriver: true }
        )}
        style={[styles.container, { marginTop: top }]}>
        <Text style={styles.title}>Black and White</Text>
        {articleParagraphs.map((it, index) =>
          <View key={index} >
            {index % 3 === 0 && <Image style={styles.img} resizeMode="cover" source={{ uri: getImage(index) }} />}
            <Text style={styles.paragraph} > {it} </Text>
          </View>
        )}
        {/*essa view abaixo e onde desejo que fica fixo o footer ou seja e nela que preciso pegar o onLayout
          e bom determinar uma alutra fixa para ele
        */}
        <View onLayout={event => setBootomActions(event.nativeEvent.layout)} style={[styles.footerScrool]} />
        <View  >
          <Text style={[styles.featureTitle]}>Feature</Text>
          {articleParagraphs.slice(0, 3).map((it, index) =>
            <View style={styles.featureView} >
              <Image style={styles.imgFeature} resizeMode="cover" source={{ uri: getImage(index) }} />
              <Text numberOfLines={3} style={styles.featureText}>{it}</Text>
            </View>

          )}
        </View>
      </Animated.ScrollView>
      {bootomActions !== null &&
        <Animated.View style={[styles.footerScrool, {
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          transform: [{
            translateY: scroolY.interpolate({
              inputRange,
              outputRange: [0, 0, 0, 0, -1]
            })
          }] // precisa ser o transform
        }]}>
          <View style={styles.rowFooter}>
            <Image source={require("../assets/heart.png")} style={styles.icon} resizeMode="contain" />
            <Animated.Text
              style={{
                opacity: scroolY.interpolate({
                  inputRange,
                  outputRange: [0, 0, 0, 1, 1]
                })
              }}

            > 306 </Animated.Text>
          </View>
          <View style={styles.rowFooter}>
            <Animated.Image source={require("../assets/share.png")} style={[styles.icon, {
              opacity: scroolY.interpolate({
                inputRange,
                outputRange: [0, 0, 0, 1, 1]
              })
            }]} resizeMode="contain" />
            <Animated.Image source={require("../assets/cifrao.png")} style={[styles.icon, {
              transform: [{
                translateX: scroolY.interpolate({
                  inputRange,
                  outputRange: [20, 20, 20, 0, 0]
                })

              }]
            }]} resizeMode="contain" />
            <Animated.Image source={require("../assets/export.png")} style={[styles.icon, {
              opacity: scroolY.interpolate({
                inputRange,
                outputRange: [0, 0, 0, 1, 1]
              })

            }]} resizeMode="contain" />
          </View>

        </Animated.View>

      }
    </>
  )

}

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  img: {
    height: 220,
    borderRadius: 10,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    flexWrap: "wrap",
    width: "70%",
    marginBottom: 20,
  },
  featureView: {
    flexDirection: "row",
    marginVertical: 20,
    paddingHorizontal: 5,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: "bold",
    flexWrap: "wrap",
    width: "70%",

  },
  imgFeature: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginHorizontal: 20,
  },
  featureText: {
    textAlign: "left",
    fontSize: 10,
    lineHeight: 17,
    letterSpacing: 0.3,
    flexWrap: "wrap",
    width: "70%",
  },
  paragraph: {
    textAlign: "left",
    fontSize: 15,
    lineHeight: 20,
    paddingVertical: 20,
    letterSpacing: 0.3,
  },
  icon: {
    width: 20,
    height: 20,
    marginHorizontal: 5,
  },
  footer: {
    height: 10,
  },
  footerScrool: {
    flexDirection: "row",
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingBottom: 20,
    justifyContent: "space-between",
    alignItems: "center",
    height: 60,
  },
  rowFooter: {
    flexDirection: "row",
    alignItems: "center"
  }
})
