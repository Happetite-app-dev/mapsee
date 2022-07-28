import React, {useEffect, useRef, useState} from 'react';
import { Animated, Text, View, TouchableHighlight, Button, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
const mapScreenBottomSheetExampleImage = require('../assets/image/mapScreenBottomSheetExample.png')
const LocationplusIcon = require('../assets/icons/locationplus.png')
const CreateNoteImage = require('../assets/image/CreateNote.png')
const BottomSheetScreen = ({onDisplay, onCancel, animationVal, targetName, targetAddress, targetId, targetLctn, navigation}) => {
  const gotoEditScreen = () => {return(navigation.push("EditScreen", {placeName: targetName, placeID: targetId, address:targetAddress, lctn: targetLctn}))}
  if(animationVal<0){
    return(                                                 //bottomsheet가 전체 화면을 덮기 전
      <View style={{position:'absolute', width: '100%', height: '100%'}}>
        <View style={{position: 'absolute', width: '75%', height: '100%'}} onTouchEndCapture={()=>onDisplay()}>
          <Text style={{position:'absolute', top: 20, fontSize: 20}}>{targetName}</Text>
          <Text style={{position:'absolute', top: 80, fontSize: 15}}>{targetAddress}</Text>
        </View>
        <View style={{position:'absolute', right:0, width:'25%', height:'8%'}} onTouchEndCapture={()=>onDisplay()}/>
        <View style={{position: 'absolute', top: '8%',right:0 , width: '25%', height: '10%', alignItems:'center', justifyContent:'center'}}>
          <TouchableHighlight
            style={{
              position: 'absolute',
              alignItems: 'center',
              width:48,
              height:48,
              borderRadius: 24,
              zIndex:1,
              bottom: 23,
            }}
            underlayColor='blue'
            onPress={gotoEditScreen}
          >
            <Image source={CreateNoteImage} resizeMode='contain' />
          </TouchableHighlight>
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
                bottom: 100,
                right: 10,
                alignItems: 'center',
                width:48,
                height:48,
                borderRadius: 24,
                zIndex:1,
            }}
            underlayColor='blue'
            onPress={gotoEditScreen}
        >
          <Image source={CreateNoteImage} resizeMode='contain' />
        </TouchableHighlight>
      </View>
    )
  }
}

const BottomSheet = ({onRemove, onDisplay, onCancel, setIsShow, animation, animationVal, targetName, targetAddress, targetId, targetLctn, navigation}) => {
  return(
    <View style={{width: '100%', height: '100%'}}>
    <View style={{width:'100%', height: '76%'}} onTouchEndCapture={()=>{setIsShow(false); onRemove(); navigation.navigate('Tabs')}}/>
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
      <BottomSheetScreen onRemove={()=>onRemove()} onDisplay={()=>onDisplay()} onCancel={()=>onCancel()} 
        animationVal={animationVal} targetName={targetName} targetAddress={targetAddress} targetId={targetId} targetLctn={targetLctn} navigation={navigation}/>  
    </Animated.View>
    </View>
  )
}

const PlaceInfoBottomSheet = ({route, navigation}) => {
  const {setIsShow, targetName, targetAddress, targetId, targetLctn} = route.params;
  const [animationValue, setAnimationValue] = useState(-1000);
  const showAnimation = useRef(new Animated.Value(animationValue)).current;
  useEffect(()=>{toggleAnimation3()}, []);
  const toggleAnimation1 = () => {                    //bottomsheet가 -650일 때  안 보이게 하기
    const val = -1000;
    Animated.timing(showAnimation, {
      useNativeDriver: false,
      toValue: val,
      duration: 350
    }).start()
    setAnimationValue(val);
  }
  const toggleAnimation2 = () => {                      //bottomsheet가 -650일 때 터치해서 전체 화면으로 올리기
    const val2 = 0;
    Animated.timing(showAnimation, {
      useNativeDriver: false,
      toValue: val2,
      duration: 350
    }).start()
    setAnimationValue(val2);
  }
  const toggleAnimation3 = () => {                                //bottomsheet가 -1000일 때 보이게 하기, bottomsheet가 0일 때 뒤로 가기 버튼 눌러서 보이게만 하기
    const val3 = -650;
    Animated.timing(showAnimation, {
      useNativeDriver: false,
      toValue: val3,
      duration: 350
    }).start()
    setAnimationValue(val3);
  }
  return (
    <BottomSheet 
      onRemove = {() => {          
        toggleAnimation1()
      }}
      onDisplay = {() => {
        toggleAnimation2()
      }}
      onCancel={()=>{
        toggleAnimation3()
      }} 
      setIsShow={s=>setIsShow(s)}
      animation={showAnimation}
      animationVal={animationValue}
      targetName={targetName}
      targetAddress={targetAddress}
      targetId = {targetId}
      targetLctn={targetLctn}
      navigation={navigation}
    />  
  )
}

export default PlaceInfoBottomSheet;