import { StyleSheet, TextInput, TouchableOpacity, View, Text } from 'react-native'
import React from 'react'
import { colors, HEIGHT, WIDTH } from '../../utility'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
const ButtonField = ({
    icon,
    iconStyle,
    textContent,
    textStyle,
    buttonStyle,
    containerStyle,
    onPress,
    disabled,
    loader
}) => {
  return (
        <TouchableOpacity style={[styles.container, containerStyle]}
        onPress={onPress}
        disabled={disabled}
        >
        <View style={[styles.insideContainer, buttonStyle]}>
            {   icon ? 
                loader ? 
                    loader:
                    <Icon style={[styles.icon, iconStyle]}
                        name={icon?.name}
                        size={icon?.size ? icon?.size: 20 }
                        color={icon?.color ? icon?.color : 'gray'}
                    ></Icon>
                :
                <></>
            }
            <Text style={[styles.textInput, textStyle]}
            >
                {textContent}
            </Text>
        </View>
        </TouchableOpacity>
  )
}

export default ButtonField

const styles = StyleSheet.create({
    container: {
        height: HEIGHT * 0.06,
        width: WIDTH * 0.9,
        borderRadius: 10,
        elevation:4,
        backgroundColor:colors.BLUE_DARK,
    },
    insideContainer:{
        flex:1,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
    },
    textInput:{
        fontSize: 20,
        color: colors.WHITE,
        fontWeight:'bold',
        
    },
    icon:{
        marginRight:WIDTH * 0.05
    }
})