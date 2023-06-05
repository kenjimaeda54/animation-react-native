# Animação
Repositorio com varias animações em React Native


## Feature
### Tempo Animado
- Para esta animação funcionar corretamente e ideal colocar uma view em volta da flatlist, isso ajuda a não estrapolar o conteudo
- Para mudar o texto do tempo automaticamente adicionei um listener na animação , assim a cada valor qeu ela assumir coloco no text input
- Repara que o TextInput tem o ref , com nome de refInput, no caso precisa ser um textInput não funciona com text , pois não temos acesso ao ref

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

- Para funcionar sequencial animação do botão,da view e do texto usamos o timer sequence
- Usei o useCalback pra adicionar um listener na currentDuration conforme ele altera e acionado novamente esa função
- Toda vez que ocorrer o scroll horizontal eu faço aciono o currentDuration

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

- Animação do react native e bem organica , por exepmlo para ativar o botão, eu incio com o valor 1 e depois vou para o zero,consequentemente na interpolação relfete isso
- ButtonAnimation começa no Animated.sequence em 1 é apos concluir a seguência no start da animação coloco para zero 
- Por isso na interpolação  o estado 1, quando começa animação da view,texto o  inputRange do botão tem  opacidade  zero, é o  botão ira começar a 200 no eixo y.
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



