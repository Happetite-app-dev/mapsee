import MakeFolderBottomSheet from "../components/MakeFolderBottomSheet";
import React, {useEffect, useRef, useState} from 'react';
import { Animated, Text, View, TouchableOpacity, Button } from 'react-native';

const MakeFolderBottomSheetScreen = ({navigation, route}) => {
  const {folderID, folderName, folderColor, recordDataSource}= route.params
  const [animationValue, setAnimationValue] = useState(0);

  const showAnimation = useRef(new Animated.Value(animationValue)).current
  const toggleAnimation = () => {
    const val = -1000;
    Animated.timing(showAnimation, {
      useNativeDriver: false,
      toValue: val,
      duration: 350
    }).start()
    setAnimationValue(val);
  }
  
  return (
    <View style={{width: '100%', height: '100%'}}>
    <View style={{width:'100%', height: '26%'}} onTouchEndCapture={()=>{toggleAnimation(); navigation.goBack()}}/>
    <Animated.View style={{
        width: "100%",
        backgroundColor:"#fff",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 0,
        position: 'absolute',
        zIndex: 3,
        alignItems: 'center',
        justifyContent: 'center',
        height: 630,
        shadowOffset: {
          width: 0,
          height: 12,
        },
        alignSelf:'center',
        shadowOpacity: 0.58, 
        shadowRadius: 16.00,
        bottom: showAnimation,
        elevation: 24,
      }}>
        <MakeFolderBottomSheet stackNavigation={navigation} folderID={folderID} folderName_={folderName} folderColor_={folderColor} recordDataSource={recordDataSource}/>
      </Animated.View>
      </View>
  )  
  
}

export default MakeFolderBottomSheetScreen;