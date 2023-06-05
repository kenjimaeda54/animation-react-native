# Animação
Repositório com várias animações em React Native. </br>
Referencia: https://www.youtube.com/watch?v=ZiSN9uik6OY&list=RDCMUCTcH04SRuyedaSuuQVeAcdg&start_radio=1&rv=ZiSN9uik6OY&t=0

## Feature
### Tempo Animado
- Para esta animação funcionar corretamente e ideal colocar uma view em volta da flatlist, isso ajuda a não extrapolar o conteúdo
- Para mudar o texto do tempo automaticamente adicionei um listener na animação, assim a cada valor que  assumir coloco no text input
- Repara que o TextInput tem o ref , com nome de refInput, no caso precisa ser um textInput não funciona com text, pois não temos acesso ao ref


```typescript


  useEffect(() => {

  
    const listenerInput = timerAnimatedInput.addListener(({ value }) => {
      refInput.current?.setNativeProps({
        text: Math.ceil(value).toString()
      })

    })

    return () => {
      timerAnimatedInput.removeListener(listenerInput)
    }

  })


 <Animated.View style={styles.forceFlatlist}>
        <Animated.View style={[styles.viewTextInput, { opacity: textInputOpacity }]}>
          <TextInput style={styles.textItem} ref={refInput} defaultValue={currentDuration.toString()} />
        </Animated.View>
        <Animated.FlatList
          data={timers}
          horizontal
          contentContainerStyle={{
            paddingHorizontal: itemSpacing
          }}
          bounces={false}
          pagingEnabled
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scroolX } } }],
            { useNativeDriver: true }
          )}
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={e => handleMomentScroll(Math.round(e.nativeEvent.contentOffset.x / itemSize))}
          snapToInterval={itemSize}
          style={{ opacity: opacityButton }}
          decelerationRate="fast"
          keyExtractor={(_, index) => `${index}`}
          renderItem={renderItem}
        />
      </Animated.View>



// estilo

 forceFlatlist: {
    flex: 1,
    position: "absolute",
    top: height / 3,
    left: 0,
    right: 0,
  },



```

- Para funcionar sequencial animação do botão, view e do texto, usamos o timer sequence
- Usei o useCalback para adicionar um listener na currentDuration, conforme ele altera é acionado novamente essa função
- Toda vez que ocorrer o scroll horizontal eu faço seto o currentDuration

```typescript

  function handleMomentScroll(index: number) {
    setCurrentDuration(timers[index])
  }
  
  
<!--  onMomentumScrollEnd={e => handleMomentScroll(Math.round(e.nativeEvent.contentOffset.x / itemSize))}   -->
// propriedade da flatlist

 const pressAnimated = useCallback(() => {
    timerAnimatedInput.setValue(currentDuration)
    Animated.sequence([

      Animated.timing(buttonAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }), // aqui vai interferi no interpolation [0,1] // por isso comecei em 1 , para que a opacidade seja 0 quando inicar a contagem, 

      Animated.timing(timerBackground, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }),

      Animated.parallel([

        Animated.timing(timerAnimatedInput, {
          toValue: 0,
          duration: currentDuration * 1000,
          useNativeDriver: true
        }),

        Animated.timing(timerBackground, {
          toValue: height,
          duration: currentDuration * 1000,
          useNativeDriver: true
        })


      ]),

      Animated.delay(400)

    ]).start(() => {
      Vibration.cancel()
      Vibration.vibrate()
      timerAnimatedInput.setValue(currentDuration)
      Animated.timing(buttonAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }).start()

    })

  }, [currentDuration])


```

- Animação do react native e bem orgânica, por exemplo, para ativar o botão, eu início com o valor 1 e depois vou para o zero, consequentemente na interpolação reflete isso
- ButtonAnimation começa no Animated.sequence em 1  após concluir a sequência no start da animação coloco para zero 
- Por isso na interpolação o estado 1, quando começa animação da view é texto o inputRange do botão tem opacidade zero, é o botão ira começar a 200 no eixo y.
- Estado zero do botão quando acaba animação termina, então botão volta para seu estado normal 


```typescript

   Animated.sequence([

      Animated.timing(buttonAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }),

      Animated.timing(timerBackground, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }),

      Animated.parallel([

        Animated.timing(timerAnimatedInput, {
          toValue: 0,
          duration: currentDuration * 1000,
          useNativeDriver: true
        }),

        Animated.timing(timerBackground, {
          toValue: height,
          duration: currentDuration * 1000,
          useNativeDriver: true
        })


      ]),

      Animated.delay(400)

    ]).start(() => {
      //aqui abaixo e quando conclui animação em sequencia
      Vibration.cancel()
      Vibration.vibrate()
      timerAnimatedInput.setValue(currentDuration)
      Animated.timing(buttonAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }).start()

    })
    
    
    
  const opacityButton = buttonAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  })

  const translateYButton = buttonAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200]

  })

  const textInputOpacity = buttonAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1]
  })


```


### Sequencia animada
- Para realizar aquelas barras de sequência, primeiro pega o tamanho do campo interno, pois sera dinâmico o tamanho do componente
- Toda vez que mudar o tamanho da largura e a quantidade de passos vou setar o valor do reactive que é uma constante de animação que criei
- No onLayout ele pega o tamanho da view apenas uma vez
- Abaixo um cálculo para pegar o tamanho correto para cada passo que precisa dar no translateX
- Dica para css se com position absolute seu componente não ficar na tela toda retira do pai aligen items

```typescript

function ProgressIndicator({ step, steps, height }: ProgressIndicatorProps) {
  const [currentWidth, setCurrentWidth] = useState(0)
  const animatedValue = useRef(new Animated.Value(-1000)).current
  const reactive = useRef(new Animated.Value(-1000)).current

  useEffect(() => {
    // - currentWidth + currentWidth * step /steps  para pegar o tamanho do tranlastex 
    reactive.setValue(-currentWidth + (currentWidth * step) / steps)

  }, [currentWidth, step])

 const handleWidthLayout = (value: number) => {
    setCurrentWidth(value)
  }

  <View
        onLayout={e => handleWidthLayout(e.nativeEvent.layout.width)} 
        style={[styles.viewProgress, { height }]}
      >
        <Animated.View
          style={[styles.progress, { height, transform: [{ translateX: animatedValue }] }]} />
      </View>


}


// estilo
  container: {
    flex: 1,
    justifyContent: "center",  
    paddingHorizontal: 20,

  },
  
   progress: {
    backgroundColor: "rgba(0,0,0,0.5)",
    position: "absolute",
    right: 0,
    left: 0,
    width: "100%"
  },

```


### Paralax Animação
- Efeito paralax e bem simples de efetuar, preciso envolver a imagem com uma view é a mesma precisa ser menor que a imagem é possuir overflhow: hidden
- Para gerar o efeito eu arrasto a imagem negativamente 0.75 e positivamente 0.75
- Regra do input range e bem simples, sera anterior, atual e o próximo, ou seja, quando estiver na tela anterior a imagem ira para largura negativa, no atual mantenho normal, e a próxima à imagem fara efeito para direita

```typescript

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
        <View style={styles.viewWithBorder}>
          <View style={styles.viewParalax}  >
            <Animated.Image source={{ uri: item.photo }} style={[styles.image, { transform: [{ translateX }] }]} resizeMode="cover" />
          </View>
          <Image style={styles.imageAvatar} source={{ uri: item.avatar_url }} />
        </View>
      </View>
    )
  }
  
 
 //estilo
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
  
 image: {
    width: itemWidth * 1.4, //imagem precisa ser maior que a view
    height: itemHeigth,
  },
  viewParalax: {
    width: itemWidth,
    alignItems: "center",
    height: itemHeigth,
    overflow: "hidden", //com esse overflow hiden a imagem não estrapalo o container
    borderRadius: 13,
  },


```

### Tela de carregamento
- Para realizar esse feito foi com o Moti
- Ele usa um conceito muito simples, parecido com web, determino quando começa é termina
- Ou seja, no from e quando começa a view e animate quando termina

``` typescript

    <MotiView
        from={{
          width: 80,  
          height: 80,  
          borderRadius: 40,  
          borderWidth: 0,
          shadowOpacity: 0.5

        }}
        animate={{
          width: 100,  
          height: 100,  
          borderRadius: 50,  
          borderWidth: 10,  
          shadowOpacity: 1
        }}
        transition={{
          type: "timing",
          duration: 2000,
          loop: true

        }}
        style={styles.viewAnimation}
      />



```


### Tela de apresentação
- Par criar o backgroud circular branco que some, usamos o Animated.Modulo, com ele não iremos possuir valores negativos 
- Ideia e descobrir ao scrollar o final, inicio é quando estiver no meio, essa view fica no fundo, a parte de cima, com efeito, circular
- Quando a tela estiver na metade esse background ira sumir 
- Quando animação não se comportar da maneira que deseja tenta usar o extrapolate

```typescript

export default function IntrodutionCarousel() {

 const Indicator = ({ scroolX }: PropsScroll) => {
  return (<View style={styles.viewIndicator} >
    {data.map((it, index) => {
      const inputRange = [
        (index - 1) * width,
        index * width,
        (index + 1) * width,
      ]

      const opacity = scroolX.interpolate({
        inputRange,
        outputRange: [0.4, 1, 0.4],
        extrapolate: "clamp"
      })

      const scale = scroolX.interpolate({
        inputRange,
        outputRange: [.7, 1.4, .7],
        extrapolate: "clamp"
      })


      return (
        <Animated.View key={it.key} style={[styles.indicator, {
          opacity,
          transform: [{ scale }]
        }]} />
      )
    })}
  </View>)
 
}


const YoloBackground = ({ scroolX }: PropsScroll) => {
  const yolo = Animated.modulo(
    Animated.divide(
      Animated.modulo(scroolX, width), new Animated.Value(width)
    ), 1
  ) 

  const rotate = yolo.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ["35deg", "0deg", "35deg"]
  })

  const translateX = yolo.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -height, 0]
  })


  return <Animated.View
    style={[styles.viewYolo, {
      transform: [
        {
          rotate: rotate
        },
        {
          translateX
        }
      ]
    }]}

  />


}



 return (
    <View style={styles.container}>
      <Background index={currentIndex} />
      {/*a view precisa estar acima da flatlist*/}
      <YoloBackground scroolX={scrollX} />
      <Animated.FlatList
        data={data}
        keyExtractor={(item) => item.key}
        renderItem={renderItem}
        horizontal
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={handleIndex.current}
        scrollEventThrottle={16}
        pagingEnabled
      />
      <Indicator scroolX={scrollX} />

    </View>

  )


}
// style

 viewYolo: {
    width,
    height,
    position: "absolute",
    top: -height * 0.48,
    backgroundColor: "white",
    borderRadius: 86,
  }


```




