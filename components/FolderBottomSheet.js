import React, {useRef, useState} from 'react';
import { Animated, Text, View, TouchableOpacity, Button } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

const FolderBottomSheet = () => {
  const [animationValue, setAnimationValue] = useState(-1000);
  const showAnimation = useRef(new Animated.Value(animationValue)).current
  const toggleAnimation = () => {
    const val = animationValue==0 ? -1000 : 0;
    Animated.timing(showAnimation, {
      useNativeDriver: false,
      toValue: val,
      duration: 350
    }).start()
    setAnimationValue(val);
  }
  return (
    // <>
    //   <View
    //     onTouchEndCapture = {()=>{
    //       if(animationValue===0){
    //         toggleAnimation();
    //       } else{
    //         alert("a");
    //       }
    //     }}
    //     style={{flex:1, zIndex: 1, alignItems: 'center', justifyContent:'center'}}>
    //     <Text>ddd</Text>
    //   </View>
    //   <BottomSheet onCancel={()=>{
    //     toggleAnimation()
    //   }} animation={showAnimation}/>
    // </>
    <Animated.View style={{
        width: "100%",
        backgroundColor:"#fff",
        borderTopLeftRadius: 30,
        borderBottomRightRadius: 30,
        padding: 20,
        position: 'absolute',
        zIndex: 3,
        alignItems: 'center',
        justifyContent: 'center',
        maxHeight: 300,
        shadowOffset: {
          width: 0,
          height: 12,
        },
        shadowOpacity: 0.58, 
        shadowRadius: 16.00,
        bottom: showAnimation,
        elevation: 24,
      }}>
        <ScrollView showsHorizontalScrollIndicator={false} style={{width: "100%"}}>
          <TouchableOpacity>
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
          <TouchableOpacity>
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
          <TouchableOpacity>
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
            toggleAnimation();
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