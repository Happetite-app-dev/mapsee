import { useState } from "react";
import { View, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Carousel from "react-native-snap-carousel";
const ImageCarousel = ({ navigation, images }) => {
  const [carousel, setCarousel] = useState();

  const _renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={{
          height: 148,
          width: 148,
        }}
        onPress={() => {
          navigation.navigate("ImageView", item);
        }}
        activeOpacity={1}
      >
        <Image style={{ flex: 1, borderRadius: 8 }} source={{ uri: item }} />
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        alignItems: "center",
      }}
    >
      <Carousel
        layout="stack"
        ref={(ref) => setCarousel(ref)}
        data={images}
        sliderWidth={200}
        itemWidth={140}
        renderItem={_renderItem}
        layoutCardOffset={18}
        style={{ backgroundColor: "red" }}
      />
    </View>
  );
};

export default ImageCarousel;
