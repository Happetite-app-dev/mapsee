import { View, Text } from "react-native";
import RNSwiper from "react-native-3d-swiper";

const SwipeTest = () => {
  const onSwipeUp = (index) => {
    //parameter returned is the index of active child
    console.log(index);
  };

  const onSwipeDown = (index) => {
    //parameter returned is the index of active child
    console.log(index);
  };

  const onPress = (index) => {
    //parameter returned is the index of active child
    console.log(index);
  };
  return (
    <View>
      <RNSwiper
        minimumScale={116 / 148} //scale of out of focus components
        minimumOpacity={1} // opacity of out of focus components
        overlap={68} // the degree to which components overlap.
        cardWidth={150} // the width of each component
        duration={50} // animation duration on swipe
        swipeThreshold={30} // minimum distance to swipe to trigger change in state
        onSwipeUp={() => onSwipeUp(11)}
        onSwipeDown={() => onSwipeDown(22)}
        onPress={() => onPress(33)}
      >
        <View style={{ backgroundColor: "red", height: 150, width: 150 }}>
          <Text>1</Text>
        </View>
        <View style={{ backgroundColor: "blue", height: 150, width: 150 }}>
          <Text>2</Text>
        </View>
        <View style={{ backgroundColor: "green", height: 150, width: 150 }}>
          <Text>3</Text>
        </View>
        <View style={{ backgroundColor: "purple", height: 150, width: 150 }}>
          <Text>4</Text>
        </View>
        <View style={{ backgroundColor: "orange", height: 150, width: 150 }}>
          <Text>5</Text>
        </View>
        <View style={{ backgroundColor: "yellow", height: 150, width: 150 }}>
          <Text>6</Text>
        </View>
      </RNSwiper>
    </View>
  );
};

export default SwipeTest;
