import {ScrollableRef} from '@gorhom/bottom-sheet/lib/typescript/types';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {Fragment, useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Animated,
  ViewToken,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {SharedElement} from 'react-navigation-shared-element';
import {dataTropical} from '../utils/data';
import {DataTropical} from '../utils/types';

const {width} = Dimensions.get('screen');
const spacing = 20;
const sizeIcon = 30;
const totalIcon = spacing + sizeIcon;

const renderItem = ({item}: {item: DataTropical; index: number}) => (
  <ScrollView
    bounces={false}
    showsVerticalScrollIndicator={false}
    style={styles.scrollTitle}>
    {/*para esta view acima scrollTitle ficar no centro certinho pequei a largura e divid por 2
       tambem retirei as sobras   width: width - spacing * 2,
      so pagginEnabled não consegueria fazer a view cobrir todo espaço
    */}
    <View style={styles.viewText}>
      <Text style={styles.fillText}>
        {Array(50).fill(`${item.title} inner text \n`)}
      </Text>
    </View>
  </ScrollView>
);

type ParamList = {
  Details: {
    item: DataTropical;
  };
};

const Details = () => {
  const {goBack} = useNavigation();

  const flatlistScrollRef = useRef<FlatList>(null);
  const {top} = useSafeAreaInsets();
  const {params} = useRoute<RouteProp<ParamList, 'Details'>>();
  const findSelectedIndex = dataTropical.findIndex(
    it => params?.item.id === it.id,
  );
  const mountedAnimated = useRef(new Animated.Value(0)).current;
  const activeIndex = useRef(new Animated.Value(findSelectedIndex)).current;
  const animatedIndex = useRef(new Animated.Value(findSelectedIndex)).current;

  const animation = (toValue: number, delay?: number) =>
    Animated.timing(mountedAnimated, {
      toValue,
      duration: 500,
      delay,
      useNativeDriver: true,
    }); // preciso retornar uma animação

  useEffect(() => {
    Animated.parallel([
      Animated.timing(animatedIndex, {
        toValue: activeIndex,
        duration: 500,
        useNativeDriver: true,
      }),
      animation(1, 300),
    ]).start();
  });

  const translateY = mountedAnimated.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0],
  });

  const opacity = mountedAnimated.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 0.7, 1],
  });

  const animationIcon = totalIcon * 2;

  const translateX = animatedIndex.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [animationIcon, 0, -animationIcon],
  });

  function handleGoBack() {
    animation(0).start();
    goBack();
  }

  const handleScrollMomentEnd = (index: number) => activeIndex.setValue(index);

  function handleListHeader(index: number) {
    activeIndex.setValue(index);

    flatlistScrollRef.current?.scrollToIndex({
      index,
      animated: true,
    });
  }

  return (
    <View style={[styles.container, {marginVertical: top + 20}]}>
      <TouchableOpacity onPress={handleGoBack}>
        <Image
          source={require('../../../../assets/back.png')}
          resizeMode="contain"
          style={styles.back}
        />
      </TouchableOpacity>
      <ScrollView
        bounces={false}
        showsHorizontalScrollIndicator={false}
        horizontal>
        {/*precisa de uma view em volta do map nela eu coloquei o paddingletf
            para alinhar no centro os icones
          */}
        <Animated.View style={[styles.contentImg, {transform: [{translateX}]}]}>
          {dataTropical.map((item, index) => {
            const inputRange = [index - 1, index, index + 1];
            const opacity = activeIndex.interpolate({
              inputRange,
              outputRange: [0.5, 1, 0.5],
              extrapolate: 'clamp',
            });
            return (
              <Animated.View style={[styles.content, {opacity}]} key={item.id}>
                <SharedElement id={`${item.id}.photo`}>
                  <TouchableOpacity
                    onPress={() => handleListHeader(index)}
                    style={styles.viewImg}>
                    <Image
                      style={styles.img}
                      resizeMode="center"
                      source={item.image}
                    />
                  </TouchableOpacity>
                </SharedElement>
                <Text style={styles.titleSlider}>{item.title}</Text>
              </Animated.View>
            );
          })}
        </Animated.View>
      </ScrollView>
      <Animated.FlatList
        ref={flatlistScrollRef}
        pagingEnabled
        style={{transform: [{translateY}], opacity}}
        data={dataTropical}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        initialScrollIndex={findSelectedIndex}
        onMomentumScrollEnd={e =>
          handleScrollMomentEnd(
            Math.floor(e.nativeEvent.contentOffset.x / width),
          )
        }
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingVertical: 20,
        }}
        horizontal
      />
    </View>
  );
};

Details.sharedElements = () => dataTropical.map(it => `${it.id}.photo`);

export default Details;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  viewDataTropical: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  back: {
    width: 20,
    height: 20,
    alignSelf: 'flex-start',
    paddingHorizontal: 35,
    marginBottom: 20,
  },
  contentImg: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: width / 2 - totalIcon,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    marginHorizontal: 20,
  },
  viewImg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d3d3d3',
    marginBottom: 7,
  },
  img: {
    width: sizeIcon,
    height: sizeIcon,
  },
  titleSlider: {
    fontSize: 12,
    color: 'black',
    fontWeight: '300',
  },
  scrollTitle: {
    borderRadius: 15,
    width: width - spacing * 2, //2 e porque e lado esquerdo e direito
    marginHorizontal: spacing,
  },
  viewText: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#d3d3d3',
  },
  fillText: {
    fontSize: 17,
    lineHeight: 23,
    fontWeight: '300',
    color: 'black',
  },
});
