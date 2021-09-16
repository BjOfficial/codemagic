import React from "react";
import * as RN from "react-native";
import style from './styles';
const Documents = () =>{
    return(
<RN.View style={style.container}>
    <RN.Image 
    source={require('../../assets/images/addDocument/adddocument.png')} 
    style={style.image}
    />
    <RN.Text>
       {'Be on Top of all renwals of documents'}
    </RN.Text>
</RN.View>
    ); 
}

export default Documents;