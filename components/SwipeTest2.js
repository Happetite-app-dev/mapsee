import { Image, View } from "react-native";
import Carousel from "react-spring-3d-carousel";

const SwipeTest2 = () => {
  const slides = [
    {
      key: 1,
      content: (
        <View style={{ backgroundColor: "red", width: 20, height: 20 }} />
      ),
    },
    {
      key: 2,
      content: (
        <View style={{ backgroundColor: "red", width: 20, height: 20 }} />
      ),
    },
    {
      key: 3,
      content: (
        <View style={{ backgroundColor: "red", width: 20, height: 20 }} />
      ),
    },
    {
      key: 4,
      content: (
        <View style={{ backgroundColor: "red", width: 20, height: 20 }} />
      ),
    },
    {
      key: 5,
      content: (
        <View style={{ backgroundColor: "red", width: 20, height: 20 }} />
      ),
    },
  ];
  return <Carousel slides={slides} />;
};

export default SwipeTest2;
