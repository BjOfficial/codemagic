import { colorLightBlue } from "@constants/Colors";
import React from "react";
import * as RN from 'react-native';

const StatusBar =() =>{
    return(
        <RN.View>
  <RN.StatusBar
    backgroundColor= {colorLightBlue}
    barStyle="light-content"
  />
  </RN.View>
    )
}

export default StatusBar;