import React, { Component } from "react";
import { TouchableOpacity } from "react-native";

class PreventDoubleTap extends Component {
  disabled = false;
  onPress = (...args) => {
    if (this.disabled) return;
    this.disabled = true;
    setTimeout(() => {
      this.disabled = false;
    }, 500);
    this.props.onPress && this.props.onPress(...args);
  };
}

export class ButtonHighLight extends PreventDoubleTap {
  render() {
    return (
      <TouchableOpacity
        {...this.props}
        onPress={this.onPress}
        underlayColor="#f7f7f7"
      />
    );
  }
}
