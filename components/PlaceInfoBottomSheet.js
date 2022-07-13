import React, {useEffect, useRef, useState} from 'react';
import { Animated, Text, View, TouchableOpacity, Button, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
const mapScreenBottomSheetExampleImage = require('../assets/image/mapScreenBottomSheetExample.png')

const BottomSheet = ({animation, onCancel, targetName, targetAddress}) => {
  return (
    <Animated.View style={{
      width: "100%",
      backgroundColor:"#fff",
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      padding: 20,
      position: 'absolute',
      zIndex: 4,
      alignItems: 'center',
      justifyContent: 'center',
      height: 800,
      shadowOffset: {
        width: 0,
        height: 12,
      },
      shadowOpacity: 0.58, 
      shadowRadius: 16.00,
      bottom: animation,
      elevation: 24,
    }}
    >
      <View style={{position: 'absolute', top:50, left:20, width: 180, height: 160}}>
        <Text style={{position:'absolute', top: 20, fontSize: 20}}>{targetName}</Text>
        <Text style={{position:'absolute', top: 80, fontSize: 15}}>{targetAddress}</Text>

      </View>
      <View style={{position: 'absolute', top:55, left:215, width: 150, height: 150}}>
        <Image source={mapScreenBottomSheetExampleImage} style={{width: 150, height:150}}/>
      </View>
    </Animated.View>
  )
}

const PlaceInfoBottomSheet = ({isShow, targetName, targetAddress}) => {
  const [animationValue, setAnimationValue] = useState(-1000);
  const showAnimation = useRef(new Animated.Value(animationValue)).current;
  useEffect(()=>{toggleAnimation();}, [isShow]);
  const toggleAnimation = () => {
    const val = isShow ? -500 : -1000;
    Animated.timing(showAnimation, {
      useNativeDriver: false,
      toValue: val,
      duration: 350
    }).start()
    setAnimationValue(val);
  }
  const toggleAnimation2 = () => {
    const val2 = animationValue==-500 ? 10 : -500;
    Animated.timing(showAnimation, {
      useNativeDriver: false,
      toValue: val2,
      duration: 350
    }).start()
    setAnimationValue(val2);
  }
  return (
    <View
      onTouchEndCapture={()=>{
        toggleAnimation2();
      }}
      style={{
        zIndex:4,
      }}
    >
    <BottomSheet 
      onCancel={()=>{
        toggleAnimation()
      }} 
      animation={showAnimation}
      targetName={targetName}
      targetAddress={targetAddress}
    />
    </View>
    
  )
}

export default PlaceInfoBottomSheet;