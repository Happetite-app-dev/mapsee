import { useState } from "react";
import { View, Text, SafeAreaView } from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";
const carouselItems = [
  {
    title: "Item 1",
    text: "Text 1",
  },
  {
    title: "Item 2",
    text: "Text 2",
  },
  {
    title: "Item 3",
    text: "Text 3",
  },
  {
    title: "Item 4",
    text: "Text 4",
  },
  {
    title: "Item 5",
    text: "Text 5",
  },
];
const SwipeTest2 = () => {
  const [carousel, setCarousel] = useState();

  const _renderItem = ({ item, index }) => {
    return (
      <View
        style={{
          backgroundColor: "red",
          borderRadius: 5,
          height: 250,
          padding: 50,
          marginLeft: 20,
          marginRight: 20,
        }}
      >
        <Text style={{ fontSize: 30 }}>{item.title}</Text>
        <Text>{item.text}</Text>
      </View>
    );
  };
  const customPagination = () => {
    return (
      <Pagination
        dotsLength={4}
        activeDotIndex={2}
        containerStyle={{ backgroundColor: "rgba(0, 0, 0, 0.75)" }}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          marginHorizontal: 8,
          backgroundColor: "rgba(255, 255, 255, 0.92)",
        }}
        inactiveDotStyle={
          {
            // Define styles for inactive dots here
          }
        }
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    );
  };
  return (
    <SafeAreaView style={{ backgroundColor: "rebeccapurple" }}>
      <View style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}>
        <Carousel
          layout="default"
          ref={(ref) => setCarousel(ref)}
          data={carouselItems}
          sliderWidth={300}
          itemWidth={300}
          renderItem={_renderItem}
        >
          <customPagination />
        </Carousel>
      </View>
    </SafeAreaView>
  );
};

export default SwipeTest2;
