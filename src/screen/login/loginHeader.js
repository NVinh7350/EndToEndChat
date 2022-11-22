import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors, HEIGHT, WIDTH } from '../../utility'

const LoginHeader = () => {
  return (
    <View style={styles.container}>
        <Text style= { styles.textTitleBig }> End to End </Text>
        <Text style= { styles.textTitleSmall}> Chat encrytion</Text>
    </View>
  )
}

export default LoginHeader

const styles = StyleSheet.create({
    container:{
        height: HEIGHT * 0.25,
        width: WIDTH,
        backgroundColor: colors.BLUE_DARK,
        justifyContent: 'center'
    },
    textTitleSmall: {
        fontSize: 18,
        fontWeight: 'bold',
        alignSelf: 'center',
        color: colors.WHITE,
    },
    textTitleBig: {
        fontSize: 40,
        fontWeight: 'bold',
        alignSelf: 'center',
        color: colors.WHITE,
    },
})