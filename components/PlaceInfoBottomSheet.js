import React, {useEffect, useRef, useState} from 'react';
import { Animated, Text, View, TouchableHighlight, Button, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
const mapScreenBottomSheetExampleImage = require('../assets/image/mapScreenBottomSheetExample.png')
const LocationplusIcon = require('../assets/icons/locationplus.png')

const BottomSheetScreen = ({onDisplay, onCancel, animationVal, targetName, targetAddress}) => {
  if(animationVal<0){
    return(                                                 //bottomsheet가 전체 화면을 덮기 전
      <View style={{position:'absolute', width: '100%', height: '100%'}} onTouchEndCapture={()=>onDisplay()}>
      <View style={{position: 'absolute', top:40, left:10, width: 180, height: 160}}>
        <Text style={{position:'absolute', top: 20, fontSize: 20}}>{targetName}</Text>
        <Text style={{position:'absolute', top: 80, fontSize: 15}}>{targetAddress}</Text>
      </View>
      <View style={{position: 'absolute', top:40, left:210, width: 150, height: 150}}>
        <Image source={mapScreenBottomSheetExampleImage} style={{width: 150, height:150}}/>
      </View>
      </View>
    )
  }
  else{   
    return(                                                       //bottomsheet가 전체 화면을 덮은 후
      <View style={{position:'absolute', width: '110%', height: '100%'}}>
        <View style={{position: 'absolute', top: 30, left: 0, width: 60, height: 50, paddingTop:5}}>
          <Button title='back' onPress={()=>onCancel()}/>
        </View>
        <View style={{position: 'absolute', top: 45, width: '50%', height: 40, alignSelf:'center'}}>
          <Text style={{textAlign:'center', textAlignVertical:'center', marginTop:4, fontSize:25}}>{targetName}</Text>
        </View>
        <TouchableHighlight
            style={{
                position: 'absolute',
                bottom: 130,
                justifyContent: 'center',
                alignSelf: 'center',
                alignItems: 'center',
                width:80,
                height:80,
                borderRadius: 40,
                backgroundColor: 'skyblue',
                zIndex:1,
            }}
            underlayColor='blue'
        >
          <Image source={LocationplusIcon} resizeMode='contain' style={{width: 40, height: 40, tintColor: '#fff', zIndex:1}} />
        </TouchableHighlight>
      </View>
    )
  }
}

const BottomSheet = ({onDisplay, onCancel, animation, animationVal, targetName, targetAddress}) => {
  return(
    <Animated.View style={{
      width: "100%",
      height: '40%',
      backgroundColor:"#fff",
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      padding: 20,
      position: 'absolute',
      zIndex: 4,
      alignItems: 'center',
      justifyContent: 'center',
      height: 850,                             //조정 필요
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
      <BottomSheetScreen onDisplay={()=>onDisplay()} onCancel={()=>onCancel()} 
        animationVal={animationVal} targetName={targetName} targetAddress={targetAddress}/>  
    </Animated.View>
  )
}

const PlaceInfoBottomSheet = ({isShow, targetName, targetAddress, targetId}) => {
  const [animationValue, setAnimationValue] = useState(-1000);
  const showAnimation = useRef(new Animated.Value(animationValue)).current;
  useEffect(()=>{toggleAnimation1();}, [isShow]);
  const toggleAnimation1 = () => {                    //bottomsheet가 -1000이거나 -500일 때 map을 클릭하여 보이게 / 안 보이게 하기
    const val = isShow ? -500 : -1000;
    Animated.timing(showAnimation, {
      useNativeDriver: false,
      toValue: val,
      duration: 350
    }).start()
    setAnimationValue(val);
  }
  const toggleAnimation2 = () => {                      //bottomsheet가 -500일 때 터치해서 전체 화면으로 올리기
    // const val2 = animationValue==-500 ? 0 : -500;     //터치해서 아래로 내리는 걸 원하면 이걸 주석 취소하고 아래거를 주석처리해라
    const val2 = 0;
    Animated.timing(showAnimation, {
      useNativeDriver: false,
      toValue: val2,
      duration: 350
    }).start()
    setAnimationValue(val2);
  }
  const toggleAnimation3 = () => {                                //bottomsheet가 10일 때 뒤로 가기 버튼 눌러서 보이게만 하기
    const val3 = -500;
    Animated.timing(showAnimation, {
      useNativeDriver: false,
      toValue: val3,
      duration: 350
    }).start()
    setAnimationValue(val3);
  }
  return (
    <BottomSheet 
      onDisplay = {() => {
        toggleAnimation2()
      }}
      onCancel={()=>{
        toggleAnimation3()
      }} 
      animation={showAnimation}
      animationVal={animationValue}
      targetName={targetName}
      targetAddress={targetAddress}
    />  
  )
}

export default PlaceInfoBottomSheet;