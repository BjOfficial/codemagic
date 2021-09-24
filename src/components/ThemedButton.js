import React from "react";
import { Button } from "react-native-paper";
import { StyleSheet, Text } from "react-native";
import { colorLightBlue, colorWhite } from "@constants/Colors";
import sharedStyles from "@shared/sharedStyles";

import { font14, font16 } from "@constants/Fonts";

/**
 * Application Themed Button.
 * @component
 * @example
 * <ThemedButton title="Example button" />
 */

const ThemedButton = (
  {
    title,
    mode = "contained",
    color,
    fullSize = true,
    buttonStyle,
    labelStyle,
    onPress,
    ...rest
  },
  props
) => {
  return (
    <Button
      mode={mode}
      contentStyle={{
        flexDirection: "row",
        justifyContent: "center",
        width: "100%",
      }}
      color={color}
      labelStyle={[
        styles.label,
        mode === "contained"
          ? { color: colorWhite }
          : mode === "outline"
          ? { color: colorLightBlue }
          : { color },
        labelStyle,
      ]}
      style={[
        styles.button,
        sharedStyles.noShadow,
        { borderColor: color },
        buttonStyle,
        { ...rest.style },
      ]}
      uppercase={false}
      onPress={onPress}
      {...rest}>
      <Text
        style={[
          { ...rest.btnStyle },
          { margin: 0, fontFamily: "Rubik-Medium" },
        ]}>
        {title}
      </Text>
    </Button>
  );
};

export default ThemedButton;

const styles = StyleSheet.create({
  button: {
    width: "100%",
    borderRadius: 25,
    padding: 4,
    // margin: 5,
    borderWidth: 1,
    // backgroundColor:'red',
  },
  label: {
    paddingVertical: 1,
    fontSize: font14,
    lineHeight: font16,
    // ,fontFamily:'Avenir Heavy'
  },
});
