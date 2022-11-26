import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { HEIGHT, WIDTH, colors } from '../../utility';
import React from 'react'
import CircleImage from '../CircleImage';
const handleMessage = (message) => {
    if (!message)
    return '';
    return message.length > 24 ? message.slice(0,20).concat('...') : message
}
const ChatItem = ({
    containerStyle,
    state,
    userName,
    lastMessage,
    timeMessage,
    seen,
    onPress,
    containerImageStyle,
    imageStyle,
    source,
    textStyle,

}) => {
    var border = seen === true ? 'bold' : 'normal'
    return (
        <View style={ [styles.container, containerStyle] }>
            <TouchableOpacity
                style= {{
                    flexDirection: 'row',
                    alignItems: 'center'}}
                onPress={ onPress }
            >
                <CircleImage
                    source= {source}
                    state= {state}
                    containerStyle= {[containerImageStyle]}
                    imageStyle= {imageStyle}
                />
                
                <View style={ styles.textArea}>
                    <Text style={[ styles.textLarge , {fontWeight: border}, textStyle]}>
                        {handleMessage(userName)}
                    </Text>
                    
                    {
                        lastMessage ?
                        <Text style={[ styles.textMedium, {fontWeight: border} ]}>
                        {`${handleMessage(lastMessage)} ${timeMessage}`}
                        </Text> :
                        <View></View>
                    }
                </View>
            </TouchableOpacity>
        </View>
  )
}

export default ChatItem

const styles = StyleSheet.create({
    container: {
        height: HEIGHT * 0.1,
        width: WIDTH ,
        flexDirection: 'row',
        paddingHorizontal: WIDTH*0.02,
    },
    textArea: {
        height: HEIGHT * 0.08,
        width: WIDTH * 0.7 ,
        marginLeft: WIDTH*0.05,
        justifyContent:'center',
        paddingVertical: HEIGHT*0.025,
        color: 'black',
    },
    textLarge: {
        fontSize: 17,
        color: 'black'
    },
    textMedium: {
        width:WIDTH * 0.905 ,
        fontSize: 14,
        textAlignVertical: 'bottom',
        color: 'black',
    }

})