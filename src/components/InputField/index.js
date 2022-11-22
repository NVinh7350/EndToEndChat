import { StyleSheet, TextInput, View } from 'react-native'
import React from 'react'
import { colors, HEIGHT, WIDTH } from '../../utility'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const InputField = ({
    leftIcon,
    rightIcon,
    onRightIconPress,
    value,
    onChangeText,
    secureTextEntry,
    placeholder,
    textInputStyle,
    containerStyle,
    
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
        <Icon style={styles.leftIcon}
            name={leftIcon?.name}
            size={leftIcon?.size ? leftIcon?.size: 20 }
            color={leftIcon?.color ? leftIcon?.color : 'gray'}
        ></Icon>
        <TextInput 
            secureTextEntry = {secureTextEntry}
            style={[styles.textInput, textInputStyle]}
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
        ></TextInput>
        <Icon style={{}}
            name={rightIcon?.name}
            size={rightIcon?.size ? rightIcon?.size: 20 }
            color={rightIcon?.color ? rightIcon?.color : 'gray'}
            onPress={onRightIconPress}
        ></Icon>
    </View>
  )
}

export default InputField

const styles = StyleSheet.create({
    container: {
        height: HEIGHT * 0.06,
        width: WIDTH * 0.9,
        borderRadius: 10,
        elevation:4,
        flexDirection:'row',
        backgroundColor:colors.WHITE,
        justifyContent:'space-evenly',
        alignItems:'center'
    },
    textInput:{
        // marginLeft:WIDTH * 0.045,
        height: HEIGHT * 0.06,
        width: WIDTH * 0.66 ,
        fontSize: 16,
        color: colors.BLACK,
    },
    leftIcon:{
    }
})