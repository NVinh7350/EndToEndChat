import { TouchableOpacity, View, Image,Dimensions, StyleSheet } from 'react-native'
import React from 'react'
import { HEIGHT } from '../../utility'
import StateIcon from '../StateIcon'

export default CircleImage = ({
    onPress, 
    containerStyle,
    imageStyle,
    source,
    state,
    icon
}) => {
    return !onPress ?  
    (<View 
        style={[styles.containerImage, containerStyle]}>
            <Image
            style={[ styles.image, imageStyle ]}
            source={source}
            >
            </Image>
            <StateIcon
            state={state}
            ></StateIcon>
    </View>) :
    (<View 
        style={[styles.containerImage,containerStyle]}>
            <TouchableOpacity
            onPress={onPress}
            >
            { icon ? 
                icon
                :
                <Image
                style={[ styles.image, imageStyle ]}
                source={source}
                >
                </Image> 
            }
                
            </TouchableOpacity>
    </View>)
}
const  styles = StyleSheet.create({
    containerImage :{
        height: HEIGHT * 0.075,
        borderRadius: 100,
    },
    image :{
        height: '100%',
        aspectRatio: 1,
        borderRadius: 100,
    }
})