import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { HEIGHT, WIDTH, colors } from '../../utility'
import CircleImage from '../CircleImage'
import ButtonField from '../ButtonField'
const InvitationItem = (
  {
    userName,
    profileImg,
    onPressAccept, 
    onPressRefuse,
    onPressProfile
  }
) => {
  const [pressed, setPressed] = useState('');
  return (
    <View style={styles.container}>
      <View style={styles.containerImage}>
        <CircleImage
        containerStyle={{height: HEIGHT * 0.1}}
        source={profileImg}
        onPress={()=>{
          onPressProfile();
          setPressed('')
        }}
        ></CircleImage>
      </View>
      <View style={styles.containerBody}>
        <Text style={styles.textLarge}>{userName}</Text>
        {
          pressed ? 
          <Text style={[styles.textLarge, {fontWeight:'nomal'}]}> {pressed}</Text>
          :
          <View style={styles.containerButton}>
          <ButtonField containerStyle={styles.styleButton} 
                      textContent={'Chấp nhận'} 
                      textStyle={styles.textMedium}
                      onPress={()=>{
                        setPressed('Đã chấp nhận lời mời');
                        onPressAccept();
                      }}
                      ></ButtonField>
          <ButtonField 
                       containerStyle={[styles.styleButton, {backgroundColor:colors.GRAY_BLAND}]}
                       textContent={'Từ chối'} 
                       textStyle={[styles.textMedium, {color: colors.BLACK}]}
                       onPress={()=>{
                        setPressed('Đã từ chối lời mời');
                        onPressRefuse();
                      }}
                       ></ButtonField>
          </View>
        }
      </View>
    </View>
  )
}

export default InvitationItem

const styles = StyleSheet.create({
    container: {
        height: HEIGHT * 0.1,
        width: WIDTH ,
        flexDirection: 'row',
        paddingHorizontal: WIDTH*0.02,
        marginVertical:HEIGHT * 0.01,
        justifyContent:'space-between'
    },
    containerImage: {
        height: HEIGHT * 0.1,
        width: WIDTH * 0.2,
    },
    containerBody: {
        height: HEIGHT * 0.1,
        width: WIDTH * 0.73,
        justifyContent:'center'
    },
    containerButton: {
      flexDirection:'row',
      justifyContent:'space-between'
    },
    styleButton: {
      height: HEIGHT *0.05,
      width:WIDTH * 0.35,
      justifyContent:'center'
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
        height:HEIGHT * 0.05,
        fontSize: 18,
        color: 'black',
        fontWeight:'500'
    },
    textMedium: {
        // width:WIDTH * 0.905 ,
        fontSize: 17,
        color: 'white',
        fontWeight:'500'
    }

})