import { Alert, Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import InputField from '../../components/InputField'
import ButtonField from '../../components/ButtonField'
import { WIDTH, HEIGHT, colors } from '../../utility'
import Icon from 'react-native-vector-icons/MaterialIcons'

const ImageDetail = ({navigation, route}) => {
    const heightImage = route?.params?.item?.height /(route?.params?.item?.width / WIDTH)
    const widthImage = route?.params?.item?.width/(route?.params?.item?.width / WIDTH)
  return (
    <View>
      <View style={styles.containerHeader}>
            <Icon
                style = {styles.buttonBack}
                    name='arrow-back-ios'
                    size={30}
                    color={colors.BLACK}
                    onPress= {()=> navigation.goBack()}
            ></Icon>
        </View>
        <Image
        style={{height: heightImage? heightImage : 300, width: widthImage? widthImage : WIDTH,maxHeight : HEIGHT*0.9, maxWidth: WIDTH, alignSelf:'center'}}
        source={{uri:route.params?.item?.uri}}
        />
    </View>
  )
}

export default ImageDetail

const styles = StyleSheet.create({
    buttonBack:{
        borderRadius:100,
        marginLeft:20
    },
    textTitle: {
        fontSize: 25,
        // width:WIDTH*0.8,
        color: colors.BLACK,
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    containerHeader:{
        height:HEIGHT * 0.07,
        borderBottomWidth:1,
        borderBottomColor:colors.GRAY_BLAND,
        flexDirection:'row',
        alignItems:'center',
    },
    containerBody:{
        // justifyContent:'center',
        alignItems:'center',
        paddingTop:HEIGHT *0.05
    },
})