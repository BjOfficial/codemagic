import { StyleSheet, Dimensions } from "react-native";
import { colorAsh } from "@constants/Colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignSelf: "center",
  },
  image: {
    width: Dimensions.get("screen").width * 0.3,
    height: Dimensions.get("screen").height * 0.15,
    alignSelf: "center",
    marginBottom: 30,
  },
  text: {
    fontFamily: "Rubik-Regular",
    alignSelf: "center",
    color: colorAsh,
    marginTop: 5,
  },
});

export default styles;
