import { StyleSheet, Text, View, Dimensions } from 'react-native'
import React from 'react'
import { HEIGHT, colors, WIDTH } from '../../utility'
export default stateIcon = ({
    state
}) => {
    if ( state != 'Active' && state != 'Sleep' && state)
    return (
        <View style= {styles.imageStateSlepp}>
            <Text style={{fontSize:7, color:'black'}}>{`  ${state}  `}</Text>
        </View>
    )
    switch(state) {
        case 'Active': 
            return <View style= { styles.imageStateAtive }></View>
        case 'Sleep':
            return <View></View>
        default:
            return <View></View>
    }
}

const styles = StyleSheet.create({
    imageStateAtive: {
        height: HEIGHT * 0.023,
        aspectRatio: 1,
        borderRadius: 100,
        borderWidth: 3,
        borderColor:'white',
        backgroundColor: colors.GREEN_DARK,
        position:'absolute',
        top: HEIGHT * 0.055,
        left: HEIGHT *0.055
    },
    imageStateSlepp: {
        borderRadius: 30,
        borderWidth: 2,
        borderColor:'white',
        backgroundColor: colors.ORANGE,
        position:'absolute',
        top: HEIGHT * 0.055,
        left: HEIGHT *0.05
    }
})