import React, {useEffect, useRef, useState} from 'react';
import { Animated, Text, View, TouchableOpacity, Button } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

const FolderBottomSheet = ({show, setShow, setFolderName}) => {
  const [animationValue, setAnimationValue] = useState(-1000);
  useEffect(()=>toggleAnimation(),[show])
  const showAnimation = useRef(new Animated.Value(animationValue)).current
  const toggleAnimation = () => {
    const val = show ? 0 : -1000;
    Animated.timing(showAnimation, {
      useNativeDriver: false,
      toValue: val,
      duration: 350
    }).start()
    setAnimationValue(val);
  }
  return (
    <Animated.View style={{
        width: "100%",
        backgroundColor:"#fff",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 20,
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
        <ScrollView showsHorizontalScrollIndicator={false} style={{width: "100%"}}>
        <TouchableOpacity onPress={()=>{
            setFolderName('Menu1');
            setShow(false);
          }}>
            <View style={{
              backgroundColor: "grey",
              alignItems: 'center',
              justifyContent: 'center',
              height: 40,
              marginBottom: 8,
              borderBottomWidth: 1
            }}>
              <Text style={{fontSize: 16, fontWeight: "bold"}}>Menu1</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{
            setFolderName('Menu2');
            setShow(false);
          }}>
            <View style={{
              backgroundColor: "grey",
              alignItems: 'center',
              justifyContent: 'center',
              height: 40,
              marginBottom: 8,
              borderBottomWidth: 1
            }}>
              <Text style={{fontSize: 16, fontWeight: "bold"}}>Menu2</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{
            setFolderName('Menu3');
            setShow(false);
          }}>
            <View style={{
              backgroundColor: "grey",
              alignItems: 'center',
              justifyContent: 'center',
              height: 40,
              marginBottom: 8,
              borderBottomWidth: 1
            }}>
              <Text style={{fontSize: 16, fontWeight: "bold"}}>Menu3</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{
            setFolderName('Menu4');
            setShow(false);
          }}>
            <View style={{
              backgroundColor: "grey",
              alignItems: 'center',
              justifyContent: 'center',
              height: 40,
              marginBottom: 8,
              borderBottomWidth: 1
            }}>
              <Text style={{fontSize: 16, fontWeight: "bold"}}>Menu4</Text>
            </View>
          </TouchableOpacity>
              
        </ScrollView>
  
      </Animated.View>
  )
}

export default FolderBottomSheet;