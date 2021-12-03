import * as React from "react";
import {
  Text,
  View,
  SafeAreaView,
  Dimensions,
  Platform,
  StyleSheet,
} from "react-native";

import Carousel, { ParallaxImage } from "react-native-snap-carousel";
const { width: viewportWidth, height: viewportHeight } =
  Dimensions.get("window");
let screenWidth = viewportWidth;
let screenHeight = 600;
// _renderItem ({item, index}) {
//     return (
//         <View style={styles.item}>
//             {/* <ParallaxImage
//                 source={{ uri: item.thumbnail }}
//                 // containerStyle={styles.imageContainer}
//                 style={styles.image}
//                 parallaxFactor={0.4}
//                 {...parallaxProps}
//             /> */}
//             <Text style={styles.title} numberOfLines={2}>
//                 { item.title }
//             </Text>
//         </View>
//     );
// }
const SnapCarouselComponent = (props) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white", paddingTop: 50 }}>
      <View style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}>
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
          data={carouselItems}
          renderItem={props?._renderItem}
          hasParallaxImages={false}
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
    borderRadius: 8,
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
