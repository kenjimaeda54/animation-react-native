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


### Barras de progresso
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
- Ideal e centralizar a imagem verticalmente e horizontalmente

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

### Stick Rodape
- A ideia e deixar fotter  presso em baixo é quando atingir um certo ponto ela ira se mover com layout
- Para fazer esse efeito colocamos uma view com o mesmo estilo da view animada
- Quando atingir a view pressa o onLayout ira mudar é setar o bottomActions 
- Quando o bottomAcitions não for mais nullo ira setar uma view animada, que ocupara o mesmo espaço da view que preparamos para pegar o onLayout
- BottomAction ao ser setado ele ficara com o tamanho da view que esta no onLayout
- InputRange a lógica e simples, primeiro se a view não estiver visível com -1, depois se estiver no estado normal 0, para gerar um efeito suave, estamos também pegando -30 do tamanho da view principal, depois o tamanho todo da view principal e por fim pegando mais 1 da view principal
- Repara que interpelote novamente segue mesmo conceito, no caso da view principal footerScrool, outputRange só sera -1 quando estiver 1 píxel acima da view principal, restante deveria mostrar, porem o buttomActions sera nullo então não ira mostrar
- Alguns ícones estão com interpolação de animação   opacidade, ou seja, quando a view estiver -30 do tamanho principal e com 1 píxel acima irão mostrar caso a contrário ira sumir
- Os valores -30 e +1 são flexíveis quanto maiores mais suaves
- No (bootomActions?.y - height + 60) o mais 60 e flexível e para tentar suprir a correção do tamanho da view
- Então analisando o inputRange esta view animada de fato sera efetiva em dois momentos quando estiver com tamanho da view do onLayout ou seja topEdge é quando estiver 1 pixel acima dela
- Por isso o tranlateX fica em 0 nesses dois momentos, para que o ícone volta ao seu lugar é exiba os outros ícones com animação de opacidade

```typescript

  const topEdge = bootomActions !== null ? (bootomActions?.y - height + 60) + bootomActions?.height : 0

 
  const inputRange = [-1, 0, topEdge - 30, topEdge, topEdge + 1]

 <View onLayout={event => setBootomActions(event.nativeEvent.layout)} style={[styles.footerScrool]} />

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
          }]
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
                  outputRange: [20, 20, 20, 0, 0] // para entender bem so reapara aqui inputRange [-1, 0, topEdge - 30, topEdge, topEdge + 1]
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


//styles

  footerScrool: {
    flexDirection: "row",
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingBottom: 20,
    justifyContent: "space-between",
    alignItems: "center",
    height: 60,
  },


```


### Scroll Vertical sumindo aos poucos o conteudo na parte superior
- Para realizar essa animação trabalhei com scale e  opacidade
- Segredo e diminuir a escala um pouco antes do scroll finalizar, ou seja, o tamanho do card versus o index mais algum valor
- Usei 0.5, pois com esse valor ficaria a metade


```typescript
  function renderItem({ item, index }: { item: IDataProps, index: number }) {
    const inputRange = [
      -1,  
      0, 
      itemSize * index,    
      itemSize * (index + 2)  
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
  
  //para dar efeito de blur
   <Image
        source={{ uri: backgroundImg }}
        style={StyleSheet.absoluteFillObject} // para couber certinho no fundo
        blurRadius={25}
      />


````

### Imagem principal com thumbnail em baixo
- Para realizar esa animação usei duas Flatlist uma que imagem cobre a tela toda é outra thumbnail
- Na thumbnail a ideia e o carrossel sempre pare com a imagem na metade então fiz uma lógica com seu ref




```typescript

const { width, height } = Dimensions.get("window")

export default function FlatlistHorizontal() { 
  const [activeIndex, setActiveIndex] = useState(0)
  const topRef = useRef<FlatList>(null)
  const thumbNailRef = useRef<FlatList>(null)
  const heigthImageThumb = 60
  const widthImageThumb = 60
  const spacing = 5
  
     
   function handleScrool(index: number) {
    setActiveIndex(index)
    topRef.current?.scrollToOffset({
      offset: index * width,
      animated: true
    })

    if (index * (widthImageThumb + spacing) - widthImageThumb / 2 > width / 2) {
      thumbNailRef.current?.scrollToOffset({
        offset: index * (widthImageThumb + spacing) - width / 2 + widthImageThumb / 2, 
        animated: true

      })

    }
  }  
     
     
  return (
    <View style={styles.container} >
      <FlatList
        ref={topRef}
        data={images}
        horizontal
        keyExtractor={item => `${item.id}`}
        pagingEnabled
        renderItem={renderItemImage}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={event => handleScrool(Math.floor(event.nativeEvent.contentOffset.x / width))} 
      />
      <FlatList
        ref={thumbNailRef}
        data={images}
        horizontal
        style={{
          position: "absolute",
          bottom: heigthImageThumb,
          paddingHorizontal: spacing,
        }}
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => `${item.id}`}
        renderItem={renderItemThumbNail}
      />
    </View>
  )

}
```

### Carousel 3d animado
- Essa animação trabalhei com vários conceitos, para lidar com rotação usei modulo assim consigo 0,0.5 e 1
- Quando scrollar a imagem é girar, a tendência e que a imagem fica sobressaindo nas outras que estão atrás, aplicando um zIndex resolvemos o casso
- Eu separei o conteúdo do fundo branco que ficam atrás, ambos iram girar. View que possui o conteúdo preciso também um zIndex
- Sempre que for usar esse conceito de girar usamos perpective, ela vai permitir uma escala em z [perspective](https://medium.com/swlh/the-heart-of-react-native-transform-e0f4995ebdb6)  
- O contêiner branco fica com os botoes 
- Para navegar de um slider para outro pelos botoes usamos o ref
 
 ```typescript 
 
 export default function FlatlistCarousel3d() {
  const { top } = useSafeAreaInsets()
  const scrollX = useRef(new Animated.Value(0)).current
  const refList = useRef<FlatList>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const rotateAnimated = Animated.modulo(Animated.divide(scrollX, width), width)
 
  const handleIndex = useRef((info: ViewSlider) => {
    const infoIndex = info.viewableItems[0].index!
    setCurrentIndex(infoIndex)
  })

  function handleNextSlider() {
    refList.current?.scrollToOffset({
      offset: (currentIndex + 1) * width,
      animated: true
    })
  }

  function handlePreviousSlider() {
    refList.current?.scrollToOffset({
      offset: (currentIndex - 1) * width,
      animated: true
    })

  }
 
 
  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={refList}
        data={images}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        contentContainerStyle={{
          height: 100,
        }}
        pagingEnabled
        horizontal
        style={{ zIndex: 9999 }} 
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={handleIndex.current}
        keyExtractor={(_, index) => `${index}`}
        renderItem={renderItem}
      />

     
      <View style={[styles.content, { zIndex: 99 }]}>
        {content.map((it, index) => {
          const inputRange = [
            (index - 0.4) * width,  
            width * index, 
            (index + 0.4) * width,  

          ]

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0, 1, 0]
          })

          
          const rotate = scrollX.interpolate({
            inputRange,
            outputRange: ["45deg", "0deg", "90deg"]
          })


          return (
            <Animated.View
              key={it.key}
              style={{
                position: "absolute",
                opacity,
                transform: [{
                  perspective: imageWidth * 4
                },
                { rotateY: rotate }

                ],
                top: imageHeight - 350, left: 25,
              }}>
              <Text style={styles.title} >{it.title.toUpperCase()} </Text>
              <Text style={styles.subTitle}  >{it.subTitle} </Text>
              <Text style={styles.price}   >{it.price} USD </Text>
            </Animated.View>
          )
        })}
      </View>
      <Animated.View style={[styles.backgroundView, {
        width: imageWidth + 25, height: imageHeight + 170, top: imageHeight - 80,
        transform: [
          { perspective: imageWidth * 4 }, 
          {
            rotateY: rotateAnimated.interpolate({
              inputRange: [0, 0.5, 1],  
              outputRange: ["0deg", "90deg", "180deg"]
            })
          }
        ]
      }]} />
      <View style={[styles.footer, { width: imageWidth + 60 }]} >
        <TouchableOpacity disabled={currentIndex === 0} onPress={handlePreviousSlider} style={[styles.button, {
          opacity: currentIndex === 0 ? 0.5 : 1,
        }]}>
          <Image source={require("../assets/back.png")} resizeMode="contain" style={styles.imgBack} />
          <Text style={styles.textButton} >Previous </Text>
        </TouchableOpacity>
        <TouchableOpacity disabled={currentIndex === content.length} onPress={handleNextSlider} style={[styles.button, {
          opacity: currentIndex === content.length - 1 ? 0.5 : 1
        }]}>
          <Text style={styles.textButton}   >Next </Text>
          <Image source={require("../assets/next.png")} resizeMode="contain" style={styles.imgBack} />
        </TouchableOpacity>
      </View>
    </View>
  )
  
}
 
 
 
 ```

### Bootom Sheet 
- Ideia e conseguir arrastar o conteúdo para parte de cima,tipico instragam
- Para realizar esse efeito usei [bottom-shet](https://www.npmjs.com/package/@gorhom/bottom-sheet)
- Para flatlist não ocupar toda a tela, forcei com uma view em volta
- SnapInterval e ideal para que a flatlist ao realizar scroll pare exatamente sempre em um item, neste caso trabalhei em conjunto com decelerationRate
- Para gerar o overlay sobre os dots usei o divide, pequei o scrollY é divide pelo tamanho do renderItem da flatlist, o tamanho dela no meu casso e o itemHeight 
- Bottomsheet e obrigatório dois parâmetros o index  é  snapoints, nesste caso foi o tamanho da tela menos o tamanho do renderItem da flatlist  e altura toda da tela
- Resumidamente quando ele começa em abaixo da imagem é quando é arrastado fica na tela toda



```typescript
const { width, height } = Dimensions.get("window")

const itemWidth = width
const itemHeight = height * 0.70

const sizeDot = 8;
const spacingDot = 8;

const sizeOverlay = sizeDot + spacingDot

export default function ButtonSheetWithPagination() {


return (


  function handleItem({ item }: { item: string }) {
    return <Image source={{ uri: item }} resizeMode="cover" style={styles.image} />
  }

 <View style={{ height: itemHeight, position: "relative" }} >
        <Animated.FlatList
          data={images}
          renderItem={handleItem}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollYRef } } }],
            { useNativeDriver: true }
          )}
          snapToInterval={itemHeight}
          bounces={false}
          decelerationRate="fast"
          showsVerticalScrollIndicator={false}
        />
      </View>

 <View style={styles.pagination}>
        {images.map((_, index) =>
          <View key={index} style={styles.dot} />
        )}
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


)


//style

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

}

```

### Shared Element parte Tropical List
- Para lidar com shared element usei [react navigation shared elemenet](https://www.npmjs.com/package/react-navigation-shared-element)
- Basicamente envolvo o elemento quero navega para próxima tela com um id especifico, este elemento precisa está presente na outra tela
- Nesta tela que vai recebe o id tem algumas abordagens, utilizado foi estatico  que é automático após criar uma tela com react navigation shared element
- Repara que tela Details tem o método sharedElements, se a tela fosse DetailsScreen,seria DetailsScreen.sharedElement
- Para carosel acima fica na posição correta usei useEffect, assim que a tela é montada uso o Animated.parallel é faço scroll no eixo x ate o ícone   corresponde ao conteúdo abaixo
- Repara que uso o tamanho do animationIcon no interpolate do translateX, seria o tamanho do espaço entre os ícones, tamanho do ícone é multiplicado por 2, pois considero os dois lados
- A flatlist abaixo ira sempre iniciar no index que foi clicado conforme o ícone da tela anterior pela propriedade initialScrollIndex, para conseguirmos scrollar ela ate o ponto desejado e bom usar o getItemLayout

```typescript
// tela de origem
// HomeScreen

export function HomeScreen() {


  return (
      <View style={styles.contentImg}>
        {dataTropical.map(it =>
          <SharedElement key={it.id} id={`${it.id}.photo`} >
            <TouchableOpacity onPress={() => handleNavigation(it)} style={styles.imgView}>
              <Image source={it.image} style={styles.img} />
            </TouchableOpacity>
          </SharedElement>
        )}
      </View>
  )

}

// tela destino
const Details = () => {
 const { goBack } = useNavigation()
  const flatlistScrollRef = useRef<FlatList>(null)
  const { top } = useSafeAreaInsets()
  const { params } = useRoute<RouteProp<ParamList, 'Details'>>()
  const findSelectedIndex = dataTropical.findIndex(it => params?.item.id === it.id)
  const mountedAnimated = useRef(new Animated.Value(0)).current
  const activeIndex = useRef(new Animated.Value(findSelectedIndex)).current
  const animatedIndex = useRef(new Animated.Value(findSelectedIndex)).current

 useEffect(() => {

    Animated.parallel([
      Animated.timing(animatedIndex, {
        toValue: activeIndex,
        duration: 500,
        useNativeDriver: true
      }),
      animation(1, 300)
    ]).start()


  })

  const translateX = animatedIndex.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [animationIcon, 0, -animationIcon],


  })
  
   function handleListHeader(index: number) {
    activeIndex.setValue(index)

    flatlistScrollRef.current?.scrollToIndex({
      index,
      animated: true,
    })

  }

  return (
     <ScrollView
        bounces={false}
        showsHorizontalScrollIndicator={false}
        horizontal >
        <Animated.View style={[styles.contentImg, { transform: [{ translateX }] }]} >
          {dataTropical.map((item, index) => {
            const inputRange = [index - 1, index, index + 1]
            const opacity = activeIndex.interpolate({
              inputRange,
              outputRange: [0.5, 1, 0.5],
              extrapolate: "clamp"
            })
            return (
              <Animated.View style={[styles.content, { opacity }]} key={item.id} >
                <SharedElement id={`${item.id}.photo`}>
                  <TouchableOpacity onPress={() => handleListHeader(index)} style={styles.viewImg}>
                    <Image style={styles.img} resizeMode="center" source={item.image} />
                  </TouchableOpacity>
                </SharedElement>
                <Text style={styles.titleSlider}>{item.title}</Text>
              </Animated.View >
            )
          })}
        </Animated.View>
       </ScrollView>
        <Animated.View style={[styles.contentImg, { transform: [{ translateX }] }]} >
          {dataTropical.map((item, index) => {
            const inputRange = [index - 1, index, index + 1]
            const opacity = activeIndex.interpolate({
              inputRange,
              outputRange: [0.5, 1, 0.5],
              extrapolate: "clamp"
            })
            return (
              <Animated.View style={[styles.content, { opacity }]} key={item.id} >
                <SharedElement id={`${item.id}.photo`}>
                  <TouchableOpacity onPress={() => handleListHeader(index)} style={styles.viewImg}>
                    <Image style={styles.img} resizeMode="center" source={item.image} />
                  </TouchableOpacity>
                </SharedElement>
                <Text style={styles.titleSlider}>{item.title}</Text>
              </Animated.View >
            )
          })}
        </Animated.View>
   
  )

}

Details.sharedElements = () => dataTropical.map(it => `${it.id}.photo`)
```
