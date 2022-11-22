import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors, HEIGHT, WIDTH } from '../../utility'

const Loader = ({status}) => {
    return status == 'loading' ?(
        <View style={styles.container}>
            <ActivityIndicator
            size={45}
            color={colors.BLUE_DARK}
            ></ActivityIndicator>
        </View>
    ) : null
}

export default Loader

const styles = StyleSheet.create({
    container: {
        height:HEIGHT,
        width:WIDTH,
        position:'absolute',
        justifyContent:'center',
        zIndex:1,
        alignItems:'center',
        backgroundColor: colors.DARK_GRAY
    }
})