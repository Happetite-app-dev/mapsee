import { useState } from "react";
import { View, Image } from "react-native";
import Carousel from "react-native-snap-carousel";
const _renderItem = ({ item, index }) => {
  return (
    <View
      style={{
        height: 148,
        width: 148,
      }}
    >
      <Image style={{ flex: 1 }} source={{ uri: item }} />
    </View>
  );
};
const ImageCarousel = ({ images }) => {
  const [carousel, setCarousel] = useState();

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
