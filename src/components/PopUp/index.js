import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors, HEIGHT, WIDTH } from '../../utility'

const PopUp = ({
    open,
    child
}) => {
    return open ?(
        <View style={styles.container}>
            {child}
        </View>
    ) : null
}

export default PopUp

const styles = StyleSheet.create({
    container: {
        height:HEIGHT,
        width:WIDTH,
        position:'absolute',
        justifyContent:'center',
        zIndex:1,
        alignItems:'center',
        backgroundColor: colors.DARK_GRAY,
        
    }
})