import StatusBar from "@components/StatusBar";
import ThemedButton from "@components/ThemedButton";
import { colorLightBlue } from "@constants/Colors";
import React from "react";
import * as RN from "react-native";
import style from './styles';
const Documents = () => {
    return (
        <RN.View style={style.container}>
            <StatusBar />
        
                <RN.Image
                    // source={require('../../assets/images/addDocument/adddocument.png')}
                    source={require('../../assets/images/emptyStates/adddocument.png')}
                    style={style.image}
                />
                <RN.Text style={style.text}>
                    {'Be on Top of all renwals of documents'}
                </RN.Text>
                <RN.Text style={style.text}>
                    {'and payments'}
                </RN.Text>
                <ThemedButton title="+ Add Document"
                    mode="outline"
                    color={colorLightBlue}
                    buttonStyle={{ marginTop: 20 }}
                    btnStyle={{ fontFamily: 'Rubik-Medium' }}></ThemedButton>
            </RN.View >
        
    );
}

export default Documents;