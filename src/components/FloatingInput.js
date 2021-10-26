import React, { useRef, useEffect, Fragment } from "react";
import {
  Animated,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  Platform,
} from "react-native";
import {
  colorplaceholder,
  colorError,
  colorBlack,
  colorDropText,
} from "@constants/Colors";
import { font12 } from "@constants/Fonts";
const FloatingInput = (props) => {
  const animate_value = useRef(new Animated.Value(0)).current;
  const textinputref = useRef(null);
  const onFocus_Elem = () => {
    props.onFocus && props.onFocus();
    Animated.timing(animate_value, {
      toValue: 1,
      duration: 100,
    }).start();
  };
  const onBlur_Elem = (elem) => {
    if (!elem.nativeEvent.text && !props.focus) {
      Animated.timing(animate_value, {
        toValue: 0,
        duration: 100,
      }).start();
    }
  };
  useEffect(() => {
    if (props.value) {
      Animated.timing(animate_value, {
        toValue: 1,
        duration: 100,
      }).start();
    }
    if (props.focus) {
      Animated.timing(animate_value, {
        toValue: 1,
        duration: 100,
      }).start();
    }
  }, [props.value]);
  const interpolate_style_view = {
    top: animate_value.interpolate({
      inputRange: [0, 1],
      outputRange: [15, 3],
    }),
    width: "100%",
  };
  const interpolate_style_text = {
    fontSize: animate_value.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: animate_value.interpolate({
      inputRange: [0, 1],
      outputRange: ["#000", "#1D7BC3"],
    }),
    width: "100%",
  };
  return (
    <View style={styles.parentContainer}>
      <View style={[styles.container, { ...props.containerStyle }]}>
        {props.leftIcon && props.leftIcon}
        <TouchableHighlight
          underlayColor={null}
          style={{ flex: 1, paddingRight: 20 }}
          onPress={() => {
            props.type == "dropdown"
              ? props.dropdowncallback && props.dropdowncallback()
              : props.type == "calendar"
              ? props.onPressCalendar()
              : textinputref.current.focus();
          }}>
          <Fragment>
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
              }}>
              {props.prefix && (
                <TouchableHighlight
                  underlayColor="none"
                  onPress={() => props.prefixCall && props.prefixCall()}>
                  <Text
                    style={[
                      styles.textinput,
                      {
                        height: 25,
                        marginTop: 26,
                        width: "100%",
                      },
                    ]}>
                    {props.prefix}{" "}
                  </Text>
                </TouchableHighlight>
              )}
              <TextInput
                placeholderTextColor={
                  Platform.OS == "ios" ? "#747474" : colorDropText
                }
                ref={textinputref}
                {...props}
                onFocus={onFocus_Elem}
                onEndEditing={onBlur_Elem}
                style={[
                  styles.textinput,
                  { width: "100%", color: "#000" },
                  { ...props.inputstyle },
                ]}
                leftIcon={props.leftIcon}
                rightIcon={props.rightIcon}
                keyboardType={props.keyboard_type}
                editable={props.editable_text}
                showSoftInputOnFocus={props.show_keyboard}
                onChangeText={props.onChangeText}
                onTouchStart={() => {
                  props.type == "dropdown"
                    ? props.dropdowncallback && props.dropdowncallback()
                    : textinputref.current.focus();
                }}
              />
            </View>
            <Animated.View style={[styles.viewtext, interpolate_style_view]}>
              <Animated.Text style={[styles.textsize, interpolate_style_text]}>
                {props.placeholder_text}
              </Animated.Text>
              {props.addtionalPlaceholder && (
                <Text style={styles.addtionalPlaceholder}>
                  {props.addtionalPlaceholder}
                </Text>
              )}
            </Animated.View>
          </Fragment>
        </TouchableHighlight>
        {props.rightIcon && props.rightIcon}
      </View>
      {props.error && (
        <Text style={[styles.errorMsg, { ...props.errorStyle }]}>
          {props.error}
        </Text>
      )}
    </View>
  );
};
export default FloatingInput;
const styles = {
  viewtext: {
    position: "absolute",
    top: 0,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  container: {
    borderBottomWidth: 0.5,
    borderColor: "rgba(153,153,153,0.5)",
    borderRadius: 5,
    padding: 10,
    paddingHorizontal: 4,
    width: "100%",
    height: 40,
    flexDirection: "row",
    alignItems: "center",
  },
  textinput: {
    paddingVertical: 0,
    width: "80%",
    height: 25,
    paddingLeft: 0,
    marginVertical: 10,
    marginTop: 22,
    fontSize: 13,
    fontFamily: "Rubik-Regular",
    color: colorBlack,
  },
  textsize: {
    color: "#A0A6B2",
    fontFamily: "Rubik-Regular",
    fontSize: 14,
    marginRight: 0,
  },
  rightLable: {
    padding: 0,
    margin: 0,
    color: "#fff",
    lineHeight: 14,
    fontSize: 12,
  },
  rightView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#41A58D",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 30,
  },
  addtionalPlaceholder: {
    color: colorplaceholder,
    fontFamily: "Rubik-Regular",
    fontSize: 14,
    paddingLeft: 5,
  },
  parentContainer: {
    marginBottom: 30,
  },
  errorMsg: {
    color: colorError,
    fontSize: font12,
    fontFamily: "Rubik-Regular",
    marginTop: 20,
    // marginLeft: 20,
  },
};
