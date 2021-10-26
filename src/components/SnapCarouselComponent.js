import React from "react";
import { View, SafeAreaView, Dimensions, StyleSheet } from "react-native";

import Carousel from "react-native-snap-carousel";
const { width: viewportWidth, height: viewportHeight } =
  Dimensions.get("window");
let screenWidth = viewportWidth;
let screenHeight = 600;

const SnapCarouselComponent = (props) => {
  // const [cindex, setCIndex] = useState(props.currentIndex);
  // useEffect(() => {
  //   setCIndex(props.currentIndex);
  // }, [props.currentIndex]);
  // console.log("carousel props index", cindex);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white", paddingTop: 10 }}>
      <View style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}>
        {/* <Text>{cindex}</Text> */}
        <Carousel
          containerCustomStyle={{
            flexDirection: "row",
            alignItems: "center",
            height: screenHeight,
          }}
          sliderWidth={screenWidth}
          sliderHeight={screenWidth}
          itemWidth={screenWidth - 60}
          inactiveSlideScale={0.9}
          inactiveSlideOpacity={0.9}
          data={props?.carouselItems}
          renderItem={props?.renderItem}
          hasParallaxImages={false}
          // currentIndex={cindex}
          onSnapToItem={(index) => props?.sendSnapItem(index)}
          ref={props.carouselRef}
        />
      </View>
    </SafeAreaView>
  );
};

export default SnapCarouselComponent;
const styles = StyleSheet.create({
  item: {
    width: screenWidth - 60,
    height: screenHeight - 60,
    backgroundColor: "white",
    borderRadius: 0,
    elevation: 5,
    padding: 20,
    marginVertical: 20,
  },
  imageContainer: {
    elevation: 8,
    paddingBottom: 20,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "cover",
    elevation: 10,
  },
});
